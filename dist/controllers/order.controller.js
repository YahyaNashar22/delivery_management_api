import { OrderService } from "../services/order.service.js";
import { assertNonNegative, assertRequiredNumber, assertRequiredString, } from "../utils/validators.js";
import { serializeOrder } from "../utils/serializers.js";
const orderService = new OrderService();
export class OrderController {
    async list(req, res) {
        const search = typeof req.query.search === "string" ? req.query.search : undefined;
        const orders = await orderService.list(search);
        res.json(orders.map(serializeOrder));
    }
    async create(req, res) {
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
    async bulkImport(req, res) {
        if (!Array.isArray(req.body.orders) || req.body.orders.length === 0) {
            res.status(400).json({ message: "orders array is required" });
            return;
        }
        const rows = req.body.orders;
        const bulkPayload = rows.map((row) => ({
            number: typeof row.number === "number" ? row.number : undefined,
            resource: assertRequiredString(row.resource, "resource"),
            client_phone: assertRequiredString(row.client_phone, "client_phone"),
            client_name: assertRequiredString(row.client_name, "client_name"),
            district: assertRequiredString(row.district, "district"),
            added_by: assertRequiredString(row.added_by, "added_by"),
            price_usd: assertNonNegative(assertRequiredNumber(row.price_usd, "price_usd"), "price_usd"),
            price_lbp: assertNonNegative(assertRequiredNumber(row.price_lbp, "price_lbp"), "price_lbp"),
            fee_usd: assertNonNegative(assertRequiredNumber(row.fee_usd, "fee_usd"), "fee_usd"),
            fee_lbp: assertNonNegative(assertRequiredNumber(row.fee_lbp, "fee_lbp"), "fee_lbp"),
            cash_payed: Boolean(row.cash_payed),
        }));
        const result = await orderService.createBulk(bulkPayload);
        const populated = await Promise.all(result.created.map((order) => order.populate([
            { path: "resource", select: "name" },
            { path: "added_by", select: "name" },
            { path: "district", select: "name city", populate: { path: "city", select: "name" } },
        ])));
        res.status(201).json({
            created_count: populated.length,
            failed_count: result.failed.length,
            failed_rows: result.failed,
            orders: populated.map(serializeOrder),
        });
    }
}
