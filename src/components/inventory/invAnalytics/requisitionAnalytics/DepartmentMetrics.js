import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import useGetInvAnalytic from "@/api/getInvAnalytic";
import { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react"; // ✅ Import all icons dynamically
const DepartmentMetrics = () => {
    const { getInvDepartmentMetrics, loadingForGetInvDepartmentMetrics } = useGetInvAnalytic();
    const [statCards, setStatCards] = useState([]);
    useEffect(() => {
        const useGetInvAnalyticFunc = async () => {
            const response = await getInvDepartmentMetrics();
            if (!response.success) {
                alert("Failed to fetch department metrics");
                return;
            }
            // ✅ Convert icon strings (e.g. "Building") to actual Lucide components
            const formattedData = response.data.map((item) => {
                const IconComponent = LucideIcons[item.icon] || LucideIcons.HelpCircle; // fallback icon
                return {
                    ...item,
                    icon: _jsx(IconComponent, { className: "w-6 h-6 text-heritage-green" }),
                };
            });
            setStatCards(formattedData);
        };
        useGetInvAnalyticFunc();
    }, [getInvDepartmentMetrics]);
    return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: statCards.map((stat, index) => (_jsxs("div", { className: "relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 hover:shadow-3xl hover:-translate-y-3 hover:scale-105 transition-all duration-700 group overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-heritage-green/10 via-emerald-50/40 to-heritage-green/5 rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" }), _jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-heritage-green/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" }), _jsx("div", { className: "absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-100/30 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000" }), _jsx("div", { className: "absolute top-4 left-4 w-2 h-2 bg-heritage-green/30 rounded-full animate-ping" }), _jsx("div", { className: "absolute bottom-4 right-4 w-1 h-1 bg-emerald-400/40 rounded-full animate-ping delay-500" }), _jsxs("div", { className: "relative flex items-start justify-between", children: [_jsxs("div", { className: "flex-1 mr-4", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-3", children: [_jsx("div", { className: "w-1 h-6 bg-gradient-to-b from-heritage-green to-emerald-600 rounded-full" }), _jsx("p", { className: "text-sm font-bold text-gray-700 uppercase tracking-wider", children: stat.title })] }), _jsx("p", { className: "text-4xl font-black text-heritage-green drop-shadow-sm mb-3 group-hover:scale-105 transition-transform duration-500", children: stat.value }), _jsxs("div", { className: `inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${stat.changeType === "positive"
                                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                        : stat.changeType === "negative"
                                            ? "bg-red-100 text-red-800 border border-red-200"
                                            : "bg-gray-100 text-gray-800 border border-gray-200"}`, children: [_jsx("svg", { className: "w-3 h-3 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 17l9.2-9.2M17 17V7H7" }) }), stat.change] })] }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: `w-20 h-20 ${stat.iconBg} rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`, children: stat.icon }), _jsx("div", { className: "absolute -inset-2 bg-gradient-to-r from-heritage-green/30 to-emerald-400/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500" }), _jsx("div", { className: "absolute top-0 right-0 w-3 h-3 bg-heritage-green rounded-full animate-pulse" })] })] })] }, index))) }));
};
export default DepartmentMetrics;
