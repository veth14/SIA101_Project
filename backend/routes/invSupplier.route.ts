import express, { Router } from "express";
import * as supplierController from "../controllers/invSupplier.controller.js";

const router = express.Router();

router.get("/get-suppliers", supplierController.getSuppliers);
router.post("/post-supplier", supplierController.postSuppliers);
export default router;
