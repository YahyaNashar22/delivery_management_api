import { Router } from "express";
import { CityController } from "../controllers/city.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

const controller = new CityController();

export const cityRouter = Router();

cityRouter.get("/", asyncHandler(controller.list.bind(controller)));
cityRouter.post("/", asyncHandler(controller.create.bind(controller)));
cityRouter.patch("/:id/status", asyncHandler(controller.updateStatus.bind(controller)));
