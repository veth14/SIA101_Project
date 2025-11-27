import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
export const DataTable = ({ columns, data, loading = false, onSort, onRowClick, actions }) => {
    const [sortKey, setSortKey] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');
    const handleSort = (key) => {
        if (!onSort)
            return;
        const direction = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortKey(key);
        setSortDirection(direction);
        onSort(key, direction);
    };
    if (loading) {
        return (_jsx("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200", children: _jsxs("div", { className: "p-8 text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-heritage-green mx-auto" }), _jsx("p", { className: "mt-2 text-sm text-gray-500", children: "Loading..." })] }) }));
    }
    return (_jsx("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [columns.map((column) => (_jsx("th", { className: `px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}`, onClick: () => column.sortable && handleSort(column.key), children: _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx("span", { children: column.label }), column.sortable && (_jsx("svg", { className: `w-4 h-4 ${sortKey === column.key
                                                    ? 'text-heritage-green'
                                                    : 'text-gray-400'}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: sortKey === column.key && sortDirection === 'desc'
                                                        ? 'M5 15l7-7 7 7'
                                                        : 'M19 9l-7 7-7-7' }) }))] }) }, column.key))), actions && (_jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" }))] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: data.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: columns.length + (actions ? 1 : 0), className: "px-6 py-8 text-center text-sm text-gray-500", children: "No data available" }) })) : (data.map((row, index) => (_jsxs("tr", { className: `hover:bg-gray-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`, onClick: () => onRowClick && onRowClick(row), children: [columns.map((column) => (_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: column.render
                                        ? column.render(row[column.key], row)
                                        : row[column.key] }, column.key))), actions && (_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: actions(row) }))] }, index)))) })] }) }) }));
};
