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
        totalUsage: number;
      }
    > = {};

    const maintenanceRequests: any[] = [];
    snapshot1.forEach((doc) => {
      maintenanceRequests.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    itemsSnapshot.forEach((doc) => {
      const item = doc.data() as any;
      const category = item.category || "Uncategorized";

      if (!categoryGroups[category]) {
        categoryGroups[category] = {
          name: category,
          count: 0,
          items: [],
          totalValue: 0,
          monthlyConsumption: 0,
          totalUsage: 0,
        };
      }

      categoryGroups[category].count += 1;

      // Calculate usage: initialStock - currentStock
      const initialStock = item.initialStock || 0;
      const currentStock = item.currentStock || 0;
      const itemUsage = initialStock - currentStock;

      categoryGroups[category].items.push({
        id: doc.id,
        ...item,
        usage: itemUsage, // Add usage to each item
      });

      // Add to total usage for the category
      if (itemUsage > 0) {
        categoryGroups[category].totalUsage += itemUsage;
      }

      // Calculate total inventory value (current stock value)
      if (currentStock !== undefined && item.unitPrice) {
        categoryGroups[category].totalValue += currentStock * item.unitPrice;
      }

      // Calculate monthly consumption (usage × unit price)
      // Assuming the usage happened over time, this gives total consumption value
      if (itemUsage > 0 && item.unitPrice) {
        categoryGroups[category].monthlyConsumption +=
          itemUsage * item.unitPrice;
      }
    });

    // Convert to Department format
    const categories = Object.entries(categoryGroups).map(([key, data]) => ({
      id: key.replace(/\s+/g, "_").toUpperCase(),
      name: data.name,
      manager: "",
      itemsAssigned: data.count,
      totalUsage: data.totalUsage, // Total units used across all items in category
      monthlyConsumption: Math.round(data.monthlyConsumption), // Total value of consumption
    }));

    res.status(200).json({
      success: true,
      data: { departments: categories, maintenanceRequests },
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

export const patchInvMaintenanceRequest = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    console.log("Received PATCH request for ID:", id);
    console.log("Update data:", req.body);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Maintenance Request ID is required",
      });
    }

    const dataToUpdate = req.body;

    // Clean the ID - remove any URL encoding
    const cleanId = decodeURIComponent(id);
    console.log("Clean ID:", cleanId);

    const docRef = db.collection("maintenance_requests").doc(cleanId);

    const doc = await docRef.get();

    console.log("Document exists:", doc.exists);

    if (!doc.exists) {
      console.log("Document not found with ID:", cleanId);
      return res.status(404).json({
        success: false,
        message: `Maintenance Request not found with ID: ${cleanId}`,
      });
    }

    console.log("Current document data:", doc.data());

    // Update the document
    await docRef.update({
      ...dataToUpdate,
      updatedAt: new Date().toISOString(),
    });

    console.log("Document updated successfully");

    // Fetch the updated document
    const updatedDoc = await docRef.get();

    res.status(200).json({
      success: true,
      message: "Maintenance Request updated successfully",
      id: cleanId,
      data: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      },
    });
  } catch (error: any) {
    console.error("❌ Error updating maintenance request:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Server error: " + (error.message || "Unknown error"),
      error: error.toString(),
    });
  }
};

export const patchInvDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Department ID is required",
      });
    }

    const dataToUpdate = req.body;

    const docRef = db.collection("departments").doc(id);

    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    await docRef.update({
      ...dataToUpdate,
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({
      success: true,
      message: "Department updated successfully",
      id: id,
    });
  } catch (error: any) {
    console.error(" Error updating department:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + (error.message || "Unknown error"),
    });
  }
};

export async function getNextMaintenanceRequestId(): Promise<string> {
  try {
    const maintenanceRequestsRef = db.collection("maintenance_requests");

    const snapshot = await maintenanceRequestsRef
      .orderBy("id", "desc")
      .limit(1)
      .get();

    if (snapshot.empty || !snapshot.docs[0]) {
      return "#00001";
    }

    const lastRequest = snapshot.docs[0].data() as MaintenanceRequest;
    const lastId = lastRequest.id;

    if (!lastId || typeof lastId !== "string" || !lastId.startsWith("#")) {
      console.warn("Invalid last ID format:", lastId);
      return "#00001";
    }

    const numericString = lastId.replace("#", "");
    const numericPart = parseInt(numericString, 10);

    if (isNaN(numericPart)) {
      console.warn("Could not parse numeric part from:", lastId);
      return "#00001";
    }

    const nextNumber = numericPart + 1;
    const nextId = `#${nextNumber.toString().padStart(5, "0")}`;

    return nextId;
  } catch (error) {
    console.error("Error getting next Maintenance Request ID:", error);
    throw error;
  }
}

export const postInvMaintenanceRequest = async (
  req: Request,
  res: Response
) => {
  try {
    const nextId = await getNextMaintenanceRequestId();
    const maintenanceRequest = req.body;

    const newMaintenanceRequest: MaintenanceRequest = {
      id: nextId,
      department: maintenanceRequest.department,
      itemService: maintenanceRequest.itemService,
      requestedBy: maintenanceRequest.requestedBy,
      date: maintenanceRequest.date || new Date().toISOString().split("T")[0],
      status: "Pending",
    };

    await db
      .collection("maintenance_requests")
      .doc(nextId)
      .set(newMaintenanceRequest);

    res.status(200).json({
      success: true,
      message: "Maintenance request submitted successfully",
      data: newMaintenanceRequest,
    });
  } catch (error) {
    console.error("Error creating maintenance request:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
