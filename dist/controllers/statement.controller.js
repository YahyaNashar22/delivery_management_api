import { StatementService } from "../services/statement.service.js";
import { serializePendingStatementOrder, serializeResourceWithBalance, serializeStatement } from "../utils/serializers.js";
import { assertRequiredString } from "../utils/validators.js";
const statementService = new StatementService();
export class StatementController {
    async list(req, res) {
        const user = typeof req.query.user === "string" ? req.query.user : undefined;
        const statements = await statementService.list(user);
        res.json(statements.map(serializeStatement));
    }
    async resources(_req, res) {
        const resources = await statementService.getResourcesWithBalances();
        res.json(resources.map(serializeResourceWithBalance));
    }
    async pendingOrders(req, res) {
        const orders = await statementService.listPendingOrdersForResource(String(req.params.userId));
        res.json(orders.map(serializePendingStatementOrder));
    }
    async create(req, res) {
        const statement = await statementService.create({
            user: assertRequiredString(req.body.user, "user"),
            title: assertRequiredString(req.body.title, "title"),
            order_ids: Array.isArray(req.body.order_ids) ? req.body.order_ids.map((id) => String(id)) : [],
        });
        res.status(201).json(serializeStatement(statement));
    }
}
