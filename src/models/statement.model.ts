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
