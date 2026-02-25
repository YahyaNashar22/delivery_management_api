import { ActiveStatus } from "../enums/active-status.enum.js";

export interface ICity {
  name: string;
  free_usd: number;
  fee_lbp: number;
  status: ActiveStatus;
}
