import express, { Router } from "express";
import * as analyticController from "../controllers/invAnalytic.controller.js";

const router = express.Router();

router.get("/get-analytics-chart", analyticController.getAnalyticsChart);
router.get(
  "/get-analytics-bottom-section",
  analyticController.getAnalyticsBottomSection
);

export default router;
