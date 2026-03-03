import { ExpenseService } from "../services/expense.service.js";
import { serializeExpenseCategory, serializeExpenseEntry } from "../utils/serializers.js";
import { assertNonNegative, assertRequiredNumber, assertRequiredString, } from "../utils/validators.js";
const expenseService = new ExpenseService();
export class ExpenseController {
    async listCategories(_req, res) {
        const categories = await expenseService.listCategories();
        res.json(categories.map(serializeExpenseCategory));
    }
    async createCategory(req, res) {
        const category = await expenseService.createCategory({
            name: assertRequiredString(req.body.name, "name"),
        });
        res.status(201).json(serializeExpenseCategory(category));
    }
    async listEntries(_req, res) {
        const entries = await expenseService.listEntries();
        res.json(entries.map(serializeExpenseEntry));
    }
    async createEntry(req, res) {
        const entry = await expenseService.createEntry({
            expense_category: assertRequiredString(req.body.expense_category, "expense_category"),
            amount_usd: assertNonNegative(assertRequiredNumber(req.body.amount_usd, "amount_usd"), "amount_usd"),
            amount_lbp: assertNonNegative(assertRequiredNumber(req.body.amount_lbp, "amount_lbp"), "amount_lbp"),
            ...(req.body.trip ? { trip: assertRequiredString(req.body.trip, "trip") } : {}),
        });
        const populated = await entry.populate([
            { path: "expense_category", select: "name" },
            { path: "trip", select: "title" },
        ]);
        res.status(201).json(serializeExpenseEntry(populated));
    }
}
