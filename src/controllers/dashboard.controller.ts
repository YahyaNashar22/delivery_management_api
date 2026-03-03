import { Request, Response } from "express";
import { DashboardService } from "../services/dashboard.service.js";

const dashboardService = new DashboardService();

export class DashboardController {
  public async summary(_req: Request, res: Response): Promise<void> {
    const summary = await dashboardService.getSummary();
    res.json(summary);
  }
}
