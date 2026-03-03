import { DashboardService } from "../services/dashboard.service.js";
const dashboardService = new DashboardService();
export class DashboardController {
    async summary(_req, res) {
        const summary = await dashboardService.getSummary();
        res.json(summary);
    }
}
