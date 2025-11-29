import express, { Router } from "express";
import * as requisitionController from "../controllers/invRequisition.controller";

const router = express.Router();

router.get("/get-requisitions", requisitionController.getRequisitions);
router.post("/post-requisition", requisitionController.postRequisition);
router.patch("/patch-requisition/:id", requisitionController.patchInvRequisition); 

export default router;
