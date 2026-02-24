import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

export class App {
  public readonly app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddleware();
    this.initializeRoutes();
  }

  private initializeMiddleware(): void {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(cookieParser());
  }

  private initializeRoutes(): void {
    this.app.get("/", (_, res) => {
      res.json({ message: "API is running" });
    });
  }

  public listen(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  }
}
