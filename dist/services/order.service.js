import { OrderModel } from "../models/order.model.js";
export class OrderService {
    async list(search) {
        const query = {};
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
            .sort({ createdAt: -1 });
    }
    async create(payload) {
        return OrderModel.create(payload);
    }
}
