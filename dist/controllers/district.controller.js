import { ActiveStatus } from "../enums/active-status.enum.js";
import { DistrictService } from "../services/district.service.js";
import { HttpError } from "../utils/http-error.js";
import { serializeDistrict } from "../utils/serializers.js";
import { assertEnumValue, assertRequiredString } from "../utils/validators.js";
const districtService = new DistrictService();
export class DistrictController {
    async list(req, res) {
        const search = typeof req.query.search === "string" ? req.query.search : undefined;
        const districts = await districtService.list(search);
        res.json(districts.map(serializeDistrict));
    }
    async create(req, res) {
        const name = assertRequiredString(req.body.name, "name");
        const city = assertRequiredString(req.body.city, "city");
        const district = await districtService.create({ name, city });
        const populated = await district.populate("city", "name");
        res.status(201).json(serializeDistrict(populated));
    }
    async updateStatus(req, res) {
        const status = assertEnumValue(req.body.status, Object.values(ActiveStatus), "status");
        const district = await districtService.updateStatus(String(req.params.id), status);
        if (!district) {
            throw new HttpError(404, "District not found");
        }
        res.json(serializeDistrict(district));
    }
}
