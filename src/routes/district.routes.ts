import { Router } from "express";
import { DistrictController } from "../controllers/district.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

const controller = new DistrictController();

export const districtRouter = Router();

districtRouter.get("/", asyncHandler(controller.list.bind(controller)));
districtRouter.post("/", asyncHandler(controller.create.bind(controller)));
districtRouter.patch("/:id/status", asyncHandler(controller.updateStatus.bind(controller)));
