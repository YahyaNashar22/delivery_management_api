import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { apiRouter } from "./routes/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

export class App {
  public readonly app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    this.app.use(express.json());
    this.app.use(
      cors({
        origin: [
          "http://localhost:5173",
          "https://delivery-management-api-k06v.onrender.com",
          "https://delivery-buddy.netlify.app",
        ],
        credentials: true,
      }),
    );
    this.app.use(cookieParser());
  }

  private initializeRoutes(): void {
    this.app.get("/", (_, res) => {
      res.json({ message: "API is running" });
    });

    this.app.get("/health", (_, res) => {
      res.json({ status: "ok" });
    });

    this.app.use("/api", apiRouter);
  }

  private initializeErrorHandling(): void {
    this.app.use(errorMiddleware);
  }

  public listen(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  }
}
