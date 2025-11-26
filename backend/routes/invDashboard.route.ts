import express, { Router } from "express";
import * as dashboardController from "../controllers/invDashboard.controller.js";

const router = express.Router();

router.get("/get-dashboard-stats", dashboardController.getInvDashboardStats);
router.get("/get-dashboard-chart", dashboardController.getInvDashboardChart);
router.get("/get-dashboard-activity", dashboardController.getInvDashboardActivity);

export default router;
