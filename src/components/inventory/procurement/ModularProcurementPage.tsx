import React, { useEffect, useState } from 'react';
import { ProcurementBackground } from './ProcurementBackground';
import { ProcurementStats } from './ProcurementStats';
import { ProcurementGrid } from './ProcurementGrid';
import PurchaseOrderDetailsModal from './PurchaseOrderDetailsModal';
import { subscribeToPurchaseOrders, type PurchaseOrderRecord, updatePurchaseOrderStatus } from '../../../backend/purchaseOrders/purchaseOrdersService';

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
  hasInvoice?: boolean;
}

const ModularProcurementPage: React.FC = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const mapRecordToPurchaseOrder = (record: PurchaseOrderRecord): PurchaseOrder => {
    const rawStatus = (record.status || '').toString().toLowerCase();
    let status: PurchaseOrder['status'];
    switch (rawStatus) {
      case 'approved':
        status = 'approved';
        break;
      case 'received':
        status = 'received';
        break;
      case 'cancelled':
        status = 'cancelled';
        break;
      case 'pending':
      default:
        status = 'pending';
    }

    const orderDate = record.orderDate 
      || (record.createdAt ? record.createdAt.toISOString().split('T')[0] : '');

    return {
      id: record.id,
      orderNumber: record.orderNumber,
      supplier: record.supplier,
      items: record.items?.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
      })) ?? [],
      totalAmount: record.totalAmount,
      status,
      orderDate,
      expectedDelivery: record.expectedDelivery || '',
      approvedBy: record.approvedBy,
      approvedDate: record.approvedDate,
      notes: record.notes,
      hasInvoice: record.hasInvoice,
    };
  };

  useEffect(() => {
    const unsubscribe = subscribeToPurchaseOrders(
      (records) => {
        const mapped = records.map(mapRecordToPurchaseOrder);
        setPurchaseOrders(mapped);
      },
      (error) => {
        console.error('Error subscribing to purchase orders:', error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const handleViewDetails = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleMarkReceived = async (order: PurchaseOrder) => {
    try {
      await updatePurchaseOrderStatus(order.id, 'received', { approvedBy: order.approvedBy || 'System' });
    } catch (error) {
      console.error('Failed to mark purchase order as received:', error);
    }
  };

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

        {/* Stats Cards */}
        <ProcurementStats stats={stats} formatCurrency={formatCurrency} />

        {/* Purchase Orders Grid */}
        <ProcurementGrid
          orders={purchaseOrders}
          formatCurrency={formatCurrency}
          getStatusBadge={getStatusBadge}
          onViewDetails={handleViewDetails}
          onMarkReceived={handleMarkReceived}
        />
      </div>

      <PurchaseOrderDetailsModal
        order={selectedOrder}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
};

export default ModularProcurementPage;