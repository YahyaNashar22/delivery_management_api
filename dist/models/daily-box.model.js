import { Schema, model } from "mongoose";
const dailyBoxSchema = new Schema({
    opening_amount_usd: {
        type: Number,
        required: true,
        min: 0,
    },
    opening_amount_lbp: {
        type: Number,
        required: true,
        min: 0,
    },
    closing_amount_usd: {
        type: Number,
        min: 0,
        default: null,
    },
    closing_amount_lbp: {
        type: Number,
        min: 0,
        default: null,
    },
    closed_at: {
        type: Date,
        default: null,
        index: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
}, {
    timestamps: true,
});
// Prevent multiple open boxes per user
dailyBoxSchema.index({ user: 1, closed_at: 1 }, { partialFilterExpression: { closed_at: null } });
// Helpful for reporting
dailyBoxSchema.index({ user: 1, createdAt: -1 });
export const DailyBoxModel = model("DailyBox", dailyBoxSchema);
