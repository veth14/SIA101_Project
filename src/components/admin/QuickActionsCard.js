import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
const QuickActionsCard = () => {
    const actions = [
        {
            id: 'walkin',
            title: 'Walk-in Booking',
            description: 'Create new reservation',
            icon: '🚶‍♂️',
            bgColor: 'bg-gradient-to-br from-heritage-green/10 to-emerald-50',
            iconBg: 'bg-heritage-green',
            to: '/admin/frontdesk'
        },
        {
            id: 'checkin',
            title: 'Quick Check-in',
            description: 'Process guest arrival',
            icon: '🏨',
            bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
            iconBg: 'bg-blue-500',
            to: '/admin/frontdesk'
        },
        {
            id: 'rooms',
            title: 'Room Status',
            description: 'View room availability',
            icon: '🛏️',
            bgColor: 'bg-gradient-to-br from-purple-50 to-violet-50',
            iconBg: 'bg-purple-500',
            to: '/admin/rooms'
        }
    ];
    return (_jsxs("div", { className: "bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 h-full min-h-[400px]", children: [_jsxs("div", { className: "flex items-center space-x-4 mb-8", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl", children: _jsx("svg", { className: "w-6 h-6 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }) }), _jsx("div", { className: "absolute -inset-1 bg-gradient-to-r from-heritage-green to-emerald-400 rounded-2xl blur opacity-30" })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-black text-gray-900", children: "Quick Actions" }), _jsx("p", { className: "text-sm text-gray-500 font-medium", children: "Streamline your workflow" })] })] }), _jsx("div", { className: "space-y-4", children: actions.map((action, index) => (_jsxs(Link, { to: action.to, className: "group relative flex items-center p-5 rounded-2xl border-2 border-gray-100 hover:border-heritage-green/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1", style: { animationDelay: `${index * 100}ms` }, children: [_jsx("div", { className: `absolute inset-0 ${action.bgColor} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300` }), _jsxs("div", { className: "relative flex items-center space-x-4 w-full", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: `w-14 h-14 ${action.iconBg} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`, children: _jsx("span", { className: "text-white text-2xl", children: action.icon }) }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h4", { className: "font-bold text-gray-900 group-hover:text-heritage-green transition-colors text-base mb-1", children: action.title }), _jsx("p", { className: "text-sm text-gray-500 group-hover:text-gray-600 transition-colors", children: action.description })] }), _jsx("div", { className: "flex-shrink-0", children: _jsx("svg", { className: "w-5 h-5 text-gray-400 group-hover:text-heritage-green group-hover:translate-x-1 transition-all duration-300", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z", clipRule: "evenodd" }) }) })] })] }, action.id))) })] }));
};
export default QuickActionsCard;
