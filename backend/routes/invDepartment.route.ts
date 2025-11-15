import express, { Router } from "express";
import * as departmentController from "../controllers/invDepartment.controller.js";

const router = express.Router();

// Existing routes
// router.get("/get-department", departmentController.getInvDepartment);
// router.post("/post-department", departmentController.postInvDepartment);
// router.post(
//   "/post-maintenance-request",
//   departmentController.postInvMaintenanceRequest
// );

// Category-based department routes (NEW - for your dropdown)
router.get("/get-department", departmentController.getDepartmentsByCategory);

// Aggregation routes
router.post(
  "/aggregate-departments",
  departmentController.aggregateDepartmentData
);
router.post(
  "/assign-item-to-department",
  departmentController.assignItemToDepartment
);

export default router;
