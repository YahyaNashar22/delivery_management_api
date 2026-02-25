import { Schema, model, Document, Types } from "mongoose";
import { TripOrderStatus } from "../enums/trip-order-status.enum.js";
import { ITripOrder } from "../interfaces/ITripOrder.js";

export interface ITripOrderDocument
  extends ITripOrder, Document<Types.ObjectId> {}

const tripOrderSchema = new Schema<ITripOrderDocument>(
  {
    trip: {
      type: Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
      index: true,
    },

    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(TripOrderStatus),
      required: true,
      default: TripOrderStatus.PENDING,
      index: true,
    },

    index: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent same order from being added twice to same trip
tripOrderSchema.index({ trip: 1, order: 1 }, { unique: true });

// Fast sorting inside trip
tripOrderSchema.index({ trip: 1, index: 1 });

export const TripOrderModel = model<ITripOrderDocument>(
  "TripOrder",
  tripOrderSchema,
);
