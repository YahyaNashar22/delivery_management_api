import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
const controller = new UserController();
export const userRouter = Router();
userRouter.get("/", asyncHandler(controller.list.bind(controller)));
userRouter.post("/", asyncHandler(controller.create.bind(controller)));
userRouter.patch("/:id/status", asyncHandler(controller.updateStatus.bind(controller)));
