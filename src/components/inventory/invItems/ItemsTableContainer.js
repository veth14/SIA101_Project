import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState, useEffect, useRef } from 'react';
// Category Dropdown Component
export const CategoryDropdown = ({ selectedCategory, onCategoryChange, categoryOptions }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
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
    const handleCategorySelect = (category) => {
        onCategoryChange(category);
        setIsOpen(false);
    };
    return (_jsxs("div", { className: "relative z-[100000]", ref: dropdownRef, children: [_jsxs("div", { className: "relative group", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-heritage-green/20 to-emerald-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" }), _jsxs("button", { onClick: () => setIsOpen(!isOpen), className: "relative flex items-center justify-between px-6 py-3 w-48 border border-white/40 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-heritage-green/50 focus:border-heritage-green/50 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300 cursor-pointer hover:bg-white/90", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-2 h-2 bg-gradient-to-r from-heritage-green to-emerald-500 rounded-full" }), _jsx("span", { className: "text-gray-800", children: categoryOptions.find(option => option.value === selectedCategory)?.label || selectedCategory })] }), _jsx("svg", { className: `w-4 h-4 text-heritage-green transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })] })] }), isOpen && (_jsx("div", { className: "absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[99999]", children: categoryOptions.map((option) => (_jsxs("button", { onClick: () => handleCategorySelect(option.value), className: `w-full flex items-center justify-between px-6 py-3 text-left text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-heritage-green/10 hover:to-emerald-500/10 ${selectedCategory === option.value
                        ? 'bg-gradient-to-r from-heritage-green/20 to-emerald-500/20 text-heritage-green border-l-4 border-heritage-green'
                        : 'text-gray-700 hover:text-heritage-green'}`, children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: `w-2 h-2 rounded-full transition-all duration-200 ${selectedCategory === option.value
                                        ? 'bg-gradient-to-r from-heritage-green to-emerald-500'
                                        : 'bg-gray-300'}` }), _jsx("span", { className: "flex-1", children: option.label })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [option.value !== 'All Categories' && (_jsx("span", { className: "text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full", children: option.count })), selectedCategory === option.value && (_jsx("svg", { className: "w-4 h-4 text-heritage-green", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }))] })] }, option.value))) })), isOpen && (_jsx("div", { className: "fixed inset-0 z-[99998]", onClick: () => setIsOpen(false) }))] }));
};
// Stock Status Dropdown Component
export const StockStatusDropdown = ({ selectedStockStatus, onStockStatusChange, stockStatusOptions }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
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
        onStockStatusChange(status);
        setIsOpen(false);
    };
    return (_jsxs("div", { className: "relative z-[100000]", ref: dropdownRef, children: [_jsxs("div", { className: "relative group", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-heritage-green/20 to-emerald-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" }), _jsxs("button", { onClick: () => setIsOpen(!isOpen), className: "relative flex items-center justify-between px-6 py-3 w-44 border border-white/40 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-heritage-green/50 focus:border-heritage-green/50 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300 cursor-pointer hover:bg-white/90", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-2 h-2 bg-gradient-to-r from-heritage-green to-emerald-500 rounded-full" }), _jsx("span", { className: "text-gray-800", children: stockStatusOptions.find(option => option.value === selectedStockStatus)?.label || selectedStockStatus })] }), _jsx("svg", { className: `w-4 h-4 text-heritage-green transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })] })] }), isOpen && (_jsx("div", { className: "absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[99999]", children: stockStatusOptions.map((option) => (_jsxs("button", { onClick: () => handleStatusSelect(option.value), className: `w-full flex items-center justify-between px-6 py-3 text-left text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-heritage-green/10 hover:to-emerald-500/10 ${selectedStockStatus === option.value
                        ? 'bg-gradient-to-r from-heritage-green/20 to-emerald-500/20 text-heritage-green border-l-4 border-heritage-green'
                        : 'text-gray-700 hover:text-heritage-green'}`, children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: `w-2 h-2 rounded-full transition-all duration-200 ${selectedStockStatus === option.value
                                        ? 'bg-gradient-to-r from-heritage-green to-emerald-500'
                                        : 'bg-gray-300'}` }), _jsx("span", { className: "flex-1", children: option.label })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [option.value !== 'all' && (_jsx("span", { className: "text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full", children: option.count })), selectedStockStatus === option.value && (_jsx("svg", { className: "w-4 h-4 text-heritage-green", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }))] })] }, option.value))) })), isOpen && (_jsx("div", { className: "fixed inset-0 z-[99998]", onClick: () => setIsOpen(false) }))] }));
};
export const ItemsTableContainer = ({ searchTerm, selectedCategory, items, currentPage, onPageChange, onViewDetails = () => { } }) => {
    const itemsPerPage = 6;
    // Filter items based on search term and selected category
    const filteredItems = useMemo(() => {
        if (!items || items.length === 0) {
            return [];
        }
        return items.filter(item => {
            // Search filter - check if search term is empty or matches any field
            const searchLower = (searchTerm || '').toLowerCase().trim();
            const matchesSearch = searchLower === '' ||
                (item.id && item.id.toLowerCase().includes(searchLower)) ||
                (item.name && item.name.toLowerCase().includes(searchLower)) ||
                (item.category && item.category.toLowerCase().includes(searchLower)) ||
                (item.supplier && item.supplier.toLowerCase().includes(searchLower)) ||
                (item.location && item.location.toLowerCase().includes(searchLower));
            // Category filter
            const matchesCategory = !selectedCategory ||
                selectedCategory === 'All Categories' ||
                item.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [items, searchTerm, selectedCategory]);
    // Calculate pagination based on currentPage
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredItems.slice(startIndex, endIndex);
    const getStatusColor = (currentStock, reorderLevel) => {
        if (currentStock === 0) {
            return 'bg-red-100 text-red-800 border-red-200';
        }
        else if (currentStock <= reorderLevel) {
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
        else {
            return 'bg-green-100 text-green-800 border-green-200';
        }
    };
    const getStatusText = (currentStock, reorderLevel) => {
        if (currentStock === 0) {
            return 'Out of Stock';
        }
        else if (currentStock <= reorderLevel) {
            return 'Low Stock';
        }
        else {
            return 'In Stock';
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { style: { height: '480px' }, children: _jsxs("table", { className: "w-full h-full", children: [_jsx("thead", { className: "bg-gray-50 border-b border-gray-200", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider", children: "Item ID" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider", children: "Name" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider", children: "Category" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider", children: "Stock" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider", children: "Status" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider", children: "Supplier" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: Array.from({ length: 6 }).map((_, index) => {
                                const item = currentItems[index];
                                if (item) {
                                    return (_jsxs("tr", { className: "hover:bg-gray-50 transition-colors duration-200 h-16", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "text-sm font-medium text-gray-900 font-mono", children: item.id }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center", children: _jsx("svg", { className: "w-4 h-4 text-blue-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" }) }) }), _jsx("span", { className: "text-sm font-medium text-gray-900", children: item.name })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("span", { className: "inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-heritage-green/10 text-heritage-green border border-heritage-green/20", children: ["\uD83D\uDCC2 ", item.category === 'Housekeeping' ? 'Housekeeping Supplies' : item.category] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { children: [_jsxs("div", { className: "text-sm font-medium text-gray-900", children: [item.currentStock, " ", item.unit] }), _jsxs("div", { className: "text-xs text-gray-500", children: ["Min: ", item.reorderLevel] })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("span", { className: `inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(item.currentStock, item.reorderLevel)}`, children: [_jsx("div", { className: "w-2 h-2 rounded-full mr-2 bg-current opacity-60" }), getStatusText(item.currentStock, item.reorderLevel)] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "text-sm font-medium text-gray-900", children: item.supplier }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("button", { onClick: () => onViewDetails(item), className: "inline-flex items-center px-3 py-1.5 text-sm font-medium text-heritage-green bg-heritage-green/10 border border-heritage-green/30 rounded-lg hover:bg-heritage-green hover:text-white transition-all duration-200 group", children: [_jsxs("svg", { className: "w-4 h-4 mr-1 group-hover:scale-110 transition-transform", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }), _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" })] }), "View Details"] }) })] }, item.id));
                                }
                                else {
                                    return (_jsxs("tr", { className: "h-16", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "text-sm text-gray-400", children: "-" }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "text-sm text-gray-400", children: "-" }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "text-sm text-gray-400", children: "-" }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "text-sm text-gray-400", children: "-" }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "text-sm text-gray-400", children: "-" }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "text-sm text-gray-400", children: "-" }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "text-sm text-gray-400", children: "-" }) })] }, `empty-${index}`));
                                }
                            }) })] }) }), totalPages > 1 && (_jsx("div", { className: "flex items-center justify-center pt-6 pb-4 bg-white border-t border-gray-100", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("button", { onClick: () => onPageChange(currentPage - 1), disabled: currentPage === 1, className: `inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${currentPage === 1
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'} transition-colors`, children: [_jsx("svg", { className: "w-4 h-4 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }), "Previous"] }), _jsx("div", { className: "flex items-center space-x-1", children: Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const page = i + 1;
                                return (_jsx("button", { onClick: () => onPageChange(page), className: `inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-md transition-colors ${page === currentPage
                                        ? 'bg-heritage-green text-white'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`, children: page }, page));
                            }) }), _jsxs("button", { onClick: () => onPageChange(currentPage + 1), disabled: currentPage === totalPages, className: `inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${currentPage === totalPages
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'} transition-colors`, children: ["Next", _jsx("svg", { className: "w-4 h-4 ml-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })] })] }) }))] }));
};
