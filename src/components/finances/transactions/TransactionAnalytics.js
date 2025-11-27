import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// Recharts JSX typing aliases to avoid strict return-type JSX errors
const RResponsiveContainer = ResponsiveContainer;
const RAreaChart = AreaChart;
const RXAxis = XAxis;
const RYAxis = YAxis;
const RCartesianGrid = CartesianGrid;
const RTooltip = Tooltip;
const RArea = Area;
// Sample transaction data for the chart
const getTransactionData = (timeframe) => {
    const weeklyData = [
        { day: 'Monday', transactions: 15254 },
        { day: 'Tuesday', transactions: 8254 },
        { day: 'Wednesday', transactions: 18254 },
        { day: 'Thursday', transactions: 3254 },
        { day: 'Friday', transactions: 25000 },
        { day: 'Saturday', transactions: 12000 },
        { day: 'Sunday', transactions: 16000 }
    ];
    const monthlyData = [
        { day: 'Week 1', transactions: 85000 },
        { day: 'Week 2', transactions: 92000 },
        { day: 'Week 3', transactions: 78000 },
        { day: 'Week 4', transactions: 95000 }
    ];
    const yearlyData = [
        { day: 'Q1', transactions: 250000 },
        { day: 'Q2', transactions: 280000 },
        { day: 'Q3', transactions: 320000 },
        { day: 'Q4', transactions: 290000 }
    ];
    switch (timeframe) {
        case 'monthly': return monthlyData;
        case 'yearly': return yearlyData;
        default: return weeklyData;
    }
};
const calculateChartMetrics = (data) => {
    const total = data.reduce((sum, item) => sum + item.transactions, 0);
    const average = Math.round(total / data.length);
    const max = Math.max(...data.map(item => item.transactions));
    const maxDay = data.find(item => item.transactions === max)?.day || '';
    return {
        totalTransactions: total,
        averageTransactions: average,
        maxTransactions: max,
        maxDay: maxDay,
        projectedTransactions: Math.round(total * 1.08)
    };
};
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
    }).format(amount);
};
const formatShortCurrency = (amount) => {
    if (amount >= 1000000) {
        return `₱${(amount / 1000000).toFixed(1)}M`;
    }
    else if (amount >= 1000) {
        return `₱${(amount / 1000).toFixed(0)}K`;
    }
    return `₱${amount}`;
};
// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (_jsxs("div", { className: "bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-4 min-w-[200px]", children: [_jsx("p", { className: "mb-2 font-medium text-gray-900", children: label }), payload.map((entry, index) => (_jsxs("div", { className: "flex items-center justify-between gap-4 mb-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: entry.color } }), _jsx("span", { className: "text-sm text-gray-600 capitalize", children: entry.dataKey })] }), _jsx("span", { className: "text-sm font-medium text-gray-900", children: formatCurrency(entry.value) })] }, `tooltip-${String(index)}`)))] }));
    }
    return null;
};
const TransactionAnalytics = ({ filters, onFiltersChange, isLoading }) => {
    const [activeTimeframe, setActiveTimeframe] = useState('weekly');
    // Get data and metrics
    const transactionData = useMemo(() => getTransactionData(activeTimeframe), [activeTimeframe]);
    const metrics = useMemo(() => calculateChartMetrics(transactionData), [transactionData]);
    // Transform data for recharts
    const chartData = transactionData.map((item) => ({
        day: item.day,
        transactions: item.transactions
    }));
    return (_jsxs(_Fragment, { children: [_jsx("style", { children: `
        @keyframes slide-in-up {
          0% {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-slide-in-up {
          animation: slide-in-up 0.8s ease-out;
        }
      ` }), _jsxs("div", { className: "relative overflow-hidden shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60 animate-slide-in-up", children: [_jsx("div", { className: "absolute inset-0 transition-opacity duration-700 bg-gradient-to-br from-heritage-green/8 via-heritage-light/30 to-heritage-green/5 rounded-3xl opacity-60 group-hover:opacity-100" }), _jsxs("div", { className: "relative z-10", children: [_jsx("div", { className: "px-8 border-b py-7 bg-gradient-to-r from-white via-slate-50/80 to-white border-gray-200/30", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-5", children: [_jsxs("div", { className: "relative group", children: [_jsx("div", { className: "p-2 bg-[#82A33D]/10 rounded-xl", children: _jsx("svg", { className: "w-6 h-6 text-[#82A33D]", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 17v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V7a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2" }) }) }), _jsx("div", { className: "absolute transition-opacity duration-300 -inset-2 bg-gradient-to-r from-heritage-green/20 to-heritage-neutral/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-100" })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-black text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text", children: "Transaction Analytics" }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsx("p", { className: "text-sm font-semibold text-gray-600", children: "Performance Metrics" }), _jsx("div", { className: "w-1 h-1 rounded-full bg-heritage-green" }), _jsx("span", { className: "text-sm font-bold text-heritage-green", children: "October 2024" })] })] })] }), _jsx("div", { className: "flex space-x-4", children: _jsxs("div", { className: "flex p-1.5 bg-gradient-to-r from-heritage-light/40 to-heritage-light/60 rounded-2xl shadow-inner backdrop-blur-sm border border-heritage-light/30", children: [_jsx("button", { className: `px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${activeTimeframe === 'weekly'
                                                            ? 'text-white bg-gradient-to-r from-heritage-green to-heritage-neutral shadow-lg transform scale-105'
                                                            : 'text-gray-700 hover:text-heritage-green hover:bg-white/50'}`, onClick: () => setActiveTimeframe('weekly'), children: "Weekly" }), _jsx("button", { className: `px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${activeTimeframe === 'monthly'
                                                            ? 'text-white bg-gradient-to-r from-heritage-green to-heritage-neutral shadow-lg transform scale-105'
                                                            : 'text-gray-700 hover:text-heritage-green hover:bg-white/50'}`, onClick: () => setActiveTimeframe('monthly'), children: "Monthly" }), _jsx("button", { className: `px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${activeTimeframe === 'yearly'
                                                            ? 'text-white bg-gradient-to-r from-heritage-green to-heritage-neutral shadow-lg transform scale-105'
                                                            : 'text-gray-700 hover:text-heritage-green hover:bg-white/50'}`, onClick: () => setActiveTimeframe('yearly'), children: "Yearly" })] }) })] }) }), _jsx("div", { className: "px-8 py-4 border-b bg-gradient-to-r from-heritage-light/20 to-heritage-light/30 border-gray-200/30", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { className: "text-sm font-semibold text-gray-600", children: "Filters:" }), _jsxs("select", { value: filters.status, onChange: (e) => onFiltersChange({ ...filters, status: e.target.value }), className: "px-4 py-2 text-sm font-bold border outline-none cursor-pointer rounded-xl bg-white/80 text-heritage-green border-heritage-neutral/30", children: [_jsx("option", { value: "all", children: "All Status" }), _jsx("option", { value: "completed", children: "Completed" }), _jsx("option", { value: "pending", children: "Pending" }), _jsx("option", { value: "failed", children: "Failed" })] }), _jsxs("select", { value: filters.category, onChange: (e) => onFiltersChange({ ...filters, category: e.target.value }), className: "px-4 py-2 text-sm font-bold border outline-none cursor-pointer rounded-xl bg-white/80 text-heritage-green border-heritage-neutral/30", children: [_jsx("option", { value: "all", children: "All Categories" }), _jsx("option", { value: "booking", children: "Booking" }), _jsx("option", { value: "service", children: "Service" }), _jsx("option", { value: "food", children: "Food & Beverage" }), _jsx("option", { value: "event", children: "Events" })] })] }) }), _jsxs("div", { className: "px-4 py-6", children: [_jsx("div", { className: "h-[320px] w-full", children: _jsx(RResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(RAreaChart, { data: chartData, margin: { top: 20, right: 40, left: 10, bottom: 40 }, children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "colorTransactions", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#82A33D", stopOpacity: 0.8 }), _jsx("stop", { offset: "95%", stopColor: "#ABAD8A", stopOpacity: 0.1 })] }) }), _jsx(RXAxis, { dataKey: "day", tick: { fill: '#82A33D', fontSize: 11 }, axisLine: { stroke: '#82A33D', strokeWidth: 1 }, tickLine: false, interval: "preserveStartEnd", height: 40, padding: { left: 20, right: 20 } }), _jsx(RYAxis, { tickFormatter: formatShortCurrency, tick: { fill: '#82A33D', fontSize: 12 }, axisLine: false, tickLine: false }), _jsx(RCartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#ABAD8A" }), _jsx(RTooltip, { content: _jsx(CustomTooltip, {}) }), _jsx(RArea, { type: "linear", dataKey: "transactions", stroke: "#82A33D", fillOpacity: 1, fill: "url(#colorTransactions)", strokeWidth: 3, connectNulls: true, dot: false, activeDot: {
                                                            r: 6,
                                                            stroke: '#ABAD8A',
                                                            strokeWidth: 2,
                                                            fill: 'white'
                                                        } })] }) }) }), _jsx("div", { className: "flex items-center justify-center pb-2 mt-2", children: _jsxs("div", { className: "flex items-center gap-2 text-xs text-gray-600", children: [_jsx("div", { className: "w-3 h-0.5 bg-heritage-green rounded" }), _jsx("span", { children: "Daily Transactions" })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 gap-4 px-8 py-6 sm:grid-cols-2 md:grid-cols-4", children: [_jsxs("div", { className: "p-4 border shadow-sm bg-white/80 rounded-xl border-heritage-light", children: [_jsx("div", { className: "text-sm font-medium text-gray-500", children: "Total Volume" }), _jsx("div", { className: "text-2xl font-bold text-heritage-green", children: formatCurrency(metrics?.totalTransactions || 98016) }), _jsxs("div", { className: "flex items-center gap-1 mt-1 text-xs font-medium text-emerald-600", children: [_jsx("svg", { className: "w-3 h-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 10l7-7m0 0l7 7m-7-7v18" }) }), _jsx("span", { children: "12.5%" })] })] }), _jsxs("div", { className: "p-4 border shadow-sm bg-white/80 rounded-xl border-heritage-light", children: [_jsx("div", { className: "text-sm font-medium text-gray-500", children: "Average" }), _jsx("div", { className: "text-2xl font-bold text-heritage-green", children: formatCurrency(metrics?.averageTransactions || 14002) }), _jsx("div", { className: "text-xs text-gray-500", children: "Per day" })] }), _jsxs("div", { className: "p-4 border shadow-sm bg-white/80 rounded-xl border-heritage-light", children: [_jsx("div", { className: "text-sm font-medium text-gray-500", children: "Highest Day" }), _jsx("div", { className: "text-2xl font-bold text-heritage-green", children: formatCurrency(metrics?.maxTransactions || 25000) }), _jsx("div", { className: "text-xs text-gray-500", children: metrics?.maxDay || "Friday" })] }), _jsxs("div", { className: "p-4 border shadow-sm bg-white/80 rounded-xl border-heritage-light", children: [_jsx("div", { className: "text-sm font-medium text-gray-500", children: "Projected" }), _jsx("div", { className: "text-2xl font-bold text-heritage-green", children: formatCurrency(metrics?.projectedTransactions || 105857) }), _jsx("div", { className: "text-xs text-gray-500", children: "Next week" })] })] })] })] })] }));
};
export default TransactionAnalytics;
