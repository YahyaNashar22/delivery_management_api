import { UserModel } from "../models/user.model.js";
export class UserService {
    async list(filters) {
        const query = {};
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
    async create(payload) {
        return UserModel.create(payload);
    }
    async updateStatus(id, status) {
        return UserModel.findByIdAndUpdate(id, { status }, { returnDocument: "after" })
            .select("-password")
            .populate({ path: "district", select: "name city", populate: { path: "city", select: "name" } });
    }
}
