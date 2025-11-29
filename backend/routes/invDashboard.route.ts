import express, { Router } from "express";
import * as dashboardController from "../controllers/invDashboard.controller";

const router = express.Router();

router.get("/get-dashboard-stats", dashboardController.getInvDashboardStats);
router.get("/get-dashboard-chart", dashboardController.getInvDashboardChart);
router.get("/get-dashboard-activity", dashboardController.getInvDashboardActivity);
router.get("/", (req, res) => {
    res.json({ message: "Inventory Dashboard Route is working!" });
  });
  
export default router;
