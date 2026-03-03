import { ExpenseCategoryModel } from "../models/expense-category.model.js";
import { ExpenseEntryModel } from "../models/expense-entry.model.js";

export class ExpenseService {
  public async listCategories() {
    return ExpenseCategoryModel.find().sort({ name: 1 });
  }

  public async createCategory(payload: { name: string }) {
    return ExpenseCategoryModel.create(payload);
  }

  public async listEntries() {
    return ExpenseEntryModel.find()
      .populate("expense_category", "name")
      .populate("trip", "title")
      .sort({ createdAt: -1 });
  }

  public async createEntry(payload: {
    expense_category: string;
    amount_usd: number;
    amount_lbp: number;
    trip?: string;
  }) {
    return ExpenseEntryModel.create(payload);
  }
}
