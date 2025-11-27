import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Statistics component for Lost & Found dashboard
 *
 * @param stats - Statistics data containing counts for different item statuses
 */
const LostFoundStats = ({ stats }) => {
    const statsCards = [
        {
            title: 'Total Lost & Found Items',
            value: stats.all.toString(),
            change: '+12% from last month',
            changeType: 'positive',
            iconBg: 'bg-blue-100',
            icon: (_jsx("svg", { className: "w-6 h-6 text-blue-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" }) }))
        },
        {
            title: 'Unclaimed Items',
            value: stats.unclaimed.toString(),
            change: '+3% from last month',
            changeType: 'positive',
            iconBg: 'bg-yellow-100',
            icon: (_jsx("svg", { className: "w-6 h-6 text-yellow-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }))
        },
        {
            title: 'Successfully Claimed',
            value: stats.claimed.toString(),
            change: '+8% from last month',
            changeType: 'positive',
            iconBg: 'bg-green-100',
            icon: (_jsx("svg", { className: "w-6 h-6 text-green-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }) }))
        },
        {
            title: 'Disposed Items',
            value: stats.disposed.toString(),
            change: '2% from last month',
            changeType: 'negative',
            iconBg: 'bg-red-100',
            icon: (_jsx("svg", { className: "w-6 h-6 text-red-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }))
        }
    ];
    return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: statsCards.map((stat, index) => (_jsxs("div", { className: "relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 hover:shadow-3xl hover:-translate-y-3 hover:scale-105 transition-all duration-700 group overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-heritage-green/10 via-emerald-50/40 to-heritage-green/5 rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" }), _jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-heritage-green/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" }), _jsx("div", { className: "absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-100/30 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000" }), _jsx("div", { className: "absolute top-4 left-4 w-2 h-2 bg-heritage-green/30 rounded-full animate-ping" }), _jsx("div", { className: "absolute bottom-4 right-4 w-1 h-1 bg-emerald-400/40 rounded-full animate-ping delay-500" }), _jsxs("div", { className: "relative flex items-start justify-between", children: [_jsxs("div", { className: "flex-1 mr-4", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-3", children: [_jsx("div", { className: "w-1 h-6 bg-gradient-to-b from-heritage-green to-emerald-600 rounded-full" }), _jsx("p", { className: "text-sm font-bold text-gray-700 uppercase tracking-wider", children: stat.title })] }), _jsx("p", { className: "text-4xl font-black text-heritage-green drop-shadow-sm mb-3 group-hover:scale-105 transition-transform duration-500", children: stat.value }), _jsxs("div", { className: `inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${stat.changeType === 'positive'
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                        : stat.changeType === 'negative'
                                            ? 'bg-red-100 text-red-800 border border-red-200'
                                            : 'bg-gray-100 text-gray-800 border border-gray-200'}`, children: [_jsx("svg", { className: "w-3 h-3 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 17l9.2-9.2M17 17V7H7" }) }), stat.change] })] }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: `w-20 h-20 ${stat.iconBg} rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`, children: stat.icon }), _jsx("div", { className: "absolute -inset-2 bg-gradient-to-r from-heritage-green/30 to-emerald-400/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500" }), _jsx("div", { className: "absolute top-0 right-0 w-3 h-3 bg-heritage-green rounded-full animate-pulse" })] })] })] }, index))) }));
};
export default LostFoundStats;
