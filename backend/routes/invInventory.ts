import express, { Router } from "express";
import * as inventoryController from "../controllers/invInventory.controller.js";

const router = express.Router();

router.get("/get-stats", inventoryController.getItemStats);
router.get("/get-items", inventoryController.getInventoryItems);

export default router;
