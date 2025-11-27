import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { ProcurementDetailsModal } from './ProcurementDetailsModal';
import usePatchInvProcurement from '../../../api/patchInvProcurement';
export const ProcurementCard = ({ order, formatCurrency, getStatusBadge, onSuccess, }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { patchInvProcurement, loadingForPatchInvProcurement } = usePatchInvProcurement();
    const handleApproveOrder = async (e) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to approve this purchase order?')) {
            return;
        }
        try {
            const response = await patchInvProcurement(order.orderNumber, {
                status: 'approved',
                approvedBy: 'Manager Name', // TODO: Replace with actual logged-in user
                approvedDate: new Date().toISOString(),
            });
            if (response.success) {
                alert('Purchase order approved successfully!');
                if (onSuccess)
                    onSuccess();
            }
            else {
                alert(response.message || 'Failed to approve purchase order');
            }
        }
        catch (error) {
            console.error('Error approving order:', error);
            alert('An error occurred while approving the purchase order');
        }
    };
    const handleMarkReceived = async (e) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to mark this order as received?')) {
            return;
        }
        try {
            const response = await patchInvProcurement(order.orderNumber, {
                status: 'received',
            });
            if (response.success) {
                alert('Purchase order marked as received!');
                if (onSuccess)
                    onSuccess();
            }
            else {
                alert(response.message || 'Failed to update purchase order');
            }
        }
        catch (error) {
            console.error('Error updating order:', error);
            alert('An error occurred while updating the purchase order');
        }
    };
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow h-full flex flex-col", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: order.orderNumber }), _jsx("p", { className: "text-sm text-gray-600", children: order.supplier })] }), getStatusBadge(order.status)] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsxs("p", { className: "text-sm font-medium text-gray-700", children: ["Items (", order.items.length, ")"] }), _jsxs("div", { className: "mt-1 space-y-1", children: [order.items.slice(0, 2).map((item, index) => (_jsxs("div", { className: "flex justify-between text-sm text-gray-600", children: [_jsxs("span", { children: [item.name, " (\u00D7", item.quantity, ")"] }), _jsx("span", { children: formatCurrency(item.total) })] }, index))), order.items.length > 2 && (_jsxs("p", { className: "text-sm text-gray-500", children: ["+", order.items.length - 2, " more items"] }))] })] }), _jsxs("div", { className: "flex justify-between items-center pt-3 border-t border-gray-200", children: [_jsx("span", { className: "text-sm font-medium text-gray-700", children: "Total Amount" }), _jsx("span", { className: "text-lg font-bold text-heritage-green", children: formatCurrency(order.totalAmount) })] }), _jsxs("div", { className: "flex justify-between text-sm text-gray-600", children: [_jsxs("span", { children: ["Order: ", new Date(order.orderDate).toLocaleDateString()] }), _jsxs("span", { children: ["Expected: ", new Date(order.expectedDelivery).toLocaleDateString()] })] }), order.status === 'approved' || order.status === 'received' ? (order.approvedBy ? (_jsxs("div", { className: "bg-green-50 p-3 rounded-lg border-l-4 border-green-400", children: [_jsxs("p", { className: "text-sm text-green-700 font-medium", children: ["Approved by: ", order.approvedBy] }), order.approvedDate && (_jsxs("p", { className: "text-xs text-green-600 mt-1", children: ["Approved on: ", new Date(order.approvedDate).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })] }))] })) : (_jsx("div", { className: "bg-gray-50 p-3 rounded-lg border-l-4 border-gray-300", children: _jsx("p", { className: "text-sm text-gray-500 italic", children: "Approval information not available" }) }))) : (_jsxs("div", { className: "bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400", children: [_jsx("p", { className: "text-sm text-yellow-700 font-medium", children: "Pending approval" }), _jsx("p", { className: "text-xs text-yellow-600 mt-1", children: "Awaiting manager review" })] })), order.notes ? (_jsxs("div", { className: "bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400 min-h-[60px] flex flex-col justify-center", children: [_jsx("p", { className: "text-xs text-blue-600 font-medium mb-1", children: "Notes:" }), _jsxs("p", { className: "text-sm text-blue-700 italic", children: ["\"", order.notes, "\""] })] })) : (_jsx("div", { className: "bg-gray-50 p-3 rounded-lg border-l-4 border-gray-300 min-h-[60px] flex items-center", children: _jsx("p", { className: "text-sm text-gray-400 italic", children: "No additional notes provided" }) }))] }), _jsxs("div", { className: "mt-auto pt-4 flex gap-2", children: [_jsx("button", { onClick: () => setIsModalOpen(true), disabled: loadingForPatchInvProcurement, className: "flex-1 px-4 py-2 bg-heritage-green text-white rounded-lg hover:bg-heritage-green/90 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed", children: "View Details" }), order.status === 'pending' && (_jsx("button", { onClick: handleApproveOrder, disabled: loadingForPatchInvProcurement, className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1", children: loadingForPatchInvProcurement ? (_jsx(_Fragment, { children: _jsxs("svg", { className: "animate-spin h-3.5 w-3.5", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }) })) : ('Approve') })), order.status === 'approved' && (_jsx("button", { onClick: handleMarkReceived, disabled: loadingForPatchInvProcurement, className: "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1", children: loadingForPatchInvProcurement ? (_jsx(_Fragment, { children: _jsxs("svg", { className: "animate-spin h-3.5 w-3.5", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }) })) : ('Mark Received') }))] })] }), _jsx(ProcurementDetailsModal, { order: order, isOpen: isModalOpen, onClose: () => setIsModalOpen(false), formatCurrency: formatCurrency, getStatusBadge: getStatusBadge, onSuccess: onSuccess })] }));
};
