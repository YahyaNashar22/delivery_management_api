import { Request, Response } from "express";
import { OrderService } from "../services/order.service.js";
import {
  assertNonNegative,
  assertRequiredNumber,
  assertRequiredString,
} from "../utils/validators.js";
import { serializeOrder } from "../utils/serializers.js";

const orderService = new OrderService();

export class OrderController {
  public async list(req: Request, res: Response): Promise<void> {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const orders = await orderService.list(search);
    res.json(orders.map(serializeOrder));
  }

  public async create(req: Request, res: Response): Promise<void> {
    const numberInput = req.body.number ?? Date.now();

    const order = await orderService.create({
      number: assertRequiredNumber(numberInput, "number"),
      resource: assertRequiredString(req.body.resource, "resource"),
      client_phone: assertRequiredString(req.body.client_phone, "client_phone"),
      client_name: assertRequiredString(req.body.client_name, "client_name"),
      district: assertRequiredString(req.body.district, "district"),
      added_by: assertRequiredString(req.body.added_by, "added_by"),
      price_usd: assertNonNegative(assertRequiredNumber(req.body.price_usd, "price_usd"), "price_usd"),
      price_lbp: assertNonNegative(assertRequiredNumber(req.body.price_lbp, "price_lbp"), "price_lbp"),
      fee_usd: assertNonNegative(assertRequiredNumber(req.body.fee_usd, "fee_usd"), "fee_usd"),
      fee_lbp: assertNonNegative(assertRequiredNumber(req.body.fee_lbp, "fee_lbp"), "fee_lbp"),
      cash_payed: Boolean(req.body.cash_payed),
    });

    const populated = await order.populate([
      { path: "resource", select: "name" },
      { path: "added_by", select: "name" },
      { path: "district", select: "name city", populate: { path: "city", select: "name" } },
    ]);

    res.status(201).json(serializeOrder(populated));
  }
}
