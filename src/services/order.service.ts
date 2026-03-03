import { IOrderDocument, OrderModel } from "../models/order.model.js";

export class OrderService {
  public async list(search?: string): Promise<IOrderDocument[]> {
    const query: Record<string, unknown> = {};

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

  public async create(payload: {
    number: number;
    resource: string;
    client_phone: string;
    client_name: string;
    district: string;
    added_by: string;
    price_usd: number;
    price_lbp: number;
    fee_usd: number;
    fee_lbp: number;
    cash_payed: boolean;
  }): Promise<IOrderDocument> {
    return OrderModel.create(payload);
  }

  public async createBulk(payload: Array<{
    number?: number;
    resource: string;
    client_phone: string;
    client_name: string;
    district: string;
    added_by: string;
    price_usd: number;
    price_lbp: number;
    fee_usd: number;
    fee_lbp: number;
    cash_payed: boolean;
  }>) {
    const highestOrder = await OrderModel.findOne().sort({ number: -1 }).select("number").lean();
    let nextNumber = Number(highestOrder?.number ?? 0) + 1;

    const created: IOrderDocument[] = [];
    const failed: Array<{ index: number; message: string }> = [];

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
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to create row";
        failed.push({ index, message });
      }
    }

    return { created, failed };
  }
}

