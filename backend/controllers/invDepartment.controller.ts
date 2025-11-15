// Add these to your invDepartment.controller.ts file

import type { Request, Response } from "express";
import { db } from "../config/firebaseAdmin.js";

type Department = {
  id: string;
  name: string;
  manager: string;
  itemsAssigned: number;
  totalUsage: number;
  monthlyConsumption: number;
};

type InventoryItem = {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  unitPrice: number;
  department?: string; // Department this item is assigned to
  monthlyUsage?: number; // Monthly usage quantity
  totalUsageCount?: number; // Total times this item has been used
  unit: string;
  location: string;
};

// ... (keep your existing functions: getInvDepartment, getNextDepartmentId, etc.)

/**
 * Gets department-like data grouped by inventory item categories
 * This creates a dynamic list based on categories in inventory_items
 */

type MaintenanceRequest = {
  id: string;
  department: string;
  itemService: string;
  requestedBy: string;
  date: string;
  status: "Pending" | "Approved" | "Rejected" | "Completed";
};

export const getDepartmentsByCategory = async (req: Request, res: Response) => {
  try {
    const itemsSnapshot = await db.collection("inventory_items").get();

    const snapshot1 = await db.collection("maintenance_requests").get();

    if (itemsSnapshot.empty) {
      res.status(404).json({
        success: false,
        message: "No inventory items found",
      });
      return;
    }

    if (snapshot1.empty) {
      res.status(404).json({
        success: false,
        message: "No maintenance requests found",
      });
      return;
    }

    // Group items by category
    const categoryGroups: Record<
      string,
      {
        name: string;
        count: number;
        items: any[];
        totalValue: number;
        monthlyConsumption: number;
      }
    > = {};

    const maintenanceRequests: MaintenanceRequest[] = [];
    snapshot1.forEach((doc) => {
      maintenanceRequests.push({
        id: doc.id,
        ...doc.data(),
      } as MaintenanceRequest);
    });

    itemsSnapshot.forEach((doc) => {
      const item = doc.data();
      const category = item.category || "Uncategorized";

      if (!categoryGroups[category]) {
        categoryGroups[category] = {
          name: category,
          count: 0,
          items: [],
          totalValue: 0,
          monthlyConsumption: 0,
        };
      }

      categoryGroups[category].count += 1;
      categoryGroups[category].items.push({
        id: doc.id,
        ...item,
      });

      // Calculate total inventory value
      if (item.currentStock && item.unitPrice) {
        categoryGroups[category].totalValue +=
          item.currentStock * item.unitPrice;
      }

      // Calculate monthly consumption
      if (item.monthlyUsage && item.unitPrice) {
        categoryGroups[category].monthlyConsumption +=
          item.monthlyUsage * item.unitPrice;
      }
    });

    // Convert to Department format
    const categories = Object.entries(categoryGroups).map(([key, data]) => ({
      id: key.replace(/\s+/g, "_").toUpperCase(),
      name: data.name,
      manager: "", // You can set default managers or leave empty
      itemsAssigned: data.count,
      totalUsage: data.items.reduce(
        (sum, item) => sum + (item.totalUsageCount || 0),
        0
      ),
      monthlyConsumption: Math.round(data.monthlyConsumption),
    }));

    res.status(200).json({
      success: true,
      data: { categories, maintenanceRequests },
    });
  } catch (error) {
    console.error("Error getting categories:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Aggregates inventory data and updates department metrics
 * Call this function periodically or when inventory changes
 */
export const aggregateDepartmentData = async (req: Request, res: Response) => {
  try {
    // Get all inventory items
    const itemsSnapshot = await db.collection("inventory_items").get();

    if (itemsSnapshot.empty) {
      res.status(404).json({
        success: false,
        message: "No inventory items found to aggregate",
      });
      return;
    }

    // Initialize department aggregation map
    const departmentMetrics: Record<
      string,
      {
        itemsAssigned: number;
        totalUsage: number;
        monthlyConsumption: number;
      }
    > = {};

    // Aggregate data from all inventory items
    itemsSnapshot.forEach((doc) => {
      const item = doc.data() as InventoryItem;
      const deptId = item.department;

      // Skip items without department assignment
      if (!deptId) return;

      // Initialize department metrics if not exists
      if (!departmentMetrics[deptId]) {
        departmentMetrics[deptId] = {
          itemsAssigned: 0,
          totalUsage: 0,
          monthlyConsumption: 0,
        };
      }

      // Count items assigned to this department
      departmentMetrics[deptId].itemsAssigned += 1;

      // Sum up total usage count
      if (item.totalUsageCount) {
        departmentMetrics[deptId].totalUsage += item.totalUsageCount;
      }

      // Calculate monthly consumption in monetary value
      if (item.monthlyUsage && item.unitPrice) {
        departmentMetrics[deptId].monthlyConsumption +=
          item.monthlyUsage * item.unitPrice;
      }
    });

    // Update each department document with aggregated metrics
    const batch = db.batch();
    let updatedCount = 0;

    for (const [deptId, metrics] of Object.entries(departmentMetrics)) {
      const deptRef = db.collection("departments").doc(deptId);

      // Check if department exists
      const deptDoc = await deptRef.get();
      if (!deptDoc.exists) {
        console.warn(`Department ${deptId} not found, skipping...`);
        continue;
      }

      batch.update(deptRef, {
        itemsAssigned: metrics.itemsAssigned,
        totalUsage: metrics.totalUsage,
        monthlyConsumption: Math.round(metrics.monthlyConsumption), // Round to nearest peso
        lastAggregated: new Date().toISOString(),
      });

      updatedCount++;
    }

    await batch.commit();

    res.status(200).json({
      success: true,
      message: `Successfully aggregated data for ${updatedCount} departments`,
      data: departmentMetrics,
    });
  } catch (error) {
    console.error("Error aggregating department data:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during aggregation",
    });
  }
};

/**
 * Updates a specific department's metrics based on its inventory items
 */
export const updateDepartmentMetrics = async (departmentId: string) => {
  try {
    // Get all items assigned to this department
    const itemsSnapshot = await db
      .collection("inventory_items")
      .where("department", "==", departmentId)
      .get();

    let itemsAssigned = 0;
    let totalUsage = 0;
    let monthlyConsumption = 0;

    itemsSnapshot.forEach((doc) => {
      const item = doc.data() as InventoryItem;

      itemsAssigned += 1;

      if (item.totalUsageCount) {
        totalUsage += item.totalUsageCount;
      }

      if (item.monthlyUsage && item.unitPrice) {
        monthlyConsumption += item.monthlyUsage * item.unitPrice;
      }
    });

    // Update the department document
    await db
      .collection("departments")
      .doc(departmentId)
      .update({
        itemsAssigned,
        totalUsage,
        monthlyConsumption: Math.round(monthlyConsumption),
        lastAggregated: new Date().toISOString(),
      });

    return {
      success: true,
      departmentId,
      metrics: { itemsAssigned, totalUsage, monthlyConsumption },
    };
  } catch (error) {
    console.error(
      `Error updating metrics for department ${departmentId}:`,
      error
    );
    throw error;
  }
};

/**
 * Assigns an inventory item to a department
 */
export const assignItemToDepartment = async (req: Request, res: Response) => {
  try {
    const { itemId, departmentId } = req.body;

    if (!itemId || !departmentId) {
      res.status(400).json({
        success: false,
        message: "itemId and departmentId are required",
      });
      return;
    }

    // Verify department exists
    const deptDoc = await db.collection("departments").doc(departmentId).get();
    if (!deptDoc.exists) {
      res.status(404).json({
        success: false,
        message: "Department not found",
      });
      return;
    }

    // Update the inventory item
    await db.collection("inventory_items").doc(itemId).update({
      department: departmentId,
    });

    // Recalculate department metrics
    await updateDepartmentMetrics(departmentId);

    res.status(200).json({
      success: true,
      message: "Item assigned to department successfully",
    });
  } catch (error) {
    console.error("Error assigning item to department:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
