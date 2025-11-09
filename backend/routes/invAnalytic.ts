import express, { Router } from "express";
import * as analyticController from "../controllers/invAnalytic.controller.js";

const router = express.Router();

router.get("/get-analytics-chart", analyticController.getAnalyticsChart);
router.get(
  "/get-analytics-bottom-section",
  analyticController.getAnalyticsBottomSection
);
router.get(
  "/get-procurement-metrics",
  analyticController.getProcurementMetrics
);
router.get(
  "/get-procurement-analytics",
  analyticController.getProcurementAnalytics
);

router.get("/get-department-metrics", analyticController.getDepartmentMetrics);
router.get("/get-department-charts", analyticController.getDepartmentCharts);

export default router;
