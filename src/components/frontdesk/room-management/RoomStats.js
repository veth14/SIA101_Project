import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Statistics component for Room Management dashboard
 */
const RoomStats = ({ roomStats, loading = false }) => {
    const stats = [
        {
            title: 'Total Rooms',
            value: loading ? '...' : roomStats.totalRooms.toString(),
            change: 'Hotel capacity',
            changeType: 'neutral',
            iconBg: 'bg-blue-100',
            icon: (_jsxs("svg", { className: "w-6 h-6 text-blue-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" }), _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" }), _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 11h8" }), _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 15h8" })] }))
        },
        {
            title: 'Available Rooms',
            value: loading ? '...' : roomStats.availableRooms.toString(),
            change: `${100 - roomStats.occupancyRate}% available`,
            changeType: 'positive',
            iconBg: 'bg-green-100',
            icon: (_jsx("svg", { className: "w-6 h-6 text-green-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }) }))
        },
        {
            title: 'Occupied Rooms',
            value: loading ? '...' : roomStats.occupiedRooms.toString(),
            change: `${roomStats.occupancyRate}% occupancy rate`,
            changeType: roomStats.occupancyRate > 70 ? 'positive' : 'neutral',
            iconBg: 'bg-orange-100',
            icon: (_jsx("svg", { className: "w-6 h-6 text-orange-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" }) }))
        },
        {
            title: 'Under Maintenance',
            value: loading ? '...' : roomStats.maintenanceRooms.toString(),
            change: roomStats.maintenanceRooms === 0 ? 'All rooms operational' : 'Needs attention',
            changeType: roomStats.maintenanceRooms === 0 ? 'positive' : 'negative',
            iconBg: 'bg-red-100',
            icon: (_jsxs("svg", { className: "w-6 h-6 text-red-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" }), _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" })] }))
        },
        {
            title: 'Cleaning Rooms',
            value: loading ? '...' : roomStats.cleaningRooms.toString(),
            change: roomStats.cleaningRooms > 0 ? 'Housekeeping active' : 'All clean',
            changeType: 'neutral',
            iconBg: 'bg-sky-100',
            icon: (_jsx("svg", { className: "w-6 h-6 text-sky-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" }) }))
        }
    ];
    return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8", children: stats.map((stat, index) => (_jsxs("div", { className: "relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 hover:shadow-3xl hover:-translate-y-3 hover:scale-105 transition-all duration-700 group overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-heritage-green/10 via-emerald-50/40 to-heritage-green/5 rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" }), _jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-heritage-green/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" }), _jsx("div", { className: "absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-100/30 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000" }), _jsx("div", { className: "absolute top-4 left-4 w-2 h-2 bg-heritage-green/30 rounded-full animate-ping" }), _jsx("div", { className: "absolute bottom-4 right-4 w-1 h-1 bg-emerald-400/40 rounded-full animate-ping delay-500" }), _jsxs("div", { className: "relative flex items-start justify-between", children: [_jsxs("div", { className: "flex-1 mr-4", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-3", children: [_jsx("div", { className: "w-1 h-6 bg-gradient-to-b from-heritage-green to-emerald-600 rounded-full" }), _jsx("p", { className: "text-sm font-bold text-gray-700 uppercase tracking-wider", children: stat.title })] }), _jsx("p", { className: "text-4xl font-black text-heritage-green drop-shadow-sm mb-3 group-hover:scale-105 transition-transform duration-500", children: stat.value }), _jsxs("div", { className: `inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${stat.changeType === 'positive'
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                        : stat.changeType === 'negative'
                                            ? 'bg-red-100 text-red-800 border border-red-200'
                                            : 'bg-gray-100 text-gray-800 border border-gray-200'}`, children: [_jsx("svg", { className: "w-3 h-3 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 17l9.2-9.2M17 17V7H7" }) }), stat.change] })] }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: `w-20 h-20 ${stat.iconBg} rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`, children: stat.icon }), _jsx("div", { className: "absolute -inset-2 bg-gradient-to-r from-heritage-green/30 to-emerald-400/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500" }), _jsx("div", { className: "absolute top-0 right-0 w-3 h-3 bg-heritage-green rounded-full animate-pulse" })] })] })] }, index))) }));
};
export default RoomStats;
