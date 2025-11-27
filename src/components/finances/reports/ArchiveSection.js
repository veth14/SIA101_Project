import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Archive, Download, Eye } from 'lucide-react';
import { getArchivedReports, reportCategories } from '../../../data/financialReportsData';
const ArchiveSection = ({ searchQuery }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const archivedReports = getArchivedReports();
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filteredReports = normalizedQuery
        ? archivedReports.filter((report) => {
            const category = reportCategories.find((c) => c.id === report.category);
            const categoryName = category?.name.toLowerCase() ?? '';
            return (report.name.toLowerCase().includes(normalizedQuery) ||
                report.preparedBy.toLowerCase().includes(normalizedQuery) ||
                categoryName.includes(normalizedQuery));
        })
        : archivedReports;
    const pageSize = 5;
    const totalPages = Math.max(1, Math.ceil(filteredReports.length / pageSize));
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedReports = filteredReports.slice(startIndex, startIndex + pageSize);
    // Removed loading state and effect
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
    return (_jsxs("div", { className: "relative overflow-hidden border-2 shadow-xl bg-gradient-to-br from-white via-slate-50 to-slate-100 rounded-3xl border-slate-200/70", children: [_jsx("div", { className: "absolute top-0 right-0 w-64 h-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-bl from-slate-200/40 to-transparent" }), _jsx("div", { className: "absolute bottom-0 left-0 w-48 h-48 -translate-x-1/2 translate-y-1/2 rounded-full bg-gradient-to-tr from-slate-100/60 to-transparent" }), _jsxs("div", { className: "relative z-10 flex items-center justify-between w-full px-8 py-5 bg-white/90 border-b border-gray-100", children: [_jsxs("div", { className: "flex items-start gap-4 text-left", children: [_jsx("div", { className: "p-2 bg-[#82A33D]/10 rounded-xl", children: _jsx(Archive, { className: "w-6 h-6 text-[#82A33D]" }) }), _jsxs("div", { className: "flex flex-col items-start text-left", children: [_jsx("h3", { className: "text-2xl font-black text-slate-800 text-left", children: "Archived Reports" }), _jsx("p", { className: "mt-1 text-sm text-slate-500 text-left", children: "Historical reports kept for compliance and reference" })] })] }), _jsx("div", { className: "flex items-center gap-4", children: _jsxs("div", { className: "hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200", children: [_jsx("div", { className: "w-2 h-2 bg-emerald-500 rounded-full animate-pulse" }), _jsxs("span", { className: "text-xs font-semibold text-slate-600", children: [filteredReports.length, " ", filteredReports.length === 1 ? 'report' : 'reports'] })] }) })] }), _jsx("div", { className: "relative z-10 border-t-2 border-slate-200/50", children: _jsx("div", { className: "p-8", children: archivedReports.length === 0 ? (_jsxs("div", { className: "py-16 text-center", children: [_jsxs("div", { className: "relative mx-auto mb-6", children: [_jsx("div", { className: "flex items-center justify-center w-24 h-24 mx-auto shadow-lg bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl", children: _jsx(Archive, { className: "w-12 h-12 text-slate-400" }) }), _jsx("div", { className: "absolute -inset-2 bg-gradient-to-r from-slate-400 to-slate-500 rounded-3xl blur opacity-20" })] }), _jsx("h3", { className: "mb-2 text-xl font-bold text-slate-700", children: "No Archived Reports" }), _jsx("p", { className: "text-slate-500", children: "Reports will appear here after archiving" })] })) : filteredReports.length === 0 ? (_jsxs("div", { className: "py-12 text-center", children: [_jsx("h3", { className: "mb-2 text-lg font-bold text-slate-700", children: "No archived reports match your search" }), normalizedQuery && (_jsxs("p", { className: "text-sm text-slate-500", children: ["No results for \"", searchQuery, "\""] }))] })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5", children: paginatedReports.map((report) => {
                                    const category = reportCategories.find(c => c.id === report.category);
                                    return (_jsxs("div", { className: "relative p-5 overflow-hidden transition-all duration-300 border-2 group bg-gradient-to-br from-white to-slate-50 border-slate-200 rounded-2xl hover:shadow-xl hover:-translate-y-1 hover:border-slate-300", children: [_jsx("div", { className: "absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-slate-100/50 to-transparent rounded-bl-3xl" }), _jsxs("div", { className: "flex items-start gap-3 pr-20 mb-4", children: [_jsx("div", { className: "flex items-center justify-center flex-shrink-0 w-12 h-12 transition-transform duration-300 shadow-sm bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl group-hover:scale-110", children: _jsx("span", { className: "text-2xl", children: getFileIcon(report.fileType) }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h4", { className: "text-sm font-bold text-slate-900 truncate mb-1.5 group-hover:text-heritage-green transition-colors", children: report.name }), _jsx("div", { className: "flex items-center gap-1.5", children: _jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-xs font-medium", children: [category?.icon, " ", category?.name] }) })] })] }), _jsxs("div", { className: "mb-4 space-y-2 text-xs", children: [_jsxs("div", { className: "flex items-center justify-between p-2 rounded-lg bg-slate-50", children: [_jsx("span", { className: "font-medium text-slate-500", children: "\uD83D\uDCC5 Date:" }), _jsx("span", { className: "font-bold text-slate-700", children: new Date(report.dateGenerated).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric'
                                                                }) })] }), _jsxs("div", { className: "flex items-center justify-between p-2 rounded-lg bg-slate-50", children: [_jsx("span", { className: "font-medium text-slate-500", children: "\uD83D\uDCE6 Size:" }), _jsx("span", { className: "font-bold text-slate-700", children: report.fileSize })] }), _jsxs("div", { className: "flex items-center justify-between p-2 rounded-lg bg-slate-50", children: [_jsx("span", { className: "font-medium text-slate-500", children: "\uD83D\uDC64 By:" }), _jsx("span", { className: "font-bold truncate text-slate-700", children: report.preparedBy })] })] }), _jsxs("div", { className: "flex items-center gap-2 pt-3 border-t-2 border-slate-200", children: [_jsxs("button", { onClick: () => alert(`Viewing ${report.name}`), className: "flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-300 hover:scale-105", title: "View Report", children: [_jsx(Eye, { className: "w-4 h-4" }), "View"] }), _jsxs("button", { onClick: () => alert(`Downloading ${report.name}`), className: "flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all duration-300 hover:scale-105", title: "Download Report", children: [_jsx(Download, { className: "w-4 h-4" }), "Download"] })] })] }, report.id));
                                }) }), totalPages > 1 && (_jsx("div", { className: "mt-6 border-t border-gray-100 bg-gray-50/50 -mx-8 px-8 pt-4 pb-2", children: _jsx("div", { className: "flex items-center justify-center", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("button", { onClick: () => setCurrentPage((p) => Math.max(1, p - 1)), disabled: currentPage === 1, className: "inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed", children: [_jsx("svg", { className: "w-4 h-4 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }), "Previous"] }), _jsx("div", { className: "flex items-center space-x-1", children: Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                    let pageNum;
                                                    if (totalPages <= 5) {
                                                        pageNum = i + 1;
                                                    }
                                                    else {
                                                        const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                                                        pageNum = start + i;
                                                    }
                                                    return (_jsx("button", { onClick: () => setCurrentPage(pageNum), className: `inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-md transition-colors ${pageNum === currentPage
                                                            ? 'bg-gradient-to-r from-heritage-green to-heritage-neutral text-white shadow-sm'
                                                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`, children: pageNum }, pageNum));
                                                }) }), _jsxs("button", { onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)), disabled: currentPage === totalPages, className: "inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed", children: ["Next", _jsx("svg", { className: "w-4 h-4 ml-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })] })] }) }) }))] })) }) })] }));
};
export default ArchiveSection;
