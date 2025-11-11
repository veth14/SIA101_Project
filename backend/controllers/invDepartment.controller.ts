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

type MaintenanceRequest = {
  id: string;
  department: string;
  itemService: string;
  requestedBy: string;
  date: string;
  status: "Pending" | "Approved" | "Rejected" | "Completed";
};

// const departments: Department[] = [
//   {
//     id: "DEPT001",
//     name: "Housekeeping",
//     manager: "Maria Santos",
//     itemsAssigned: 248,
//     totalUsage: 35,
//     monthlyConsumption: 45780,
//   },
//   {
//     id: "DEPT002",
//     name: "Laundry Services",
//     manager: "Lisa Fernandez",
//     itemsAssigned: 67,
//     totalUsage: 6,
//     monthlyConsumption: 18560,
//   },
//   {
//     id: "DEPT003",
//     name: "Security",
//     manager: "Roberto Garcia",
//     itemsAssigned: 45,
//     totalUsage: 5,
//     monthlyConsumption: 8970,
//   },
//   {
//     id: "DEPT004",
//     name: "Maintenance",
//     manager: "Juan Dela Cruz",
//     itemsAssigned: 156,
//     totalUsage: 18,
//     monthlyConsumption: 28450,
//   },
//   {
//     id: "DEPT005",
//     name: "Food & Beverages",
//     manager: "Carlos Rivera",
//     itemsAssigned: 412,
//     totalUsage: 28,
//     monthlyConsumption: 76920,
//   },
//   {
//     id: "DEPT006",
//     name: "Front Desk",
//     manager: "Ana Cruz",
//     itemsAssigned: 89,
//     totalUsage: 8,
//     monthlyConsumption: 12340,
//   },
// ];

// Sample maintenance requests
// const maintenanceRequests: MaintenanceRequest[] = [
//   {
//     id: "#00000",
//     department: "Housekeeping",
//     itemService: "Floor Cleaning Machine Repair",
//     requestedBy: "Maria Santos",
//     date: "2025-09-10",
//     status: "Pending",
//   },
//   {
//     id: "#00001",
//     department: "Maintenance",
//     itemService: "AC Unit Service - Room 305",
//     requestedBy: "Juan Dela Cruz",
//     date: "2025-09-11",
//     status: "Approved",
//   },
//   {
//     id: "#00002",
//     department: "F&B",
//     itemService: "Kitchen Equipment Check",
//     requestedBy: "Carlos Rivera",
//     date: "2025-09-12",
//     status: "Rejected",
//   },
//   {
//     id: "#00003",
//     department: "Housekeeping",
//     itemService: "Linen Replacement - 5th Floor",
//     requestedBy: "Maria Santos",
//     date: "2025-09-13",
//     status: "Completed",
//   },
//   {
//     id: "#00004",
//     department: "Maintenance",
//     itemService: "Elevator Maintenance Check",
//     requestedBy: "Juan Dela Cruz",
//     date: "2025-09-13",
//     status: "Completed",
//   },
//   {
//     id: "#00005",
//     department: "Security",
//     itemService: "CCTV Camera Installation - Lobby",
//     requestedBy: "Roberto Garcia",
//     date: "2025-09-14",
//     status: "Pending",
//   },
//   {
//     id: "#00006",
//     department: "Front Desk",
//     itemService: "Computer System Upgrade",
//     requestedBy: "Ana Reyes",
//     date: "2025-09-14",
//     status: "Approved",
//   },
//   {
//     id: "#00007",
//     department: "Housekeeping",
//     itemService: "Vacuum Cleaner Replacement",
//     requestedBy: "Lisa Cruz",
//     date: "2025-09-15",
//     status: "Pending",
//   },
//   {
//     id: "#00008",
//     department: "F&B",
//     itemService: "Refrigerator Repair - Kitchen",
//     requestedBy: "Miguel Torres",
//     date: "2025-09-15",
//     status: "Approved",
//   },
//   {
//     id: "#00009",
//     department: "Maintenance",
//     itemService: "Plumbing Fix - Room 201",
//     requestedBy: "Pedro Morales",
//     date: "2025-09-16",
//     status: "Completed",
//   },
//   {
//     id: "#00010",
//     department: "Security",
//     itemService: "Access Card System Update",
//     requestedBy: "Roberto Garcia",
//     date: "2025-09-16",
//     status: "Pending",
//   },
//   {
//     id: "#00011",
//     department: "Housekeeping",
//     itemService: "Bed Sheet Inventory Restock",
//     requestedBy: "Maria Santos",
//     date: "2025-09-17",
//     status: "Approved",
//   },
//   {
//     id: "#00012",
//     department: "F&B",
//     itemService: "Coffee Machine Maintenance",
//     requestedBy: "Carlos Rivera",
//     date: "2025-09-17",
//     status: "Completed",
//   },
//   {
//     id: "#00013",
//     department: "Front Desk",
//     itemService: "Phone System Repair",
//     requestedBy: "Ana Reyes",
//     date: "2025-09-18",
//     status: "Pending",
//   },
//   {
//     id: "#00014",
//     department: "Maintenance",
//     itemService: "Generator Testing and Service",
//     requestedBy: "Juan Dela Cruz",
//     date: "2025-09-18",
//     status: "Approved",
//   },
// ];

