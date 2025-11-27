import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { ProcurementBackground } from "./ProcurementBackground";
import { ProcurementStats } from "./ProcurementStats";
import { ProcurementGrid } from "./ProcurementGrid";
import useGetInvProcurement from "../../../api/getInvProcurement";
const ModularProcurementPage = () => {
    // Sample purchase orders data
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const { getInvProcurementOrder, loadingForGetInvProcurementOrder } = useGetInvProcurement();
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
    const getStatusBadge = (status) => {
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
        const config = statusConfig[status] ||
            statusConfig["pending"];
        return (_jsx("span", { className: `inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`, children: config.label }));
    };
    const formatCurrency = (amount) => {
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
    return (_jsxs("div", { className: "min-h-screen bg-[#F9F6EE]", children: [_jsx(ProcurementBackground, {}), _jsxs("div", { className: "relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full", children: [_jsx(ProcurementStats, { stats: stats, formatCurrency: formatCurrency }), _jsx(ProcurementGrid, { orders: purchaseOrders, setOrders: setPurchaseOrders, formatCurrency: formatCurrency, getStatusBadge: getStatusBadge })] })] }));
};
export default ModularProcurementPage;
