import { TripStatus } from "../enums/trip-status.enum.js";
import { TripOrderStatus } from "../enums/trip-order-status.enum.js";
import { TripModel } from "../models/trip.model.js";
import { OrderModel } from "../models/order.model.js";
import { TripOrderModel } from "../models/trip-order.model.js";
import { HttpError } from "../utils/http-error.js";
export class TripService {
    async list(filters) {
        const query = {};
        if (filters.status) {
            query.status = filters.status;
        }
        if (filters.search) {
            const regex = { $regex: filters.search, $options: "i" };
            query.$or = [{ title: regex }];
        }
        const trips = await TripModel.find(query)
            .populate("city", "name")
            .populate("driver", "name")
            .sort({ createdAt: -1 });
        const tripIds = trips.map((trip) => trip._id);
        const counts = await TripOrderModel.aggregate([
            { $match: { trip: { $in: tripIds } } },
            { $group: { _id: "$trip", count: { $sum: 1 } } },
        ]);
        const countMap = new Map(counts.map((item) => [item._id.toString(), item.count]));
        return trips.map((trip) => Object.assign(trip, { order_count: countMap.get(trip._id.toString()) ?? 0 }));
    }
    async create(payload) {
        const trip = await TripModel.create({
            title: payload.title,
            city: payload.city,
            driver: payload.driver,
            exchange_usd: payload.exchange_usd,
            exchange_lbp: payload.exchange_lbp,
        });
        if (payload.order_ids && payload.order_ids.length > 0) {
            await this.assignOrders(trip._id.toString(), payload.order_ids);
        }
        return trip;
    }
    async updateStatus(id, status) {
        return TripModel.findByIdAndUpdate(id, {
            status,
            delivered_at: status === TripStatus.DELIVERED ? new Date() : null,
        }, { returnDocument: "after" })
            .populate("city", "name")
            .populate("driver", "name");
    }
    async getAssignableOrders(search) {
        const assignedOrderIds = await TripOrderModel.distinct("order");
        const query = {
            _id: { $nin: assignedOrderIds },
        };
        if (search) {
            const regex = { $regex: search, $options: "i" };
            const maybeNumber = Number(search);
            query.$or = [
                { client_name: regex },
                { client_phone: regex },
                ...(Number.isNaN(maybeNumber) ? [] : [{ number: maybeNumber }]),
            ];
        }
        return OrderModel.find(query)
            .populate("resource", "name")
            .populate("added_by", "name")
            .populate({ path: "district", select: "name city", populate: { path: "city", select: "name" } })
            .sort({ createdAt: -1 })
            .limit(300);
    }
    async assignOrders(tripId, orderIds) {
        const trip = await TripModel.findById(tripId);
        if (!trip) {
            throw new HttpError(404, "Trip not found");
        }
        const uniqueOrderIds = [...new Set(orderIds.map((id) => String(id)))];
        if (uniqueOrderIds.length === 0) {
            throw new HttpError(400, "order_ids is required");
        }
        const orderCount = await OrderModel.countDocuments({ _id: { $in: uniqueOrderIds } });
        if (orderCount !== uniqueOrderIds.length) {
            throw new HttpError(400, "Some orders do not exist");
        }
        const alreadyAssigned = await TripOrderModel.find({ order: { $in: uniqueOrderIds } }).lean();
        if (alreadyAssigned.length > 0) {
            throw new HttpError(409, "One or more orders are already assigned to another trip");
        }
        const lastTripOrder = await TripOrderModel.findOne({ trip: tripId }).sort({ index: -1 }).lean();
        const startIndex = (lastTripOrder?.index ?? -1) + 1;
        await TripOrderModel.insertMany(uniqueOrderIds.map((orderId, offset) => ({
            trip: tripId,
            order: orderId,
            status: TripOrderStatus.PENDING,
            index: startIndex + offset,
            fee_applied: true,
        })));
        return this.getTripOrders(tripId);
    }
    async getTripOrders(tripId) {
        const trip = await TripModel.findById(tripId)
            .populate("city", "name")
            .populate("driver", "name");
        if (!trip) {
            throw new HttpError(404, "Trip not found");
        }
        const tripOrders = await TripOrderModel.find({ trip: tripId })
            .populate({
            path: "order",
            populate: [
                { path: "resource", select: "name" },
                { path: "added_by", select: "name" },
                { path: "district", select: "name city", populate: { path: "city", select: "name" } },
            ],
        })
            .sort({ index: 1 });
        return {
            trip,
            orders: tripOrders,
            summary: this.calculateSettlement(tripOrders),
        };
    }
    async updateTripOrderStatus(tripId, tripOrderId, payload) {
        const tripOrder = await TripOrderModel.findOne({ _id: tripOrderId, trip: tripId });
        if (!tripOrder) {
            throw new HttpError(404, "Trip order not found");
        }
        tripOrder.status = payload.status;
        if (typeof payload.fee_applied === "boolean") {
            tripOrder.fee_applied = payload.fee_applied;
        }
        if (typeof payload.note === "string") {
            tripOrder.note = payload.note.trim();
        }
        if (payload.status === TripOrderStatus.DELIVERED) {
            tripOrder.fee_applied = true;
        }
        await tripOrder.save();
        return this.getTripOrders(tripId);
    }
    async closeTrip(tripId) {
        const tripData = await this.getTripOrders(tripId);
        if (tripData.orders.length === 0) {
            throw new HttpError(400, "Trip has no orders");
        }
        if (tripData.summary.pending_count > 0) {
            throw new HttpError(400, "All trip orders must be finalized before closing the trip");
        }
        const trip = await TripModel.findByIdAndUpdate(tripId, { status: TripStatus.DELIVERED, delivered_at: new Date() }, { returnDocument: "after" })
            .populate("city", "name")
            .populate("driver", "name");
        if (!trip) {
            throw new HttpError(404, "Trip not found");
        }
        return {
            trip,
            orders: tripData.orders,
            summary: tripData.summary,
        };
    }
    calculateSettlement(tripOrders) {
        const summary = {
            total_orders: 0,
            delivered_count: 0,
            returned_count: 0,
            damaged_count: 0,
            cancelled_count: 0,
            pending_count: 0,
            returned_with_fee_count: 0,
            returned_without_fee_count: 0,
            order_total_usd: 0,
            order_total_lbp: 0,
            fee_collected_usd: 0,
            fee_collected_lbp: 0,
            collected_usd: 0,
            collected_lbp: 0,
            refund_usd: 0,
            refund_lbp: 0,
            net_usd: 0,
            net_lbp: 0,
        };
        for (const tripOrder of tripOrders) {
            const order = tripOrder.order;
            if (!order) {
                continue;
            }
            const priceUsd = Number(order.price_usd ?? 0);
            const priceLbp = Number(order.price_lbp ?? 0);
            const feeUsd = Number(order.fee_usd ?? 0);
            const feeLbp = Number(order.fee_lbp ?? 0);
            summary.total_orders += 1;
            summary.order_total_usd += priceUsd;
            summary.order_total_lbp += priceLbp;
            switch (tripOrder.status) {
                case TripOrderStatus.DELIVERED:
                    summary.delivered_count += 1;
                    summary.fee_collected_usd += feeUsd;
                    summary.fee_collected_lbp += feeLbp;
                    summary.collected_usd += priceUsd + feeUsd;
                    summary.collected_lbp += priceLbp + feeLbp;
                    break;
                case TripOrderStatus.RETURNED:
                    summary.returned_count += 1;
                    summary.refund_usd += priceUsd;
                    summary.refund_lbp += priceLbp;
                    if (tripOrder.fee_applied !== false) {
                        summary.returned_with_fee_count += 1;
                        summary.fee_collected_usd += feeUsd;
                        summary.fee_collected_lbp += feeLbp;
                        summary.collected_usd += feeUsd;
                        summary.collected_lbp += feeLbp;
                    }
                    else {
                        summary.returned_without_fee_count += 1;
                    }
                    break;
                case TripOrderStatus.DAMAGED:
                    summary.damaged_count += 1;
                    summary.refund_usd += priceUsd;
                    summary.refund_lbp += priceLbp;
                    if (tripOrder.fee_applied !== false) {
                        summary.returned_with_fee_count += 1;
                        summary.fee_collected_usd += feeUsd;
                        summary.fee_collected_lbp += feeLbp;
                        summary.collected_usd += feeUsd;
                        summary.collected_lbp += feeLbp;
                    }
                    else {
                        summary.returned_without_fee_count += 1;
                    }
                    break;
                case TripOrderStatus.CANCELLED:
                    summary.cancelled_count += 1;
                    summary.refund_usd += priceUsd;
                    summary.refund_lbp += priceLbp;
                    if (tripOrder.fee_applied !== false) {
                        summary.returned_with_fee_count += 1;
                        summary.fee_collected_usd += feeUsd;
                        summary.fee_collected_lbp += feeLbp;
                        summary.collected_usd += feeUsd;
                        summary.collected_lbp += feeLbp;
                    }
                    else {
                        summary.returned_without_fee_count += 1;
                    }
                    break;
                default:
                    summary.pending_count += 1;
            }
        }
        summary.net_usd = summary.collected_usd - summary.refund_usd;
        summary.net_lbp = summary.collected_lbp - summary.refund_lbp;
        return summary;
    }
}
