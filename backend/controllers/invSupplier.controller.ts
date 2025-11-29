import type { Request, Response } from "express";
import { db } from "../config/firebaseAdmin";

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  rating: number;
  totalOrders: number;
  totalValue: number;
  lastOrderDate: string;
  status: "active" | "inactive" | "suspended";
  paymentTerms: string;
  deliveryTime: string;
  notes?: string;
}

// const suppliers: Supplier[] = [
//   {
//     id: "SUP001",
//     name: "Hotel Linens Co.",
//     contactPerson: "Sarah Johnson",
//     email: "sarah@hotellinens.com",
//     phone: "+63 917 123 4567",
//     address: "123 Textile Street, Makati City",
//     category: "Linens & Textiles",
//     rating: 4.8,
//     totalOrders: 45,
//     totalValue: 2250000,
//     lastOrderDate: "2024-09-25",
//     status: "active",
//     paymentTerms: "Net 30",
//     deliveryTime: "3-5 days",
//   },
//   {
//     id: "SUP002",
//     name: "Premium Coffee Co.",
//     contactPerson: "Miguel Santos",
//     email: "miguel@premiumcoffee.ph",
//     phone: "+63 917 234 5678",
//     address: "456 Coffee Street, Quezon City",
//     category: "Food & Beverage",
//     rating: 4.6,
//     totalOrders: 32,
//     totalValue: 890000,
//     lastOrderDate: "2024-09-28",
//     status: "active",
//     paymentTerms: "Net 15",
//     deliveryTime: "1-2 days",
//   },
//   {
//     id: "SUP003",
//     name: "Cleaning Supplies Inc.",
//     contactPerson: "Anna Cruz",
//     email: "anna@cleaningsupplies.com",
//     phone: "+63 917 345 6789",
//     address: "789 Industrial Ave, Pasig City",
//     category: "Cleaning & Maintenance",
//     rating: 4.2,
//     totalOrders: 28,
//     totalValue: 650000,
//     lastOrderDate: "2024-09-20",
//     status: "active",
//     paymentTerms: "Net 45",
//     deliveryTime: "2-4 days",
//   },
//   {
//     id: "SUP004",
//     name: "Hotel Amenities Ltd.",
//     contactPerson: "Robert Garcia",
//     email: "robert@hotelamenities.ph",
//     phone: "+63 917 456 7890",
//     address: "321 Commerce Plaza, Taguig City",
//     category: "Guest Amenities",
//     rating: 4.5,
//     totalOrders: 22,
//     totalValue: 480000,
//     lastOrderDate: "2024-09-15",
//     status: "active",
//     paymentTerms: "Net 30",
//     deliveryTime: "5-7 days",
//   },
//   {
//     id: "SUP005",
//     name: "Electrical Supplies Ltd.",
//     contactPerson: "Lisa Mendoza",
//     email: "lisa@electricalsupplies.com",
//     phone: "+63 917 567 8901",
//     address: "654 Tech Hub, Alabang",
//     category: "Electrical & Technical",
//     rating: 3.9,
//     totalOrders: 15,
//     totalValue: 320000,
//     lastOrderDate: "2024-08-30",
//     status: "inactive",
//     paymentTerms: "Net 60",
//     deliveryTime: "7-10 days",
//   },
// ];

export const postSuppliers = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const currentYear = new Date().getFullYear();

    // Step 1: Get the most recent supplier
    const snapshot = await db
      .collection("suppliers")
      .orderBy("id", "desc")
      .limit(1)
      .get();

    let nextNumber = 1;

    if (!snapshot.empty && snapshot.docs[0]) {
      const lastReq = snapshot.docs[0].data();
      const match = lastReq.id.match(/SUP-\d{4}-(\d+)/);

      if (match) {
        const lastNumber = parseInt(match[1], 10);
        nextNumber = lastNumber + 1;
      }
    }

    const newId = `SUP-${currentYear}-${String(nextNumber).padStart(3, "0")}`;

    const docRef = db.collection("suppliers").doc(newId);
    await docRef.set({
      ...data,
      id: newId,
      rating: data.rating || 0,
      totalOrders: data.totalOrders || 0,
      totalValue: data.totalValue || 0,
      createdAt: new Date().toISOString(),
      status: "active", // default status active na sya agad pag nag add ng supplier
    });

    res.status(201).json({
      success: true,
      message: "Supplier added successfully",
      id: newId,
    });
  } catch (error) {
    console.error("Error adding supplier:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getSuppliers = async (req: Request, res: Response) => {
  const snapshot = await db.collection("suppliers").get();

  if (snapshot.empty) {
    return res
      .status(404)
      .json({ success: false, message: "No Suppliers Found" });
  }
  const suppliers: Supplier[] = snapshot.docs.map((doc) => ({
    id: doc.id, // use the document ID
    ...doc.data(), // spread the rest of the fields
  })) as Supplier[];

  res.status(200).json({ success: true, data: suppliers });
};

export const patchInvSupplier = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Supplier ID is required",
      });
    }

    const dataToUpdate = req.body;

    const docRef = db.collection("suppliers").doc(id);

    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    // Allow updating status along with other fields
    await docRef.update({
      ...dataToUpdate,
      updatedAt: new Date().toISOString(),
    });

    // Fetch updated suppliers list
    const snapshot = await db.collection("suppliers").get();

    const suppliers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      message: "Supplier updated successfully",
      id: id,
      updatedData: suppliers,
    });
  } catch (error) {
    console.error("Error updating Supplier:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
