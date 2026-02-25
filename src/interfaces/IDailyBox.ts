import { Types } from "mongoose";

export interface IDailyBox {
  opening_amount_usd: number;
  opening_amount_lbp: number;
  closing_amount_usd: number;
  closing_amount_lbp: number;
  closed_at: Date;
  user: Types.ObjectId;
}
