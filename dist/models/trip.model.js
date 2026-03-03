import { Schema, model } from "mongoose";
import { TripStatus } from "../enums/trip-status.enum.js";
const tripSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    city: {
        type: Schema.Types.ObjectId,
        ref: "City",
        required: true,
        index: true,
    },
    driver: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    exchange_usd: {
        type: Number,
        required: true,
        min: 0,
    },
    exchange_lbp: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: Object.values(TripStatus),
        required: true,
        default: TripStatus.PENDING,
        index: true,
    },
    delivered_at: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});
// Useful indexes
tripSchema.index({ driver: 1, status: 1 });
tripSchema.index({ createdAt: -1 });
export const TripModel = model("Trip", tripSchema);
