import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
const controller = new DashboardController();
export const dashboardRouter = Router();
dashboardRouter.get("/summary", asyncHandler(controller.summary.bind(controller)));
