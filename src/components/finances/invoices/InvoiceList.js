import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import CreateInvoiceModal from './CreateInvoiceModal';
const InvoiceList = ({ invoices, onInvoiceSelect, selectedInvoice, onInvoiceCreated }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        status: 'all',
        dateRange: 'all',
        searchTerm: ''
    });
    const [showAll, setShowAll] = useState(false);
    const itemsPerPage = 11;
    // Filter invoices based on current filters
    const filteredInvoices = invoices.filter(invoice => {
        // Status filter
        if (filters.status !== 'all' && invoice.status !== filters.status) {
            return false;
        }
        // Search term filter
        if (filters.searchTerm && !invoice.id.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
            !invoice.guestName.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
            !invoice.roomNumber.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
            return false;
        }
        // Date range filter (you can extend this based on your needs)
        if (filters.dateRange !== 'all') {
            const checkInDate = new Date(invoice.checkIn);
            const today = new Date();
            switch (filters.dateRange) {
                case 'today':
                    return checkInDate.toDateString() === today.toDateString();
                case 'week': {
                    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return checkInDate >= weekAgo;
                }
                case 'month': {
                    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                    return checkInDate >= monthAgo;
                }
                default:
                    return true;
            }
        }
        return true;
    });
    // Pagination logic
    const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentInvoices = filteredInvoices.slice(startIndex, endIndex);
    const totalItems = filteredInvoices.length;
    const visibleInvoices = showAll ? filteredInvoices : currentInvoices;
    const displayedStart = totalItems === 0 ? 0 : (showAll ? 1 : startIndex + 1);
    const displayedEnd = showAll ? totalItems : Math.min(endIndex, totalItems);
    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters.status, filters.dateRange, filters.searchTerm]);
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    // Export functionality
    const handleExportAll = () => {
        // Create CSV content using filtered invoices
        const headers = ['Invoice ID', 'Guest Name', 'Room Number', 'Check-in', 'Check-out', 'Status', 'Total Amount', 'Items Count'];
        const csvContent = [
            headers.join(','),
            ...filteredInvoices.map(invoice => [
                invoice.id,
                `"${invoice.guestName}"`,
                invoice.roomNumber,
                invoice.checkIn,
                invoice.checkOut,
                invoice.status,
                invoice.totalAmount.toFixed(2),
                invoice.items?.length || 0
            ].join(','))
        ].join('\n');
        // Create filename with filter info
        const filterSuffix = filters.status !== 'all' || filters.dateRange !== 'all' || filters.searchTerm ? '_filtered' : '';
        const fileName = `invoices_export${filterSuffix}_${new Date().toISOString().split('T')[0]}.csv`;
        // Create and download the file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const handleInvoiceCreated = (newInvoice) => {
        if (onInvoiceCreated) {
            onInvoiceCreated(newInvoice);
        }
        setIsCreateModalOpen(false);
    };
    return (_jsxs(_Fragment, { children: [_jsx("style", { children: `
        @keyframes table-slide-in {
          0% {
            opacity: 0;
            transform: translateX(-30px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        
        .animate-table-slide-in {
          animation: table-slide-in 0.7s ease-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(130, 163, 61, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(130, 163, 61, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(130, 163, 61, 0.5);
        }
      ` }), _jsxs("div", { className: "flex flex-col h-full overflow-hidden bg-white border shadow-md rounded-xl border-gray-200/70", children: [_jsxs("div", { className: "p-6 border-b border-gray-200/70 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsxs("h3", { className: "flex items-center gap-3 text-2xl font-black text-gray-900", children: [_jsx("div", { className: "p-2 bg-[#82A33D]/10 rounded-xl", children: _jsx("svg", { className: "w-6 h-6 text-[#82A33D]", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }) }), "Invoice Records"] }), _jsxs("p", { className: "flex items-center gap-2 mt-2 text-sm text-gray-600", children: [_jsx("span", { className: "inline-flex items-center px-2 py-1 bg-[#82A33D]/10 text-[#82A33D] rounded-lg text-xs font-semibold", children: showAll
                                                            ? `All ${totalItems}`
                                                            : totalItems === 0
                                                                ? '0 results'
                                                                : `${displayedStart}-${displayedEnd} of ${totalItems}` }), _jsx("span", { className: "text-gray-400", children: "\u2022" }), _jsx("span", { children: showAll ? 'All invoices' : 'Paginated view' })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("button", { onClick: () => setIsCreateModalOpen(true), className: "flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white transition-all shadow-lg bg-gradient-to-r from-heritage-green to-heritage-neutral rounded-xl hover:shadow-xl hover:scale-105", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }), _jsx("span", { children: "Create Invoice" })] }), _jsxs("button", { onClick: handleExportAll, className: "flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-[#82A33D] transition-all bg-white border-2 border-[#82A33D]/20 rounded-xl hover:bg-[#82A33D] hover:text-white hover:border-[#82A33D] shadow-sm hover:shadow-md", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" }) }), _jsx("span", { children: filters.status !== 'all' || filters.dateRange !== 'all' || filters.searchTerm
                                                            ? `Export ${filteredInvoices.length} Filtered`
                                                            : 'Export All' })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-3", children: [_jsxs("div", { className: "relative group", children: [_jsx("div", { className: "absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none", children: _jsx("svg", { className: "w-5 h-5 text-gray-400 group-focus-within:text-[#82A33D] transition-colors", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }) }), _jsx("input", { type: "text", placeholder: "Search invoices...", value: filters.searchTerm, onChange: (e) => setFilters({ ...filters, searchTerm: e.target.value }), className: "w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium placeholder:text-gray-400 hover:border-gray-300" })] }), _jsxs("select", { value: filters.status, onChange: (e) => setFilters({ ...filters, status: e.target.value }), className: "px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium hover:border-gray-300 cursor-pointer", children: [_jsx("option", { value: "all", children: "\uD83D\uDCCA All Status" }), _jsx("option", { value: "paid", children: "\u2705 Paid" }), _jsx("option", { value: "pending", children: "\u23F3 Pending" }), _jsx("option", { value: "overdue", children: "\u26A0\uFE0F Overdue" })] }), _jsxs("select", { value: filters.dateRange, onChange: (e) => setFilters({ ...filters, dateRange: e.target.value }), className: "px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium hover:border-gray-300 cursor-pointer", children: [_jsx("option", { value: "all", children: "\uD83D\uDCC5 All Dates" }), _jsx("option", { value: "today", children: "Today" }), _jsx("option", { value: "week", children: "This Week" }), _jsx("option", { value: "month", children: "This Month" })] })] })] }), _jsx("div", { className: "flex-1 overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase", children: "Invoice ID" }), _jsx("th", { className: "px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase", children: "Guest" }), _jsx("th", { className: "px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase", children: "Room" }), _jsx("th", { className: "px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase", children: "Status" }), _jsx("th", { className: "px-6 py-5 text-xs font-black tracking-wider text-right text-gray-700 uppercase", children: "Amount" }), _jsx("th", { className: "px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase", children: "Date" })] }) }), _jsxs("tbody", { className: "bg-white divide-y divide-gray-200", children: [visibleInvoices.map((invoice, index) => (_jsxs("tr", { onClick: () => {
                                                console.log('Invoice clicked:', invoice.id);
                                                onInvoiceSelect(invoice);
                                            }, style: { animationDelay: `${index * 50}ms`, height: '74px' }, className: `group cursor-pointer transition-all duration-300 hover:shadow-sm animate-fade-in ${selectedInvoice?.id === invoice.id
                                                ? 'bg-gradient-to-r from-[#82A33D]/10 via-[#82A33D]/5 to-transparent border-l-4 border-l-[#82A33D]'
                                                : 'hover:bg-gray-50'}`, children: [_jsx("td", { className: "px-6 py-5 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "flex items-center justify-center w-8 h-8 rounded-lg bg-[#82A33D]/10", children: _jsx("svg", { className: "w-4 h-4 text-[#82A33D]", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }) }), _jsxs("div", { children: [_jsx("div", { className: "text-sm font-bold text-gray-900 transition-colors group-hover:text-[#82A33D]", children: invoice.id }), _jsxs("div", { className: "text-xs font-medium text-gray-500", children: [invoice.items?.length || 0, " items"] })] })] }) }), _jsx("td", { className: "px-6 py-5 whitespace-nowrap", children: _jsxs("div", { children: [_jsx("div", { className: "text-sm font-bold text-gray-900 transition-colors group-hover:text-[#82A33D]", children: invoice.guestName }), _jsxs("div", { className: "text-xs font-medium text-gray-500", children: ["Stay: ", invoice.checkIn, " - ", invoice.checkOut] })] }) }), _jsx("td", { className: "px-6 py-5 text-center whitespace-nowrap", children: _jsx("div", { className: "text-sm font-semibold text-gray-900", children: invoice.roomNumber }) }), _jsx("td", { className: "px-6 py-5 text-center whitespace-nowrap", children: _jsxs("span", { className: `inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${invoice.status === 'paid'
                                                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                                                            : invoice.status === 'pending'
                                                                ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200'
                                                                : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200'}`, children: [_jsx("span", { className: `w-1.5 h-1.5 mr-2 rounded-full ${invoice.status === 'paid'
                                                                    ? 'bg-emerald-500'
                                                                    : invoice.status === 'pending'
                                                                        ? 'bg-amber-500'
                                                                        : 'bg-red-500'}` }), invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)] }) }), _jsx("td", { className: "px-6 py-5 text-right whitespace-nowrap", children: _jsxs("div", { className: "text-sm font-bold text-gray-900", children: ["$", invoice.totalAmount.toFixed(2)] }) }), _jsxs("td", { className: "px-6 py-5 text-center whitespace-nowrap", children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: invoice.checkIn }), _jsx("div", { className: "text-xs font-medium text-gray-500", children: invoice.checkOut })] })] }, invoice.id))), !showAll && totalItems > 0 &&
                                            Array.from({ length: Math.max(0, itemsPerPage - currentInvoices.length) }).map((_, index) => (_jsx("tr", { style: { height: '74px' }, className: "border-gray-200 border-dashed bg-gray-50/30", children: _jsx("td", { className: "px-6 py-5", colSpan: 6, children: _jsxs("div", { className: "flex items-center justify-center text-sm font-medium text-gray-300 opacity-60", children: [_jsx("div", { className: "w-2 h-2 mr-2 bg-gray-300 rounded-full opacity-40" }), "Empty slot ", index + 1] }) }) }, `empty-${index}`)))] })] }) }), totalItems === 0 && (_jsxs("div", { className: "py-12 text-center", children: [_jsx("div", { className: "mb-4 text-5xl text-gray-400", children: "\uD83D\uDD0D" }), _jsx("p", { className: "font-medium text-gray-500", children: "No invoices found" }), _jsx("p", { className: "mt-1 text-sm text-gray-400", children: "Try adjusting your search or filters" })] })), !showAll && totalPages > 1 && (_jsx("div", { className: "p-4 border-t border-gray-100 bg-white/50", children: _jsx("div", { className: "flex items-center justify-center", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { onClick: () => handlePageChange(Math.max(1, currentPage - 1)), disabled: currentPage === 1, className: "inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }), _jsx("span", { className: "ml-1", children: "Previous" })] }), _jsx("div", { className: "flex items-center space-x-2", children: Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                                            let pageNum;
                                            if (totalPages <= 7) {
                                                pageNum = i + 1;
                                            }
                                            else {
                                                const start = Math.max(1, Math.min(currentPage - 3, totalPages - 6));
                                                pageNum = start + i;
                                            }
                                            const isActive = pageNum === currentPage;
                                            return (_jsx("button", { onClick: () => handlePageChange(pageNum), className: `inline-flex items-center justify-center min-w-[38px] h-10 px-3 text-sm font-medium rounded-md transition-all ${isActive ? 'bg-gradient-to-r from-heritage-green to-heritage-neutral text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'}`, "aria-current": isActive ? 'page' : undefined, children: pageNum }, pageNum));
                                        }) }), _jsxs("button", { onClick: () => handlePageChange(Math.min(totalPages, currentPage + 1)), disabled: currentPage === totalPages, className: "inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed", children: [_jsx("span", { className: "mr-1", children: "Next" }), _jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })] })] }) }) }))] }), _jsx(CreateInvoiceModal, { isOpen: isCreateModalOpen, onClose: () => setIsCreateModalOpen(false), onInvoiceCreated: handleInvoiceCreated })] }));
};
export default InvoiceList;
