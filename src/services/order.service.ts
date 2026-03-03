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
}

