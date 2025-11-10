import type { Request, Response } from "express";

type PurchaseOrderItem = {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

type PurchaseOrder = {
  id: string;
  orderNumber: string;
  supplier: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  status: 'pending' | 'approved' | 'received' | 'cancelled';
  orderDate: string;
  expectedDelivery: string;
  approvedBy?: string;
  approvedDate?: string;
  notes?: string;
}

const purchaseOrders: PurchaseOrder[] = [
  {
    id: 'PO001',
    orderNumber: 'PO-2024-001',
    supplier: 'Hotel Linens Co.',
    items: [
      { name: 'Bath Towels', quantity: 50, unitPrice: 450, total: 22501 },
      { name: 'Bed Sheets', quantity: 30, unitPrice: 800, total: 24000 }
    ],
    totalAmount: 22500,
    status: 'approved',
    orderDate: '2024-09-15',
    expectedDelivery: '2024-09-25',
    approvedBy: 'Manager',
    approvedDate: '2024-09-16',
    notes: 'Priority order for peak season'
  },
  {
    id: 'PO002',
    orderNumber: 'PO-2024-002',
    supplier: 'Premium Coffee Co.',
    items: [
      { name: 'Coffee Beans', quantity: 20, unitPrice: 1200, total: 24000 },
      { name: 'Tea Bags', quantity: 100, unitPrice: 80, total: 8000 }
    ],
    totalAmount: 22000,
    status: 'pending',
    orderDate: '2024-09-20',
    expectedDelivery: '2024-09-30'
  },
  {
    id: 'PO003',
    orderNumber: 'PO-2024-003',
    supplier: 'Cleaning Supplies Inc.',
    items: [
      { name: 'Disinfectant', quantity: 15, unitPrice: 350, total: 5250 },
      { name: 'Floor Cleaner', quantity: 25, unitPrice: 280, total: 7000 }
    ],
    totalAmount: 12250,
    status: 'received',
    orderDate: '2024-09-10',
    expectedDelivery: '2024-09-18',
    approvedBy: 'Supervisor',
    approvedDate: '2024-09-11'
  },
  {
    id: 'PO004',
    orderNumber: 'PO-2024-004',
    supplier: 'Kitchen Equipment Ltd.',
    items: [
      { name: 'Chef Knives', quantity: 5, unitPrice: 2500, total: 12500 },
      { name: 'Cutting Boards', quantity: 10, unitPrice: 800, total: 8000 }
    ],
    totalAmount: 20500,
    status: 'approved',
    orderDate: '2024-09-22',
    expectedDelivery: '2024-10-05',
    approvedBy: 'Head Chef',
    approvedDate: '2024-09-23'
  },
  {
    id: 'PO005',
    orderNumber: 'PO-2024-005',
    supplier: 'Office Supplies Pro',
    items: [
      { name: 'Printer Paper', quantity: 50, unitPrice: 120, total: 6000 },
      { name: 'Ink Cartridges', quantity: 8, unitPrice: 450, total: 3600 }
    ],
    totalAmount: 9600,
    status: 'pending',
    orderDate: '2024-09-25',
    expectedDelivery: '2024-10-02'
  },
  {
    id: 'PO006',
    orderNumber: 'PO-2024-006',
    supplier: 'Maintenance Tools Inc.',
    items: [
      { name: 'Screwdriver Set', quantity: 3, unitPrice: 1500, total: 4500 },
      { name: 'Hammer', quantity: 2, unitPrice: 800, total: 1600 }
    ],
    totalAmount: 6100,
    status: 'approved',
    orderDate: '2024-09-28',
    expectedDelivery: '2024-10-08',
    approvedBy: 'Maintenance Manager',
    approvedDate: '2024-09-29',
    notes: 'Urgent repair tools needed'
  },
  {
    id: 'PO007',
    orderNumber: 'PO-2024-007',
    supplier: 'Guest Amenities Co.',
    items: [
      { name: 'Shampoo Bottles', quantity: 100, unitPrice: 45, total: 4500 },
      { name: 'Soap Bars', quantity: 150, unitPrice: 25, total: 3750 }
    ],
    totalAmount: 8250,
    status: 'pending',
    orderDate: '2024-09-29',
    expectedDelivery: '2024-10-10'
  }
];

type StatCard = {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2
  }).format(amount);
};

export const getInvProcurementOrder = (req: Request, res: Response) => {
  if (purchaseOrders.length <= 0) {
    return res
      .status(500)
      .json({ success: false, message: "Missing Purchase Order Data " });
  }

  res.status(200).json({ success: true, data: purchaseOrders});
};

export const getInvProcurementStats = (req: Request, res: Response) => {
  const totalOrders = purchaseOrders.length;
  const pendingOrders = purchaseOrders.filter(po => po.status === 'pending').length;
  const approvedOrders = purchaseOrders.filter(po => po.status === 'approved').length;
  const receivedOrders = purchaseOrders.filter(po => po.status === 'received').length;
  const totalValue = purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0);

  const statCards: StatCard[] = [
    {
      title: 'Monthly Revenue Impact',
      value: formatCurrency(totalValue * 0.85),
      change: '+11% cost savings achieved',
      changeType: 'positive',
    },
    {
      title: 'Smart Procurement Score',
      value: totalOrders > 0 ? Math.round((approvedOrders / totalOrders) * 100) + '%' : '0%',
      change: '+12% efficiency boost',
      changeType: 'positive',
    },
    {
      title: 'Vendor Performance',
      value: approvedOrders > 0 ? Math.round((receivedOrders / approvedOrders) * 100) + '%' : '0%',
      change: '+1% delivery reliability',
      changeType: 'positive',
    },
    {
      title: 'Cost Optimization',
      value: formatCurrency(totalValue * 0.15),
      change: '22% below budget target',
      changeType: 'positive',
    }
  ];

  res.status(200).json({ success: true, data: statCards });
};