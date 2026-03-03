import { Schema, model } from "mongoose";
const expenseCategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
}, {
    timestamps: true,
});
export const ExpenseCategoryModel = model("ExpenseCategory", expenseCategorySchema);
