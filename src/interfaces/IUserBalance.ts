import { Types } from "mongoose";

export interface IUserBalance {
  user: Types.ObjectId;
  order_count: number;
  balance_usd: number;
  balance_lbp: number;
  order_total_usd: number;
  order_total_lbp: number;
  fee_total_usd: number;
  fee_total_lbp: number;
  old_balance_usd: number;
  old_balance_lbp: number;
}
