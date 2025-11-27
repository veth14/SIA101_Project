import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
export const ItemsPagination = ({ searchTerm, selectedCategory, items, currentPage, onPageChange, }) => {
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
    // Calculate pagination
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    console.log('ItemsPagination - Current Page:', currentPage, 'Total Pages:', totalPages, 'Filtered Items:', filteredItems.length);
    const getPaginationRange = () => {
        const range = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        const end = Math.min(totalPages, start + maxVisible - 1);
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }
        for (let i = start; i <= end; i++) {
            range.push(i);
        }
        return range;
    };
    // Only show pagination if there are multiple pages
    if (totalPages <= 1) {
        return null;
    }
    return (_jsx("div", { className: "flex items-center justify-center pt-6 pb-4", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("button", { onClick: () => onPageChange(currentPage - 1), disabled: currentPage === 1, className: `inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'} transition-colors`, children: [_jsx("svg", { className: "w-4 h-4 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }), "Previous"] }), _jsx("div", { className: "flex items-center space-x-1", children: getPaginationRange().map((page) => (_jsx("button", { onClick: () => onPageChange(page), className: `inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-md transition-colors ${page === currentPage
                            ? 'bg-heritage-green text-white'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`, children: page }, page))) }), _jsxs("button", { onClick: () => onPageChange(currentPage + 1), disabled: currentPage === totalPages, className: `inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${currentPage === totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'} transition-colors`, children: ["Next", _jsx("svg", { className: "w-4 h-4 ml-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })] })] }) }));
};
