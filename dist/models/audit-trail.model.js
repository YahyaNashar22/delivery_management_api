import { Schema, model } from "mongoose";
const auditTrailSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    action: {
        type: String,
        required: true,
        trim: true,
    },
    previous_value: {
        type: String,
        required: true,
    },
    new_value: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
// Helpful index for admin panels
auditTrailSchema.index({ createdAt: -1 });
auditTrailSchema.index({ user: 1, createdAt: -1 });
// TODO: PREVENT UPDATES
export const AuditTrailModel = model("AuditTrail", auditTrailSchema);
