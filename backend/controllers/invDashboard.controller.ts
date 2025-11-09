import type { Request, Response } from "express";

type StatCard = {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
};

const stats: StatCard[] = [
  {
    title: "Total Inventory Items",
    value: "1,2248",
    change: "23% from last month",
    changeType: "positive",
  },
  {
    title: "Low Stock Alerts",
    value: "23",
    change: "5% from last month",
    changeType: "positive",
  },
  {
    title: "Pending Purchase Orders",
    value: "18",
    change: "8% from last month",
    changeType: "positive",
  },
  {
    title: "Total Inventory Value",
    value: "$1,320",
    change: "23% from last month",
    changeType: "positive",
  },
];
type ChartData = {
  month: string;
  consumption: number;
};

const chartData: ChartData[] = [
  { month: "January", consumption: 2000 },
  { month: "February", consumption: 1800 },
  { month: "March", consumption: 2200 },
  { month: "April", consumption: 2400 },
  { month: "May", consumption: 2600 },
  { month: "June", consumption: 2800 },
];
type DepartmentData = {
  department: string;
  usage: number;
};

const departmentData: DepartmentData[] = [
  { department: "Housekeeping", usage: 300 },
  { department: "F&B", usage: 250 },
  { department: "Front Desk", usage: 100 },
  { department: "Maintenance", usage: 150 },
  { department: "Kitchen", usage: 400 },
];
type Activity = {
  id: string;
  type: "approved" | "submitted" | "delivered" | "replenished";
  title: string;
  code: string;
  department: string;
  timestamp: string;
};
const recentActivities: Activity[] = [
  {
    id: "1",
    type: "approved",
    title: "Purchase Order approved",
    code: "PO-2024-001",
    department: "Housekeeping",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    type: "submitted",
    title: "Requisition submitted",
    code: "REQ-2024-045",
    department: "F&B",
    timestamp: "4 hours ago",
  },
  {
    id: "3",
    type: "delivered",
    title: "Order delivered",
    code: "PO-2024-002",
    department: "Kitchen",
    timestamp: "1 day ago",
  },
  {
    id: "4",
    type: "replenished",
    title: "Stock replenished",
    code: "INV-2024-156",
    department: "Housekeeping",
    timestamp: "2 day ago",
  },
];

export const getInvDashboardStats = (req: Request, res: Response) => {
  if (stats.length <= 0) {
    return res.status(500).json({ success: false, message: "Missing Stats" });
  }

  res.status(200).json({ success: true, data: stats });
};
export const getInvDashboardChart = (req: Request, res: Response) => {
  if (departmentData.length <= 0) {
    return res
      .status(500)
      .json({ success: false, message: "Missing Chart Data" });
  }

  res.status(200).json({ success: true, data: { chartData, departmentData } });
};
export const getInvDashboardActivity = (req: Request, res: Response) => {
  if (recentActivities.length <= 0) {
    return res
      .status(500)
      .json({ success: false, message: "Missing Activity Data " });
  }

  res.status(200).json({ success: true, data: recentActivities });
};
