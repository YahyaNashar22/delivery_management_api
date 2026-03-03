import { DailyBoxModel } from "../models/daily-box.model.js";
export class DailyBoxService {
    async list() {
        return DailyBoxModel.find()
            .populate("user", "name")
            .sort({ createdAt: -1 });
    }
    async open(payload) {
        return DailyBoxModel.create(payload);
    }
    async close(id, payload) {
        return DailyBoxModel.findByIdAndUpdate(id, {
            ...payload,
            closed_at: new Date(),
        }, { returnDocument: "after" }).populate("user", "name");
    }
}
