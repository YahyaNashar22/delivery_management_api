import { Types } from "mongoose";

export interface IAuditTrail {
  user: Types.ObjectId;
  action: string;
  previous_value: string;
  new_value: string;
}
