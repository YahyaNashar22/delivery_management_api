import { Types } from "mongoose";
import { TripStatus } from "../enums/trip-status.enum.js";

export interface ITrip {
  title: string;
  city: Types.ObjectId;
  driver: Types.ObjectId;
  exchange_usd: number;
  exchange_lbp: number;
  status: TripStatus;
  delivered_at: Date;
}
