import { ActiveStatus } from "../enums/active-status.enum.js";
import { UserTypes } from "../enums/user-type.enum.js";
import { IUserDocument, UserModel } from "../models/user.model.js";

export class UserService {
  public async list(filters: { search?: string; type?: UserTypes }): Promise<IUserDocument[]> {
    const query: Record<string, unknown> = {};

    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.search) {
      const regex = { $regex: filters.search, $options: "i" };
      query.$or = [{ name: regex }, { username: regex }, { email: regex }];
    }

    return UserModel.find(query)
      .select("-password")
      .populate({ path: "district", select: "name city", populate: { path: "city", select: "name" } })
      .sort({ createdAt: -1 });
  }

  public async create(payload: {
    username: string;
    email: string;
    password: string;
    name: string;
    phone: string;
    district: string;
    type: UserTypes;
  }): Promise<IUserDocument> {
    return UserModel.create(payload);
  }

  public async updateStatus(id: string, status: ActiveStatus): Promise<IUserDocument | null> {
    return UserModel.findByIdAndUpdate(id, { status }, { returnDocument: "after" })
      .select("-password")
      .populate({ path: "district", select: "name city", populate: { path: "city", select: "name" } });
  }
}


