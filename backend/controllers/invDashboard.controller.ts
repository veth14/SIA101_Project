import type { Request, Response } from "express";
import { db } from "../config/firebaseAdmin.js";

type StatCard = {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
};

type ChartData = {
  month: string;
  consumption: number;
};

type DepartmentData = {
  department: string;
  usage: number;
};

type Activity = {
  id: string;
  type: "approved" | "submitted" | "delivered" | "replenished";
  title: string;
  code: string;
  department: string;
  timestamp: string;
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount);
};

const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
  
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
};

export const getInvDashboardStats = async (req: Request, res: Response) => {
  try {
    const [itemsSnapshot, ordersSnapshot, requisitionsSnapshot] = await Promise.all([
      db.collection("inventory_items").get(),
      db.collection("purchaseOrders").get(),
      db.collection("requisitions").get(),
    ]);

    const inventoryItems = itemsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const purchaseOrders = ordersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const requisitions = requisitionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // calcute the total number of inventory items
    const totalItems = inventoryItems.length;

    const lowStockItems = inventoryItems.filter(
      (item: any) => item.currentStock <= (item.reorderLevel || 10)
    ).length;

    const outOfStockItems = inventoryItems.filter(
      (item: any) => item.currentStock === 0 || !item.currentStock
    ).length;

    const pendingOrders = purchaseOrders.filter(
      (po: any) => po.status === "pending"
    ).length;

    const pendingPOValue = purchaseOrders
      .filter((po: any) => po.status === "pending")
      .reduce((sum: number, po: any) => sum + (po.totalAmount || 0), 0);

    const totalInventoryValue = inventoryItems.reduce((sum: number, item: any) => {
      return sum + (item.currentStock || 0) * (item.unitPrice || 0);
    }, 0);

    const lastMonthItems = inventoryItems.filter((item: any) => {
      if (!item.createdAt) return false;
      const itemDate = new Date(item.createdAt);
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return itemDate.getMonth() === lastMonth.getMonth();
    }).length;

    const itemGrowth = lastMonthItems > 0 
      ? Math.round(((totalItems - lastMonthItems) / lastMonthItems) * 100)
      : 0;

    const stats: StatCard[] = [
      {
        title: "Total Inventory Items",
        value: totalItems.toLocaleString(),
        change: itemGrowth > 0 
          ? `+${itemGrowth}% from last month` 
          : `${lowStockItems} low stock, ${outOfStockItems} out of stock`,
        changeType: itemGrowth > 0 ? "positive" : lowStockItems > 0 ? "negative" : "neutral",
      },
      {
        title: "Low Stock Alerts",
        value: lowStockItems.toString(),
        change: outOfStockItems > 0 
          ? `${outOfStockItems} out of stock items` 
          : `${totalItems - lowStockItems} items well-stocked`,
        changeType: lowStockItems > 5 ? "negative" : lowStockItems > 0 ? "neutral" : "positive",
      },
      {
        title: "Pending Purchase Orders",
        value: pendingOrders.toString(),
        change: formatCurrency(pendingPOValue),
        changeType: pendingOrders > 10 ? "negative" : "neutral",
      },
      {
        title: "Total Inventory Value",
        value: formatCurrency(totalInventoryValue),
        change: `${totalItems} items tracked`,
        changeType: "positive",
      },
    ];

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error("❌ Error fetching dashboard stats:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getInvDashboardChart = async (req: Request, res: Response) => {
  try {
    const [itemsSnapshot, ordersSnapshot, requisitionsSnapshot] = await Promise.all([
      db.collection("inventory_items").get(),
      db.collection("purchaseOrders").get(),
      db.collection("requisitions").get(),
    ]);

    const inventoryItems = itemsSnapshot.docs.map((doc) => doc.data());
    const purchaseOrders = ordersSnapshot.docs.map((doc) => doc.data());
    const requisitions = requisitionsSnapshot.docs.map((doc) => doc.data());

    const monthlyData: Record<string, number> = {};
    const currentYear = new Date().getFullYear();

    purchaseOrders.forEach((po: any) => {
      if (po.orderDate) {
        const date = new Date(po.orderDate);
        if (date.getFullYear() === currentYear) {
          const month = date.toLocaleString("en-US", { month: "long" });
          monthlyData[month] = (monthlyData[month] || 0) + (po.totalAmount || 0);
        }
      }
    });

    requisitions.forEach((req: any) => {
      if (req.requestDate) {
        const date = new Date(req.requestDate);
        if (date.getFullYear() === currentYear) {
          const month = date.toLocaleString("en-US", { month: "long" });
          monthlyData[month] = (monthlyData[month] || 0) + (req.totalEstimatedCost || 0);
        }
      }
    });

    const chartData: ChartData[] = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ].map((month) => ({
      month,
      consumption: monthlyData[month] || 0,
    }));

    // === DEPARTMENT USAGE CHART ===
    const categoryMap: Record<string, string> = {
      "Food & Beverage": "F&B",
      "Front Office": "Front Desk",
      "Guest Amenities": "Guest Services",
      "Housekeeping": "Housekeeping",
      "Laundry": "Laundry",
      "Maintenance": "Maintenance",
      "Security": "Security",
    };

    const departmentUsage: Record<string, number> = {};

    inventoryItems.forEach((item: any) => {
      const dept = categoryMap[item.category] || item.category || "Other";
      const value = (item.currentStock || 0) * (item.unitPrice || 0);
      departmentUsage[dept] = (departmentUsage[dept] || 0) + value;
    });

    // Add requisitions by department
    requisitions.forEach((req: any) => {
      const dept = req.department || "Other";
      departmentUsage[dept] = (departmentUsage[dept] || 0) + (req.totalEstimatedCost || 0);
    });

    const departmentData: DepartmentData[] = Object.entries(departmentUsage)
      .map(([department, usage]) => ({
        department,
        usage,
      }))
      .sort((a, b) => b.usage - a.usage) // Sort by highest usage
      .slice(0, 10); // Limit to top 10

    res.status(200).json({ success: true, data: { chartData, departmentData } });
  } catch (error) {
    console.error("❌ Error fetching chart data:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getInvDashboardActivity = async (req: Request, res: Response) => {
  try {
    // Fetch latest records from all three collections
    const [itemsSnapshot, ordersSnapshot, requisitionsSnapshot] = await Promise.all([
      db.collection("inventory_items").orderBy("createdAt", "desc").limit(15).get(),
      db.collection("purchaseOrders").orderBy("createdAt", "desc").limit(15).get(),
      db.collection("requisitions").orderBy("createdAt", "desc").limit(15).get(),
    ]);

    const activities: (Activity & { sortDate: Date })[] = [];

    // === PROCESS PURCHASE ORDERS ===
    ordersSnapshot.docs.forEach((doc) => {
      const po = doc.data();
      let type: Activity["type"] = "submitted";
      let title = "Purchase Order submitted";

      if (po.status === "approved") {
        type = "approved";
        title = "Purchase Order approved";
      } else if (po.status === "received") {
        type = "delivered";
        title = "Order delivered";
      }

      const createdDate = po.createdAt ? new Date(po.createdAt) : new Date(po.orderDate);

      activities.push({
        id: doc.id,
        type,
        title,
        code: po.orderNumber || doc.id,
        department: po.supplier || "N/A",
        timestamp: getRelativeTime(po.createdAt || po.orderDate),
        sortDate: createdDate,
      });
    });

    // === PROCESS REQUISITIONS ===
    requisitionsSnapshot.docs.forEach((doc) => {
      const req = doc.data();
      let type: Activity["type"] = "submitted";
      let title = "Requisition submitted";

      if (req.status === "approved") {
        type = "approved";
        title = "Requisition approved";
      } else if (req.status === "fulfilled") {
        type = "delivered";
        title = "Requisition fulfilled";
      }

      const createdDate = req.createdAt ? new Date(req.createdAt) : new Date(req.requestDate);

      activities.push({
        id: doc.id,
        type,
        title,
        code: req.requestNumber || doc.id,
        department: req.department || "N/A",
        timestamp: getRelativeTime(req.createdAt || req.requestDate),
        sortDate: createdDate,
      });
    });

    // === PROCESS INVENTORY ITEMS ===
    itemsSnapshot.docs.forEach((doc) => {
      const item = doc.data();
      const createdDate = new Date(item.createdAt);

      activities.push({
        id: doc.id,
        type: "replenished",
        title: "Inventory item added",
        code: item.id || doc.id,
        department: item.category || "N/A",
        timestamp: getRelativeTime(item.createdAt),
        sortDate: createdDate,
      });
    });

    // Sort by most recent date and limit to 10
    activities.sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime());

    // Remove sortDate before sending response
    const recentActivities: Activity[] = activities.slice(0, 10).map(({ sortDate, ...activity }) => activity);

    res.status(200).json({ success: true, data: recentActivities });
  } catch (error) {
    console.error("❌ Error fetching activities:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};