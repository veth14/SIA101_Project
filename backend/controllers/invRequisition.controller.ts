import type { Request, Response } from "express";

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

const requisitions: Requisition[] = [
  {
    id: "REQ001",
    requestNumber: "REQ-2024-001",
    department: "Housekeeping",
    requestedBy: "Maria Santos",
    items: [
      {
        name: "Vacuum Cleaner Bags",
        quantity: 50,
        unit: "pieces",
        estimatedCost: 2500,
        reason: "Current stock depleted",
      },
      {
        name: "Floor Cleaner",
        quantity: 10,
        unit: "bottles",
        estimatedCost: 1200,
        reason: "Monthly restocking",
      },
    ],
    totalEstimatedCost: 3700,
    status: "pending",
    priority: "high",
    requestDate: "2024-09-20",
    requiredDate: "2024-09-25",
    justification:
      "Essential cleaning supplies needed for daily operations. Current stock is running low and may affect service quality.",
  },
  {
    id: "REQ002",
    requestNumber: "REQ-2024-002",
    department: "Food & Beverage",
    requestedBy: "Carlos Rivera",
    items: [
      {
        name: "Coffee Beans",
        quantity: 20,
        unit: "kg",
        estimatedCost: 8000,
        reason: "Premium blend for restaurant",
      },
      {
        name: "Sugar Packets",
        quantity: 500,
        unit: "pieces",
        estimatedCost: 1500,
        reason: "Guest room amenities",
      },
    ],
    totalEstimatedCost: 9500,
    status: "approved",
    priority: "medium",
    requestDate: "2024-09-18",
    requiredDate: "2024-09-28",
    justification:
      "Quality ingredients needed to maintain restaurant standards and guest satisfaction.",
    approvedBy: "Manager",
    approvedDate: "2024-09-19",
  },
  {
    id: "REQ003",
    requestNumber: "REQ-2024-003",
    department: "Maintenance",
    requestedBy: "Robert Garcia",
    items: [
      {
        name: "LED Light Bulbs",
        quantity: 30,
        unit: "pieces",
        estimatedCost: 4500,
        reason: "Replace burnt bulbs",
      },
      {
        name: "Electrical Wire",
        quantity: 100,
        unit: "meters",
        estimatedCost: 2000,
        reason: "Repair work",
      },
    ],
    totalEstimatedCost: 6500,
    status: "fulfilled",
    priority: "urgent",
    requestDate: "2024-09-15",
    requiredDate: "2024-09-20",
    justification:
      "Critical maintenance items needed for guest room repairs and safety compliance.",
    approvedBy: "Supervisor",
    approvedDate: "2024-09-16",
  },
  {
    id: "REQ004",
    requestNumber: "REQ-2024-004",
    department: "Front Office",
    requestedBy: "Anna Reyes",
    items: [
      {
        name: "Printer Paper",
        quantity: 20,
        unit: "reams",
        estimatedCost: 1000,
        reason: "Office supplies",
      },
      {
        name: "Ink Cartridges",
        quantity: 5,
        unit: "pieces",
        estimatedCost: 2500,
        reason: "Printer maintenance",
      },
    ],
    totalEstimatedCost: 3500,
    status: "rejected",
    priority: "low",
    requestDate: "2024-09-22",
    requiredDate: "2024-10-01",
    justification:
      "Office supplies for daily operations and guest service documentation.",
    notes: "Budget constraints - defer to next month",
  },
];

export const getRequisitions = (req: Request, res: Response) => {
  if (requisitions.length <= 0) {
    return res
      .status(500)
      .json({ success: false, message: "Missing Stats Items" });
  }

  res.status(200).json({ success: true, data: requisitions });
};
