import { Request, Response } from "express";
import { TripStatus } from "../enums/trip-status.enum.js";
import { TripOrderStatus } from "../enums/trip-order-status.enum.js";
import { TripService } from "../services/trip.service.js";
import { HttpError } from "../utils/http-error.js";
import { serializeTrip, serializeTripOrder } from "../utils/serializers.js";
import {
  assertEnumValue,
  assertNonNegative,
  assertRequiredNumber,
  assertRequiredString,
} from "../utils/validators.js";

const tripService = new TripService();

export class TripController {
  public async list(req: Request, res: Response): Promise<void> {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const status = typeof req.query.status === "string" && req.query.status !== "all"
      ? assertEnumValue(req.query.status, Object.values(TripStatus), "status")
      : undefined;

    const trips = await tripService.list({ search, status });
    res.json(trips.map(serializeTrip));
  }

  public async create(req: Request, res: Response): Promise<void> {
    const trip = await tripService.create({
      title: assertRequiredString(req.body.title, "title"),
      city: assertRequiredString(req.body.city, "city"),
      driver: assertRequiredString(req.body.driver, "driver"),
      exchange_usd: assertNonNegative(assertRequiredNumber(req.body.exchange_usd, "exchange_usd"), "exchange_usd"),
      exchange_lbp: assertNonNegative(assertRequiredNumber(req.body.exchange_lbp, "exchange_lbp"), "exchange_lbp"),
      order_ids: Array.isArray(req.body.order_ids) ? req.body.order_ids.map((id: unknown) => String(id)) : [],
    });

    const populated = await trip.populate([{ path: "city", select: "name" }, { path: "driver", select: "name" }]);
    res.status(201).json(serializeTrip(populated));
  }

  public async updateStatus(req: Request, res: Response): Promise<void> {
    const status = assertEnumValue(req.body.status, Object.values(TripStatus), "status");
    const trip = await tripService.updateStatus(String(req.params.id), status);

    if (!trip) {
      throw new HttpError(404, "Trip not found");
    }

    res.json(serializeTrip(trip));
  }

  public async assignableOrders(req: Request, res: Response): Promise<void> {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const orders = await tripService.getAssignableOrders(search);
    res.json(orders.map((order) => ({
      id: String(order._id),
      number: order.number,
      client_name: order.client_name,
      client_phone: order.client_phone,
      district_name: (order as any).district?.name ?? "",
      price_usd: order.price_usd,
      fee_usd: order.fee_usd,
    })));
  }

  public async getOrders(req: Request, res: Response): Promise<void> {
    const tripData = await tripService.getTripOrders(String(req.params.id));

    res.json({
      trip: serializeTrip(tripData.trip),
      orders: tripData.orders.map(serializeTripOrder),
      summary: tripData.summary,
    });
  }

  public async assignOrders(req: Request, res: Response): Promise<void> {
    const orderIds = Array.isArray(req.body.order_ids) ? req.body.order_ids.map((id: unknown) => String(id)) : [];
    const tripData = await tripService.assignOrders(String(req.params.id), orderIds);

    res.json({
      trip: serializeTrip(tripData.trip),
      orders: tripData.orders.map(serializeTripOrder),
      summary: tripData.summary,
    });
  }

  public async updateTripOrderStatus(req: Request, res: Response): Promise<void> {
    const status = assertEnumValue(req.body.status, Object.values(TripOrderStatus), "status");

    const tripData = await tripService.updateTripOrderStatus(
      String(req.params.id),
      String(req.params.tripOrderId),
      {
        status,
        fee_applied: typeof req.body.fee_applied === "boolean" ? req.body.fee_applied : undefined,
        note: typeof req.body.note === "string" ? req.body.note : undefined,
      },
    );

    res.json({
      trip: serializeTrip(tripData.trip),
      orders: tripData.orders.map(serializeTripOrder),
      summary: tripData.summary,
    });
  }

  public async closeTrip(req: Request, res: Response): Promise<void> {
    const result = await tripService.closeTrip(String(req.params.id));

    res.json({
      trip: serializeTrip(result.trip),
      orders: result.orders.map(serializeTripOrder),
      summary: result.summary,
    });
  }
}
