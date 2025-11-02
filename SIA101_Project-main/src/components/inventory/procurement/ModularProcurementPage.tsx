import React from 'react';
import ProcurementHeader from './ProcurementHeader';
import { ProcurementBackground } from './ProcurementBackground';
import { ProcurementStats } from './ProcurementStats';
import { ProcurementGrid } from './ProcurementGrid';

interface PurchaseOrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface PurchaseOrder {
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

const ModularProcurementPage: React.FC = () => {

  // Sample purchase orders data
  const purchaseOrders: PurchaseOrder[] = [
    {
      id: 'PO001',
      orderNumber: 'PO-2024-001',
      supplier: 'Hotel Linens Co.',
      items: [
        { name: 'Bath Towels', quantity: 50, unitPrice: 450, total: 22500 },
        { name: 'Bed Sheets', quantity: 30, unitPrice: 800, total: 24000 }
      ],
      totalAmount: 46500,
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
      totalAmount: 32000,
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


  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '⏳ Pending' },
      'approved': { bg: 'bg-blue-100', text: 'text-blue-800', label: '✅ Approved' },
      'received': { bg: 'bg-green-100', text: 'text-green-800', label: '📦 Received' },
      'cancelled': { bg: 'bg-red-100', text: 'text-red-800', label: '❌ Cancelled' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['pending'];
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const stats = {
    totalOrders: purchaseOrders.length,
    pendingOrders: purchaseOrders.filter(po => po.status === 'pending').length,
    approvedOrders: purchaseOrders.filter(po => po.status === 'approved').length,
    receivedOrders: purchaseOrders.filter(po => po.status === 'received').length,
    totalValue: purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0)
  };

  return (
    <div className="min-h-screen bg-[#F9F6EE]">
      {/* Background Elements */}
      <ProcurementBackground />

      {/* Main Content Container */}
      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">
        {/* Header */}
        <ProcurementHeader />

        {/* Stats Cards */}
        <ProcurementStats stats={stats} formatCurrency={formatCurrency} />

        {/* Purchase Orders Grid */}
        <ProcurementGrid
          orders={purchaseOrders}
          formatCurrency={formatCurrency}
          getStatusBadge={getStatusBadge}
        />
      </div>
    </div>
  );
};

export default ModularProcurementPage;
