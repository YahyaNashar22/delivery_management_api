import { Schema, model } from "mongoose";
const expenseEntrySchema = new Schema({
    expense_category: {
        type: Schema.Types.ObjectId,
        ref: "ExpenseCategory",
        required: true,
        index: true,
    },
    amount_usd: {
        type: Number,
        required: true,
        min: 0,
    },
    amount_lbp: {
        type: Number,
        required: true,
        min: 0,
    },
    trip: {
        type: Schema.Types.ObjectId,
        ref: "Trip",
        required: false,
        index: true,
        default: null,
    },
}, {
    timestamps: true,
});
expenseEntrySchema.index({ expense_category: 1, createdAt: -1 });
expenseEntrySchema.index({ trip: 1, createdAt: -1 });
export const ExpenseEntryModel = model("ExpenseEntry", expenseEntrySchema);
