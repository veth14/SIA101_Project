import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import ReportsFilter from './ReportsFilter';
import ReportFoldersGrid from './ReportFoldersGrid';
import FolderView from './FolderView';
import ArchiveSection from './ArchiveSection';
import GenerateReportModal from './GenerateReportModal';
import SearchResults from './SearchResults';
const FinancialReportsPage = () => {
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedYear, setSelectedYear] = useState(2025);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [activeTab, setActiveTab] = useState('reports');
    const [isModalOpen, setIsModalOpen] = useState(false);
    // removed artificial loading/skeleton delay — render immediately
    const handleFolderClick = (categoryId) => {
        setSelectedFolder(categoryId);
    };
    const handleBackToFolders = () => {
        setSelectedFolder(null);
    };
    const handleCloseSearch = () => {
        setSearchQuery('');
    };
    const handleOpenReport = (report) => {
    };
    return (_jsxs("div", { className: "relative min-h-screen bg-[#F9F6EE]", children: [_jsx("style", { children: `@keyframes fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in { animation: fade-in 360ms ease-out; animation-fill-mode: both; }` }), _jsxs("div", { className: "fixed inset-0 pointer-events-none", children: [_jsx("div", { className: "absolute rounded-full top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 blur-3xl animate-pulse opacity-30" }), _jsx("div", { className: "absolute delay-1000 rounded-full opacity-25 top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 blur-3xl animate-pulse" }), _jsx("div", { className: "absolute rounded-full bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 blur-3xl animate-pulse delay-2000 opacity-20" }), _jsx("div", { className: "absolute inset-0 opacity-5", children: _jsx("div", { className: "absolute inset-0", style: {
                                backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(134, 134, 134, 0.1) 1px, transparent 0)',
                                backgroundSize: '50px 50px'
                            } }) })] }), _jsxs("div", { className: "relative z-10 w-full px-2 py-4 space-y-6 sm:px-4 lg:px-6", children: [_jsx("div", { className: "relative flex justify-center mb-4 mt-1", children: _jsx("div", { className: "w-full max-w-3xl p-2 border shadow-lg rounded-3xl bg-gradient-to-br from-white via-emerald-50/30 to-green-100/20 border-emerald-200/40 backdrop-blur-sm", children: _jsxs("div", { className: "relative flex items-center justify-center px-3 py-3 overflow-hidden rounded-2xl bg-gradient-to-b from-white/50 to-emerald-50/30", children: [_jsx("div", { "aria-hidden": true, className: `absolute top-1.5 bottom-1.5 w-1/2 rounded-2xl shadow-lg transition-all duration-300 ease-in-out ${activeTab === 'reports' ? 'translate-x-0' : 'translate-x-full'}`, style: {
                                            left: 6,
                                            background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(240,253,244,0.95) 100%)',
                                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15), 0 2px 4px rgba(0, 0, 0, 0.08), inset 0 1px 2px rgba(255,255,255,0.5)'
                                        } }), _jsxs("div", { role: "tablist", "aria-label": "Reports tabs", className: "relative z-10 flex items-center justify-center w-full gap-3", children: [_jsx("button", { role: "tab", "aria-selected": activeTab === 'reports', tabIndex: 0, onClick: () => setActiveTab('reports'), className: `group z-20 flex items-center justify-center flex-1 text-center px-6 py-2.5 text-[13px] font-bold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-300/50 leading-tight ${activeTab === 'reports'
                                                    ? 'text-emerald-900 scale-[1.02]'
                                                    : 'text-emerald-700/80 hover:text-emerald-800 hover:scale-[1.01]'}`, children: _jsx("span", { className: "font-extrabold tracking-wide", children: "Reports" }) }), _jsx("button", { role: "tab", "aria-selected": activeTab === 'archive', tabIndex: 0, onClick: () => setActiveTab('archive'), className: `group z-20 flex items-center justify-center flex-1 text-center px-6 py-2.5 text-[13px] font-bold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-300/50 leading-tight ${activeTab === 'archive'
                                                    ? 'text-emerald-900 scale-[1.02]'
                                                    : 'text-emerald-700/80 hover:text-emerald-800 hover:scale-[1.01]'}`, children: _jsx("span", { className: "font-extrabold tracking-wide", children: "Archive" }) })] })] }) }) }), activeTab === 'reports' ? (selectedFolder ? (
                    // Folder View (with months and reports) - Card shell matching other finances panels
                    _jsxs("div", { className: "relative overflow-hidden border shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60 p-6 lg:p-8 animate-fade-in", children: [_jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-heritage-green/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" }), _jsx("div", { className: "absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-heritage-neutral/5 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" }), _jsxs("div", { className: "relative z-10 space-y-6", children: [_jsx("div", { className: "animate-fade-in", children: _jsx(ReportsFilter, { searchQuery: searchQuery, onSearchChange: setSearchQuery, selectedYear: selectedYear, onYearChange: setSelectedYear, selectedCategory: selectedCategory, onCategoryChange: setSelectedCategory, onGenerateClick: () => setIsModalOpen(true) }) }), _jsx(FolderView, { categoryId: selectedFolder, onBack: handleBackToFolders })] })] })) : (
                    // Main Folders / Search Results card - matches other finances panels
                    _jsxs("div", { className: "relative overflow-hidden border shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60 p-6 lg:p-8 animate-fade-in", children: [_jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-heritage-green/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" }), _jsx("div", { className: "absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-heritage-neutral/5 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" }), _jsxs("div", { className: "relative z-10 space-y-6", children: [_jsx("div", { className: "animate-fade-in", children: _jsx(ReportsFilter, { searchQuery: searchQuery, onSearchChange: setSearchQuery, selectedYear: selectedYear, onYearChange: setSelectedYear, selectedCategory: selectedCategory, onCategoryChange: setSelectedCategory, onGenerateClick: () => setIsModalOpen(true) }) }), searchQuery.trim() ? (_jsx(SearchResults, { searchQuery: searchQuery, onClose: handleCloseSearch, onOpenReport: handleOpenReport })) : (_jsx(ReportFoldersGrid, { onFolderClick: handleFolderClick, selectedCategory: selectedCategory, searchQuery: searchQuery }))] })] }))) : (_jsxs("div", { className: "relative overflow-hidden border shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60 p-6 lg:p-8 animate-fade-in", children: [_jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-heritage-green/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" }), _jsx("div", { className: "absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-heritage-neutral/5 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" }), _jsxs("div", { className: "relative z-10 space-y-6", children: [_jsx("div", { className: "animate-fade-in", children: _jsx(ReportsFilter, { searchQuery: searchQuery, onSearchChange: setSearchQuery, selectedYear: selectedYear, onYearChange: setSelectedYear, selectedCategory: selectedCategory, onCategoryChange: setSelectedCategory, onGenerateClick: () => setIsModalOpen(true) }) }), _jsx(ArchiveSection, { searchQuery: searchQuery })] })] }))] }), _jsx(GenerateReportModal, { isOpen: isModalOpen, onClose: () => setIsModalOpen(false) })] }));
};
export default FinancialReportsPage;
