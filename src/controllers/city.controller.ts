import { Request, Response } from "express";
import { ActiveStatus } from "../enums/active-status.enum.js";
import { CityService } from "../services/city.service.js";
import { HttpError } from "../utils/http-error.js";
import {
  assertEnumValue,
  assertNonNegative,
  assertRequiredNumber,
  assertRequiredString,
} from "../utils/validators.js";
import { serializeCity } from "../utils/serializers.js";

const cityService = new CityService();

export class CityController {
  public async list(req: Request, res: Response): Promise<void> {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const cities = await cityService.list(search);
    res.json(cities.map(serializeCity));
  }

  public async create(req: Request, res: Response): Promise<void> {
    const name = assertRequiredString(req.body.name, "name");
    const free_usd = assertNonNegative(assertRequiredNumber(req.body.free_usd, "free_usd"), "free_usd");
    const fee_lbp = assertNonNegative(assertRequiredNumber(req.body.fee_lbp, "fee_lbp"), "fee_lbp");

    const city = await cityService.create({ name, free_usd, fee_lbp });
    res.status(201).json(serializeCity(city));
  }

  public async updateStatus(req: Request, res: Response): Promise<void> {
    const status = assertEnumValue(req.body.status, Object.values(ActiveStatus), "status");
    const city = await cityService.updateStatus(String(req.params.id), status);

    if (!city) {
      throw new HttpError(404, "City not found");
    }

    res.json(serializeCity(city));
  }
}

