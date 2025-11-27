import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const StaffCard = ({ name, email, position, department, age, gender, phone, status, initials, colorScheme }) => {
    const colorConfig = {
        blue: {
            gradient: 'from-blue-500 to-blue-600',
            bg: 'bg-blue-100',
            text: 'text-blue-800',
            border: 'border-blue-200/50'
        },
        purple: {
            gradient: 'from-purple-500 to-purple-600',
            bg: 'bg-purple-100',
            text: 'text-purple-800',
            border: 'border-purple-200/50'
        },
        emerald: {
            gradient: 'from-emerald-500 to-emerald-600',
            bg: 'bg-emerald-100',
            text: 'text-emerald-800',
            border: 'border-emerald-200/50'
        },
        pink: {
            gradient: 'from-pink-500 to-pink-600',
            bg: 'bg-pink-100',
            text: 'text-pink-800',
            border: 'border-pink-200/50'
        },
        amber: {
            gradient: 'from-amber-500 to-amber-600',
            bg: 'bg-amber-100',
            text: 'text-amber-800',
            border: 'border-amber-200/50'
        }
    };
    const colors = colorConfig[colorScheme];
    const statusConfig = {
        active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
        inactive: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Inactive' },
        'on-leave': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'On Leave' }
    };
    const statusStyle = statusConfig[status];
    return (_jsxs("div", { className: "group relative", children: [_jsx("div", { className: `absolute -inset-1 bg-gradient-to-r ${colors.gradient} rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500` }), _jsxs("div", { className: `relative bg-gradient-to-br from-white/95 to-gray-50/50 backdrop-blur-xl rounded-2xl ${colors.border} border shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 p-6`, children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: `w-12 h-12 bg-gradient-to-br ${colors.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`, children: _jsx("span", { className: "text-white font-bold text-lg", children: initials }) }), _jsx("div", { className: "flex items-center space-x-2", children: _jsxs("span", { className: `inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${statusStyle.bg} ${statusStyle.text}`, children: [_jsx("div", { className: `w-1.5 h-1.5 ${status === 'active' ? 'bg-green-500' : status === 'on-leave' ? 'bg-yellow-500' : 'bg-gray-500'} rounded-full mr-1 animate-pulse` }), statusStyle.label] }) })] }), _jsxs("div", { className: "flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300", children: [_jsx("button", { className: "p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200", title: "Edit", children: _jsx("svg", { className: "w-4 h-4 text-gray-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" }) }) }), _jsx("button", { className: "p-2 hover:bg-red-50 rounded-lg transition-colors duration-200", title: "Delete", children: _jsx("svg", { className: "w-4 h-4 text-red-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }) })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-gray-900 group-hover:text-gray-700 transition-colors", children: name }), _jsx("p", { className: "text-sm text-gray-600 font-medium", children: email })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3 text-sm", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("svg", { className: "w-4 h-4 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 6V9a2 2 0 00-2-2H8a2 2 0 00-2 2v3.001" }) }), _jsx("span", { className: "text-gray-700 font-medium", children: position })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("svg", { className: "w-4 h-4 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" }) }), _jsx("span", { className: "text-gray-700 font-medium", children: department })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("svg", { className: "w-4 h-4 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }), _jsxs("span", { className: "text-gray-700", children: ["Age: ", age] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("svg", { className: "w-4 h-4 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }) }), _jsx("span", { className: "text-gray-700 capitalize", children: gender })] })] }), _jsx("div", { className: "pt-3 border-t border-gray-200", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("svg", { className: "w-4 h-4 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" }) }), _jsx("span", { className: "text-gray-700 font-medium", children: phone })] }) })] })] })] }));
};
export default StaffCard;
