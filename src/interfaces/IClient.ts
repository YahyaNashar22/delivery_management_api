import { Types } from "mongoose";
import { ActiveStatus } from "../enums/active-status.enum.js";

export interface IClient {
    name: string;
    phone: string;
    district: Types.ObjectId;
    status: ActiveStatus;
}