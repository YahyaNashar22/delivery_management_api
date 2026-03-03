import { Schema, model } from "mongoose";
import { ActiveStatus } from "../enums/active-status.enum.js";
import { UserTypes } from "../enums/user-type.enum.js";
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
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
    type: {
        type: String,
        enum: Object.values(UserTypes),
        required: true,
    },
}, {
    timestamps: true,
});
export const UserModel = model("User", userSchema);
