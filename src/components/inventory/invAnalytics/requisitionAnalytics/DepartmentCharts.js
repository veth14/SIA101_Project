import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Tooltip, ResponsiveContainer, XAxis, YAxis, AreaChart, Area, } from "recharts";
import useGetInvAnalytic from "@/api/getInvAnalytic";
import { exportDepartmentToPDF } from "@/utils/exportUtils";
// Recharts typing workaround: cast components to a generic React component type
const RResponsiveContainer = ResponsiveContainer;
const RAreaChart = AreaChart;
const RXAxis = XAxis;
const RYAxis = YAxis;
const RArea = Area;
const RCartesianGrid = CartesianGrid;
const RTooltip = Tooltip;
const DepartmentCharts = () => {
    const [selectedPeriod, setSelectedPeriod] = useState("Last 30 Days");
    const [departmentData, setDepartmentData] = useState([]);
    const [departmentPerformance, setDepartmentPerformance] = useState([]);
    const { getInvDepartmentCharts, loadingForGetInvDepartmentCharts } = useGetInvAnalytic();
    useEffect(() => {
        const useGetInvAnalyticFunc = async () => {
            const response = await getInvDepartmentCharts();
            if (!response.success) {
                alert(response.message);
                return;
            }
            setDepartmentData(response.data[0]);
            setDepartmentPerformance(response.data[1]);
        };
        useGetInvAnalyticFunc();
    }, []);
    const handleExport = () => {
        if (!departmentData || departmentData.length === 0) {
            alert("No data available to export");
            return;
        }
        // Prepare monthly data for export
        const monthlyData = departmentData.map((item) => ({
            Month: item.month,
            Housekeeping: item.housekeeping || 0,
            "Front Office": item.frontoffice || 0,
            "Food & Beverage": item.fnb || 0,
            Maintenance: item.maintenance || 0,
            Security: item.security || 0,
            Total: (item.housekeeping || 0) +
                (item.frontoffice || 0) +
                (item.fnb || 0) +
                (item.maintenance || 0) +
                (item.security || 0),
        }));
        // Add totals row
        const totals = {
            Month: "TOTAL",
            Housekeeping: monthlyData.reduce((sum, item) => sum + item.Housekeeping, 0),
            "Front Office": monthlyData.reduce((sum, item) => sum + item["Front Office"], 0),
            "Food & Beverage": monthlyData.reduce((sum, item) => sum + item["Food & Beverage"], 0),
            Maintenance: monthlyData.reduce((sum, item) => sum + item.Maintenance, 0),
            Security: monthlyData.reduce((sum, item) => sum + item.Security, 0),
            Total: monthlyData.reduce((sum, item) => sum + item.Total, 0),
        };
        monthlyData.push(totals);
        // Export to PDF using specialized function
        exportDepartmentToPDF(monthlyData, departmentPerformance, `department_request_trends_${selectedPeriod
            .toLowerCase()
            .replace(/\s+/g, "_")}`, `Department Request Trends - ${selectedPeriod}`);
    };
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (_jsxs("div", { className: "bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-4 min-w-[200px]", children: [_jsx("p", { className: "mb-2 font-medium text-gray-900", children: label }), payload.map((entry, index) => (_jsxs("div", { className: "flex items-center justify-between gap-4 mb-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: entry.color } }), _jsx("span", { className: "text-sm text-gray-600 capitalize", children: entry.dataKey })] }), _jsxs("span", { className: "text-sm font-medium text-gray-900", children: [entry.value, " requests"] })] }, index)))] }));
        }
        return null;
    };
    return (_jsxs("div", { className: "w-full space-y-8", children: [_jsxs("div", { className: "overflow-hidden border shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60", children: [_jsx("div", { className: "px-8 py-6 border-b bg-gradient-to-r from-slate-50 to-white border-gray-200/50", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "flex items-center justify-center w-10 h-10 shadow-xl bg-gradient-to-br from-heritage-green to-emerald-600 rounded-2xl", children: _jsx(TrendingUp, { className: "w-5 h-5 text-white", strokeWidth: 2.5 }) }), _jsx("div", { className: "absolute -inset-1 bg-gradient-to-r from-heritage-green to-emerald-400 rounded-2xl blur opacity-30" })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-black text-gray-900", children: "Department Request Trends" }), _jsxs("p", { className: "text-sm font-medium text-gray-500", children: ["Monthly request volume by department", selectedPeriod !== "All Time" && (_jsxs("span", { className: "ml-2 text-heritage-green", children: ["\u2022 Period: ", selectedPeriod] }))] })] })] }), _jsxs("div", { className: "flex space-x-4", children: [_jsx("div", { className: "relative", children: _jsxs("select", { value: selectedPeriod, onChange: (e) => setSelectedPeriod(e.target.value), className: "px-6 py-3 border border-white/40 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-heritage-green/50 focus:border-heritage-green/50 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300 cursor-pointer hover:bg-white/90 min-w-[160px]", children: [_jsx("option", { value: "Last 7 Days", children: "Last 7 Days" }), _jsx("option", { value: "Last 30 Days", children: "Last 30 Days" }), _jsx("option", { value: "Last 3 Months", children: "Last 3 Months" }), _jsx("option", { value: "Last 6 Months", children: "Last 6 Months" }), _jsx("option", { value: "Last Year", children: "Last Year" }), _jsx("option", { value: "All Time", children: "All Time" })] }) }), _jsxs("button", { onClick: handleExport, disabled: loadingForGetInvDepartmentCharts ||
                                                !departmentData ||
                                                departmentData.length === 0, className: "inline-flex items-center px-6 py-3 font-semibold text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-heritage-green to-emerald-600 rounded-xl hover:from-heritage-green/90 hover:to-emerald-600/90 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed", children: [_jsx("svg", { className: "w-5 h-5 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }), loadingForGetInvDepartmentCharts ? "Loading..." : "Export"] })] })] }) }), _jsxs("div", { className: "p-8", children: [_jsx("div", { className: "w-full h-80", children: _jsx(RResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(RAreaChart, { data: departmentData, margin: { top: 20, right: 30, left: 20, bottom: 20 }, children: [_jsxs("defs", { children: [_jsxs("linearGradient", { id: "housekeepingGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#3B82F6", stopOpacity: 0.3 }), _jsx("stop", { offset: "95%", stopColor: "#3B82F6", stopOpacity: 0.05 })] }), _jsxs("linearGradient", { id: "frontofficeGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#10B981", stopOpacity: 0.3 }), _jsx("stop", { offset: "95%", stopColor: "#10B981", stopOpacity: 0.05 })] }), _jsxs("linearGradient", { id: "fnbGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#F59E0B", stopOpacity: 0.3 }), _jsx("stop", { offset: "95%", stopColor: "#F59E0B", stopOpacity: 0.05 })] }), _jsxs("linearGradient", { id: "maintenanceGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#EF4444", stopOpacity: 0.3 }), _jsx("stop", { offset: "95%", stopColor: "#EF4444", stopOpacity: 0.05 })] }), _jsxs("linearGradient", { id: "securityGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#8B5CF6", stopOpacity: 0.3 }), _jsx("stop", { offset: "95%", stopColor: "#8B5CF6", stopOpacity: 0.05 })] })] }), _jsx(RCartesianGrid, { strokeDasharray: "3 3", stroke: "#F3F4F6" }), _jsx(RXAxis, { dataKey: "month", axisLine: false, tickLine: false, tick: { fontSize: 12, fill: "#6B7280" }, dy: 10 }), _jsx(RYAxis, { axisLine: false, tickLine: false, tick: { fontSize: 12, fill: "#6B7280" }, dx: -10 }), _jsx(RTooltip, { content: _jsx(CustomTooltip, {}) }), _jsx(RArea, { type: "monotone", dataKey: "housekeeping", stroke: "#3B82F6", strokeWidth: 3, fill: "url(#housekeepingGradient)", dot: { fill: "#3B82F6", strokeWidth: 2, r: 4 }, activeDot: {
                                                    r: 6,
                                                    stroke: "#3B82F6",
                                                    strokeWidth: 2,
                                                    fill: "#ffffff",
                                                } }), _jsx(RArea, { type: "monotone", dataKey: "frontoffice", stroke: "#10B981", strokeWidth: 3, fill: "url(#frontofficeGradient)", dot: { fill: "#10B981", strokeWidth: 2, r: 4 }, activeDot: {
                                                    r: 6,
                                                    stroke: "#10B981",
                                                    strokeWidth: 2,
                                                    fill: "#ffffff",
                                                } }), _jsx(RArea, { type: "monotone", dataKey: "fnb", stroke: "#F59E0B", strokeWidth: 3, fill: "url(#fnbGradient)", dot: { fill: "#F59E0B", strokeWidth: 2, r: 4 }, activeDot: {
                                                    r: 6,
                                                    stroke: "#F59E0B",
                                                    strokeWidth: 2,
                                                    fill: "#ffffff",
                                                } }), _jsx(RArea, { type: "monotone", dataKey: "maintenance", stroke: "#EF4444", strokeWidth: 3, fill: "url(#maintenanceGradient)", dot: { fill: "#EF4444", strokeWidth: 2, r: 4 }, activeDot: {
                                                    r: 6,
                                                    stroke: "#EF4444",
                                                    strokeWidth: 2,
                                                    fill: "#ffffff",
                                                } }), _jsx(RArea, { type: "monotone", dataKey: "security", stroke: "#8B5CF6", strokeWidth: 3, fill: "url(#securityGradient)", dot: { fill: "#8B5CF6", strokeWidth: 2, r: 4 }, activeDot: {
                                                    r: 6,
                                                    stroke: "#8B5CF6",
                                                    strokeWidth: 2,
                                                    fill: "#ffffff",
                                                } })] }) }) }), _jsxs("div", { className: "flex flex-wrap justify-center gap-6 pt-6 mt-6 border-t border-gray-100", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 bg-blue-500 rounded-full" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "Housekeeping" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 bg-green-500 rounded-full" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "Front Office" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 bg-orange-500 rounded-full" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "Food & Beverage" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 bg-red-500 rounded-full" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "Maintenance" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 bg-purple-500 rounded-full" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "Security" })] })] })] })] }), _jsx("div", { className: "mt-8 overflow-hidden border shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60", children: _jsxs("div", { className: "p-8", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h4", { className: "mb-2 text-lg font-bold text-gray-900", children: "Department Performance Metrics" }), _jsx("p", { className: "text-sm text-gray-600", children: "Detailed performance breakdown by department" })] }), _jsxs("div", { className: "overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl", children: [_jsxs("div", { className: "grid grid-cols-5 gap-6 px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100", children: [_jsx("div", { className: "text-xs font-bold tracking-wider text-gray-600 uppercase", children: "Department" }), _jsx("div", { className: "text-xs font-bold tracking-wider text-gray-600 uppercase", children: "Total Requests" }), _jsx("div", { className: "text-xs font-bold tracking-wider text-gray-600 uppercase", children: "Avg Response" }), _jsx("div", { className: "text-xs font-bold tracking-wider text-gray-600 uppercase", children: "Approval Rate" }), _jsx("div", { className: "text-xs font-bold tracking-wider text-gray-600 uppercase", children: "Performance" })] }), _jsx("div", { className: "divide-y divide-gray-100", children: departmentPerformance.map((dept, index) => (_jsxs("div", { className: "grid grid-cols-5 gap-6 px-6 py-6 transition-all duration-200 hover:bg-gradient-to-r hover:from-heritage-green/5 hover:to-emerald-50/30 group", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: `w-4 h-4 rounded-full ${dept.color.replace("bg-", "bg-")} shadow-sm group-hover:scale-110 transition-transform duration-200` }), _jsx("span", { className: "font-semibold text-gray-900 transition-colors duration-200 group-hover:text-heritage-green", children: dept.name })] }), _jsx("div", { className: "flex items-center", children: _jsxs("div", { className: "text-center", children: [_jsx("span", { className: "text-lg font-bold text-gray-900", children: dept.requests }), _jsx("p", { className: "text-xs text-gray-500", children: "requests" })] }) }), _jsx("div", { className: "flex items-center", children: _jsxs("div", { className: "text-center", children: [_jsx("span", { className: "text-lg font-bold text-gray-900", children: dept.avgTime }), _jsx("p", { className: "text-xs text-gray-500", children: "average" })] }) }), _jsx("div", { className: "flex items-center", children: _jsxs("div", { className: "text-center", children: [_jsxs("span", { className: "text-lg font-bold text-emerald-600", children: [dept.approval, "%"] }), _jsx("p", { className: "text-xs text-gray-500", children: "approved" })] }) }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "flex-1 h-3 overflow-hidden bg-gray-200 rounded-full shadow-inner", children: _jsx("div", { className: `h-3 rounded-full ${dept.color} transition-all duration-500 ease-out shadow-sm`, style: { width: `${dept.approval}%` } }) }), _jsxs("span", { className: "text-sm font-bold text-gray-700 min-w-[3rem] bg-gray-100 px-2 py-1 rounded-md", children: [dept.approval, "%"] })] })] }, index))) })] })] }) })] }));
};
export default DepartmentCharts;
