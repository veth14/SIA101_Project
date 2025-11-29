import type { Request, Response } from "express";
import { db } from "../config/firebaseAdmin";

type PurchaseOrderItem = {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

type PurchaseOrder = {
  id: string;
  orderNumber: string;
  supplier: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  status: "pending" | "approved" | "received" | "cancelled";
  orderDate: string;
  expectedDelivery: string;
  approvedBy?: string;
  approvedDate?: string;
  notes?: string;
};

// const purchaseOrders: PurchaseOrder[] = [
//   {
//     id: "PO001",
//     orderNumber: "PO-2024-001",
//     supplier: "Hotel Linens Co.",
//     items: [
//       { name: "Bath Towels", quantity: 50, unitPrice: 450, total: 22501 },
//       { name: "Bed Sheets", quantity: 30, unitPrice: 800, total: 24000 },
//     ],
//     totalAmount: 22500,
//     status: "approved",
//     orderDate: "2024-09-15",
//     expectedDelivery: "2024-09-25",
//     approvedBy: "Manager",
//     approvedDate: "2024-09-16",
//     notes: "Priority order for peak season",
//   },
//   {
//     id: "PO002",
//     orderNumber: "PO-2024-002",
//     supplier: "Premium Coffee Co.",
//     items: [
//       { name: "Coffee Beans", quantity: 20, unitPrice: 1200, total: 24000 },
//       { name: "Tea Bags", quantity: 100, unitPrice: 80, total: 8000 },
//     ],
//     totalAmount: 22000,
//     status: "pending",
//     orderDate: "2024-09-20",
//     expectedDelivery: "2024-09-30",
//   },
//   {
//     id: "PO003",
//     orderNumber: "PO-2024-003",
//     supplier: "Cleaning Supplies Inc.",
//     items: [
//       { name: "Disinfectant", quantity: 15, unitPrice: 350, total: 5250 },
//       { name: "Floor Cleaner", quantity: 25, unitPrice: 280, total: 7000 },
//     ],
//     totalAmount: 12250,
//     status: "received",
//     orderDate: "2024-09-10",
//     expectedDelivery: "2024-09-18",
//     approvedBy: "Supervisor",
//     approvedDate: "2024-09-11",
//   },
//   {
//     id: "PO004",
//     orderNumber: "PO-2024-004",
//     supplier: "Kitchen Equipment Ltd.",
//     items: [
//       { name: "Chef Knives", quantity: 5, unitPrice: 2500, total: 12500 },
//       { name: "Cutting Boards", quantity: 10, unitPrice: 800, total: 8000 },
//     ],
//     totalAmount: 20500,
//     status: "approved",
//     orderDate: "2024-09-22",
//     expectedDelivery: "2024-10-05",
//     approvedBy: "Head Chef",
//     approvedDate: "2024-09-23",
//   },
//   {
//     id: "PO005",
//     orderNumber: "PO-2024-005",
//     supplier: "Office Supplies Pro",
//     items: [
//       { name: "Printer Paper", quantity: 50, unitPrice: 120, total: 6000 },
//       { name: "Ink Cartridges", quantity: 8, unitPrice: 450, total: 3600 },
//     ],
//     totalAmount: 9600,
//     status: "pending",
//     orderDate: "2024-09-25",
//     expectedDelivery: "2024-10-02",
//   },
//   {
//     id: "PO006",
//     orderNumber: "PO-2024-006",
//     supplier: "Maintenance Tools Inc.",
//     items: [
//       { name: "Screwdriver Set", quantity: 3, unitPrice: 1500, total: 4500 },
//       { name: "Hammer", quantity: 2, unitPrice: 800, total: 1600 },
//     ],
//     totalAmount: 6100,
//     status: "approved",
//     orderDate: "2024-09-28",
//     expectedDelivery: "2024-10-08",
//     approvedBy: "Maintenance Manager",
//     approvedDate: "2024-09-29",
//     notes: "Urgent repair tools needed",
//   },
//   {
//     id: "PO007",
//     orderNumber: "PO-2024-007",
//     supplier: "Guest Amenities Co.",
//     items: [
//       { name: "Shampoo Bottles", quantity: 100, unitPrice: 45, total: 4500 },
//       { name: "Soap Bars", quantity: 150, unitPrice: 25, total: 3750 },
//     ],
//     totalAmount: 8250,
//     status: "pending",
//     orderDate: "2024-09-29",
//     expectedDelivery: "2024-10-10",
//   },
// ];

type StatCard = {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount);
};

