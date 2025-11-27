import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, } from "recharts";
import useGetInvAnalytic from "@/api/getInvAnalytic";
import { exportProcurementToPDF } from "@/utils/exportUtils";
// Recharts JSX typing aliases (avoid strict JSX types from recharts)
const RResponsiveContainer = ResponsiveContainer;
const RAreaChart = AreaChart;
const RXAxis = XAxis;
const RYAxis = YAxis;
const RCartesianGrid = CartesianGrid;
const RTooltip = Tooltip;
const RArea = Area;
const ProcurementCharts = () => {
    const [selectedPeriod, setSelectedPeriod] = useState("Last 30 Days");
    const { getInvProcurementAnalytics, loadingForGetInvProcurementAnalytics } = useGetInvAnalytic();
    useEffect(() => {
        const useGetInvAnalyticFunc = async () => {
            const response = await getInvProcurementAnalytics();
            if (!response.success) {
                alert(response.message);
                return;
            }
            setProcurementData(response.data);
        };
        useGetInvAnalyticFunc();
    }, []);
    const [procurementData, setProcurementData] = useState([]);
    const handleExport = () => {
        if (!procurementData || procurementData.length === 0) {
            alert("No data available to export");
            return;
        }
        // Prepare export data with formatted values
        const exportData = procurementData.map((item) => ({
            Month: item.month,
            "Purchase Orders": item.orders || 0,
            "Order Value (₱K)": item.value || 0,
            "Active Suppliers": item.suppliers || 0,
            "On-time Delivery (%)": item.onTime || 0,
        }));
        // Calculate totals and averages
        const totalOrders = exportData.reduce((sum, item) => sum + item["Purchase Orders"], 0);
        const totalValue = exportData.reduce((sum, item) => sum + item["Order Value (₱K)"], 0);
        const avgSuppliers = Math.round(exportData.reduce((sum, item) => sum + item["Active Suppliers"], 0) /
            exportData.length);
        const avgOnTime = Math.round(exportData.reduce((sum, item) => sum + item["On-time Delivery (%)"], 0) /
            exportData.length);
        // Add summary row
        exportData.push({
            Month: "TOTAL/AVERAGE",
            "Purchase Orders": totalOrders,
            "Order Value (₱K)": totalValue,
            "Active Suppliers": avgSuppliers,
            "On-time Delivery (%)": avgOnTime,
        });
        // Export to PDF using specialized function
        exportProcurementToPDF(exportData, `procurement_analytics_${selectedPeriod
            .toLowerCase()
            .replace(/\s+/g, "_")}`, `Procurement Analytics - ${selectedPeriod}`);
    };
    // Custom Tooltip Component
    const CustomTooltip = ({ active, payload, label, }) => {
        if (active && payload && payload.length) {
            return (_jsxs("div", { className: "p-4 border shadow-2xl bg-white/95 backdrop-blur-sm rounded-xl border-gray-200/60", children: [_jsx("p", { className: "mb-2 text-sm font-bold text-gray-900", children: label }), payload.map((entry, index) => (_jsxs("div", { className: "flex items-center mb-1 space-x-2", children: [_jsx("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: entry.color } }), _jsxs("p", { className: "text-sm font-medium text-gray-700", children: [entry.dataKey === "orders" && `Orders: ${entry.value}`, entry.dataKey === "value" && `Value: ₱${entry.value}K`, entry.dataKey === "suppliers" && `Suppliers: ${entry.value}`, entry.dataKey === "onTime" && `On-time: ${entry.value}%`] })] }, `tooltip-${index}`)))] }));
        }
        return null;
    };
    return (_jsxs("div", { className: "overflow-hidden border shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60", children: [_jsx("div", { className: "px-8 py-6 border-b bg-gradient-to-r from-slate-50 to-white border-gray-200/50", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "flex items-center justify-center w-10 h-10 shadow-xl bg-gradient-to-br from-heritage-green to-emerald-600 rounded-2xl", children: _jsx(ShoppingCart, { className: "w-5 h-5 text-white", strokeWidth: 2.5 }) }), _jsx("div", { className: "absolute -inset-1 bg-gradient-to-r from-heritage-green to-emerald-400 rounded-2xl blur opacity-30" })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-black text-gray-900", children: "Procurement Analytics" }), _jsxs("p", { className: "text-sm font-medium text-gray-500", children: ["Purchase orders & supplier performance trends", selectedPeriod !== "All Time" && (_jsxs("span", { className: "ml-2 text-heritage-green", children: ["\u2022 Period: ", selectedPeriod] }))] })] })] }), _jsxs("div", { className: "flex space-x-4", children: [_jsx("div", { className: "relative", children: _jsxs("select", { value: selectedPeriod, onChange: (e) => setSelectedPeriod(e.target.value), className: "px-6 py-3 border border-white/40 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-heritage-green/50 focus:border-heritage-green/50 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300 cursor-pointer hover:bg-white/90 min-w-[160px]", children: [_jsx("option", { value: "Last 7 Days", children: "Last 7 Days" }), _jsx("option", { value: "Last 30 Days", children: "Last 30 Days" }), _jsx("option", { value: "Last 3 Months", children: "Last 3 Months" }), _jsx("option", { value: "Last 6 Months", children: "Last 6 Months" }), _jsx("option", { value: "Last Year", children: "Last Year" }), _jsx("option", { value: "All Time", children: "All Time" })] }) }), _jsxs("button", { onClick: handleExport, disabled: loadingForGetInvProcurementAnalytics ||
                                        !procurementData ||
                                        procurementData.length === 0, className: "inline-flex items-center px-6 py-3 font-semibold text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-heritage-green to-emerald-600 rounded-xl hover:from-heritage-green/90 hover:to-emerald-600/90 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed", children: [_jsx("svg", { className: "w-5 h-5 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }), loadingForGetInvProcurementAnalytics ? "Loading..." : "Export"] })] })] }) }), _jsxs("div", { className: "p-8", children: [_jsx("div", { className: "w-full h-80", children: _jsx(RResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(RAreaChart, { data: procurementData, margin: {
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 20,
                                }, children: [_jsxs("defs", { children: [_jsxs("linearGradient", { id: "ordersGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#3B82F6", stopOpacity: 0.3 }), _jsx("stop", { offset: "95%", stopColor: "#3B82F6", stopOpacity: 0.05 })] }), _jsxs("linearGradient", { id: "valueGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#10B981", stopOpacity: 0.3 }), _jsx("stop", { offset: "95%", stopColor: "#10B981", stopOpacity: 0.05 })] }), _jsxs("linearGradient", { id: "suppliersGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#F59E0B", stopOpacity: 0.3 }), _jsx("stop", { offset: "95%", stopColor: "#F59E0B", stopOpacity: 0.05 })] }), _jsxs("linearGradient", { id: "onTimeGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#8B5CF6", stopOpacity: 0.3 }), _jsx("stop", { offset: "95%", stopColor: "#8B5CF6", stopOpacity: 0.05 })] })] }), _jsx(RCartesianGrid, { strokeDasharray: "3 3", stroke: "#F3F4F6" }), _jsx(RXAxis, { dataKey: "month", axisLine: false, tickLine: false, tick: { fontSize: 12, fill: "#6B7280" }, dy: 10 }), _jsx(RYAxis, { axisLine: false, tickLine: false, tick: { fontSize: 12, fill: "#6B7280" }, dx: -10 }), _jsx(RTooltip, { content: _jsx(CustomTooltip, {}) }), _jsx(RArea, { type: "monotone", dataKey: "orders", stroke: "#3B82F6", strokeWidth: 3, fill: "url(#ordersGradient)", dot: { fill: "#3B82F6", strokeWidth: 2, r: 4 }, activeDot: {
                                            r: 6,
                                            stroke: "#3B82F6",
                                            strokeWidth: 2,
                                            fill: "#ffffff",
                                        } }), _jsx(RArea, { type: "monotone", dataKey: "value", stroke: "#10B981", strokeWidth: 3, fill: "url(#valueGradient)", dot: { fill: "#10B981", strokeWidth: 2, r: 4 }, activeDot: {
                                            r: 6,
                                            stroke: "#10B981",
                                            strokeWidth: 2,
                                            fill: "#ffffff",
                                        } }), _jsx(RArea, { type: "monotone", dataKey: "suppliers", stroke: "#F59E0B", strokeWidth: 3, fill: "url(#suppliersGradient)", dot: { fill: "#F59E0B", strokeWidth: 2, r: 4 }, activeDot: {
                                            r: 6,
                                            stroke: "#F59E0B",
                                            strokeWidth: 2,
                                            fill: "#ffffff",
                                        } }), _jsx(RArea, { type: "monotone", dataKey: "onTime", stroke: "#8B5CF6", strokeWidth: 3, fill: "url(#onTimeGradient)", dot: { fill: "#8B5CF6", strokeWidth: 2, r: 4 }, activeDot: {
                                            r: 6,
                                            stroke: "#8B5CF6",
                                            strokeWidth: 2,
                                            fill: "#ffffff",
                                        } })] }) }) }), _jsxs("div", { className: "flex flex-wrap justify-center gap-6 pt-6 mt-6 border-t border-gray-100", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 bg-blue-500 rounded-full" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "Purchase Orders" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 bg-green-500 rounded-full" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "Order Value (\u20B1K)" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 rounded-full bg-amber-500" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "Active Suppliers" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 bg-purple-500 rounded-full" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "On-time Delivery (%)" })] })] })] })] }));
};
export default ProcurementCharts;
