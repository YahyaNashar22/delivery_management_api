import { Types } from "mongoose";
import { ActiveStatus } from "../enums/active-status.enum.js";
import { UserTypes } from "../enums/user-type.enum.js";

export interface IUser {
  username: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  district: Types.ObjectId;
  status: ActiveStatus;
  type: UserTypes;
}
