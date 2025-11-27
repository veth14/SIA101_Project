import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculatePayroll } from '../../../utils/philippineTaxCalculations';
const RResponsiveContainer = ResponsiveContainer;
const RBarChart = BarChart;
const RXAxis = XAxis;
const RYAxis = YAxis;
const RCartesianGrid = CartesianGrid;
const RBar = Bar;
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
    }).format(amount);
};
const PayrollInsights = ({ employees }) => {
    const topEmployees = useMemo(() => {
        if (!employees.length)
            return [];
        const mapped = employees.map((emp) => {
            const payroll = calculatePayroll(emp.basicPay, emp.allowance, emp.overtime, emp.overtimeRate);
            return {
                name: emp.name,
                netPay: payroll.netPay,
                department: emp.department,
            };
        });
        return mapped
            .sort((a, b) => b.netPay - a.netPay)
            .slice(0, 5);
    }, [employees]);
    if (!topEmployees.length)
        return null;
    const metrics = useMemo(() => {
        if (!topEmployees.length)
            return null;
        const totalTop = topEmployees.reduce((sum, emp) => sum + emp.netPay, 0);
        const averageTop = Math.round(totalTop / topEmployees.length);
        const top = topEmployees[0];
        return {
            totalTop,
            averageTop,
            topName: top.name,
            topNet: top.netPay,
        };
    }, [topEmployees]);
    return (_jsxs("div", { className: "relative overflow-hidden shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60 mt-6", children: [_jsx("div", { className: "absolute inset-0 transition-opacity duration-700 bg-gradient-to-br from-heritage-green/8 via-heritage-light/30 to-heritage-green/5 rounded-3xl opacity-60" }), _jsxs("div", { className: "relative z-10", children: [_jsx("div", { className: "px-6 py-5 border-b bg-gradient-to-r from-white via-slate-50/80 to-white border-gray-200/30 flex items-center justify-between", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-[#82A33D]/10 rounded-xl", children: _jsx("svg", { className: "w-6 h-6 text-[#82A33D]", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 17v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V7a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2" }) }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-black text-gray-900", children: "Top Paid Employees" }), _jsx("p", { className: "mt-1 text-xs font-medium text-gray-500 md:text-sm", children: "Based on current net pay for this period" })] })] }) }), _jsxs("div", { className: "px-4 pt-4 pb-6 w-full", children: [_jsx("div", { className: "h-[240px] w-full", children: _jsx(RResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(RBarChart, { data: topEmployees, layout: "vertical", margin: { top: 10, right: 40, left: 80, bottom: 10 }, children: [_jsx(RCartesianGrid, { strokeDasharray: "3 3", horizontal: false, stroke: "#E5E7EB" }), _jsx(RXAxis, { type: "number", tickFormatter: (v) => formatCurrency(v).replace('PHP', '₱') }), _jsx(RYAxis, { type: "category", dataKey: "name", width: 120, tick: { fill: '#374151', fontSize: 12 } }), _jsx(Tooltip, { formatter: (value) => formatCurrency(value), labelFormatter: (label) => `Employee: ${label}`, contentStyle: { borderRadius: 12, borderColor: '#D1D5DB' } }), _jsx(RBar, { dataKey: "netPay", radius: [4, 4, 4, 4], fill: "#82A33D" })] }) }) }), metrics && (_jsxs("div", { className: "grid grid-cols-1 gap-3 mt-4 text-sm text-gray-700 md:grid-cols-3", children: [_jsxs("div", { className: "p-3 bg-white/80 border border-gray-100 rounded-xl shadow-sm", children: [_jsxs("div", { className: "text-xs font-medium text-gray-500", children: ["Total Net Pay (Top ", topEmployees.length, ")"] }), _jsx("div", { className: "mt-1 text-lg font-bold text-[#82A33D]", children: formatCurrency(metrics.totalTop) })] }), _jsxs("div", { className: "p-3 bg-white/80 border border-gray-100 rounded-xl shadow-sm", children: [_jsxs("div", { className: "text-xs font-medium text-gray-500", children: ["Average Net Pay (Top ", topEmployees.length, ")"] }), _jsx("div", { className: "mt-1 text-lg font-bold text-[#82A33D]", children: formatCurrency(metrics.averageTop) })] }), _jsxs("div", { className: "p-3 bg-white/80 border border-gray-100 rounded-xl shadow-sm", children: [_jsx("div", { className: "text-xs font-medium text-gray-500", children: "Top Earner" }), _jsx("div", { className: "mt-1 text-sm font-semibold text-gray-900 truncate", children: metrics.topName }), _jsx("div", { className: "text-xs font-medium text-[#82A33D]", children: formatCurrency(metrics.topNet) })] })] }))] })] })] }));
};
export default PayrollInsights;
