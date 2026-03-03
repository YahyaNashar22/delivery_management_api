import { Schema, model } from "mongoose";
const userBalanceSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
        index: true,
    },
    order_count: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
    balance_usd: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
    balance_lbp: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
    order_total_usd: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
    order_total_lbp: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
    fee_total_usd: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
    fee_total_lbp: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
    old_balance_usd: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
    old_balance_lbp: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
}, { timestamps: true });
// One balance doc per user
userBalanceSchema.index({ user: 1 }, { unique: true });
export const UserBalanceModel = model("UserBalance", userBalanceSchema);
