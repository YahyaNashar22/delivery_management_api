import { Router } from "express";
import { OrderController } from "../controllers/order.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

const controller = new OrderController();

export const orderRouter = Router();

orderRouter.get("/", asyncHandler(controller.list.bind(controller)));
orderRouter.post("/", asyncHandler(controller.create.bind(controller)));
