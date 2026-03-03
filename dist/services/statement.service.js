import { UserTypes } from "../enums/user-type.enum.js";
import { OrderModel } from "../models/order.model.js";
import { StatementModel } from "../models/statement.model.js";
import { UserBalanceModel } from "../models/user-balance.model.js";
import { UserModel } from "../models/user.model.js";
import { HttpError } from "../utils/http-error.js";
export class StatementService {
    async list(userId) {
        const query = {};
        if (userId) {
            query.user = userId;
        }
        return StatementModel.find(query)
            .populate("user", "name email type")
            .populate("orders", "number client_name client_phone price_usd price_lbp fee_usd fee_lbp")
            .sort({ createdAt: -1 });
    }
    async getResourcesWithBalances() {
        const resources = await UserModel.find({ type: UserTypes.RESOURCE })
            .select("name email phone status")
            .sort({ name: 1 });
        const resourceIds = resources.map((resource) => resource._id);
        const balances = await UserBalanceModel.find({ user: { $in: resourceIds } }).lean();
        const balanceMap = new Map(balances.map((balance) => [String(balance.user), balance]));
        return resources.map((resource) => ({
            user: resource,
            balance: balanceMap.get(String(resource._id)) ?? {
                order_count: 0,
                balance_usd: 0,
                balance_lbp: 0,
                order_total_usd: 0,
                order_total_lbp: 0,
                fee_total_usd: 0,
                fee_total_lbp: 0,
                old_balance_usd: 0,
                old_balance_lbp: 0,
            },
        }));
    }
    async listPendingOrdersForResource(userId) {
        const user = await UserModel.findById(userId).select("type");
        if (!user) {
            throw new HttpError(404, "Resource user not found");
        }
        if (user.type !== UserTypes.RESOURCE) {
            throw new HttpError(400, "Statements can only be created for RESOURCE users");
        }
        const statementedOrderIds = await StatementModel.distinct("orders");
        return OrderModel.find({
            resource: userId,
            _id: { $nin: statementedOrderIds },
        })
            .populate("district", "name")
            .sort({ createdAt: -1 });
    }
    async create(payload) {
        const user = await UserModel.findById(payload.user).select("type");
        if (!user) {
            throw new HttpError(404, "Resource user not found");
        }
        if (user.type !== UserTypes.RESOURCE) {
            throw new HttpError(400, "Statements can only be created for RESOURCE users");
        }
        const uniqueOrderIds = [...new Set(payload.order_ids.map((id) => String(id)))];
        if (uniqueOrderIds.length === 0) {
            throw new HttpError(400, "order_ids is required");
        }
        const alreadyStatemented = await StatementModel.findOne({ orders: { $in: uniqueOrderIds } }).select("_id").lean();
        if (alreadyStatemented) {
            throw new HttpError(409, "One or more selected orders already belong to another statement");
        }
        const orders = await OrderModel.find({
            _id: { $in: uniqueOrderIds },
            resource: payload.user,
        });
        if (orders.length !== uniqueOrderIds.length) {
            throw new HttpError(400, "Some orders are invalid or do not belong to the selected resource");
        }
        let order_total_usd = 0;
        let order_total_lbp = 0;
        let fee_total_usd = 0;
        let fee_total_lbp = 0;
        for (const order of orders) {
            order_total_usd += Number(order.price_usd);
            order_total_lbp += Number(order.price_lbp);
            fee_total_usd += Number(order.fee_usd);
            fee_total_lbp += Number(order.fee_lbp);
        }
        const balance = await UserBalanceModel.findOne({ user: payload.user });
        const old_balance_usd = Number(balance?.balance_usd ?? 0);
        const old_balance_lbp = Number(balance?.balance_lbp ?? 0);
        const new_balance_usd = old_balance_usd + order_total_usd + fee_total_usd;
        const new_balance_lbp = old_balance_lbp + order_total_lbp + fee_total_lbp;
        const statement = await StatementModel.create({
            user: payload.user,
            title: payload.title,
            orders: uniqueOrderIds,
            order_count: uniqueOrderIds.length,
            order_total_usd,
            order_total_lbp,
            fee_total_usd,
            fee_total_lbp,
            old_balance_usd,
            old_balance_lbp,
            new_balance_usd,
            new_balance_lbp,
        });
        try {
            await UserBalanceModel.findOneAndUpdate({ user: payload.user }, {
                $inc: {
                    order_count: uniqueOrderIds.length,
                    order_total_usd,
                    order_total_lbp,
                    fee_total_usd,
                    fee_total_lbp,
                },
                $set: {
                    old_balance_usd,
                    old_balance_lbp,
                    balance_usd: new_balance_usd,
                    balance_lbp: new_balance_lbp,
                },
            }, {
                upsert: true,
                returnDocument: "after",
                setDefaultsOnInsert: true,
            });
        }
        catch (error) {
            await StatementModel.findByIdAndDelete(statement._id);
            throw error;
        }
        return StatementModel.findById(statement._id)
            .populate("user", "name email type")
            .populate("orders", "number client_name client_phone price_usd price_lbp fee_usd fee_lbp");
    }
}
