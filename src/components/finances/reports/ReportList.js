import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { FileText, Download, Eye, Trash2, Filter } from 'lucide-react';
const ReportList = ({ reports, onView, onDownload, onDelete }) => {
    const [sortBy, setSortBy] = useState('date');
    const [filterType, setFilterType] = useState('all');
    const filteredReports = reports.filter(report => filterType === 'all' || report.fileType === filterType);
    const sortedReports = [...filteredReports].sort((a, b) => {
        if (sortBy === 'date') {
            return new Date(b.dateGenerated).getTime() - new Date(a.dateGenerated).getTime();
        }
        return a.name.localeCompare(b.name);
    });
    const getFileIcon = (fileType) => {
        switch (fileType) {
            case 'PDF':
                return '📄';
            case 'Excel':
                return '📊';
            case 'CSV':
                return '📈';
            default:
                return '📁';
        }
    };
    if (reports.length === 0) {
        return (_jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center", children: [_jsx("div", { className: "w-16 h-16 mb-4 bg-gray-100 rounded-full flex items-center justify-center", children: _jsx(FileText, { className: "w-8 h-8 text-gray-400" }) }), _jsx("h3", { className: "text-lg font-semibold text-gray-600 mb-2", children: "No reports found" }), _jsx("p", { className: "text-sm text-gray-500", children: "This month doesn't have any reports yet." })] }));
    }
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between gap-4 p-4 bg-white/80 rounded-xl border border-gray-200", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Filter, { className: "w-4 h-4 text-gray-500" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "Filter by:" }), _jsxs("select", { value: filterType, onChange: (e) => setFilterType(e.target.value), className: "px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", children: [_jsx("option", { value: "all", children: "All Types" }), _jsx("option", { value: "PDF", children: "PDF" }), _jsx("option", { value: "Excel", children: "Excel" }), _jsx("option", { value: "CSV", children: "CSV" })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm font-medium text-gray-700", children: "Sort by:" }), _jsxs("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", children: [_jsx("option", { value: "date", children: "Date Generated" }), _jsx("option", { value: "name", children: "Name" })] })] })] }), _jsx("div", { className: "bg-white/95 rounded-xl border border-gray-200 overflow-hidden shadow-sm", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gradient-to-r from-heritage-light/50 to-heritage-light/30 border-b border-gray-200", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Report Name" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Date Generated" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Prepared By" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "File Type" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Size" }), _jsx("th", { className: "px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: sortedReports.map((report) => (_jsxs("tr", { className: "hover:bg-heritage-light/20 transition-colors", children: [_jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "text-2xl", children: getFileIcon(report.fileType) }), _jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: report.name }), _jsxs("div", { className: "text-xs text-gray-500", children: ["v", report.version] })] })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("div", { className: "text-sm text-gray-900", children: new Date(report.dateGenerated).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                }) }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("div", { className: "text-sm text-gray-900", children: report.preparedBy }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${report.fileType === 'PDF'
                                                    ? 'bg-red-100 text-red-700'
                                                    : report.fileType === 'Excel'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-blue-100 text-blue-700'}`, children: report.fileType }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("div", { className: "text-sm text-gray-500", children: report.fileSize }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center justify-end gap-2", children: [_jsx("button", { onClick: () => onView(report), className: "p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors", title: "View Report", children: _jsx(Eye, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => onDownload(report), className: "p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors", title: "Download Report", children: _jsx(Download, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => onDelete(report), className: "p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors", title: "Delete Report", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }, report.id))) })] }) }) }), _jsxs("div", { className: "flex items-center justify-between px-4 py-3 bg-white/80 rounded-xl border border-gray-200", children: [_jsxs("p", { className: "text-sm text-gray-600", children: ["Showing ", _jsx("span", { className: "font-semibold", children: sortedReports.length }), " of", ' ', _jsx("span", { className: "font-semibold", children: reports.length }), " reports"] }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Total size: ", reports.reduce((acc, r) => acc + parseFloat(r.fileSize), 0).toFixed(1), " MB"] })] })] }));
};
export default ReportList;
