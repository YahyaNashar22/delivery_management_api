import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { apiRouter } from "./routes/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
export class App {
    app;
    constructor() {
        this.app = express();
        this.initializeMiddleware();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }
    initializeMiddleware() {
        this.app.use(express.json());
        this.app.use(cors());
        this.app.use(cookieParser());
    }
    initializeRoutes() {
        this.app.get("/", (_, res) => {
            res.json({ message: "API is running" });
        });
        this.app.get("/health", (_, res) => {
            res.json({ status: "ok" });
        });
        this.app.use("/api", apiRouter);
    }
    initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }
    listen(port) {
        this.app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    }
}
