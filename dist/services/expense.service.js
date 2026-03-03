import { ExpenseCategoryModel } from "../models/expense-category.model.js";
import { ExpenseEntryModel } from "../models/expense-entry.model.js";
export class ExpenseService {
    async listCategories() {
        return ExpenseCategoryModel.find().sort({ name: 1 });
    }
    async createCategory(payload) {
        return ExpenseCategoryModel.create(payload);
    }
    async listEntries() {
        return ExpenseEntryModel.find()
            .populate("expense_category", "name")
            .populate("trip", "title")
            .sort({ createdAt: -1 });
    }
    async createEntry(payload) {
        return ExpenseEntryModel.create(payload);
    }
}
