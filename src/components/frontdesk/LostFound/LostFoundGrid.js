import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 *
 * Displays a paginated grid of lost and found items using LostFoundCard components.
 * Shows maximum 6 items per page with pagination controls.
 */
import { useState, useEffect, useMemo, useRef } from 'react';
// Status Dropdown Component
const StatusDropdown = ({ selectedStatus, onStatusChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const statuses = [
        'All Status',
        'Unclaimed',
        'Claimed',
        'Disposed'
    ];
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    const handleStatusSelect = (status) => {
        onStatusChange(status);
        setIsOpen(false);
    };
    return (_jsxs("div", { className: "relative z-[100000]", ref: dropdownRef, children: [_jsxs("div", { className: "relative group", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-heritage-green/20 to-emerald-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" }), _jsxs("button", { onClick: () => setIsOpen(!isOpen), className: "relative flex items-center justify-between px-6 py-3 w-full min-[1370px]:w-48 border border-white/40 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-heritage-green/50 focus:border-heritage-green/50 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300 cursor-pointer hover:bg-white/90", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-2 h-2 bg-gradient-to-r from-heritage-green to-emerald-500 rounded-full" }), _jsx("span", { className: "text-gray-800", children: selectedStatus })] }), _jsx("svg", { className: `w-4 h-4 text-heritage-green transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })] })] }), isOpen && (_jsx("div", { className: "absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[99999]", children: statuses.map((status) => (_jsxs("button", { onClick: () => handleStatusSelect(status), className: `w-full flex items-center space-x-3 px-6 py-3 text-left text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-heritage-green/10 hover:to-emerald-500/10 ${selectedStatus === status
                        ? 'bg-gradient-to-r from-heritage-green/20 to-emerald-500/20 text-heritage-green border-l-4 border-heritage-green'
                        : 'text-gray-700 hover:text-heritage-green'}`, children: [_jsx("div", { className: `w-2 h-2 rounded-full transition-all duration-200 ${selectedStatus === status
                                ? 'bg-gradient-to-r from-heritage-green to-emerald-500'
                                : 'bg-gray-300'}` }), _jsx("span", { className: "flex-1", children: status }), selectedStatus === status && (_jsx("svg", { className: "w-4 h-4 text-heritage-green", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }))] }, status))) })), isOpen && (_jsx("div", { className: "fixed inset-0 z-[99998]", onClick: () => setIsOpen(false) }))] }));
};
/**
 * Grid component for displaying lost and found items with pagination
 *
 * @param items - Array of lost and found items
 * @param onViewDetails - Function to handle viewing item details
 * @param onMarkClaimed - Function to handle marking item as claimed
 */
// Small reusable badge component to avoid duplication
const StatusBadge = ({ status }) => (_jsx("span", { className: `inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${status === 'claimed'
        ? 'bg-green-100 text-green-800 border border-green-200'
        : status === 'disposed'
            ? 'bg-red-100 text-red-800 border border-red-200'
            : 'bg-blue-100 text-blue-800 border border-blue-200'}`, children: status === 'claimed' ? 'Claimed' : status === 'disposed' ? 'Disposed' : 'Unclaimed' }));
// Shared actions used both in table rows and mobile cards
const ItemActions = ({ item, onViewDetails, onMarkClaimed }) => (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("button", { onClick: () => onViewDetails(item), className: "inline-flex items-center px-3 py-1.5 text-sm font-medium text-heritage-green bg-heritage-green/10 border border-heritage-green/30 rounded-lg hover:bg-heritage-green hover:text-white transition-all duration-200", children: [_jsxs("svg", { className: "w-4 h-4 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }), _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" })] }), "View"] }), item.status !== 'claimed' && (_jsxs("button", { onClick: () => onMarkClaimed(item), className: "inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-all duration-200", children: [_jsx("svg", { className: "w-4 h-4 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }), "Claim"] }))] }));
const LostFoundGrid = ({ items, activeTab, onViewDetails, onMarkClaimed }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All Status');
    const itemsPerPage = 6;
    // Reset to page 1 when items change (e.g., after filtering)
    useEffect(() => {
        setCurrentPage(1);
    }, [items]);
    // Create a new blank item and open the details view (used by Add Item button)
    const handleAddNew = () => {
        const newItem = {
            id: `new-${Date.now()}`,
            itemName: '',
            description: '',
            category: 'other',
            location: '',
            dateFound: new Date().toISOString(),
            foundBy: '',
            status: 'unclaimed'
        };
        onViewDetails(newItem);
    };
    // Filter items based on search term and selected status
    const filteredItems = useMemo(() => {
        if (!items || items.length === 0) {
            return [];
        }
        return items.filter(item => {
            // Search filter - check if search term is empty or matches any field
            const searchLower = (searchTerm || '').toLowerCase().trim();
            const matchesSearch = searchLower === '' ||
                (item.id && item.id.toLowerCase().includes(searchLower)) ||
                (item.itemName && item.itemName.toLowerCase().includes(searchLower)) ||
                (item.category && item.category.toLowerCase().includes(searchLower)) ||
                (item.location && item.location.toLowerCase().includes(searchLower)) ||
                (item.foundBy && item.foundBy.toLowerCase().includes(searchLower));
            // Status filter
            const matchesStatus = !selectedStatus ||
                selectedStatus === 'All Status' ||
                item.status.toLowerCase() === selectedStatus.toLowerCase();
            return matchesSearch && matchesStatus;
        });
    }, [items, searchTerm, selectedStatus]);
    // Calculate pagination
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredItems.slice(startIndex, endIndex);
    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedStatus]);
    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        if (totalPages <= maxVisiblePages) {
            // Show all pages if total is less than max visible
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        }
        else {
            // Show smart pagination
            if (currentPage <= 3) {
                // Show first 5 pages
                for (let i = 1; i <= 5; i++) {
                    pages.push(i);
                }
            }
            else if (currentPage >= totalPages - 2) {
                // Show last 5 pages
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pages.push(i);
                }
            }
            else {
                // Show current page and 2 on each side
                for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                    pages.push(i);
                }
            }
        }
        return pages;
    };
    // Show empty state if no items
    if (items.length === 0) {
        return (_jsx("div", { className: "bg-white rounded-lg border border-gray-200 shadow-sm", children: _jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83D\uDD0D" }), _jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-2", children: "No items found" }), _jsx("p", { className: "text-gray-600", children: "Try adjusting your search criteria or filters." })] }) }));
    }
    return (_jsxs("div", { className: "bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden", children: [_jsx("div", { className: "px-4 sm:px-8 py-6 bg-gradient-to-r from-slate-50 to-white border-b border-gray-200/50", children: _jsxs("div", { className: "flex flex-col min-[1370px]:flex-row min-[1370px]:items-center min-[1370px]:justify-between", children: [_jsxs("div", { className: "flex items-center space-x-4 mb-4 min-[1370px]:mb-0", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl", children: _jsx("svg", { className: "w-5 h-5 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }), _jsx("div", { className: "absolute -inset-1 bg-gradient-to-r from-heritage-green to-emerald-400 rounded-2xl blur opacity-30" })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-black text-gray-900", children: "Lost & Found Items" }), _jsxs("p", { className: "text-sm text-gray-500 font-medium", children: ["Showing ", startIndex + 1, "-", Math.min(endIndex, filteredItems.length), " of ", filteredItems.length, " items \u2022 Page ", currentPage, " of ", totalPages, searchTerm && _jsxs("span", { className: "ml-2 text-heritage-green", children: ["\u2022 Searching: \"", searchTerm, "\""] }), selectedStatus !== 'All Status' && _jsxs("span", { className: "ml-2 text-blue-600", children: ["\u2022 Status: ", selectedStatus] })] })] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0 min-[1370px]:space-y-0", children: [_jsxs("div", { className: "relative group w-full sm:w-auto", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-heritage-green/20 to-emerald-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" }), _jsxs("div", { className: "relative flex items-center", children: [_jsx("svg", { className: "absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-heritage-green z-10", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }), _jsx("input", { type: "text", placeholder: "Search items, categories, or locations...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-12 pr-6 py-3 w-full sm:w-80 md:w-72 min-[1370px]:w-80 border border-white/40 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-heritage-green/50 focus:border-heritage-green/50 bg-white/70 backdrop-blur-sm shadow-lg placeholder-gray-500 transition-all duration-300" })] })] }), _jsx("div", { className: "w-full sm:w-auto", children: _jsx(StatusDropdown, { selectedStatus: selectedStatus, onStatusChange: setSelectedStatus }) }), _jsx("div", { className: "w-full sm:w-auto", children: _jsxs("button", { onClick: handleAddNew, className: "w-full sm:w-auto min-[1370px]:w-auto inline-flex justify-center items-center px-6 py-3 bg-gradient-to-r from-heritage-green to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:from-heritage-green/90 hover:to-emerald-600/90 hover:shadow-xl transition-all duration-300 transform hover:scale-105", children: [_jsx("svg", { className: "w-5 h-5 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6v6m0 0v6m0-6h6m-6 0H6" }) }), "Add Item"] }) })] })] }) }), _jsx("div", { className: "min-[1370px]:hidden px-4 py-4", children: currentItems.length === 0 ? (_jsx("div", { className: "text-center text-sm text-gray-500", children: "No items to display" })) : (_jsx("div", { className: "space-y-4", children: currentItems.map((item) => (_jsxs("div", { className: "bg-white border border-gray-200 rounded-xl p-4 shadow-sm", children: [_jsx("div", { className: "flex items-start justify-between", children: _jsxs("div", { className: "flex-1 pr-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm font-mono text-gray-700", children: item.id }), _jsx("div", { className: "text-lg font-semibold text-gray-900", children: item.itemName || '-' })] }), _jsx("div", { children: _jsx("span", { className: "inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-heritage-green/10 text-heritage-green border border-heritage-green/20", children: item.category }) })] }), _jsx("div", { className: "mt-2 text-sm text-gray-600", children: item.location }), _jsx("div", { className: "mt-2", children: _jsx(StatusBadge, { status: item.status }) })] }) }), _jsx("div", { className: "mt-3 flex space-x-2", children: _jsx(ItemActions, { item: item, onViewDetails: onViewDetails, onMarkClaimed: onMarkClaimed }) })] }, item.id))) })) }), _jsx("div", { className: "hidden min-[1370px]:block", style: { height: '480px' }, children: _jsxs("table", { className: "w-full h-full", children: [_jsx("thead", { className: "bg-gray-50 border-b border-gray-200", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider", children: "Item ID" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider", children: "Item Name" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider", children: "Category" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider", children: activeTab === 'found' ? 'Location Found' : 'Location Lost' }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider", children: "Status" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider", children: activeTab === 'found' ? 'Date Found' : 'Date Lost' }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: Array.from({ length: 6 }).map((_, index) => {
                                const item = currentItems[index];
                                if (item) {
                                    return (_jsxs("tr", { className: "hover:bg-gray-50 transition-colors duration-200 h-16", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "text-sm font-medium text-gray-900 font-mono", children: item.id }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center", children: _jsx("svg", { className: "w-4 h-4 text-blue-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" }) }) }), _jsx("span", { className: "text-sm font-medium text-gray-900", children: item.itemName })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("span", { className: "inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-heritage-green/10 text-heritage-green border border-heritage-green/20", children: ["\uD83D\uDCC2 ", item.category] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "text-sm font-medium text-gray-900", children: item.location }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx(StatusBadge, { status: item.status }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "text-sm font-medium text-gray-900", children: new Date(item.dateFound).toLocaleDateString() }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx(ItemActions, { item: item, onViewDetails: onViewDetails, onMarkClaimed: onMarkClaimed }) })] }, item.id));
                                }
                                else {
                                    return (_jsxs("tr", { className: "h-16", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "text-sm text-gray-400", children: "-" }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "text-sm text-gray-400", children: "-" }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "text-sm text-gray-400", children: "-" }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "text-sm text-gray-400", children: "-" }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "text-sm text-gray-400", children: "-" }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "text-sm text-gray-400", children: "-" }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "text-sm text-gray-400", children: "-" }) })] }, `empty-${index}`));
                                }
                            }) })] }) }), totalPages > 1 && (_jsx("div", { className: "flex items-center justify-center pt-6 pb-4 bg-white border-t border-gray-100", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("button", { onClick: () => setCurrentPage(prev => Math.max(prev - 1, 1)), disabled: currentPage === 1, className: `inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${currentPage === 1
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'} transition-colors`, children: [_jsx("svg", { className: "w-4 h-4 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }), "Previous"] }), _jsx("div", { className: "flex items-center space-x-1", children: getPageNumbers().map((pageNum) => (_jsx("button", { onClick: () => setCurrentPage(pageNum), className: `inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-md transition-colors ${currentPage === pageNum
                                    ? 'bg-heritage-green text-white'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`, children: pageNum }, pageNum))) }), _jsxs("button", { onClick: () => setCurrentPage(prev => Math.min(prev + 1, totalPages)), disabled: currentPage === totalPages, className: `inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${currentPage === totalPages
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'} transition-colors`, children: ["Next", _jsx("svg", { className: "w-4 h-4 ml-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })] })] }) }))] }));
};
export default LostFoundGrid;
