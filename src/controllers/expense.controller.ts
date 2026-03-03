import { Request, Response } from "express";
import { ExpenseService } from "../services/expense.service.js";
import { serializeExpenseCategory, serializeExpenseEntry } from "../utils/serializers.js";
import {
  assertNonNegative,
  assertRequiredNumber,
  assertRequiredString,
} from "../utils/validators.js";

const expenseService = new ExpenseService();

export class ExpenseController {
  public async listCategories(_req: Request, res: Response): Promise<void> {
    const categories = await expenseService.listCategories();
    res.json(categories.map(serializeExpenseCategory));
  }

  public async createCategory(req: Request, res: Response): Promise<void> {
    const category = await expenseService.createCategory({
      name: assertRequiredString(req.body.name, "name"),
    });

    res.status(201).json(serializeExpenseCategory(category));
  }

  public async listEntries(_req: Request, res: Response): Promise<void> {
    const entries = await expenseService.listEntries();
    res.json(entries.map(serializeExpenseEntry));
  }

  public async createEntry(req: Request, res: Response): Promise<void> {
    const entry = await expenseService.createEntry({
      expense_category: assertRequiredString(req.body.expense_category, "expense_category"),
      amount_usd: assertNonNegative(assertRequiredNumber(req.body.amount_usd, "amount_usd"), "amount_usd"),
      amount_lbp: assertNonNegative(assertRequiredNumber(req.body.amount_lbp, "amount_lbp"), "amount_lbp"),
      ...(req.body.trip ? { trip: assertRequiredString(req.body.trip, "trip") } : {}),
    });

    const populated = await (entry as any).populate([
      { path: "expense_category", select: "name" },
      { path: "trip", select: "title" },
    ]);

    res.status(201).json(serializeExpenseEntry(populated));
  }
}
