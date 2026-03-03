import { Schema, model } from "mongoose";
import { ActiveStatus } from "../enums/active-status.enum.js";
const districtSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    city: {
        type: Schema.Types.ObjectId,
        ref: "City",
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(ActiveStatus),
        default: ActiveStatus.ACTIVE,
    },
}, {
    timestamps: true,
});
// Optional indexes
districtSchema.index({ name: 1, city: 1 }, { unique: true });
export const DistrictModel = model("District", districtSchema);
