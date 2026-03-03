import { Schema, model } from "mongoose";
import { TripOrderStatus } from "../enums/trip-order-status.enum.js";
const tripOrderSchema = new Schema({
    trip: {
        type: Schema.Types.ObjectId,
        ref: "Trip",
        required: true,
        index: true,
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: true,
        index: true,
    },
    status: {
        type: String,
        enum: Object.values(TripOrderStatus),
        required: true,
        default: TripOrderStatus.PENDING,
        index: true,
    },
    index: {
        type: Number,
        required: true,
        min: 0,
    },
    fee_applied: {
        type: Boolean,
        required: true,
        default: true,
    },
    note: {
        type: String,
        trim: true,
        default: "",
    },
}, {
    timestamps: true,
});
// Prevent same order from being added twice to same trip
tripOrderSchema.index({ trip: 1, order: 1 }, { unique: true });
// Fast sorting inside trip
tripOrderSchema.index({ trip: 1, index: 1 });
export const TripOrderModel = model("TripOrder", tripOrderSchema);
