import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PieChart } from 'lucide-react';
const RevenueDistribution = ({ revenueData }) => {
    const getSourceConfig = (source) => {
        switch (source) {
            case 'rooms':
                return {
                    name: 'Room Revenue',
                    gradient: 'from-blue-500 via-blue-600 to-blue-700',
                    shadowColor: 'shadow-blue-500/30',
                    glowColor: 'from-blue-400/20 to-blue-600/20',
                    dotColor: 'bg-blue-500'
                };
            case 'food_beverage':
                return {
                    name: 'Food & Beverage',
                    gradient: 'from-orange-500 via-orange-600 to-orange-700',
                    shadowColor: 'shadow-orange-500/30',
                    glowColor: 'from-orange-400/20 to-orange-600/20',
                    dotColor: 'bg-orange-500'
                };
            case 'other':
                return {
                    name: 'Other Services',
                    gradient: 'from-gray-500 via-gray-600 to-gray-700',
                    shadowColor: 'shadow-gray-500/30',
                    glowColor: 'from-gray-400/20 to-gray-600/20',
                    dotColor: 'bg-gray-500'
                };
            default:
                return {
                    name: 'Unknown',
                    gradient: 'from-heritage-green via-heritage-green to-heritage-neutral',
                    shadowColor: 'shadow-heritage-green/30',
                    glowColor: 'from-heritage-green/20 to-heritage-neutral/20',
                    dotColor: 'bg-heritage-green'
                };
        }
    };
    const totalAmount = revenueData.reduce((sum, item) => sum + item.amount, 0);
    return (_jsxs("div", { className: "overflow-hidden relative bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60 shadow-2xl animate-fade-in", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-heritage-neutral/5 via-white to-heritage-green/10 rounded-3xl opacity-60" }), _jsxs("div", { className: "relative z-10", children: [_jsx("div", { className: "px-8 py-7 border-b bg-gradient-to-r from-white via-slate-50/80 to-white border-gray-200/30", children: _jsxs("div", { className: "flex items-center space-x-5", children: [_jsxs("div", { className: "relative group", children: [_jsx("div", { className: "p-2 bg-[#82A33D]/10 rounded-xl", children: _jsx(PieChart, { className: "w-6 h-6 text-[#82A33D]" }) }), _jsx("div", { className: "absolute -inset-2 bg-gradient-to-r from-heritage-neutral/20 to-heritage-green/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300" })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent", children: "Revenue Distribution" }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsx("p", { className: "text-sm font-semibold text-gray-600", children: "Percentage Analysis" }), _jsx("div", { className: "w-1 h-1 bg-heritage-green rounded-full" }), _jsx("span", { className: "text-sm font-bold text-heritage-green", children: "100% Coverage" })] })] })] }) }), _jsx("div", { className: "p-8 space-y-6", children: revenueData.map((item, index) => {
                            const config = getSourceConfig(item.source);
                            return (_jsxs("div", { className: "group animate-fade-in", style: { animationDelay: `${index * 150}ms` }, children: [_jsxs("div", { className: "flex justify-between items-center mb-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: `w-3 h-3 ${config.dotColor} rounded-full shadow-lg ${config.shadowColor} ring-2 ring-white` }), _jsx("span", { className: "text-base font-bold text-gray-800", children: config.name })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("span", { className: "text-sm font-semibold text-gray-500", children: ["$", item.amount.toLocaleString()] }), _jsxs("span", { className: "text-base font-black text-gray-900 min-w-[50px] text-right", children: [item.percentage, "%"] })] })] }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-full h-6 shadow-inner overflow-hidden", children: _jsxs("div", { className: `h-full bg-gradient-to-r ${config.gradient} rounded-full transition-all duration-1000 ease-out relative group-hover:shadow-xl ${config.shadowColor}`, style: {
                                                        width: `${item.percentage}%`,
                                                        transitionDelay: `${index * 100}ms`
                                                    }, children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" }), item.percentage > 15 && (_jsx("div", { className: "absolute inset-0 flex items-center justify-end pr-3", children: _jsxs("span", { className: "text-xs font-bold text-white drop-shadow-lg", children: [item.percentage, "%"] }) }))] }) }), _jsx("div", { className: `absolute -inset-1 bg-gradient-to-r ${config.glowColor} rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10` })] }), _jsx("div", { className: "flex justify-end mt-2", children: _jsxs("span", { className: "text-xs text-gray-500 font-medium", children: [((item.amount / totalAmount) * 100).toFixed(2), "% contribution"] }) })] }, item.id));
                        }) }), _jsx("div", { className: "px-8 py-6 border-t bg-gradient-to-r from-heritage-light/20 via-white to-heritage-light/20 border-gray-200/30", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-gradient-to-br from-heritage-green to-heritage-green flex items-center justify-center shadow-lg", children: _jsx("span", { className: "text-white text-lg font-black", children: "\u03A3" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-gray-600", children: "Total Revenue" }), _jsx("p", { className: "text-xs text-gray-500", children: "All sources combined" })] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: "text-2xl font-black text-heritage-green", children: ["$", totalAmount.toLocaleString()] }), _jsx("p", { className: "text-xs text-gray-500 font-semibold", children: "100% Distribution" })] })] }) })] })] }));
};
export default RevenueDistribution;
