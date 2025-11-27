import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, FileText, Calendar, CheckCircle, AlertCircle, Download } from 'lucide-react';
const GenerateReportModal = ({ isOpen, onClose }) => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('2025');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isGenerated, setIsGenerated] = useState(false);
    const [reportExists, setReportExists] = useState(false);
    const categories = [
        { value: 'income', label: 'Income Report', icon: '💰' },
        { value: 'expense', label: 'Expense Report', icon: '📊' },
        { value: 'payroll', label: 'Payroll Summary', icon: '👥' },
        { value: 'profit-loss', label: 'Profit & Loss Statement', icon: '📈' },
        { value: 'balance', label: 'Balance Sheet', icon: '⚖️' },
        { value: 'custom', label: 'Custom Report', icon: '📋' }
    ];
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const years = ['2025', '2024', '2023', '2022', '2021'];
    const handleGenerate = () => {
        if (!selectedCategory || !selectedMonth || !selectedYear) {
            alert('Please select all fields');
            return;
        }
        // Check if report already exists (simulate check)
        const monthIndex = months.indexOf(selectedMonth) + 1;
        const existingReports = [
            { category: 'income', month: 10, year: 2025 },
            { category: 'expense', month: 10, year: 2025 },
            { category: 'payroll', month: 10, year: 2025 }
        ];
        const exists = existingReports.some(r => r.category === selectedCategory && r.month === monthIndex && r.year === parseInt(selectedYear));
        if (exists) {
            setReportExists(true);
            return;
        }
        // Simulate report generation
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            setIsGenerated(true);
        }, 2000);
    };
    const handleReset = () => {
        setSelectedCategory('');
        setSelectedMonth('');
        setSelectedYear('2025');
        setIsGenerating(false);
        setIsGenerated(false);
        setReportExists(false);
    };
    const handleClose = () => {
        handleReset();
        onClose();
    };
    if (!isOpen)
        return null;
    return createPortal(_jsxs("div", { className: "fixed inset-0 z-[1000] flex items-center justify-center", role: "dialog", "aria-modal": "true", children: [_jsx("div", { className: "fixed inset-0 transition-opacity duration-200 bg-black/45 backdrop-blur-lg", onClick: handleClose, "aria-label": "Close overlay" }), _jsxs("div", { className: "relative z-10 w-full max-w-4xl max-h-[80vh] mx-6 my-6 overflow-hidden rounded-3xl bg-white/95 shadow-2xl ring-1 ring-black/5 pb-2 flex flex-col", children: [_jsxs("div", { className: "relative px-6 py-4 bg-white border-b border-gray-100 rounded-t-3xl", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "flex items-center justify-center w-12 h-12 text-white rounded-full shadow-sm bg-emerald-600", children: _jsx(FileText, { className: "w-5 h-5" }) }), _jsxs("div", { className: "flex flex-col", children: [_jsx("h2", { className: "text-lg font-semibold text-emerald-700 md:text-2xl", children: "Generate Financial Report" }), _jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Create a new financial report for your selected category and period." })] })] }), _jsx("div", { "aria-hidden": true })] }), _jsx("button", { onClick: handleClose, "aria-label": "Close", className: "absolute flex items-center justify-center rounded-md top-4 right-4 w-9 h-9 text-emerald-700 bg-emerald-50 ring-1 ring-emerald-100", children: _jsx(X, { className: "w-4 h-4" }) })] }), _jsx("div", { className: "p-6 pb-10 overflow-y-auto overflow-x-hidden flex-1 min-h-0", children: reportExists ? (
                        // Report Already Exists Warning
                        _jsx("div", { className: "space-y-6", children: _jsxs("div", { className: "flex items-start gap-4 p-6 bg-amber-50 border-2 border-amber-200 rounded-xl", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(AlertCircle, { className: "w-8 h-8 text-amber-600" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-lg font-bold text-amber-900 mb-2", children: "Report Already Exists" }), _jsxs("p", { className: "text-amber-800 mb-4", children: ["A ", _jsx("strong", { children: categories.find(c => c.value === selectedCategory)?.label }), " report for", ' ', _jsxs("strong", { children: [selectedMonth, " ", selectedYear] }), " has already been generated."] }), _jsxs("div", { className: "flex items-center gap-3 pt-4 border-t border-amber-200", children: [_jsxs("button", { onClick: () => alert('Downloading existing report...'), className: "flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors", children: [_jsx(Download, { className: "w-4 h-4" }), "Download Existing"] }), _jsx("button", { onClick: handleReset, className: "px-4 py-2 bg-white hover:bg-gray-50 text-amber-800 font-semibold border border-amber-300 rounded-lg transition-colors", children: "Generate New Period" })] })] })] }) })) : isGenerated ? (
                        // Success State
                        _jsx("div", { className: "space-y-6", children: _jsxs("div", { className: "flex flex-col items-center justify-center py-8 text-center bg-emerald-50/70 border border-emerald-100 rounded-2xl shadow-sm", children: [_jsx("div", { className: "p-4 mb-4 bg-white border border-emerald-100 rounded-full shadow-sm", children: _jsx(CheckCircle, { className: "w-16 h-16 text-emerald-600" }) }), _jsx("h3", { className: "mb-2 text-2xl font-bold text-slate-900", children: "Report Generated Successfully!" }), _jsxs("p", { className: "mb-6 text-sm text-slate-700", children: ["Your ", categories.find(c => c.value === selectedCategory)?.label, " for ", selectedMonth, " ", selectedYear, " is ready."] }), _jsxs("div", { className: "flex flex-wrap items-center justify-center gap-3", children: [_jsxs("button", { onClick: () => alert('Downloading report...'), className: "inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-lg shadow-md bg-gradient-to-r from-emerald-600 to-emerald-700 border border-emerald-700/20 hover:shadow-lg hover:-translate-y-0.5 transition", children: [_jsx(Download, { className: "w-5 h-5" }), _jsx("span", { children: "Download Report" })] }), _jsx("button", { onClick: handleReset, className: "px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors", children: "Generate Another" })] })] }) })) : (
                        // Form
                        _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "flex items-center gap-2 text-sm font-bold text-gray-700", children: [_jsx(FileText, { className: "w-4 h-4 text-heritage-green" }), "Report Type"] }), _jsxs("select", { value: selectedCategory, onChange: (e) => setSelectedCategory(e.target.value), className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green appearance-none bg-white cursor-pointer transition-all", children: [_jsx("option", { value: "", children: "Select report type..." }), categories.map(cat => (_jsxs("option", { value: cat.value, children: [cat.icon, " ", cat.label] }, cat.value)))] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "flex items-center gap-2 text-sm font-bold text-gray-700", children: [_jsx(Calendar, { className: "w-4 h-4 text-heritage-green" }), "Month"] }), _jsxs("select", { value: selectedMonth, onChange: (e) => setSelectedMonth(e.target.value), className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green appearance-none bg-white cursor-pointer transition-all", children: [_jsx("option", { value: "", children: "Select month..." }), months.map(month => (_jsx("option", { value: month, children: month }, month)))] })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "flex items-center gap-2 text-sm font-bold text-gray-700", children: [_jsx(Calendar, { className: "w-4 h-4 text-heritage-green" }), "Year"] }), _jsx("select", { value: selectedYear, onChange: (e) => setSelectedYear(e.target.value), className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green appearance-none bg-white cursor-pointer transition-all", children: years.map(year => (_jsx("option", { value: year, children: year }, year))) })] })] }), _jsx("div", { className: "p-4 bg-blue-50 border border-blue-200 rounded-xl", children: _jsxs("div", { className: "flex gap-3", children: [_jsx("div", { className: "text-2xl", children: "\u2139\uFE0F" }), _jsxs("div", { className: "text-sm text-blue-800", children: [_jsx("p", { className: "font-semibold mb-1", children: "Report Generation" }), _jsxs("ul", { className: "space-y-1 text-xs", children: [_jsx("li", { children: "\u2022 Reports are automatically named: Category-YYYY-MM-Type-v1" }), _jsx("li", { children: "\u2022 Generation typically takes 5-10 seconds" }), _jsx("li", { children: "\u2022 You'll be notified if a report already exists" })] })] })] }) })] })) }), !isGenerated && !reportExists && (_jsxs("div", { className: "flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/80", children: [_jsx("button", { onClick: handleClose, className: "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-200", children: "Cancel" }), _jsx("button", { onClick: handleGenerate, disabled: isGenerating, className: `inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-200 transition disabled:opacity-60 disabled:cursor-not-allowed ${isGenerating
                                    ? 'bg-gray-300 text-gray-600'
                                    : 'bg-gradient-to-r from-emerald-600 to-emerald-700 border border-emerald-700/20'}`, children: isGenerating ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }), _jsx("span", { children: "Generating..." })] })) : (_jsxs(_Fragment, { children: [_jsx(FileText, { className: "w-4 h-4" }), _jsx("span", { children: "Generate Report" })] })) })] }))] })] }), document.body);
};
export default GenerateReportModal;
