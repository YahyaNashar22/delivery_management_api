import { Types } from "mongoose";
import { TripOrderStatus } from "../enums/trip-order-status.enum.js";

export interface ITripOrder {
  trip: Types.ObjectId;
  order: Types.ObjectId;
  status: TripOrderStatus;
  index: number; // used to re-arrange order
}
