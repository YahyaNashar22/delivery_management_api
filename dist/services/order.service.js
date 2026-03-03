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
    async createBulk(payload) {
        const highestOrder = await OrderModel.findOne().sort({ number: -1 }).select("number").lean();
        let nextNumber = Number(highestOrder?.number ?? 0) + 1;
        const created = [];
        const failed = [];
        for (let index = 0; index < payload.length; index += 1) {
            const row = payload[index];
            try {
                const number = typeof row.number === "number" && !Number.isNaN(row.number)
                    ? row.number
                    : nextNumber++;
                const order = await OrderModel.create({
                    ...row,
                    number,
                });
                created.push(order);
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "Failed to create row";
                failed.push({ index, message });
            }
        }
        return { created, failed };
    }
}
