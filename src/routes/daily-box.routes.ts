import { Router } from "express";
import { DailyBoxController } from "../controllers/daily-box.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

const controller = new DailyBoxController();

export const dailyBoxRouter = Router();

dailyBoxRouter.get("/", asyncHandler(controller.list.bind(controller)));
dailyBoxRouter.post("/", asyncHandler(controller.open.bind(controller)));
dailyBoxRouter.patch("/:id/close", asyncHandler(controller.close.bind(controller)));
