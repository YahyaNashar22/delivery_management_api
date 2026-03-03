import { ActiveStatus } from "../enums/active-status.enum.js";
import { CityModel } from "../models/city.model.js";
export class CityService {
    async list(search) {
        const query = {};
        if (search) {
            query.name = { $regex: search, $options: "i" };
        }
        return CityModel.find(query).sort({ name: 1 });
    }
    async create(payload) {
        return CityModel.create({
            name: payload.name,
            free_usd: payload.free_usd,
            fee_lbp: payload.fee_lbp,
            status: payload.status ?? ActiveStatus.ACTIVE,
        });
    }
    async updateStatus(id, status) {
        return CityModel.findByIdAndUpdate(id, { status }, { returnDocument: "after" });
    }
}
