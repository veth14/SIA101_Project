import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { createPortal } from 'react-dom';
import usePatchInvProcurement from '../../../api/patchInvProcurement';
export const ProcurementDetailsModal = ({ order, isOpen, onClose, formatCurrency, getStatusBadge, onSuccess, }) => {
    const { patchInvProcurement, loadingForPatchInvProcurement } = usePatchInvProcurement();
    const [isApproving, setIsApproving] = useState(false);
    const handleApproveOrder = async () => {
        if (!confirm('Are you sure you want to approve this purchase order?')) {
            return;
        }
        setIsApproving(true);
        try {
            const response = await patchInvProcurement(order.orderNumber, {
                status: 'approved',
                approvedBy: 'Manager Name', // TODO: Replace with actual logged-in user
                approvedDate: new Date().toISOString(),
            });
            if (response.success) {
                alert('Purchase order approved successfully!');
                onClose();
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
        finally {
            setIsApproving(false);
        }
    };
    const handleMarkReceived = async () => {
        if (!confirm('Are you sure you want to mark this order as received?')) {
            return;
        }
        try {
            const response = await patchInvProcurement(order.orderNumber, {
                status: 'received',
            });
            if (response.success) {
                alert('Purchase order marked as received!');
                onClose();
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
    if (!isOpen)
        return null;
    const modalContent = (_jsxs("div", { className: "fixed inset-0 z-[99999] overflow-y-auto", children: [_jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity", onClick: onClose }), _jsx("div", { className: "relative min-h-screen flex items-center justify-center p-4", children: _jsxs("div", { className: "relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl transform transition-all", children: [_jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-heritage-green/5 to-emerald-50/30", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-xl flex items-center justify-center shadow-lg", children: _jsx("svg", { className: "w-5 h-5 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: order.orderNumber }), _jsx("p", { className: "text-sm text-gray-600", children: order.supplier })] })] }), _jsx("button", { onClick: onClose, className: "p-2 hover:bg-gray-100 rounded-lg transition-colors", children: _jsx("svg", { className: "w-5 h-5 text-gray-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), _jsx("div", { className: "overflow-y-auto max-h-[calc(100vh-250px)] px-6 py-5", children: _jsxs("div", { className: "space-y-5", children: [_jsxs("div", { className: "bg-gray-50 rounded-lg p-4 border border-gray-200", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 mb-3", children: "Order Information" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1.5", children: "Status" }), _jsx("div", { className: "w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white", children: getStatusBadge(order.status) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1.5", children: "Order Date" }), _jsx("input", { type: "text", value: new Date(order.orderDate).toLocaleDateString('en-US', {
                                                                    month: 'long',
                                                                    day: 'numeric',
                                                                    year: 'numeric'
                                                                }), disabled: true, className: "w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 cursor-not-allowed" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1.5", children: "Expected Delivery" }), _jsx("input", { type: "text", value: new Date(order.expectedDelivery).toLocaleDateString('en-US', {
                                                                    month: 'long',
                                                                    day: 'numeric',
                                                                    year: 'numeric'
                                                                }), disabled: true, className: "w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 cursor-not-allowed" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1.5", children: "Supplier" }), _jsx("input", { type: "text", value: order.supplier, disabled: true, className: "w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 cursor-not-allowed" })] })] }), (order.status === 'approved' || order.status === 'received') && order.approvedBy && (_jsxs("div", { className: "mt-4 bg-green-50 p-4 rounded-lg border border-green-200", children: [_jsxs("p", { className: "text-sm font-medium text-green-700", children: ["Approved by: ", order.approvedBy] }), order.approvedDate && (_jsxs("p", { className: "text-sm text-green-600 mt-1", children: ["on ", new Date(order.approvedDate).toLocaleDateString('en-US', {
                                                                month: 'long',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })] }))] }))] }), _jsxs("div", { className: "bg-gray-50 rounded-lg p-4 border border-gray-200", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 mb-3", children: "Order Items" }), _jsx("div", { className: "space-y-3 max-h-[300px] overflow-y-auto pr-2", children: order.items.map((item, index) => (_jsxs("div", { className: "bg-white rounded-lg p-3 border border-gray-200", children: [_jsx("div", { className: "mb-2", children: _jsxs("h4", { className: "font-semibold text-gray-700 text-xs", children: ["Item #", index + 1] }) }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Item Name" }), _jsx("input", { type: "text", value: item.name, disabled: true, className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 cursor-not-allowed" })] }), _jsxs("div", { className: "grid grid-cols-3 gap-2", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Quantity" }), _jsx("input", { type: "text", value: item.quantity, disabled: true, className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 cursor-not-allowed" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Unit Price (\u20B1)" }), _jsx("input", { type: "text", value: item.unitPrice.toLocaleString("en-PH", { minimumFractionDigits: 2 }), disabled: true, className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 cursor-not-allowed" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Total (\u20B1)" }), _jsx("input", { type: "text", value: item.total.toLocaleString("en-PH", { minimumFractionDigits: 2 }), disabled: true, className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 font-semibold cursor-not-allowed" })] })] })] })] }, index))) })] }), order.notes && (_jsxs("div", { className: "bg-gray-50 rounded-lg p-4 border border-gray-200", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 mb-3", children: "Notes" }), _jsx("div", { className: "bg-blue-50 p-4 rounded-lg border border-blue-200", children: _jsx("p", { className: "text-sm text-blue-700", children: order.notes }) })] })), _jsx("div", { className: "bg-gradient-to-r from-heritage-green/10 to-emerald-50 rounded-lg p-4 border border-heritage-green/20", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-base font-bold text-gray-800", children: "Total Order Amount:" }), _jsxs("span", { className: "text-2xl font-black text-heritage-green", children: ["\u20B1", order.totalAmount.toLocaleString("en-PH", { minimumFractionDigits: 2 })] })] }) })] }) }), _jsxs("div", { className: "flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50", children: [_jsx("button", { onClick: onClose, disabled: loadingForPatchInvProcurement || isApproving, className: "px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed", children: "CLOSE" }), order.status === 'pending' && (_jsx("button", { onClick: handleApproveOrder, disabled: loadingForPatchInvProcurement || isApproving, className: "px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2", children: isApproving ? (_jsxs(_Fragment, { children: [_jsxs("svg", { className: "animate-spin h-4 w-4", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Approving..."] })) : ('APPROVE ORDER') })), order.status === 'approved' && (_jsx("button", { onClick: handleMarkReceived, disabled: loadingForPatchInvProcurement, className: "px-6 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2", children: loadingForPatchInvProcurement ? (_jsxs(_Fragment, { children: [_jsxs("svg", { className: "animate-spin h-4 w-4", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Updating..."] })) : ('MARK AS RECEIVED') }))] })] }) })] }));
    return createPortal(modalContent, document.body);
};
