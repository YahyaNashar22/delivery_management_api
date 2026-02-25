import { Schema, model, Document, Types } from "mongoose";
import { ActiveStatus } from "../enums/active-status.enum.js";
import { IDistrict } from "../interfaces/IDistrict.js";

export interface IDistrictDocument
  extends IDistrict, Document<Types.ObjectId> {}

const districtSchema = new Schema<IDistrictDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: Schema.Types.ObjectId,
      ref: "City",
      required: true,
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

// Optional indexes
districtSchema.index({ name: 1, city: 1 }, { unique: true });

export const DistrictModel = model<IDistrictDocument>(
  "District",
  districtSchema,
);
