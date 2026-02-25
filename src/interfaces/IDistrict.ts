import { Types } from "mongoose";
import { ActiveStatus } from "../enums/active-status.enum.js";

export interface IDistrict {
  name: string;
  city: Types.ObjectId;
  status: ActiveStatus;
}
