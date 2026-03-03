import { Schema, model } from "mongoose";
const statementSchema = new Schema({
    // must be of type resource
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    orders: [
        {
            type: Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
    ],
}, {
    timestamps: true,
});
// Helpful indexes
statementSchema.index({ user: 1, createdAt: -1 });
statementSchema.index({ orders: 1 });
export const StatementModel = model("Statement", statementSchema);
