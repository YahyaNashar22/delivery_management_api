import { Schema, model } from "mongoose";
import { ActiveStatus } from "../enums/active-status.enum.js";
const citySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    free_usd: {
        type: Number,
        required: true,
        min: 0,
    },
    fee_lbp: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: Object.values(ActiveStatus),
        default: ActiveStatus.ACTIVE,
    },
}, {
    timestamps: true,
});
export const CityModel = model("City", citySchema);
