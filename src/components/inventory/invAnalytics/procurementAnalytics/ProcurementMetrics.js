import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import useGetInvAnalytic from "@/api/getInvAnalytic";
import { useEffect, useState } from "react";
import { DollarSign, Lightbulb, Zap, BarChart } from "lucide-react";
const ProcurementMetrics = () => {
    const { getInvProcurementMetrics, loadingForGetInvProcurementMetrics } = useGetInvAnalytic();
    useEffect(() => {
        const useGetInvAnalyticFunc = async () => {
            const response = await getInvProcurementMetrics();
            if (!response.success) {
                alert(response.message);
                return;
            }
            console.log(response);
            const iconMap = {
                DollarSign: _jsx(DollarSign, { className: "w-6 h-6 text-emerald-600" }),
                Lightbulb: _jsx(Lightbulb, { className: "w-6 h-6 text-blue-600" }),
                Zap: _jsx(Zap, { className: "w-6 h-6 text-purple-600" }),
                BarChart: _jsx(BarChart, { className: "w-6 h-6 text-amber-600" }),
            };
            const formattedData = response.data.map((item) => ({
                ...item,
                icon: iconMap[item.icon] || (_jsx(BarChart, { className: "w-6 h-6 text-gray-500" })),
            }));
            setStatCards(formattedData);
        };
        useGetInvAnalyticFunc();
    }, []);
    const [statCards, setStatCards] = useState([]);
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };
    const stats = {
        totalOrders: 347,
        pendingOrders: 45,
        approvedOrders: 289,
        receivedOrders: 267,
        totalValue: 3100000,
    };
    // const statCards: StatCard[] = [
    //   {
    //     title: "Monthly Revenue Impact",
    //     value: formatCurrency(stats.totalValue * 0.85),
    //     change: "+18% cost savings achieved",
    //     changeType: "positive",
    //     iconBg: "bg-emerald-100",
    //     icon: (
    //       <svg
    //         className="w-6 h-6 text-emerald-600"
    //         fill="none"
    //         stroke="currentColor"
    //         viewBox="0 0 24 24"
    //       >
    //         <path
    //           strokeLinecap="round"
    //           strokeLinejoin="round"
    //           strokeWidth={2}
    //           d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
    //         />
    //       </svg>
    //     ),
    //   },
    //   {
    //     title: "Smart Procurement Score",
    //     value: Math.round((stats.approvedOrders / stats.totalOrders) * 100) + "%",
    //     change: "+12% efficiency boost",
    //     changeType: "positive",
    //     iconBg: "bg-blue-100",
    //     icon: (
    //       <svg
    //         className="w-6 h-6 text-blue-600"
    //         fill="none"
    //         stroke="currentColor"
    //         viewBox="0 0 24 24"
    //       >
    //         <path
    //           strokeLinecap="round"
    //           strokeLinejoin="round"
    //           strokeWidth={2}
    //           d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    //         />
    //       </svg>
    //     ),
    //   },
    //   {
    //     title: "Vendor Performance",
    //     value:
    //       Math.round((stats.receivedOrders / stats.approvedOrders) * 100) + "%",
    //     change: "+8% delivery reliability",
    //     changeType: "positive",
    //     iconBg: "bg-purple-100",
    //     icon: (
    //       <svg
    //         className="w-6 h-6 text-purple-600"
    //         fill="none"
    //         stroke="currentColor"
    //         viewBox="0 0 24 24"
    //       >
    //         <path
    //           strokeLinecap="round"
    //           strokeLinejoin="round"
    //           strokeWidth={2}
    //           d="M13 10V3L4 14h7v7l9-11h-7z"
    //         />
    //       </svg>
    //     ),
    //   },
    //   {
    //     title: "Cost Optimization",
    //     value: formatCurrency(stats.totalValue * 0.15),
    //     change: "22% below budget target",
    //     changeType: "positive",
    //     iconBg: "bg-amber-100",
    //     icon: (
    //       <svg
    //         className="w-6 h-6 text-amber-600"
    //         fill="none"
    //         stroke="currentColor"
    //         viewBox="0 0 24 24"
    //       >
    //         <path
    //           strokeLinecap="round"
    //           strokeLinejoin="round"
    //           strokeWidth={2}
    //           d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    //         />
    //       </svg>
    //     ),
    //   },
    // ];
    return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: statCards.map((stat, index) => (_jsxs("div", { className: "relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 hover:shadow-3xl hover:-translate-y-3 hover:scale-105 transition-all duration-700 group overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-heritage-green/10 via-emerald-50/40 to-heritage-green/5 rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" }), _jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-heritage-green/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" }), _jsx("div", { className: "absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-100/30 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000" }), _jsx("div", { className: "absolute top-4 left-4 w-2 h-2 bg-heritage-green/30 rounded-full animate-ping" }), _jsx("div", { className: "absolute bottom-4 right-4 w-1 h-1 bg-emerald-400/40 rounded-full animate-ping delay-500" }), _jsxs("div", { className: "relative flex items-start justify-between", children: [_jsxs("div", { className: "flex-1 mr-4", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-3", children: [_jsx("div", { className: "w-1 h-6 bg-gradient-to-b from-heritage-green to-emerald-600 rounded-full" }), _jsx("p", { className: "text-sm font-bold text-gray-700 uppercase tracking-wider", children: stat.title })] }), _jsx("p", { className: "text-4xl font-black text-heritage-green drop-shadow-sm mb-3 group-hover:scale-105 transition-transform duration-500", children: stat.value }), _jsxs("div", { className: `inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${stat.changeType === "positive"
                                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                        : stat.changeType === "negative"
                                            ? "bg-red-100 text-red-800 border border-red-200"
                                            : "bg-gray-100 text-gray-800 border border-gray-200"}`, children: [_jsx("svg", { className: "w-3 h-3 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 17l9.2-9.2M17 17V7H7" }) }), stat.change] })] }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: `w-20 h-20 ${stat.iconBg} rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`, children: stat.icon }), _jsx("div", { className: "absolute -inset-2 bg-gradient-to-r from-heritage-green/30 to-emerald-400/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500" }), _jsx("div", { className: "absolute top-0 right-0 w-3 h-3 bg-heritage-green rounded-full animate-pulse" })] })] })] }, index))) }));
};
export default ProcurementMetrics;
