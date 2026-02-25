import { Schema, model, Document, Types } from "mongoose";
import { IExpenseEntry } from "../interfaces/IExpenseEntry.js";

export interface IExpenseEntryDocument
  extends IExpenseEntry, Document<Types.ObjectId> {}

const expenseEntrySchema = new Schema<IExpenseEntryDocument>(
  {
    expense_category: {
      type: Schema.Types.ObjectId,
      ref: "ExpenseCategory",
      required: true,
      index: true,
    },

    amount_usd: {
      type: Number,
      required: true,
      min: 0,
    },

    amount_lbp: {
      type: Number,
      required: true,
      min: 0,
    },

    trip: {
      type: Schema.Types.ObjectId,
      ref: "Trip",
      required: false,
      index: true,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

expenseEntrySchema.index({ expense_category: 1, createdAt: -1 });
expenseEntrySchema.index({ trip: 1, createdAt: -1 });

export const ExpenseEntryModel = model<IExpenseEntryDocument>(
  "ExpenseEntry",
  expenseEntrySchema,
);
