import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FileText, Download, Eye, Calendar, User, X } from 'lucide-react';
import { sampleReports, reportCategories } from '../../../data/financialReportsData';
const SearchResults = ({ searchQuery, onClose, onOpenReport }) => {
    // Consider only active (non-archived) reports when searching from the Reports tab
    const activeReports = sampleReports.filter(report => report.status === 'active');
    // Filter reports based on search query
    const filteredReports = activeReports.filter(report => {
        const query = searchQuery.toLowerCase();
        return (report.name.toLowerCase().includes(query) ||
            report.id.toLowerCase().includes(query) ||
            report.category.toLowerCase().includes(query) ||
            report.preparedBy.toLowerCase().includes(query) ||
            report.fileType.toLowerCase().includes(query));
    });
    if (!searchQuery || filteredReports.length === 0)
        return null;
    const getFileIcon = (fileType) => {
        switch (fileType) {
            case 'PDF': return '📄';
            case 'Excel': return '📊';
            case 'CSV': return '📈';
            default: return '📁';
        }
    };
    const getCategoryIcon = (category) => {
        const icons = {
            'income': '💰',
            'expense': '📊',
            'payroll': '👥',
            'profit-loss': '📈',
            'balance': '⚖️',
            'custom': '📋'
        };
        return icons[category] || '📁';
    };
    const getCategoryLabel = (categoryId) => {
        const category = reportCategories.find(c => c.id === categoryId);
        return category?.name || categoryId;
    };
    return (_jsxs("div", { className: "w-full bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-heritage-green/30 shadow-2xl p-6 animate-fade-in", children: [_jsxs("div", { className: "flex items-center justify-between mb-6 pb-4 border-b border-gray-200", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-xl font-bold text-gray-900", children: "Search Results" }), _jsxs("p", { className: "text-sm text-gray-600 mt-1", children: ["Found ", _jsx("span", { className: "font-bold text-heritage-green", children: filteredReports.length }), " report", filteredReports.length !== 1 ? 's' : '', " matching \"", searchQuery, "\""] })] }), _jsx("button", { onClick: onClose, className: "p-2 hover:bg-gray-100 rounded-lg transition-colors", title: "Close search results", children: _jsx(X, { className: "w-5 h-5 text-gray-500" }) })] }), _jsx("div", { className: "space-y-3 max-h-[500px] overflow-y-auto pr-2", children: filteredReports.map((report) => (_jsx("div", { className: "group p-4 bg-gradient-to-r from-heritage-light/20 to-white border-2 border-gray-200 hover:border-heritage-green/50 rounded-xl transition-all duration-300 hover:shadow-md", children: _jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("span", { className: "text-3xl", children: getFileIcon(report.fileType) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h4", { className: "text-base font-bold text-gray-900 truncate group-hover:text-heritage-green transition-colors", children: report.name }), _jsxs("p", { className: "mt-0.5 text-xs text-gray-500", children: [getCategoryLabel(report.category), "\0b7 ", new Date(report.dateGenerated).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })] }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-md text-xs font-medium", children: [getCategoryIcon(report.category), " ", getCategoryLabel(report.category)] }), _jsx("span", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${report.status === 'active'
                                                                    ? 'bg-emerald-100 text-emerald-700'
                                                                    : 'bg-gray-100 text-gray-700'}`, children: report.status }), _jsx("span", { className: `inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${report.fileType === 'PDF'
                                                                    ? 'bg-red-100 text-red-700'
                                                                    : report.fileType === 'Excel'
                                                                        ? 'bg-green-100 text-green-700'
                                                                        : 'bg-blue-100 text-blue-700'}`, children: report.fileType })] })] })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-xs text-gray-600", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(Calendar, { className: "w-3 h-3 text-heritage-green" }), _jsx("span", { children: new Date(report.dateGenerated).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        }) })] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(User, { className: "w-3 h-3 text-heritage-green" }), _jsx("span", { className: "truncate", children: report.preparedBy })] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(FileText, { className: "w-3 h-3 text-heritage-green" }), _jsx("span", { children: report.fileSize })] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("span", { className: "font-semibold", children: "ID:" }), _jsx("span", { className: "font-mono", children: report.id })] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => { onOpenReport(report); onClose(); }, className: "p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors", title: "View Report", children: _jsx(Eye, { className: "w-5 h-5" }) }), _jsx("button", { onClick: () => alert(`Downloading ${report.name}`), className: "p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors", title: "Download Report", children: _jsx(Download, { className: "w-5 h-5" }) })] })] }) }, report.id))) }), _jsx("div", { className: "mt-6 pt-4 border-t border-gray-200", children: _jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsxs("span", { className: "text-gray-600", children: ["Displaying all results for \"", _jsx("span", { className: "font-semibold text-gray-900", children: searchQuery }), "\""] }), _jsx("button", { onClick: onClose, className: "px-4 py-2 bg-heritage-green/10 hover:bg-heritage-green/20 text-heritage-green font-semibold rounded-lg transition-colors", children: "Clear Search" })] }) })] }));
};
export default SearchResults;
