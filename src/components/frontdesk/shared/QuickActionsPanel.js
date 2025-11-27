import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const QuickActionsPanel = ({ onWalkInBooking, onRoomStatus, onGuestServices }) => {
    const actions = [
        {
            id: 'walkin',
            title: 'New Walk-in',
            description: 'Register walk-in guest',
            icon: '🚶‍♂️',
            bgColor: 'bg-gradient-to-br from-heritage-green/10 to-emerald-50',
            iconBg: 'bg-heritage-green',
            onClick: onWalkInBooking
        },
        {
            id: 'rooms',
            title: 'Room Management',
            description: 'Check room availability',
            icon: '🛏️',
            bgColor: 'bg-gradient-to-br from-purple-50 to-violet-50',
            iconBg: 'bg-purple-500',
            onClick: onRoomStatus
        },
        {
            id: 'services',
            title: 'Guest Assistance',
            description: 'Handle guest requests',
            icon: '🛎️',
            bgColor: 'bg-gradient-to-br from-orange-50 to-red-50',
            iconBg: 'bg-orange-500',
            onClick: onGuestServices
        }
    ];
    return (_jsxs("div", { className: "bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-full flex flex-col", children: [_jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: "flex items-center space-x-3 mb-2", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-heritage-green to-heritage-neutral rounded-xl flex items-center justify-center shadow-md", children: _jsx("svg", { className: "w-5 h-5 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }) }), _jsx("h3", { className: "text-lg font-bold text-gray-900", children: "Quick Actions" })] }), _jsx("p", { className: "text-sm text-gray-500 ml-13", children: "Essential front desk operations" })] }), _jsx("div", { className: "flex-1 space-y-3", children: actions.map((action) => (_jsx("button", { onClick: action.onClick, className: "group w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 hover:border-heritage-green/40 transition-all duration-200 text-left", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: `w-12 h-12 ${action.iconBg} rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200 flex-shrink-0`, children: _jsx("span", { className: "text-white text-xl", children: action.icon }) }), _jsx("div", { className: "flex-1 min-w-0", children: _jsxs("div", { className: "flex flex-col", children: [_jsx("h4", { className: "font-semibold text-gray-900 group-hover:text-heritage-green transition-colors text-base leading-tight", children: action.title }), _jsx("p", { className: "text-sm text-gray-600 mt-1 leading-relaxed", children: action.description })] }) }), _jsx("div", { className: "flex-shrink-0", children: _jsx("svg", { className: "w-5 h-5 text-gray-400 group-hover:text-heritage-green transition-colors duration-200", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z", clipRule: "evenodd" }) }) })] }) }, action.id))) })] }));
};
export default QuickActionsPanel;
