import type { Request, Response } from "express";
import { db } from "../config/firebaseAdmin.js";
interface RequisitionItem {
  name: string;
  quantity: number;
  unit: string;
  estimatedCost: number;
  reason: string;
}

interface Requisition {
  id: string;
  requestNumber: string;
  department: string;
  requestedBy: string;
  items: RequisitionItem[];
  totalEstimatedCost: number;
  status: "pending" | "approved" | "rejected" | "fulfilled";
  priority: "low" | "medium" | "high" | "urgent";
  requestDate: string;
  requiredDate: string;
  justification: string;
  approvedBy?: string;
  approvedDate?: string;
  notes?: string;
}

// const requisitions: Requisition[] = [
//   {
//     id: "REQ003",
//     requestNumber: "REQ-2024-003",
//     department: "Maintenance",
//     requestedBy: "Robert Garcia",
//     items: [
//       {
//         name: "LED Light Bulbs",
//         quantity: 30,
//         unit: "pieces",
//         estimatedCost: 4500,
//         reason: "Replace burnt bulbs",
//       },
//       {
//         name: "Electrical Wire",
//         quantity: 100,
//         unit: "meters",
//         estimatedCost: 2000,
//         reason: "Repair work",
//       },
//     ],
//     totalEstimatedCost: 6500,
//     status: "fulfilled",
//     priority: "urgent",
//     requestDate: "2024-09-15",
//     requiredDate: "2024-09-20",
//     justification:
//       "Critical maintenance items needed for guest room repairs and safety compliance.",
//     approvedBy: "Supervisor",
//     approvedDate: "2024-09-16",
//   },
//   {
//     id: "REQ004",
//     requestNumber: "REQ-2024-004",
//     department: "Front Office",
//     requestedBy: "Anna Reyes",
//     items: [
//       {
//         name: "Printer Paper",
//         quantity: 20,
//         unit: "reams",
//         estimatedCost: 1000,
//         reason: "Office supplies",
//       },
//       {
//         name: "Ink Cartridges",
//         quantity: 5,
//         unit: "pieces",
//         estimatedCost: 2500,
//         reason: "Printer maintenance",
//       },
//     ],
//     totalEstimatedCost: 3500,
//     status: "rejected",
//     priority: "low",
//     requestDate: "2024-09-22",
//     requiredDate: "2024-10-01",
//     justification:
//       "Office supplies for daily operations and guest service documentation.",
//     notes: "Budget constraints - defer to next month",
//   },
// ];

export const postRequisition = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const currentYear = new Date().getFullYear();

    // Step 1: Get the most recent requisition
    const snapshot = await db
      //             table name (collection)
      .collection("requisitions")
      //        document id
      .orderBy("requestNumber", "desc")
      .limit(1)
      .get();

    let nextNumber = 1;

    if (!snapshot.empty && snapshot.docs[0]) {
      const lastReq = snapshot.docs[0].data();
      // Match something like REQ-2024-003
      const match = lastReq.requestNumber.match(/REQ-\d{4}-(\d+)/);

      if (match) {
        const lastNumber = parseInt(match[1], 10);
        nextNumber = lastNumber + 1;
      }
    }

    //                        PO
    const newRequestNumber = `REQ-${currentYear}-${String(nextNumber).padStart(
      3,
      "0"
    )}`;

    //                             table name (collection)
    const docRef = db.collection("requisitions").doc(newRequestNumber);
    await docRef.set({
      ...data,
      id: newRequestNumber,
      requestNumber: newRequestNumber,
      createdAt: new Date().toISOString(),
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Requisition added successfully",
      requestNumber: newRequestNumber,
    });
  } catch (error) {
    console.error("❌ Error adding requisition:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getRequisitions = async (req: Request, res: Response) => {
  const snapshot = await db.collection("requisitions").get();

  if (snapshot.empty) {
    return res
      .status(404)
      .json({ success: false, message: "No Requisitons Found" });
  }

  const requisitions: Requisition[] = snapshot.docs.map((doc) => ({
    id: doc.id, // use the document ID
    ...doc.data(), // spread the rest of the fields
  })) as Requisition[];

  res.status(200).json({ success: true, data: requisitions });
};

export const patchInvRequisition = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Requisition ID is required",
      });
    }

    const dataToUpdate = req.body;

    const docRef = db.collection("requisitions").doc(id);

    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "Requisition order not found",
      });
    }

    await docRef.update({
      ...dataToUpdate,
      updatedAt: new Date().toISOString(),
    });

    const snapshot = await db.collection("requisitions").get();

    // Transform the snapshot into an array of purchase orders
    const requisitionORders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      message: "Requisition Order updated successfully",
      id: id,
      updatedData: requisitionORders,
    });
  } catch (error) {
    console.error("❌ Error updating purchase order:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
