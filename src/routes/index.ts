import { Router } from "express";
import { cityRouter } from "./city.routes.js";
import { dailyBoxRouter } from "./daily-box.routes.js";
import { dashboardRouter } from "./dashboard.routes.js";
import { districtRouter } from "./district.routes.js";
import { expenseRouter } from "./expense.routes.js";
import { orderRouter } from "./order.routes.js";
import { tripRouter } from "./trip.routes.js";
import { userRouter } from "./user.routes.js";

export const apiRouter = Router();

apiRouter.use("/dashboard", dashboardRouter);
apiRouter.use("/cities", cityRouter);
apiRouter.use("/districts", districtRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/orders", orderRouter);
apiRouter.use("/trips", tripRouter);
apiRouter.use("/expenses", expenseRouter);
apiRouter.use("/daily-boxes", dailyBoxRouter);
