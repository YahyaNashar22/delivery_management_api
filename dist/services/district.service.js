import { ActiveStatus } from "../enums/active-status.enum.js";
import { DistrictModel } from "../models/district.model.js";
export class DistrictService {
    async list(search) {
        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
            ];
        }
        return DistrictModel.find(query)
            .populate("city", "name")
            .sort({ name: 1 });
    }
    async create(payload) {
        return DistrictModel.create({
            name: payload.name,
            city: payload.city,
            status: payload.status ?? ActiveStatus.ACTIVE,
        });
    }
    async updateStatus(id, status) {
        return DistrictModel.findByIdAndUpdate(id, { status }, { returnDocument: "after" }).populate("city", "name");
    }
}
