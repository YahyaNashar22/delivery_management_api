import { Types } from "mongoose";

export interface IOrder {
  number: number;
  resource: Types.ObjectId; // user of type resource
  client_phone: string;
  client_name: string;
  district: Types.ObjectId;
  added_by: Types.ObjectId;
  price_usd: number;
  price_lbp: number;
  fee_usd: number;
  fee_lbp: number;
  cash_payed: boolean;
}
