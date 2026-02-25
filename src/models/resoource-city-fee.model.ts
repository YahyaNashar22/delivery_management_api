import { Schema, model, Document, Types } from "mongoose";
import { IResourceCityFee } from "../interfaces/IResourceCityFee.js";

export interface IResourceCityFeeDocument
  extends IResourceCityFee, Document<Types.ObjectId> {}

const resourceCityFeeSchema = new Schema<IResourceCityFeeDocument>(
  {
    city: {
      type: Schema.Types.ObjectId,
      ref: "City",
      required: true,
      index: true,
    },

    // must be of type RESOURCE
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
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
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate resource-city combinations
resourceCityFeeSchema.index({ city: 1, user: 1 }, { unique: true });

export const ResourceCityFeeModel = model<IResourceCityFeeDocument>(
  "ResourceCityFee",
  resourceCityFeeSchema,
);
