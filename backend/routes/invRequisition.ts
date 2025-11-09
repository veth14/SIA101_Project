import express, { Router } from "express";
import * as requisitionController from "../controllers/invRequisition.controller.js";

const router = express.Router();

router.get("/get-requisitions", requisitionController.getRequisitions);

export default router;
