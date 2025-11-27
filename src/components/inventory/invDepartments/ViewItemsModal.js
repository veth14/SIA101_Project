import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ReactDOM from 'react-dom';
export const ViewItemsModal = ({ isOpen, onClose, departmentName, items, isLoading = false, }) => {
    if (!isOpen)
        return null;
    const getStatusBadge = (status, stock, reorderLevel = 10) => {
        let finalStatus = status;
        let statusConfig;
        // Determine status based on stock if not explicitly set
        if (stock === 0) {
            finalStatus = 'out-of-stock';
        }
        else if (stock <= reorderLevel) {
            finalStatus = 'low-stock';
        }
        else {
            finalStatus = 'available';
        }
        const configs = {
            'available': {
                color: 'bg-green-100 text-green-700',
                dotColor: 'bg-green-500',
                label: 'Available'
            },
            'low-stock': {
                color: 'bg-yellow-100 text-yellow-700',
                dotColor: 'bg-yellow-500',
                label: 'Low Stock'
            },
            'out-of-stock': {
                color: 'bg-red-100 text-red-700',
                dotColor: 'bg-red-500',
                label: 'Out of Stock'
            },
            'maintenance': {
                color: 'bg-blue-100 text-blue-700',
                dotColor: 'bg-blue-500',
                label: 'Maintenance'
            }
        };
        statusConfig = configs[finalStatus] || configs['available'];
        return (_jsxs("span", { className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${statusConfig.color}`, children: [_jsx("span", { className: `w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}` }), statusConfig.label] }));
    };
    const modalContent = (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4", style: { margin: 0 }, children: _jsxs("div", { className: "bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[85vh] flex flex-col", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-start justify-between p-5 border-b", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-lg bg-heritage-green flex items-center justify-center flex-shrink-0", children: _jsx("svg", { className: "w-5 h-5 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" }) }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: departmentName }), _jsx("p", { className: "text-sm text-gray-500 mt-0.5", children: "Department Items Overview" })] })] }), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600 transition-colors", children: _jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), _jsxs("div", { className: "grid grid-cols-4 gap-6 px-6 py-5 bg-gray-50/50", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-3xl font-bold text-gray-900", children: items.length }), _jsx("div", { className: "text-xs text-gray-500 mt-1 font-medium", children: "Total Items" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-3xl font-bold text-green-600", children: items.filter(item => item.currentStock > 10).length }), _jsx("div", { className: "text-xs text-gray-500 mt-1 font-medium", children: "Available" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-3xl font-bold text-yellow-600", children: items.filter(item => item.currentStock > 0 && item.currentStock <= 10).length }), _jsx("div", { className: "text-xs text-gray-500 mt-1 font-medium", children: "Low Stock" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-3xl font-bold text-red-600", children: items.filter(item => item.currentStock === 0).length }), _jsx("div", { className: "text-xs text-gray-500 mt-1 font-medium", children: "Out of Stock" })] })] }), _jsx("div", { className: "flex-1 overflow-y-auto", children: isLoading ? (_jsxs("div", { className: "flex flex-col items-center justify-center py-16", children: [_jsx("div", { className: "w-12 h-12 border-4 border-heritage-green border-t-transparent rounded-full animate-spin mb-3" }), _jsx("p", { className: "text-sm text-gray-500", children: "Loading items..." })] })) : items.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-gray-400", children: [_jsx("svg", { className: "w-16 h-16 mb-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" }) }), _jsx("p", { className: "text-sm", children: "No items assigned to this department" })] })) : (_jsxs("table", { className: "min-w-full", children: [_jsx("thead", { className: "bg-gray-50 sticky top-0", children: _jsxs("tr", { className: "border-b border-gray-200", children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Item Name" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Category" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Stock" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Last Restocked" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-100", children: items.map((item) => (_jsxs("tr", { className: "hover:bg-gray-50/50 transition-colors", children: [_jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-9 h-9 rounded-lg bg-heritage-green/10 flex items-center justify-center flex-shrink-0", children: _jsx("svg", { className: "w-4 h-4 text-heritage-green", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" }) }) }), _jsx("span", { className: "text-sm font-medium text-gray-900", children: item.itemName })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: "text-sm text-gray-600", children: item.category }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("span", { className: "text-sm font-semibold text-gray-900", children: [item.currentStock, " ", _jsx("span", { className: "text-gray-500 font-normal", children: item.unit })] }) }), _jsx("td", { className: "px-6 py-4", children: getStatusBadge(item.status, item.currentStock) }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: "text-sm text-gray-500", children: item.lastRestocked ? new Date(item.lastRestocked).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                }) : 'N/A' }) })] }, item.id))) })] })) }), _jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-t bg-gray-50/50", children: [_jsxs("div", { className: "text-xs text-gray-500", children: ["Last updated: ", _jsx("span", { className: "font-medium text-gray-700", children: new Date().toLocaleString('en-US', {
                                        month: 'numeric',
                                        day: 'numeric',
                                        year: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true
                                    }) })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: onClose, className: "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors", children: "Close" }), _jsx("button", { className: "px-4 py-2 text-sm font-medium text-white bg-heritage-green rounded-md hover:bg-heritage-green/90 transition-colors", children: "Export Report" })] })] })] }) }));
    return ReactDOM.createPortal(modalContent, document.body);
};
