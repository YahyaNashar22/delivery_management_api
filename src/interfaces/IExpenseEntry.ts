import { Types } from "mongoose";

export interface IExpenseEntry {
  expense_category: Types.ObjectId;
  amount_usd: number;
  amount_lbp: number;
  trip?: Types.ObjectId;
}
