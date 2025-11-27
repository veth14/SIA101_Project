import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import useGetInvProcurement from "../../api/getInvProcurement";
export default function InvProcurement() {
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [statCards, setStatCards] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const { getInvProcurementOrder, getInvProcurementStats } = useGetInvProcurement();
    const fetchData = async () => {
        const ordersResponse = await getInvProcurementOrder();
        const statsResponse = await getInvProcurementStats();
        if (ordersResponse.success) {
            setPurchaseOrders(ordersResponse.data || []);
        }
        else {
            console.error(ordersResponse.message);
        }
        if (statsResponse.success) {
            setStatCards(statsResponse.data || []);
        }
        else {
            console.error(statsResponse.message);
        }
    };
    useEffect(() => {
        fetchData();
    }, [refreshKey]);
    const handleRefresh = () => {
        setRefreshKey((prev) => prev + 1);
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 p-8", children: _jsx("div", { className: "max-w-[1600px] mx-auto space-y-8", children: _jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsx("h1", { className: "text-4xl font-black text-gray-900 mb-2", children: "Procurement Management" }), _jsx("p", { className: "text-gray-600 font-medium", children: "Manage purchase orders and supplier relationships" })] }) }) }) }));
}
