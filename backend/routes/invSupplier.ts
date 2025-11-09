import express, { Router } from "express";
import * as supplierController from "../controllers/invSupplier.controller.js";

const router = express.Router();

router.get("/get-suppliers", supplierController.getSuppliers);

export default router;
