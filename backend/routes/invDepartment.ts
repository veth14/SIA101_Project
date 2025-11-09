import express, { Router } from "express";
import * as dashboardController from "../controllers/invDepartment.controller.js";

const router = express.Router();

router.get("/get-department", dashboardController.getInvDepartment);

export default router;
