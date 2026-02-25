import { Schema, model, Document, Types } from "mongoose";
import { ActiveStatus } from "../enums/active-status.enum.js";
import { IClient } from "../interfaces/IClient.js";

export interface IClientDocument extends IClient, Document<Types.ObjectId> {}

const clientSchema = new Schema<IClientDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    district: {
      type: Schema.Types.ObjectId,
      ref: "District",
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

export const ClientModel = model<IClientDocument>("Client", clientSchema);
