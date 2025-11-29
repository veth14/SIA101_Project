import express from "express";
import * as departmentController from "../controllers/invDepartment.controller";

const router = express.Router();

router.get("/get-department", departmentController.getDepartmentsByCategory);
router.post("/post-maintenance-request", departmentController.postInvMaintenanceRequest);
router.patch("/update-maintenance-request/:id", departmentController.patchInvMaintenanceRequest);
router.post("/aggregate-departments", departmentController.aggregateDepartmentData);
router.post("/assign-item-to-department", departmentController.assignItemToDepartment);
router.patch("/update-department/:id", departmentController.patchInvDepartment);

export default router;
