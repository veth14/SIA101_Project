import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const GuestServicesNavigation = ({ activeTab, onTabChange }) => {
    const tabs = [
        {
            id: 'feedback',
            label: 'Guest Feedback',
            description: 'Reviews & responses',
            icon: (_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" }) })),
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
            borderColor: 'border-blue-200'
        },
        {
            id: 'loyalty',
            label: 'Loyalty Program',
            description: 'Member management',
            icon: (_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" }) })),
            color: 'from-amber-500 to-yellow-600',
            bgColor: 'bg-amber-50',
            textColor: 'text-amber-600',
            borderColor: 'border-amber-200'
        },
        {
            id: 'assistance',
            label: 'Guest Assistance',
            description: 'Support requests',
            icon: (_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" }) })),
            color: 'from-emerald-500 to-green-600',
            bgColor: 'bg-emerald-50',
            textColor: 'text-emerald-600',
            borderColor: 'border-emerald-200'
        }
    ];
    return (_jsxs("div", { className: "bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden", children: [_jsxs("div", { className: "relative bg-gradient-to-br from-white via-green-50/20 to-green-500/5 border-b border-green-500/10", children: [_jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-green-500/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" }), _jsx("div", { className: "absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-green-100/10 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000" }), _jsx("div", { className: "relative p-8", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "relative group", children: [_jsx("div", { className: "w-14 h-14 bg-gradient-to-br from-[#82A33D] to-[#6d8a33] rounded-2xl flex items-center justify-center shadow-xl border border-[#82A33D]/30 group-hover:scale-110 transition-all duration-500", children: _jsx("svg", { className: "w-7 h-7 text-white drop-shadow-lg", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" }) }) }), _jsx("div", { className: "absolute -inset-1 bg-gradient-to-r from-[#82A33D] to-green-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500" })] }), _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-[#82A33D] mb-1", children: "Guest Experience Management" }), _jsx("p", { className: "text-gray-600 font-medium", children: "Comprehensive guest service operations" })] })] }) })] }), _jsx("div", { className: "p-6", children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: tabs.map((tab) => (_jsxs("button", { onClick: () => onTabChange(tab.id), className: `relative group p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${activeTab === tab.id
                            ? `${tab.bgColor} ${tab.borderColor} shadow-lg scale-105`
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`, children: [activeTab === tab.id && (_jsx("div", { className: `absolute inset-0 bg-gradient-to-br ${tab.color} opacity-5 rounded-2xl` })), _jsxs("div", { className: "relative flex flex-col items-center text-center space-y-3", children: [_jsx("div", { className: `w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${activeTab === tab.id
                                            ? `bg-gradient-to-br ${tab.color} text-white shadow-lg`
                                            : 'bg-white text-gray-500 group-hover:text-gray-700 shadow-md'}`, children: tab.icon }), _jsxs("div", { children: [_jsx("h3", { className: `font-bold text-lg transition-colors ${activeTab === tab.id ? tab.textColor : 'text-gray-700 group-hover:text-gray-900'}`, children: tab.label }), _jsx("p", { className: `text-sm mt-1 transition-colors ${activeTab === tab.id ? tab.textColor + '/70' : 'text-gray-500 group-hover:text-gray-600'}`, children: tab.description })] }), activeTab === tab.id && (_jsx("div", { className: `w-8 h-1 bg-gradient-to-r ${tab.color} rounded-full` }))] })] }, tab.id))) }) })] }));
};
