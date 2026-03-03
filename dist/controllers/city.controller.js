import { ActiveStatus } from "../enums/active-status.enum.js";
import { CityService } from "../services/city.service.js";
import { HttpError } from "../utils/http-error.js";
import { assertEnumValue, assertNonNegative, assertRequiredNumber, assertRequiredString, } from "../utils/validators.js";
import { serializeCity } from "../utils/serializers.js";
const cityService = new CityService();
export class CityController {
    async list(req, res) {
        const search = typeof req.query.search === "string" ? req.query.search : undefined;
        const cities = await cityService.list(search);
        res.json(cities.map(serializeCity));
    }
    async create(req, res) {
        const name = assertRequiredString(req.body.name, "name");
        const free_usd = assertNonNegative(assertRequiredNumber(req.body.free_usd, "free_usd"), "free_usd");
        const fee_lbp = assertNonNegative(assertRequiredNumber(req.body.fee_lbp, "fee_lbp"), "fee_lbp");
        const city = await cityService.create({ name, free_usd, fee_lbp });
        res.status(201).json(serializeCity(city));
    }
    async updateStatus(req, res) {
        const status = assertEnumValue(req.body.status, Object.values(ActiveStatus), "status");
        const city = await cityService.updateStatus(String(req.params.id), status);
        if (!city) {
            throw new HttpError(404, "City not found");
        }
        res.json(serializeCity(city));
    }
}
