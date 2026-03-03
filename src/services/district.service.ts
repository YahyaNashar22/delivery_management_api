import { ActiveStatus } from "../enums/active-status.enum.js";
import { IDistrictDocument, DistrictModel } from "../models/district.model.js";

export class DistrictService {
  public async list(search?: string): Promise<IDistrictDocument[]> {
    const query: Record<string, unknown> = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
      ];
    }

    return DistrictModel.find(query)
      .populate("city", "name")
      .sort({ name: 1 });
  }

  public async create(payload: {
    name: string;
    city: string;
    status?: ActiveStatus;
  }): Promise<IDistrictDocument> {
    return DistrictModel.create({
      name: payload.name,
      city: payload.city,
      status: payload.status ?? ActiveStatus.ACTIVE,
    });
  }

  public async updateStatus(id: string, status: ActiveStatus): Promise<IDistrictDocument | null> {
    return DistrictModel.findByIdAndUpdate(id, { status }, { returnDocument: "after" }).populate("city", "name");
  }
}