export const postInvProcurementOrder = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const currentYear = new Date().getFullYear();

    // Step 1: Get the most recent requisition
    const snapshot = await db
      //             table name (collection)
      .collection("purchaseOrders")
      //        document id
      .orderBy("orderNumber", "desc")
      .limit(1)
      .get();

    let nextNumber = 1;

    if (!snapshot.empty && snapshot.docs[0]) {
      const lastReq = snapshot.docs[0].data();
      // Match something like REQ-2024-003
      const match = lastReq.orderNumber.match(/PO-\d{4}-(\d+)/);

      if (match) {
        const lastNumber = parseInt(match[1], 10);
        nextNumber = lastNumber + 1;
      }
    }

    //                        PO
    const newOrderNumber = `PO-${currentYear}-${String(nextNumber).padStart(
      3,
      "0"
    )}`;

    //                             table name (collection)
    const docRef = db.collection("purchaseOrders").doc(newOrderNumber);
    await docRef.set({
      ...data,
      id: newOrderNumber,
      orderNumber: newOrderNumber,
      createdAt: new Date().toISOString(),
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: " Purchase Order added successfully",
      orderNumber: newOrderNumber,
    });
  } catch (error) {
    console.error(" Error adding order purchase:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getInvProcurementOrder = async (req: Request, res: Response) => {
  const snapshot = await db.collection("purchaseOrders").get();
  if (snapshot.empty) {
    return res
      .status(404)
      .json({ success: false, message: "Missing Purchase Order Data " });
  }
  const purchaseOrders: PurchaseOrder[] = snapshot.docs.map((doc) => ({
    id: doc.id, // use the document ID
    ...doc.data(), // spread the rest of the fields
  })) as PurchaseOrder[];
  res.status(200).json({ success: true, data: purchaseOrders });
};

export const getInvProcurementStats = async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection("purchaseOrders").get();

    if (snapshot.empty) {
      return res.status(404).json({
        success: false,
        message: "No purchase orders found",
      });
    }

    const purchaseOrders: PurchaseOrder[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as PurchaseOrder[];

    const totalOrders = purchaseOrders.length;
    const pendingOrders = purchaseOrders.filter(
      (po) => po.status === "pending"
    ).length;
    const approvedOrders = purchaseOrders.filter(
      (po) => po.status === "approved"
    ).length;
    const receivedOrders = purchaseOrders.filter(
      (po) => po.status === "received"
    ).length;
    const totalValue = purchaseOrders.reduce(
      (sum, po) => sum + po.totalAmount,
      0
    );

    const statCards: StatCard[] = [
      {
        title: "Total Purchase Value",
        value: formatCurrency(totalValue),
        change: `${totalOrders} orders processed`,
        changeType: "neutral",
      },
      {
        title: "Approval Rate",
        value:
          totalOrders > 0
            ? Math.round(
                ((approvedOrders + receivedOrders) / totalOrders) * 100
              ) + "%"
            : "0%",
        change: `${approvedOrders + receivedOrders} of ${totalOrders} orders`,
        changeType:
          approvedOrders + receivedOrders > totalOrders * 0.7
            ? "positive"
            : "neutral",
      },
      {
        title: "Fulfillment Rate",
        value:
          approvedOrders + receivedOrders > 0
            ? Math.round(
                (receivedOrders / (approvedOrders + receivedOrders)) * 100
              ) + "%"
            : "0%",
        change: `${receivedOrders} received`,
        changeType: receivedOrders > 0 ? "positive" : "neutral",
      },
      {
        title: "Pending Orders",
        value: pendingOrders.toString(),
        change: formatCurrency(
          purchaseOrders
            .filter((po) => po.status === "pending")
            .reduce((sum, po) => sum + po.totalAmount, 0)
        ),
        changeType: pendingOrders > totalOrders * 0.5 ? "negative" : "neutral",
      },
    ];

    res.status(200).json({ success: true, data: statCards });
  } catch (error) {
    console.error("Error fetching procurement stats:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const patchInvProcurementOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Purchase Order ID is required",
      });
    }

    const dataToUpdate = req.body;

    const docRef = db.collection("purchaseOrders").doc(id);

    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "Purchase Order not found",
      });
    }

    await docRef.update({
      ...dataToUpdate,
      updatedAt: new Date().toISOString(),
    });

    const snapshot = await db.collection("purchaseOrders").get();

    // Transform the snapshot into an array of purchase orders
    const purchaseOrders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(purchaseOrders);
    res.status(200).json({
      success: true,
      message: "Purchase Order updated successfully",
      id: id,
      updatedData: purchaseOrders,
    });
  } catch (error) {
    console.error(" Error updating purchase order:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
