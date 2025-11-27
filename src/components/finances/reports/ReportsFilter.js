import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Search, Filter, Calendar, Plus, ChevronDown, X, FileText, Clock, User, TrendingUp } from 'lucide-react';
const ReportsFilter = ({ searchQuery, onSearchChange, selectedYear, onYearChange, selectedCategory, onCategoryChange, selectedMonth = 0, onMonthChange = () => { }, selectedStatus = 'all', onStatusChange = () => { }, selectedFileType = 'all', onFileTypeChange = () => { }, selectedPreparedBy = 'all', onPreparedByChange = () => { }, sortBy = 'date-desc', onSortChange = () => { }, onGenerateClick = () => { }, isLoading = false }) => {
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [dateRange, setDateRange] = useState({ from: '', to: '' });
    if (isLoading) {
        return (_jsx("div", { className: "w-full space-y-4", children: _jsx("div", { className: "bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg p-6 animate-pulse", children: _jsxs("div", { className: "flex flex-col lg:flex-row items-stretch lg:items-center gap-4", children: [_jsx("div", { className: "flex-1 h-14 bg-gray-200 rounded-xl" }), _jsx("div", { className: "min-w-[220px] h-14 bg-gray-200 rounded-xl" }), _jsx("div", { className: "min-w-[150px] h-14 bg-gray-200 rounded-xl" }), _jsx("div", { className: "min-w-[160px] h-14 bg-gray-200 rounded-xl" }), _jsx("div", { className: "min-w-[180px] h-14 bg-gray-300 rounded-xl" })] }) }) }));
    }
    const years = [2025, 2024, 2023, 2022, 2021];
    const categories = [
        { value: 'all', label: 'All Categories', icon: '📁' },
        { value: 'income', label: 'Income Reports', icon: '💰' },
        { value: 'expense', label: 'Expense Reports', icon: '📊' },
        { value: 'payroll', label: 'Payroll Summaries', icon: '👥' },
        { value: 'profit-loss', label: 'Profit & Loss', icon: '📈' },
        { value: 'balance', label: 'Balance Sheets', icon: '⚖️' },
        { value: 'custom', label: 'Custom Reports', icon: '📋' }
    ];
    const months = [
        { value: 0, label: 'All Months' },
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' }
    ];
    const statuses = [
        { value: 'all', label: 'All Status', color: 'gray' },
        { value: 'active', label: 'Active', color: 'green' },
        { value: 'archived', label: 'Archived', color: 'gray' },
        { value: 'draft', label: 'Draft', color: 'yellow' },
        { value: 'pending', label: 'Pending Review', color: 'orange' }
    ];
    const fileTypes = [
        { value: 'all', label: 'All Types', icon: '📄' },
        { value: 'PDF', label: 'PDF', icon: '📕' },
        { value: 'Excel', label: 'Excel', icon: '📊' },
        { value: 'CSV', label: 'CSV', icon: '📈' },
        { value: 'Word', label: 'Word', icon: '📘' }
    ];
    const preparedByOptions = [
        { value: 'all', label: 'All Staff' },
        { value: 'finance', label: 'Finance Team' },
        { value: 'accounting', label: 'Accounting Dept' },
        { value: 'hr', label: 'HR Department' },
        { value: 'management', label: 'Management' },
        { value: 'audit', label: 'Audit Team' }
    ];
    const sortOptions = [
        { value: 'date-desc', label: 'Newest First', icon: '↓' },
        { value: 'date-asc', label: 'Oldest First', icon: '↑' },
        { value: 'name-asc', label: 'Name (A-Z)', icon: '🔤' },
        { value: 'name-desc', label: 'Name (Z-A)', icon: '🔡' },
        { value: 'size-desc', label: 'Largest First', icon: '📦' },
        { value: 'size-asc', label: 'Smallest First', icon: '📪' }
    ];
    const activeFiltersCount = () => {
        let count = 0;
        if (searchQuery)
            count++;
        if (selectedCategory !== 'all')
            count++;
        if (selectedMonth !== 0)
            count++;
        if (selectedStatus !== 'all')
            count++;
        if (selectedFileType !== 'all')
            count++;
        if (selectedPreparedBy !== 'all')
            count++;
        if (dateRange.from || dateRange.to)
            count++;
        return count;
    };
    const clearAllFilters = () => {
        onSearchChange('');
        onCategoryChange('all');
        onMonthChange(0);
        onStatusChange('all');
        onFileTypeChange('all');
        onPreparedByChange('all');
        setDateRange({ from: '', to: '' });
    };
    return (_jsxs("div", { className: "w-full space-y-4", children: [_jsx("div", { className: "bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg p-6", children: _jsxs("div", { className: "flex flex-col gap-4", children: [_jsxs("div", { className: "flex flex-col lg:flex-row items-stretch lg:items-center gap-4", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" }), _jsx("input", { type: "text", placeholder: "Search by report name, ID, or description...", value: searchQuery, onChange: (e) => onSearchChange(e.target.value), className: "w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green transition-all text-sm font-medium placeholder:text-gray-400" })] }), _jsxs("div", { className: "relative min-w-[220px]", children: [_jsx(Filter, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none z-10" }), _jsx("select", { value: selectedCategory, onChange: (e) => onCategoryChange(e.target.value), className: "w-full pl-12 pr-10 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green appearance-none bg-white cursor-pointer transition-all text-sm font-medium", children: categories.map(cat => (_jsxs("option", { value: cat.value, children: [cat.icon, " ", cat.label] }, cat.value))) }), _jsx(ChevronDown, { className: "absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" })] }), _jsxs("div", { className: "relative min-w-[150px]", children: [_jsx(Calendar, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none z-10" }), _jsx("select", { value: selectedYear, onChange: (e) => onYearChange(Number(e.target.value)), className: "w-full pl-12 pr-10 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green appearance-none bg-white cursor-pointer transition-all text-sm font-medium", children: years.map(year => (_jsx("option", { value: year, children: year }, year))) }), _jsx(ChevronDown, { className: "absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" })] }), _jsxs("button", { onClick: () => setShowAdvancedFilters(!showAdvancedFilters), className: `flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 min-w-[160px] justify-center ${showAdvancedFilters
                                        ? 'bg-heritage-green text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`, children: [_jsx(Filter, { className: "w-5 h-5" }), "Advanced", activeFiltersCount() > 0 && (_jsx("span", { className: "ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold", children: activeFiltersCount() }))] }), _jsxs("button", { onClick: onGenerateClick, className: "flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-heritage-green to-heritage-neutral text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 min-w-[180px] justify-center", children: [_jsx(Plus, { className: "w-5 h-5" }), "Generate Report"] })] }), activeFiltersCount() > 0 && (_jsxs("div", { className: "flex items-center gap-2 flex-wrap pt-2 border-t border-gray-100", children: [_jsx("span", { className: "text-xs font-semibold text-gray-500 uppercase tracking-wide", children: "Active Filters:" }), searchQuery && (_jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium", children: [_jsx(Search, { className: "w-3 h-3" }), "Search: \"", searchQuery, "\"", _jsx("button", { onClick: () => onSearchChange(''), className: "hover:bg-blue-100 rounded-full p-0.5", children: _jsx(X, { className: "w-3 h-3" }) })] })), selectedCategory !== 'all' && (_jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium", children: [_jsx(Filter, { className: "w-3 h-3" }), categories.find(c => c.value === selectedCategory)?.label, _jsx("button", { onClick: () => onCategoryChange('all'), className: "hover:bg-purple-100 rounded-full p-0.5", children: _jsx(X, { className: "w-3 h-3" }) })] })), selectedMonth !== 0 && (_jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium", children: [_jsx(Calendar, { className: "w-3 h-3" }), months.find(m => m.value === selectedMonth)?.label, _jsx("button", { onClick: () => onMonthChange(0), className: "hover:bg-emerald-100 rounded-full p-0.5", children: _jsx(X, { className: "w-3 h-3" }) })] })), selectedStatus !== 'all' && (_jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium", children: [_jsx(Clock, { className: "w-3 h-3" }), statuses.find(s => s.value === selectedStatus)?.label, _jsx("button", { onClick: () => onStatusChange('all'), className: "hover:bg-amber-100 rounded-full p-0.5", children: _jsx(X, { className: "w-3 h-3" }) })] })), selectedFileType !== 'all' && (_jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-xs font-medium", children: [_jsx(FileText, { className: "w-3 h-3" }), fileTypes.find(f => f.value === selectedFileType)?.label, _jsx("button", { onClick: () => onFileTypeChange('all'), className: "hover:bg-rose-100 rounded-full p-0.5", children: _jsx(X, { className: "w-3 h-3" }) })] })), selectedPreparedBy !== 'all' && (_jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium", children: [_jsx(User, { className: "w-3 h-3" }), preparedByOptions.find(p => p.value === selectedPreparedBy)?.label, _jsx("button", { onClick: () => onPreparedByChange('all'), className: "hover:bg-indigo-100 rounded-full p-0.5", children: _jsx(X, { className: "w-3 h-3" }) })] })), _jsxs("button", { onClick: clearAllFilters, className: "ml-auto px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5", children: [_jsx(X, { className: "w-3 h-3" }), "Clear All"] })] }))] }) }), showAdvancedFilters && (_jsxs("div", { className: "bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg p-6 animate-fade-in", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-heritage-green/10 rounded-lg", children: _jsx(Filter, { className: "w-5 h-5 text-heritage-green" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-gray-900", children: "Advanced Filters" }), _jsx("p", { className: "text-sm text-gray-500", children: "Refine your search with detailed criteria" })] })] }), _jsx("button", { onClick: () => setShowAdvancedFilters(false), className: "p-2 hover:bg-gray-100 rounded-lg transition-colors", children: _jsx(X, { className: "w-5 h-5 text-gray-500" }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "flex items-center gap-2 text-sm font-semibold text-gray-700", children: [_jsx(Calendar, { className: "w-4 h-4 text-heritage-green" }), "Month"] }), _jsx("select", { value: selectedMonth, onChange: (e) => onMonthChange(Number(e.target.value)), className: "w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green appearance-none bg-white cursor-pointer transition-all text-sm", children: months.map(month => (_jsx("option", { value: month.value, children: month.label }, month.value))) })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "flex items-center gap-2 text-sm font-semibold text-gray-700", children: [_jsx(Clock, { className: "w-4 h-4 text-heritage-green" }), "Report Status"] }), _jsx("select", { value: selectedStatus, onChange: (e) => onStatusChange(e.target.value), className: "w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green appearance-none bg-white cursor-pointer transition-all text-sm", children: statuses.map(status => (_jsx("option", { value: status.value, children: status.label }, status.value))) })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "flex items-center gap-2 text-sm font-semibold text-gray-700", children: [_jsx(FileText, { className: "w-4 h-4 text-heritage-green" }), "File Type"] }), _jsx("select", { value: selectedFileType, onChange: (e) => onFileTypeChange(e.target.value), className: "w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green appearance-none bg-white cursor-pointer transition-all text-sm", children: fileTypes.map(type => (_jsxs("option", { value: type.value, children: [type.icon, " ", type.label] }, type.value))) })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "flex items-center gap-2 text-sm font-semibold text-gray-700", children: [_jsx(User, { className: "w-4 h-4 text-heritage-green" }), "Prepared By"] }), _jsx("select", { value: selectedPreparedBy, onChange: (e) => onPreparedByChange(e.target.value), className: "w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green appearance-none bg-white cursor-pointer transition-all text-sm", children: preparedByOptions.map(option => (_jsx("option", { value: option.value, children: option.label }, option.value))) })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "flex items-center gap-2 text-sm font-semibold text-gray-700", children: [_jsx(Calendar, { className: "w-4 h-4 text-heritage-green" }), "Date From"] }), _jsx("input", { type: "date", value: dateRange.from, onChange: (e) => setDateRange({ ...dateRange, from: e.target.value }), className: "w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green transition-all text-sm" })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "flex items-center gap-2 text-sm font-semibold text-gray-700", children: [_jsx(Calendar, { className: "w-4 h-4 text-heritage-green" }), "Date To"] }), _jsx("input", { type: "date", value: dateRange.to, onChange: (e) => setDateRange({ ...dateRange, to: e.target.value }), className: "w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green transition-all text-sm" })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "flex items-center gap-2 text-sm font-semibold text-gray-700", children: [_jsx(TrendingUp, { className: "w-4 h-4 text-heritage-green" }), "Sort By"] }), _jsx("select", { value: sortBy, onChange: (e) => onSortChange(e.target.value), className: "w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green appearance-none bg-white cursor-pointer transition-all text-sm", children: sortOptions.map(option => (_jsxs("option", { value: option.value, children: [option.icon, " ", option.label] }, option.value))) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-semibold text-gray-700", children: "Quick Actions" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: clearAllFilters, className: "flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm", children: "Reset All" }), _jsx("button", { onClick: () => setShowAdvancedFilters(false), className: "flex-1 px-4 py-2.5 bg-heritage-green hover:bg-heritage-green/90 text-white font-medium rounded-lg transition-colors text-sm", children: "Apply" })] })] })] })] }))] }));
};
export default ReportsFilter;
