import type { Request, Response } from "express";
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


  res.status(200).json({ success: true, data: stats });
};
