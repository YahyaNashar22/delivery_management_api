import { Schema, model, Document, Types } from "mongoose";
import { TripStatus } from "../enums/trip-status.enum.js";
import { ITrip } from "../interfaces/ITrip.js";

export interface ITripDocument extends ITrip, Document<Types.ObjectId> {}

const tripSchema = new Schema<ITripDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: Schema.Types.ObjectId,
      ref: "City",
      required: true,
      index: true,
    },

    driver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    exchange_usd: {
      type: Number,
      required: true,
      min: 0,
    },

    exchange_lbp: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: Object.values(TripStatus),
      required: true,
      default: TripStatus.PENDING,
      index: true,
    },

    delivered_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Useful indexes
tripSchema.index({ driver: 1, status: 1 });
tripSchema.index({ createdAt: -1 });

export const TripModel = model<ITripDocument>("Trip", tripSchema);
