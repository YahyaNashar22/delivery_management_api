import { DailyBoxService } from "../services/daily-box.service.js";
import { HttpError } from "../utils/http-error.js";
import { serializeDailyBox } from "../utils/serializers.js";
import { assertNonNegative, assertRequiredNumber, assertRequiredString, } from "../utils/validators.js";
const dailyBoxService = new DailyBoxService();
export class DailyBoxController {
    async list(_req, res) {
        const dailyBoxes = await dailyBoxService.list();
        res.json(dailyBoxes.map(serializeDailyBox));
    }
    async open(req, res) {
        const dailyBox = await dailyBoxService.open({
            opening_amount_usd: assertNonNegative(assertRequiredNumber(req.body.opening_amount_usd, "opening_amount_usd"), "opening_amount_usd"),
            opening_amount_lbp: assertNonNegative(assertRequiredNumber(req.body.opening_amount_lbp, "opening_amount_lbp"), "opening_amount_lbp"),
            user: assertRequiredString(req.body.user, "user"),
        });
        const populated = await dailyBox.populate("user", "name");
        res.status(201).json(serializeDailyBox(populated));
    }
    async close(req, res) {
        const dailyBox = await dailyBoxService.close(String(req.params.id), {
            closing_amount_usd: assertNonNegative(assertRequiredNumber(req.body.closing_amount_usd, "closing_amount_usd"), "closing_amount_usd"),
            closing_amount_lbp: assertNonNegative(assertRequiredNumber(req.body.closing_amount_lbp, "closing_amount_lbp"), "closing_amount_lbp"),
        });
        if (!dailyBox) {
            throw new HttpError(404, "Daily box not found");
        }
        res.json(serializeDailyBox(dailyBox));
    }
}
