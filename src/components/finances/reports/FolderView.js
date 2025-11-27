import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { ArrowLeft, Calendar, FolderOpen } from 'lucide-react';
import { reportCategories, getMonthDataForCategory, getReportsByMonth } from '../../../data/financialReportsData';
import MonthFolderCard from './MonthFolderCard';
import ReportList from './ReportList';
const FolderView = ({ categoryId, onBack }) => {
    const [selectedMonth, setSelectedMonth] = useState(null);
    const category = reportCategories.find(c => c.id === categoryId);
    const monthData = getMonthDataForCategory(categoryId);
    if (!category)
        return null;
    const handleMonthClick = (month) => {
        setSelectedMonth(month);
    };
    const handleBackToMonths = () => {
        setSelectedMonth(null);
    };
    const handleViewReport = (report) => {
        alert(`Viewing report: ${report.name}`);
        // In production: Open report viewer or download
    };
    const handleDownloadReport = (report) => {
        alert(`Downloading report: ${report.name}`);
        // In production: Trigger file download
    };
    const handleDeleteReport = (report) => {
        if (confirm(`Are you sure you want to delete ${report.name}?`)) {
            alert(`Report deleted: ${report.name}`);
            // In production: Call API to delete report
        }
    };
    // If viewing specific month's reports
    if (selectedMonth !== null) {
        const reports = getReportsByMonth(categoryId, selectedMonth);
        const monthName = monthData.find(m => m.month === selectedMonth)?.name || '';
        return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [_jsx("button", { onClick: onBack, className: "hover:text-heritage-green transition-colors", children: "Financial Reports" }), _jsx("span", { children: "/" }), _jsx("button", { onClick: handleBackToMonths, className: "hover:text-heritage-green transition-colors", children: category.name }), _jsx("span", { children: "/" }), _jsxs("span", { className: "text-gray-900 font-medium", children: [monthName, " 2025"] })] }), _jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsxs("button", { onClick: handleBackToMonths, className: "flex items-center gap-2 mb-4 text-gray-600 hover:text-heritage-green transition-colors", children: [_jsx(ArrowLeft, { className: "w-4 h-4" }), "Back to Months"] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "text-3xl", children: category.icon }), _jsxs("div", { children: [_jsxs("h2", { className: "text-2xl font-bold text-gray-900", children: [monthName, " ", category.name] }), _jsxs("p", { className: "text-sm text-gray-500", children: [reports.length, " ", reports.length === 1 ? 'report' : 'reports', " in this month"] })] })] })] }) }), _jsx(ReportList, { reports: reports, onView: handleViewReport, onDownload: handleDownloadReport, onDelete: handleDeleteReport })] }));
    }
    // Main folder view with months
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [_jsx("button", { onClick: onBack, className: "hover:text-heritage-green transition-colors", children: "Financial Reports" }), _jsx("span", { children: "/" }), _jsx("span", { className: "text-gray-900 font-medium", children: category.name })] }), _jsxs("div", { className: `relative bg-gradient-to-br ${category.color} ${category.borderColor} border-2 rounded-2xl shadow-lg overflow-hidden`, children: [_jsx("div", { className: "absolute top-0 left-0 w-32 h-10 bg-gradient-to-r from-amber-100 to-amber-50 rounded-br-3xl border-r-2 border-b-2 border-amber-200" }), _jsxs("div", { className: "relative p-8 pt-14", children: [_jsxs("button", { onClick: onBack, className: "flex items-center gap-2 mb-4 text-gray-600 hover:text-heritage-green transition-colors", children: [_jsx(ArrowLeft, { className: "w-4 h-4" }), "Back to All Folders"] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "flex items-center justify-center w-16 h-16 bg-white/80 backdrop-blur-sm rounded-xl shadow-md", children: _jsx(FolderOpen, { className: "w-8 h-8 text-amber-600" }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("span", { className: "text-3xl", children: category.icon }), _jsx("h2", { className: "text-3xl font-bold text-gray-900", children: category.name })] }), _jsx("p", { className: "text-gray-600", children: category.description }), _jsxs("div", { className: "flex items-center gap-4 mt-3 text-sm text-gray-500", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Calendar, { className: "w-4 h-4" }), _jsx("span", { children: "Year 2025" })] }), _jsx("span", { children: "\u2022" }), _jsx("span", { children: "Last updated: October 14, 2025" })] })] })] })] }), _jsx("div", { className: "absolute bottom-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mb-16" })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-bold text-gray-900 mb-4", children: "Monthly Reports" }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-12 gap-4", children: monthData.map((month) => (_jsx(MonthFolderCard, { monthData: month, categoryColor: category.color, onClick: () => handleMonthClick(month.month) }, month.month))) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "p-4 bg-white/80 rounded-xl border border-gray-200", children: [_jsx("div", { className: "text-2xl font-bold text-heritage-green", children: monthData.reduce((acc, m) => acc + m.reportCount, 0) }), _jsx("div", { className: "text-sm text-gray-600", children: "Total Reports" })] }), _jsxs("div", { className: "p-4 bg-white/80 rounded-xl border border-gray-200", children: [_jsx("div", { className: "text-2xl font-bold text-heritage-green", children: monthData.filter(m => m.reportCount > 0).length }), _jsx("div", { className: "text-sm text-gray-600", children: "Active Months" })] }), _jsxs("div", { className: "p-4 bg-white/80 rounded-xl border border-gray-200", children: [_jsx("div", { className: "text-2xl font-bold text-heritage-green", children: "2025" }), _jsx("div", { className: "text-sm text-gray-600", children: "Current Year" })] })] })] }));
};
export default FolderView;
