import { Schema, model } from "mongoose";
import { ActiveStatus } from "../enums/active-status.enum.js";
const clientSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    district: {
        type: Schema.Types.ObjectId,
        ref: "District",
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
export const ClientModel = model("Client", clientSchema);
