import { Router } from "express";
import { ExpenseController } from "../controllers/expense.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

const controller = new ExpenseController();

export const expenseRouter = Router();

expenseRouter.get("/categories", asyncHandler(controller.listCategories.bind(controller)));
expenseRouter.post("/categories", asyncHandler(controller.createCategory.bind(controller)));
expenseRouter.get("/entries", asyncHandler(controller.listEntries.bind(controller)));
expenseRouter.post("/entries", asyncHandler(controller.createEntry.bind(controller)));
