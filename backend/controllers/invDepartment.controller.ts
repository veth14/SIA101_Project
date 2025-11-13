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
export const patchInvMaintenanceRequest = async (req: Request, res: Response) => {
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
        ...updatedDoc.data()
      }
    });
  } catch (error: any) {
    console.error("❌ Error updating maintenance request:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      success: false, 
      message: "Server error: " + (error.message || "Unknown error"),
      error: error.toString()
    });
  }
};
