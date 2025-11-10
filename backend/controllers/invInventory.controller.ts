import type { Request, Response } from "express";
import { db } from "../config/firebaseAdmin.js";
const stats: any = [
  {
    title: "Total Inventory Items",
    value: "140",
    change: "+23% from last month",
    changeType: "positive" as const,
    iconBg: "bg-green-100",
  },
  {
    title: "Low Stock Alerts",
    value: "1",
    change: "5% from last month",
    changeType: "positive" as const,
    iconBg: "bg-yellow-100",
  },
  {
    title: "Out of Stock Items",
    value: "0",
    change: "8% from last month",
    changeType: "negative" as const,
    iconBg: "bg-red-100",
  },
  {
    title: "Total Inventory Value",
    value: "2,029,165",
    change: "23% from last month",
    changeType: "positive" as const,
    iconBg: "bg-green-100",
  },
];

export const getItemStats = (req: Request, res: Response) => {
  if (stats.length <= 0) {
    return res
      .status(500)
      .json({ success: false, message: "Missing Stats Items" });
  }

  res.status(200).json({ success: true, data: stats });
};

export const getInventoryItems = async (req: Request, res: Response) => {
  const snapshot = await db.collection("inventory_items").get();
  if (snapshot.empty) {
    res
      .status(404)
      .send({ success: false, message: "No Inventory Items Found" });
    return;
  }

  const inventoryItems: any = [];

  snapshot.forEach((doc) => {
    inventoryItems.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  res.status(200).json({ success: true, data: inventoryItems });
};
