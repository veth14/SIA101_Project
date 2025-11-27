import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Folder, FileText } from 'lucide-react';
const MonthFolderCard = ({ monthData, categoryColor, onClick }) => {
    const hasReports = monthData.reportCount > 0;
    return (_jsxs("button", { onClick: onClick, disabled: !hasReports, className: `group relative bg-gradient-to-br ${categoryColor} border-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-left overflow-hidden ${hasReports
            ? 'hover:-translate-y-1 cursor-pointer'
            : 'opacity-50 cursor-not-allowed'}`, children: [_jsx("div", { className: "absolute top-0 left-0 w-16 h-6 bg-gradient-to-r from-amber-100 to-amber-50 rounded-br-xl border-r border-b border-amber-200" }), _jsx("div", { className: "relative p-4 pt-8", children: _jsx("div", { className: "flex items-start justify-between", children: _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [hasReports ? (_jsx(Folder, { className: "w-5 h-5 text-amber-600" })) : (_jsx(Folder, { className: "w-5 h-5 text-gray-400" })), _jsx("h4", { className: `font-bold text-sm ${hasReports ? 'text-gray-900' : 'text-gray-500'}`, children: monthData.name })] }), _jsxs("div", { className: "flex items-center gap-1 text-xs text-gray-500", children: [_jsx(FileText, { className: "w-3 h-3" }), _jsxs("span", { className: "font-medium", children: [monthData.reportCount, " ", monthData.reportCount === 1 ? 'report' : 'reports'] })] })] }) }) }), hasReports && (_jsx("div", { className: "absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" }))] }));
};
export default MonthFolderCard;
