import { Schema, model, Document, Types } from "mongoose";
import { IExpenseCategory } from "../interfaces/IExpenseCategory.js";

export interface IExpenseCategoryDocument
  extends IExpenseCategory, Document<Types.ObjectId> {}

const expenseCategorySchema = new Schema<IExpenseCategoryDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

export const ExpenseCategoryModel = model<IExpenseCategoryDocument>(
  "ExpenseCategory",
  expenseCategorySchema,
);
