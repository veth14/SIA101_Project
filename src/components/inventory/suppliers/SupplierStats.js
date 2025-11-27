import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const SupplierStats = ({ stats, formatCurrency }) => {
    // Calculate percentages for change display
    const activePercentage = stats.totalSuppliers > 0
        ? Math.round((stats.activeSuppliers / stats.totalSuppliers) * 100)
        : 0;
    const inactivePercentage = stats.totalSuppliers > 0
        ? Math.round((stats.inactiveSuppliers / stats.totalSuppliers) * 100)
        : 0;
    const suspendedPercentage = stats.totalSuppliers > 0
        ? Math.round((stats.suspendedSuppliers / stats.totalSuppliers) * 100)
        : 0;
    const statCards = [
        {
            title: 'Total Suppliers',
            value: stats.totalSuppliers.toString(),
            change: `${stats.totalSuppliers} supplier${stats.totalSuppliers !== 1 ? 's' : ''} registered`,
            changeType: stats.totalSuppliers > 0 ? 'positive' : 'neutral',
            iconBg: 'bg-blue-100',
            icon: (_jsx("svg", { className: "w-6 h-6 text-blue-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" }) }))
        },
        {
            title: 'Active Suppliers',
            value: stats.activeSuppliers.toString(),
            change: `${activePercentage}% of total suppliers`,
            changeType: activePercentage >= 70 ? 'positive' : activePercentage >= 40 ? 'neutral' : 'negative',
            iconBg: 'bg-green-100',
            icon: (_jsx("svg", { className: "w-6 h-6 text-green-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }) }))
        },
        {
            title: 'Inactive Suppliers',
            value: stats.inactiveSuppliers.toString(),
            change: `${inactivePercentage}% of total suppliers`,
            changeType: inactivePercentage === 0 ? 'positive' : inactivePercentage < 30 ? 'neutral' : 'negative',
            iconBg: 'bg-yellow-100',
            icon: (_jsx("svg", { className: "w-6 h-6 text-yellow-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" }) }))
        },
        {
            title: 'Total Supplier Value',
            value: formatCurrency(stats.totalValue),
            change: `from ${stats.totalSuppliers} active partnerships`,
            changeType: stats.totalValue > 0 ? 'positive' : 'neutral',
            iconBg: 'bg-purple-100',
            icon: (_jsx("svg", { className: "w-6 h-6 text-purple-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" }) }))
        }
    ];
    return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: statCards.map((stat, index) => (_jsxs("div", { className: "relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 hover:shadow-3xl hover:-translate-y-3 hover:scale-105 transition-all duration-700 group overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-heritage-green/10 via-emerald-50/40 to-heritage-green/5 rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" }), _jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-heritage-green/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" }), _jsx("div", { className: "absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-100/30 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000" }), _jsx("div", { className: "absolute top-4 left-4 w-2 h-2 bg-heritage-green/30 rounded-full animate-ping" }), _jsx("div", { className: "absolute bottom-4 right-4 w-1 h-1 bg-emerald-400/40 rounded-full animate-ping delay-500" }), _jsxs("div", { className: "relative flex items-start justify-between", children: [_jsxs("div", { className: "flex-1 mr-4", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-3", children: [_jsx("div", { className: "w-1 h-6 bg-gradient-to-b from-heritage-green to-emerald-600 rounded-full" }), _jsx("p", { className: "text-sm font-bold text-gray-700 uppercase tracking-wider", children: stat.title })] }), _jsx("p", { className: "text-4xl font-black text-heritage-green drop-shadow-sm mb-3 group-hover:scale-105 transition-transform duration-500", children: stat.value }), _jsxs("div", { className: `inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${stat.changeType === 'positive'
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                        : stat.changeType === 'negative'
                                            ? 'bg-red-100 text-red-800 border border-red-200'
                                            : 'bg-gray-100 text-gray-800 border border-gray-200'}`, children: [stat.changeType === 'positive' && (_jsx("svg", { className: "w-3 h-3 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 10l7-7m0 0l7 7m-7-7v18" }) })), stat.changeType === 'negative' && (_jsx("svg", { className: "w-3 h-3 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 14l-7 7m0 0l-7-7m7 7V3" }) })), stat.change] })] }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: `w-20 h-20 ${stat.iconBg} rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`, children: stat.icon }), _jsx("div", { className: "absolute -inset-2 bg-gradient-to-r from-heritage-green/30 to-emerald-400/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500" }), _jsx("div", { className: "absolute top-0 right-0 w-3 h-3 bg-heritage-green rounded-full animate-pulse" })] })] })] }, index))) }));
};
