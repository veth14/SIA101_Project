import type { Request, Response } from "express";
import { db } from "../config/firebaseAdmin.js";
const stats: any = [
  {
    title: "Total Inventory Items",
    value: "12",
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

export const postInventoryItem = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    console.log(data);
    const categoryMap: Record<string, string> = {
      "Food & Beverage": "FB",
      "Front Office": "FO",
      "Guest Amenities": "GA",
      Housekeeping: "HK",
      Laundry: "LD",
      Maintenance: "MT",
      Security: "SC",
    };

    const categoryCode = categoryMap[data.category];
    if (!categoryCode) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category" });
    }

    // Step 1: Query latest requisition in this category
    const snapshot = await db
      .collection("inventory_items")
      .orderBy("id", "desc")
      .get();

    let nextNumber = 1;

    if (!snapshot.empty) {
      // Filter only documents with matching category code
      const categoryDocs = snapshot.docs.filter((doc) =>
        doc.id.startsWith(categoryCode)
      );

      if (categoryDocs.length > 0 && categoryDocs[0]) {
        const lastId = categoryDocs[0].id; // highest ID
        const match = lastId.match(/\d+$/); // get trailing number
        if (match) {
          nextNumber = parseInt(match[0], 10) + 1;
        }
      }
    }

    // Step 2: Generate new ID
    const newId = `${categoryCode}${String(nextNumber).padStart(3, "0")}`;

    const formatDate = (date: string | Date) => {
      const d = typeof date === "string" ? new Date(date) : date;

      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZoneName: "short",
      }).format(d);
    };
    // Step 3: Insert the new requisition
    const docRef = db.collection("inventory_items").doc(newId);
    await docRef.set({
      ...data,
      id: newId,
      createdAt: formatDate(new Date().toISOString()),
      status: "pending",
      category: data.category,
    });

    res.status(201).json({
      success: true,
      message: "Inventory item added successfully",
      requestNumber: newId,
    });
  } catch (error) {
    console.error("❌ Error adding Inventory item:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// export const patchAddInitialStock = async (req: Request, res: Response) => {
//   try {
//     const snapshot = await db.collection("inventory_items").get();

//     if (snapshot.empty) {
//       return res.status(404).json({
//         success: false,
//         message: "No inventory items found",
//       });
//     }

//     const batch = db.batch();
//     let updatedCount = 0;

//     snapshot.forEach((doc) => {
//       const data = doc.data();

//       // Only update documents that:
//       // 1. Do NOT have initialStock
//       // 2. Have a valid currentStock value
//       if (
//         data.initialStock === undefined &&
//         data.currentStock !== undefined &&
//         data.currentStock !== null
//       ) {
//         const docRef = db.collection("inventory_items").doc(doc.id);
//         batch.update(docRef, { initialStock: data.currentStock });
//         updatedCount++;
//       }
//     });

//     if (updatedCount > 0) {
//       await batch.commit();
//     }

//     res.status(200).json({
//       success: true,
//       message: `${updatedCount} documents successfully updated with initialStock.`,
//       updatedCount,
//     });
//   } catch (error) {
//     console.error("❌ Error updating initialStock:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error while updating initialStock",
//     });
//   }
// };

export const patchStockAdjustment = async (req: Request, res: Response) => {
  try {
    const { itemId, adjustment, reason, type, itemName, oldStock } = req.body;

    // Validation
    if (!itemId || adjustment === undefined || !reason || !type) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: itemId, adjustment, reason, or type",
      });
    }

    const adjustmentNum = parseInt(adjustment);
    if (isNaN(adjustmentNum)) {
      return res.status(400).json({
        success: false,
        message: "Adjustment must be a valid number",
      });
    }

    // Get the current item
    const itemRef = db.collection("inventory_items").doc(itemId);
    const itemDoc = await itemRef.get();

    if (!itemDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    const itemData = itemDoc.data();
    const currentStock = itemData?.currentStock || 0;
    const finalAdjustment = type === "add" ? adjustmentNum : -adjustmentNum;
    const newStock = currentStock + finalAdjustment;

    // Prevent negative stock
    if (newStock < 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot reduce stock below 0",
      });
    }

    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZoneName: "short",
      }).format(date);
    };

    const now = new Date();
    const formattedDate = formatDate(now);

    // Prepare update data
    const updateData: any = {
      currentStock: newStock,
      updatedAt: formattedDate,
    };

    // Only update lastRestocked if adding stock
    if (type === "add") {
      updateData.lastRestocked = formattedDate;
    }

    // Update the item
    await itemRef.update(updateData);

    // Log the adjustment to stock_adjustments collection
    const adjustmentLogRef = db.collection("stock_adjustments").doc();
    await adjustmentLogRef.set({
      itemId: itemId,
      itemName: itemName || itemData?.name || "Unknown Item",
      oldStock: currentStock,
      adjustment: finalAdjustment,
      newStock: newStock,
      reason: reason,
      type: type,
      timestamp: formattedDate,
      createdAt: formattedDate,
    });

    res.status(200).json({
      success: true,
      message: `Stock ${type === "add" ? "added" : "removed"} successfully`,
      data: {
        itemId,
        oldStock: currentStock,
        adjustment: finalAdjustment,
        newStock,
        lastRestocked: type === "add" ? formattedDate : itemData?.lastRestocked,
      },
    });
  } catch (error) {
    console.error("❌ Error adjusting stock:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adjusting stock",
    });
  }
};
