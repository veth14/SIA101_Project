import { useState, useEffect } from "react";
import { ProcurementGrid } from "../../components/inventory/procurement/ProcurementGrid";
import useGetInvProcurement from "../../api/getInvProcurement";

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplier: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  totalAmount: number;
  status: "pending" | "approved" | "received" | "cancelled";
  orderDate: string;
  expectedDelivery: string;
  approvedBy?: string;
  notes?: string;
}

export default function InvProcurement() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [statCards, setStatCards] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const { getInvProcurementOrder, getInvProcurementStats } =
    useGetInvProcurement();

  const fetchData = async () => {
    const ordersResponse = await getInvProcurementOrder();
    const statsResponse = await getInvProcurementStats();

    if (ordersResponse.success) {
      setPurchaseOrders(ordersResponse.data || []);
    } else {
      console.error(ordersResponse.message);
    }

    if (statsResponse.success) {
      setStatCards(statsResponse.data || []);
    } else {
      console.error(statsResponse.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Format currency helper
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Get status badge helper
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { bg: string; text: string; dot: string }
    > = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        dot: "bg-yellow-500",
      },
      approved: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        dot: "bg-blue-500",
      },
      received: {
        bg: "bg-green-100",
        text: "text-green-800",
        dot: "bg-green-500",
      },
      cancelled: { bg: "bg-red-100", text: "text-red-800", dot: "bg-red-500" },
    };

    const config = statusConfig[status.toLowerCase()] || statusConfig.pending;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${config.bg} ${config.text}`}
      >
        <div className={`w-2 h-2 rounded-full mr-2 ${config.dot}`}></div>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 p-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">
              Procurement Management
            </h1>
            <p className="text-gray-600 font-medium">
              Manage purchase orders and supplier relationships
            </p>
          </div>
        </div>

        {/* Procurement Grid */}
        <ProcurementGrid
          orders={purchaseOrders}
          setOrders={setPurchaseOrders}
          formatCurrency={formatCurrency}
          getStatusBadge={getStatusBadge}
          onSuccess={handleRefresh}
        />
      </div>
    </div>
  );
}