export const getInvDepartment = async (req: Request, res: Response) => {
  const snapshot = await db.collection("departments").get();
  const snapshot1 = await db.collection("maintenance_requests").get();
  if (snapshot.empty || snapshot1.empty) {
    res
      .status(404)
      .send({ success: false, message: "No Departments Items Found" });
    return;
  }

  const departments: Department[] = [];
  const maintenanceRequests: MaintenanceRequest[] = [];
  snapshot.forEach((doc) => {
    departments.push({
      id: doc.id,
      ...doc.data(),
    } as Department);
  });
  snapshot1.forEach((doc) => {
    maintenanceRequests.push({
      id: doc.id,
      ...doc.data(),
    } as MaintenanceRequest);
  });

  res
    .status(200)
    .json({ success: true, data: { departments, maintenanceRequests } });
};

export async function getNextDepartmentId(): Promise<string> {
  try {
    const departmentsRef = db.collection("departments");

    // Query to get the last department by ID (sorted descending)
    const snapshot = await departmentsRef.orderBy("id", "desc").limit(1).get();

    if (snapshot.empty || !snapshot.docs[0]) {
      // No departments exist yet, start with DEPT001
      return "DEPT001";
    }

    // Get the last department ID
    const lastDept = snapshot.docs[0].data() as Department;
    const lastId = lastDept.id;

    // Extract the numeric part and increment
    const numericPart = parseInt(lastId.replace("DEPT", ""));
    const nextNumber = numericPart + 1;

    // Format back to DEPT### format with leading zeros
    const nextId = `DEPT${nextNumber.toString().padStart(3, "0")}`;

    return nextId;
  } catch (error) {
    console.error("Error getting next department ID:", error);
    throw error;
  }
}
export async function getNextMaintenanceRequestId(): Promise<string> {
  try {
    const maintenanceRequestsRef = db.collection("maintenance_requests");

    // Query to get the last maintenance request by ID (sorted descending)
    const snapshot = await maintenanceRequestsRef
      .orderBy("id", "desc")
      .limit(1)
      .get();

    if (snapshot.empty || !snapshot.docs[0]) {
      // No maintenance requests exist yet, start with #00001
      return "#00000";
    }

    // Get the last maintenance request ID
    const lastRequest = snapshot.docs[0].data() as MaintenanceRequest;
    const lastId = lastRequest.id;

    // Check if lastId exists and has the correct format
    if (!lastId || typeof lastId !== "string" || !lastId.startsWith("#")) {
      console.warn("Invalid last ID format:", lastId);
      return "#00001";
    }

    // Extract the numeric part and increment
    const numericString = lastId.replace("#", "");
    const numericPart = parseInt(numericString, 10);

    // Check if parsing was successful
    if (isNaN(numericPart)) {
      console.warn("Could not parse numeric part from:", lastId);
      return "#00001";
    }

    const nextNumber = numericPart + 1;

    // Format back to ###### format with leading zeros
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
      ...maintenanceRequest,
    };

    // Add the document with the generated ID as the document ID
    await db
      .collection("maintenance_requests")
      .doc(nextId)
      .set(newMaintenanceRequest);

    res.status(200).json({
      success: true,
      message: "Successfully added",
      data: newMaintenanceRequest,
    });
  } catch (error) {
    console.error("Error creating department:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const postInvDepartment = async (req: Request, res: Response) => {
  try {
    const nextId = await getNextDepartmentId();
    const departmentData = req.body;

    const newDepartment: Department = {
      id: nextId,
      ...departmentData,
    };

    // Add the document with the generated ID as the document ID
    await db.collection("departments").doc(nextId).set(newDepartment);

    res.status(200).json({
      success: true,
      message: "Successfully added",
      data: newDepartment,
    });
  } catch (error) {
    console.error("Error creating department:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
