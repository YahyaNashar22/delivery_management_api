import { Types } from "mongoose";

export interface IStatement {
  user: Types.ObjectId; // must be of type resource
  title: string;
  orders: Types.ObjectId[];
}
