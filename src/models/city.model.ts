import { Schema, model, Document, Types } from "mongoose";
import { ActiveStatus } from "../enums/active-status.enum.js";
import { ICity } from "../interfaces/ICity.js";

export interface ICityDocument extends ICity, Document<Types.ObjectId> {}

const citySchema = new Schema<ICityDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    free_usd: {
      type: Number,
      required: true,
      min: 0,
    },

    fee_lbp: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: Object.values(ActiveStatus),
      default: ActiveStatus.ACTIVE,
    },
  },
  {
    timestamps: true,
  },
);

export const CityModel = model<ICityDocument>("City", citySchema);
