import { DailyBoxModel } from "../models/daily-box.model.js";

export class DailyBoxService {
  public async list() {
    return DailyBoxModel.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });
  }

  public async open(payload: {
    opening_amount_usd: number;
    opening_amount_lbp: number;
    user: string;
  }) {
    return DailyBoxModel.create(payload);
  }

  public async close(id: string, payload: { closing_amount_usd: number; closing_amount_lbp: number }) {
    return DailyBoxModel.findByIdAndUpdate(
      id,
      {
        ...payload,
        closed_at: new Date(),
      },
      { returnDocument: "after" },
    ).populate("user", "name");
  }
}

