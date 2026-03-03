import { Router } from "express";
import { StatementController } from "../controllers/statement.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
const controller = new StatementController();
export const statementRouter = Router();
statementRouter.get("/", asyncHandler(controller.list.bind(controller)));
statementRouter.get("/resources", asyncHandler(controller.resources.bind(controller)));
statementRouter.get("/pending-orders/:userId", asyncHandler(controller.pendingOrders.bind(controller)));
statementRouter.post("/", asyncHandler(controller.create.bind(controller)));
