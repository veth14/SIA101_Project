import React, { useState, useEffect } from "react";
import ProcurementHeader from "./ProcurementHeader";
import { ProcurementBackground } from "./ProcurementBackground";
import { ProcurementStats } from "./ProcurementStats";
import { ProcurementGrid } from "./ProcurementGrid";
import useGetInvProcurement from "../../../api/getInvProcurement";
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
  status: "pending" | "approved" | "received" | "cancelled";
  orderDate: string;
  expectedDelivery: string;
  approvedBy?: string;
  approvedDate?: string;
  notes?: string;
}

const ModularProcurementPage: React.FC = () => {
  // Sample purchase orders data
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);

  const { getInvProcurementOrder, loadingForGetInvProcurementOrder } =
    useGetInvProcurement();

  useEffect(() => {
    const useGetInvProcurementOrderFunc = async () => {
      const response = await getInvProcurementOrder();
      console.log(response);
      if (!response.data) {
        alert(response.message);
        return;
      }

      setPurchaseOrders(response.data);
    };
    useGetInvProcurementOrderFunc();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "⏳ Pending",
      },
      approved: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        label: "✅ Approved",
      },
      received: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "📦 Received",
      },
      cancelled: {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "❌ Cancelled",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig["pending"];

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const stats = {
    totalOrders: purchaseOrders.length,
    pendingOrders: purchaseOrders.filter((po) => po.status === "pending")
      .length,
    approvedOrders: purchaseOrders.filter((po) => po.status === "approved")
      .length,
    receivedOrders: purchaseOrders.filter((po) => po.status === "received")
      .length,
    totalValue: purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0),
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
          setOrders={setPurchaseOrders}
          formatCurrency={formatCurrency}
          getStatusBadge={getStatusBadge}
        />
      </div>
    </div>
  );
};

export default ModularProcurementPage;
