import express from "express";
import * as departmentController from "../controllers/invDepartment.controller.js";

const router = express.Router();

router.get("/get-department", departmentController.getInvDepartment);
router.post("/post-department", departmentController.postInvDepartment);
router.post("/post-maintenance-request", departmentController.postInvMaintenanceRequest);
router.patch("/update-maintenance-request/:id", departmentController.patchInvMaintenanceRequest);

export default router;
