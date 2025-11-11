import express, { Router } from "express";
import * as procurementController from "../controllers/invProcurement.controller.js";

const router = express.Router();

router.get("/get-procurement-orders", procurementController.getInvProcurementOrder);
router.get("/get-procurement-stats", procurementController.getInvProcurementStats);
router.post("/post-procurement-order", procurementController.postInvProcurementOrder);
export default router;
