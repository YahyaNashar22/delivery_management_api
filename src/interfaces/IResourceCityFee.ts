import { Types } from "mongoose";

export interface IResourceCityFee {
  city: Types.ObjectId;
  user: Types.ObjectId; // must be RESOURCE type
  fee_usd: number;
  fee_lbp: number;
}
