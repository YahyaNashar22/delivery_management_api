import { ActiveStatus } from "../enums/active-status.enum.js";
import { ICityDocument, CityModel } from "../models/city.model.js";

export class CityService {
  public async list(search?: string): Promise<ICityDocument[]> {
    const query: Record<string, unknown> = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    return CityModel.find(query).sort({ name: 1 });
  }

  public async create(payload: {
    name: string;
    free_usd: number;
    fee_lbp: number;
    status?: ActiveStatus;
  }): Promise<ICityDocument> {
    return CityModel.create({
      name: payload.name,
      free_usd: payload.free_usd,
      fee_lbp: payload.fee_lbp,
      status: payload.status ?? ActiveStatus.ACTIVE,
    });
  }

  public async updateStatus(id: string, status: ActiveStatus): Promise<ICityDocument | null> {
    return CityModel.findByIdAndUpdate(id, { status }, { returnDocument: "after" });
  }
}


