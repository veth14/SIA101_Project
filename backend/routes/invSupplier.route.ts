import express, { Router } from "express";
import * as supplierController from "../controllers/invSupplier.controller";

const router = express.Router();

router.get("/get-suppliers", supplierController.getSuppliers);
router.post("/post-supplier", supplierController.postSuppliers);
router.patch("/patch-supplier/:id", supplierController.patchInvSupplier);
export default router;
