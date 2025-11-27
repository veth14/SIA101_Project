import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const GuestServicesStats = () => {
    const statCards = [
        {
            title: 'Guest Satisfaction Score',
            value: '4.8/5.0',
            change: '+0.3 from last month',
            changeType: 'positive',
            iconBg: 'bg-emerald-100',
            icon: (_jsx("svg", { className: "w-6 h-6 text-emerald-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }))
        },
        {
            title: 'Active Loyalty Members',
            value: '1,247',
            change: '+18% growth rate',
            changeType: 'positive',
            iconBg: 'bg-blue-100',
            icon: (_jsx("svg", { className: "w-6 h-6 text-blue-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" }) }))
        },
        {
            title: 'Assistance Requests',
            value: '23',
            change: 'Avg response: 8 min',
            changeType: 'positive',
            iconBg: 'bg-purple-100',
            icon: (_jsx("svg", { className: "w-6 h-6 text-purple-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" }) }))
        },
        {
            title: 'Feedback Responses',
            value: '89%',
            change: '+12% response rate',
            changeType: 'positive',
            iconBg: 'bg-amber-100',
            icon: (_jsx("svg", { className: "w-6 h-6 text-amber-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" }) }))
        }
    ];
    return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: statCards.map((stat, index) => (_jsxs("div", { className: "relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 hover:shadow-3xl hover:-translate-y-3 hover:scale-105 transition-all duration-700 group overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-heritage-green/10 via-emerald-50/40 to-heritage-green/5 rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" }), _jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-heritage-green/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" }), _jsx("div", { className: "absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-100/30 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000" }), _jsx("div", { className: "absolute top-4 left-4 w-2 h-2 bg-heritage-green/30 rounded-full animate-ping" }), _jsx("div", { className: "absolute bottom-4 right-4 w-1 h-1 bg-emerald-400/40 rounded-full animate-ping delay-500" }), _jsxs("div", { className: "relative flex items-start justify-between", children: [_jsxs("div", { className: "flex-1 mr-4", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-3", children: [_jsx("div", { className: "w-1 h-6 bg-gradient-to-b from-heritage-green to-emerald-600 rounded-full" }), _jsx("p", { className: "text-sm font-bold text-gray-700 uppercase tracking-wider", children: stat.title })] }), _jsx("p", { className: "text-4xl font-black text-heritage-green drop-shadow-sm mb-3 group-hover:scale-105 transition-transform duration-500", children: stat.value }), _jsxs("div", { className: `inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${stat.changeType === 'positive'
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                        : stat.changeType === 'negative'
                                            ? 'bg-red-100 text-red-800 border border-red-200'
                                            : 'bg-gray-100 text-gray-800 border border-gray-200'}`, children: [_jsx("svg", { className: "w-3 h-3 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 17l9.2-9.2M17 17V7H7" }) }), stat.change] })] }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: `w-20 h-20 ${stat.iconBg} rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`, children: stat.icon }), _jsx("div", { className: "absolute -inset-2 bg-gradient-to-r from-heritage-green/30 to-emerald-400/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500" }), _jsx("div", { className: "absolute top-0 right-0 w-3 h-3 bg-heritage-green rounded-full animate-pulse" })] })] })] }, index))) }));
};
