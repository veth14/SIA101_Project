import type { Request, Response } from "express";

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

const suppliers: Supplier[] = [
  {
    id: "SUP001",
    name: "Hotel Linens Co.",
    contactPerson: "Sarah Johnson",
    email: "sarah@hotellinens.com",
    phone: "+63 917 123 4567",
    address: "123 Textile Street, Makati City",
    category: "Linens & Textiles",
    rating: 4.8,
    totalOrders: 45,
    totalValue: 2250000,
    lastOrderDate: "2024-09-25",
    status: "active",
    paymentTerms: "Net 30",
    deliveryTime: "3-5 days",
  },
  {
    id: "SUP002",
    name: "Premium Coffee Co.",
    contactPerson: "Miguel Santos",
    email: "miguel@premiumcoffee.ph",
    phone: "+63 917 234 5678",
    address: "456 Coffee Street, Quezon City",
    category: "Food & Beverage",
    rating: 4.6,
    totalOrders: 32,
    totalValue: 890000,
    lastOrderDate: "2024-09-28",
    status: "active",
    paymentTerms: "Net 15",
    deliveryTime: "1-2 days",
  },
  {
    id: "SUP003",
    name: "Cleaning Supplies Inc.",
    contactPerson: "Anna Cruz",
    email: "anna@cleaningsupplies.com",
    phone: "+63 917 345 6789",
    address: "789 Industrial Ave, Pasig City",
    category: "Cleaning & Maintenance",
    rating: 4.2,
    totalOrders: 28,
    totalValue: 650000,
    lastOrderDate: "2024-09-20",
    status: "active",
    paymentTerms: "Net 45",
    deliveryTime: "2-4 days",
  },
  {
    id: "SUP004",
    name: "Hotel Amenities Ltd.",
    contactPerson: "Robert Garcia",
    email: "robert@hotelamenities.ph",
    phone: "+63 917 456 7890",
    address: "321 Commerce Plaza, Taguig City",
    category: "Guest Amenities",
    rating: 4.5,
    totalOrders: 22,
    totalValue: 480000,
    lastOrderDate: "2024-09-15",
    status: "active",
    paymentTerms: "Net 30",
    deliveryTime: "5-7 days",
  },
  {
    id: "SUP005",
    name: "Electrical Supplies Ltd.",
    contactPerson: "Lisa Mendoza",
    email: "lisa@electricalsupplies.com",
    phone: "+63 917 567 8901",
    address: "654 Tech Hub, Alabang",
    category: "Electrical & Technical",
    rating: 3.9,
    totalOrders: 15,
    totalValue: 320000,
    lastOrderDate: "2024-08-30",
    status: "inactive",
    paymentTerms: "Net 60",
    deliveryTime: "7-10 days",
  },
];

export const getSuppliers = (req: Request, res: Response) => {
  if (suppliers.length <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Missing Suppliers" });
  }

  res.status(200).json({ success: true, data: suppliers });
};
