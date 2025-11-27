import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { TrendingUp, Package, Utensils, Sparkles, } from "lucide-react";
import { CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, XAxis, YAxis, } from "recharts";
import useGetInvAnalytic from "@/api/getInvAnalytic";
import { exportToPDF } from "@/utils/exportUtils";
// Recharts JSX typing aliases (avoid strict JSX return types)
const RResponsiveContainer = ResponsiveContainer;
const RAreaChart = AreaChart;
const RXAxis = XAxis;
const RYAxis = YAxis;
const RCartesianGrid = CartesianGrid;
const RTooltip = Tooltip;
const RArea = Area;
const iconMap = {
    TrendingUp,
    Package,
    Utensils,
    Sparkles,
};
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (_jsxs("div", { className: "bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-4 min-w-[200px]", children: [_jsx("p", { className: "mb-2 font-medium text-gray-900", children: label }), payload.map((entry, index) => (_jsxs("div", { className: "flex items-center justify-between gap-4 mb-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: entry.color } }), _jsx("span", { className: "text-sm text-gray-600 capitalize", children: entry.dataKey })] }), _jsxs("span", { className: "text-sm font-medium text-gray-900", children: [entry.value.toLocaleString(), " units"] })] }, `tooltip-${index}`)))] }));
    }
    return null;
};
export function AnalyticsChart() {
    const [selectedPeriod, setSelectedPeriod] = useState("Last 30 Days");
    const [summaryStats, setSummaryStats] = useState([]);
    const [chartData, setChartData] = useState([]);
    const { getInvAnalyticsChart, loadingForGetInvAnalyticsChart } = useGetInvAnalytic();
    useEffect(() => {
        const useGetInvAnalyticFunc = async () => {
            const response = await getInvAnalyticsChart();
            if (!response.success) {
                alert(response.message);
                return;
            }
            setSummaryStats(response.data[0]);
            setChartData(response.data[1]);
        };
        useGetInvAnalyticFunc();
    }, []);
    const handleExport = () => {
        if (!chartData || chartData.length === 0) {
            alert("No data available to export");
            return;
        }
        // Prepare export data with formatted values
        const exportData = chartData.map((item) => ({
            Month: item.month,
            "Linens & Textiles": item.linens || 0,
            "Cleaning Supplies": item.cleaning || 0,
            "Food & Beverage": item.food || 0,
            Maintenance: item.maintenance || 0,
            Total: (item.linens || 0) +
                (item.cleaning || 0) +
                (item.food || 0) +
                (item.maintenance || 0),
        }));
        // Add summary row
        const totals = {
            Month: "TOTAL",
            "Linens & Textiles": exportData.reduce((sum, item) => sum + item["Linens & Textiles"], 0),
            "Cleaning Supplies": exportData.reduce((sum, item) => sum + item["Cleaning Supplies"], 0),
            "Food & Beverage": exportData.reduce((sum, item) => sum + item["Food & Beverage"], 0),
            Maintenance: exportData.reduce((sum, item) => sum + item["Maintenance"], 0),
            Total: exportData.reduce((sum, item) => sum + item.Total, 0),
        };
        exportData.push(totals);
        // Export to PDF with title
        exportToPDF(exportData, `inventory_usage_trends_${selectedPeriod
            .toLowerCase()
            .replace(/\s+/g, "_")}`, `Inventory Usage Trends - ${selectedPeriod}`);
    };
    return (_jsxs("div", { className: "w-full space-y-8", children: [_jsx("div", { className: "grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4", children: summaryStats.map((stat, index) => {
                    const Icon = iconMap[stat.icon] || TrendingUp;
                    return (_jsxs("div", { className: "relative p-8 overflow-hidden transition-all duration-700 border shadow-2xl bg-white/90 backdrop-blur-xl rounded-3xl border-white/30 hover:shadow-3xl hover:-translate-y-3 hover:scale-105 group", children: [_jsx("div", { className: "absolute inset-0 transition-opacity duration-700 opacity-50 bg-gradient-to-br from-heritage-green/10 via-emerald-50/40 to-heritage-green/5 rounded-3xl group-hover:opacity-100" }), _jsx("div", { className: "absolute top-0 right-0 w-32 h-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-bl from-heritage-green/20 to-transparent animate-pulse" }), _jsx("div", { className: "absolute bottom-0 left-0 w-24 h-24 delay-1000 -translate-x-1/2 translate-y-1/2 rounded-full bg-gradient-to-tr from-emerald-100/30 to-transparent animate-pulse" }), _jsx("div", { className: "absolute w-2 h-2 rounded-full top-4 left-4 bg-heritage-green/30 animate-ping" }), _jsx("div", { className: "absolute w-1 h-1 delay-500 rounded-full bottom-4 right-4 bg-emerald-400/40 animate-ping" }), _jsxs("div", { className: "relative flex items-start justify-between", children: [_jsxs("div", { className: "flex-1 mr-4", children: [_jsxs("div", { className: "flex items-center mb-3 space-x-2", children: [_jsx("div", { className: "w-1 h-6 rounded-full bg-gradient-to-b from-heritage-green to-emerald-600" }), _jsx("p", { className: "text-sm font-bold tracking-wider text-gray-700 uppercase", children: stat.title })] }), _jsx("p", { className: "mb-3 text-4xl font-black transition-transform duration-500 text-heritage-green drop-shadow-sm group-hover:scale-105", children: stat.value }), _jsxs("div", { className: `inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${stat.changeType === "positive"
                                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                                    : "bg-gray-100 text-gray-800 border border-gray-200"}`, children: [_jsx("svg", { className: "w-3 h-3 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 17l9.2-9.2M17 17V7H7" }) }), stat.change] })] }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: `w-20 h-20 ${stat.iconBg} rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`, children: _jsx(Icon, { className: "w-6 h-6 text-gray-600" }) }), _jsx("div", { className: "absolute transition-opacity duration-500 opacity-0 -inset-2 bg-gradient-to-r from-heritage-green/30 to-emerald-400/30 rounded-2xl blur-lg group-hover:opacity-60" }), _jsx("div", { className: "absolute top-0 right-0 w-3 h-3 rounded-full bg-heritage-green animate-pulse" })] })] })] }, index));
                }) }), _jsxs("div", { className: "overflow-hidden border shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60", children: [_jsx("div", { className: "px-8 py-6 border-b bg-gradient-to-r from-slate-50 to-white border-gray-200/50", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "flex items-center justify-center w-10 h-10 shadow-xl bg-gradient-to-br from-heritage-green to-emerald-600 rounded-2xl", children: _jsx(TrendingUp, { className: "w-5 h-5 text-white", strokeWidth: 2.5 }) }), _jsx("div", { className: "absolute -inset-1 bg-gradient-to-r from-heritage-green to-emerald-400 rounded-2xl blur opacity-30" })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-black text-gray-900", children: "Inventory Usage Trends" }), _jsxs("p", { className: "text-sm font-medium text-gray-500", children: ["Monthly consumption patterns across categories", selectedPeriod !== "All Time" && (_jsxs("span", { className: "ml-2 text-heritage-green", children: ["\u2022 Period: ", selectedPeriod] }))] })] })] }), _jsxs("div", { className: "flex space-x-4", children: [_jsx("div", { className: "relative", children: _jsxs("select", { value: selectedPeriod, onChange: (e) => setSelectedPeriod(e.target.value), className: "px-6 py-3 border border-white/40 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-heritage-green/50 focus:border-heritage-green/50 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300 cursor-pointer hover:bg-white/90 min-w-[160px]", children: [_jsx("option", { value: "Last 7 Days", children: "Last 7 Days" }), _jsx("option", { value: "Last 30 Days", children: "Last 30 Days" }), _jsx("option", { value: "Last 3 Months", children: "Last 3 Months" }), _jsx("option", { value: "Last 6 Months", children: "Last 6 Months" }), _jsx("option", { value: "Last Year", children: "Last Year" }), _jsx("option", { value: "All Time", children: "All Time" })] }) }), _jsxs("button", { onClick: handleExport, disabled: loadingForGetInvAnalyticsChart ||
                                                !chartData ||
                                                chartData.length === 0, className: "inline-flex items-center px-6 py-3 font-semibold text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-heritage-green to-emerald-600 rounded-xl hover:from-heritage-green/90 hover:to-emerald-600/90 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed", children: [_jsx("svg", { className: "w-5 h-5 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }), loadingForGetInvAnalyticsChart ? "Loading..." : "Export"] })] })] }) }), _jsxs("div", { className: "p-8", children: [_jsx("div", { className: "w-full h-80", children: _jsx(RResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(RAreaChart, { data: chartData, margin: {
                                            top: 20,
                                            right: 30,
                                            left: 20,
                                            bottom: 20,
                                        }, children: [_jsxs("defs", { children: [_jsxs("linearGradient", { id: "linensGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#10B981", stopOpacity: 0.3 }), _jsx("stop", { offset: "95%", stopColor: "#10B981", stopOpacity: 0.05 })] }), _jsxs("linearGradient", { id: "cleaningGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#3B82F6", stopOpacity: 0.3 }), _jsx("stop", { offset: "95%", stopColor: "#3B82F6", stopOpacity: 0.05 })] }), _jsxs("linearGradient", { id: "foodGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#F59E0B", stopOpacity: 0.3 }), _jsx("stop", { offset: "95%", stopColor: "#F59E0B", stopOpacity: 0.05 })] }), _jsxs("linearGradient", { id: "maintenanceGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#8B5CF6", stopOpacity: 0.3 }), _jsx("stop", { offset: "95%", stopColor: "#8B5CF6", stopOpacity: 0.05 })] })] }), _jsx(RCartesianGrid, { strokeDasharray: "3 3", stroke: "#F3F4F6" }), _jsx(RXAxis, { dataKey: "month", axisLine: false, tickLine: false, tick: { fontSize: 12, fill: "#6B7280" }, dy: 10 }), _jsx(RYAxis, { axisLine: false, tickLine: false, tick: { fontSize: 12, fill: "#6B7280" }, dx: -10 }), _jsx(RTooltip, { content: _jsx(CustomTooltip, {}) }), _jsx(RArea, { type: "monotone", dataKey: "linens", stroke: "#10B981", strokeWidth: 3, fill: "url(#linensGradient)", dot: { fill: "#10B981", strokeWidth: 2, r: 4 }, activeDot: {
                                                    r: 6,
                                                    stroke: "#10B981",
                                                    strokeWidth: 2,
                                                    fill: "#ffffff",
                                                } }), _jsx(RArea, { type: "monotone", dataKey: "cleaning", stroke: "#3B82F6", strokeWidth: 3, fill: "url(#cleaningGradient)", dot: { fill: "#3B82F6", strokeWidth: 2, r: 4 }, activeDot: {
                                                    r: 6,
                                                    stroke: "#3B82F6",
                                                    strokeWidth: 2,
                                                    fill: "#ffffff",
                                                } }), _jsx(RArea, { type: "monotone", dataKey: "food", stroke: "#F59E0B", strokeWidth: 3, fill: "url(#foodGradient)", dot: { fill: "#F59E0B", strokeWidth: 2, r: 4 }, activeDot: {
                                                    r: 6,
                                                    stroke: "#F59E0B",
                                                    strokeWidth: 2,
                                                    fill: "#ffffff",
                                                } }), _jsx(RArea, { type: "monotone", dataKey: "maintenance", stroke: "#8B5CF6", strokeWidth: 3, fill: "url(#maintenanceGradient)", dot: { fill: "#8B5CF6", strokeWidth: 2, r: 4 }, activeDot: {
                                                    r: 6,
                                                    stroke: "#8B5CF6",
                                                    strokeWidth: 2,
                                                    fill: "#ffffff",
                                                } })] }) }) }), _jsxs("div", { className: "flex flex-wrap justify-center gap-6 pt-6 mt-6 border-t border-gray-100", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 rounded-full bg-emerald-500" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "Linens & Textiles" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 bg-blue-500 rounded-full" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "Cleaning Supplies" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 rounded-full bg-amber-500" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "Food & Beverage" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 rounded-full bg-violet-500" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "Maintenance" })] })] })] })] })] }));
}
export default AnalyticsChart;
