import { Schema, model, Document, Types } from "mongoose";
import { IOrder } from "../interfaces/IOrder.js";

export interface IOrderDocument extends IOrder, Document<Types.ObjectId> {}

const orderSchema = new Schema<IOrderDocument>(
  {
    number: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },

    // user of type resource
    resource: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    client_phone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    client_name: {
      type: String,
      required: true,
      trim: true,
    },

    district: {
      type: Schema.Types.ObjectId,
      ref: "District",
      required: true,
      index: true,
    },

    added_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    price_usd: {
      type: Number,
      required: true,
      min: 0,
    },

    price_lbp: {
      type: Number,
      required: true,
      min: 0,
    },

    fee_usd: {
      type: Number,
      required: true,
      min: 0,
    },

    fee_lbp: {
      type: Number,
      required: true,
      min: 0,
    },

    cash_payed: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Helpful indexes for dashboard queries
orderSchema.index({ createdAt: -1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ district: 1, createdAt: -1 });

export const OrderModel = model<IOrderDocument>("Order", orderSchema);
