import { Schema, model, Document, Types } from "mongoose";
import { IStatement } from "../interfaces/IStatement.js";

export interface IStatementDocument
  extends IStatement, Document<Types.ObjectId> {}

const statementSchema = new Schema<IStatementDocument>(
  {
    // must be of type resource
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: true,
      },
    ],

    order_count: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    order_total_usd: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    order_total_lbp: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    fee_total_usd: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    fee_total_lbp: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    old_balance_usd: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    old_balance_lbp: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    new_balance_usd: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    new_balance_lbp: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Helpful indexes
statementSchema.index({ user: 1, createdAt: -1 });
statementSchema.index({ orders: 1 });

export const StatementModel = model<IStatementDocument>(
  "Statement",
  statementSchema,
);
