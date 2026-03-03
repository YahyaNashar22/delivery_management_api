import { Types } from "mongoose";

export interface IStatement {
  user: Types.ObjectId; // must be of type resource
  title: string;
  orders: Types.ObjectId[];
  order_count: number;
  order_total_usd: number;
  order_total_lbp: number;
  fee_total_usd: number;
  fee_total_lbp: number;
  old_balance_usd: number;
  old_balance_lbp: number;
  new_balance_usd: number;
  new_balance_lbp: number;
}
