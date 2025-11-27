import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { createPortal } from "react-dom";
import usePatchInvRequisition from "@/api/patchInvRequisition";
export const RequisitionDetailsModal = ({ requisition, isOpen, onClose, formatCurrency, getStatusBadge, getPriorityBadge, setRequisitions, }) => {
    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [isFulfilling, setIsFulfilling] = useState(false);
    const { patchInvRequisition } = usePatchInvRequisition();
    // Handle Approve
    const handleApprove = async () => {
        console.log("Approving requisition with ID:", requisition.id);
        console.log("Request Number:", requisition.requestNumber);
        setIsApproving(true);
        try {
            const response = await patchInvRequisition(requisition.id, {
                status: "approved",
                approvedBy: "Supervisor", // TODO: Replace with actual logged-in user
                approvedDate: new Date().toISOString(),
            });
            if (response.success) {
                alert("Requisition approved successfully!");
                console.log(response);
                setRequisitions(response.updatedData);
                onClose(); // Close modal after success
            }
            else {
                alert(response.message || "Failed to approve requisition");
            }
        }
        catch (error) {
            console.error("Error approving requisition:", error);
            alert("An error occurred while approving the requisition");
        }
        finally {
            setIsApproving(false);
        }
    };
    // Handle Reject
    const handleReject = async () => {
        console.log("Rejecting requisition with ID:", requisition.id);
        console.log("Request Number:", requisition.requestNumber);
        setIsRejecting(true);
        try {
            const response = await patchInvRequisition(requisition.id, {
                status: "rejected",
                approvedBy: "Supervisor", // TODO: Replace with actual logged-in user
                approvedDate: new Date().toISOString(),
            });
            if (response.success) {
                alert("Requisition rejected successfully!");
                console.log(response);
                setRequisitions(response.updatedData);
                onClose(); // Close modal after success
            }
            else {
                alert(response.message || "Failed to reject requisition");
            }
        }
        catch (error) {
            console.error("Error reject requisition:", error);
            alert("An error occurred while rejecting the requisition");
        }
        finally {
            setIsRejecting(false);
        }
    };
    // Handle Mark as Fulfilled
    const handleMarkFulfilled = async () => {
        console.log("Marking requisition as fulfilled with ID:", requisition.id);
        console.log("Request Number:", requisition.requestNumber);
        setIsFulfilling(true);
        try {
            const response = await patchInvRequisition(requisition.id, {
                status: "fulfilled",
                approvedBy: "Supervisor", // TODO: Replace with actual logged-in user
                approvedDate: new Date().toISOString(),
            });
            if (response.success) {
                alert("Requisition fulfilled successfully!");
                console.log(response);
                setRequisitions(response.updatedData);
                onClose(); // Close modal after success
            }
            else {
                alert(response.message || "Failed to fulfilled requisition");
            }
        }
        catch (error) {
            console.error("Error fulfilled requisition:", error);
            alert("An error occurred while fulfilling the requisition");
        }
        finally {
            setIsFulfilling(false);
        }
    };
    // Check if any action is loading
    const isLoading = isApproving || isRejecting || isFulfilling;
    if (!isOpen)
        return null;
    const modalContent = (_jsxs("div", { className: "fixed inset-0 z-[99999] overflow-y-auto", children: [_jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity", onClick: isLoading ? undefined : onClose }), _jsx("div", { className: "relative min-h-screen flex items-center justify-center p-4", children: _jsxs("div", { className: "relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl transform transition-all", children: [_jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-heritage-green/5 to-emerald-50/30", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-xl flex items-center justify-center shadow-lg", children: _jsx("svg", { className: "w-5 h-5 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }) }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: requisition.requestNumber }), _jsxs("p", { className: "text-sm text-gray-600", children: [requisition.department, " - ", requisition.requestedBy] })] })] }), _jsx("button", { onClick: onClose, disabled: isLoading, className: "p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed", children: _jsx("svg", { className: "w-5 h-5 text-gray-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), _jsx("div", { className: "overflow-y-auto max-h-[calc(100vh-250px)] px-6 py-5", children: _jsxs("div", { className: "space-y-5", children: [_jsxs("div", { className: "bg-gray-50 rounded-lg p-4 border border-gray-200", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 mb-3", children: "Request Information" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1.5", children: "Status" }), _jsx("div", { className: "w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white", children: getStatusBadge(requisition.status) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1.5", children: "Priority" }), _jsx("div", { className: "w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white", children: getPriorityBadge(requisition.priority) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1.5", children: "Request Date" }), _jsx("input", { type: "text", value: new Date(requisition.requestDate).toLocaleDateString("en-US", {
                                                                    month: "long",
                                                                    day: "numeric",
                                                                    year: "numeric",
                                                                }), disabled: true, className: "w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 cursor-not-allowed" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1.5", children: "Required Date" }), _jsx("input", { type: "text", value: new Date(requisition.requiredDate).toLocaleDateString("en-US", {
                                                                    month: "long",
                                                                    day: "numeric",
                                                                    year: "numeric",
                                                                }), disabled: true, className: "w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 cursor-not-allowed" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1.5", children: "Department" }), _jsx("input", { type: "text", value: requisition.department, disabled: true, className: "w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 cursor-not-allowed" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1.5", children: "Requested By" }), _jsx("input", { type: "text", value: requisition.requestedBy, disabled: true, className: "w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 cursor-not-allowed" })] })] }), (requisition.status === "approved" ||
                                                requisition.status === "fulfilled") &&
                                                requisition.approvedBy && (_jsxs("div", { className: "mt-4 bg-green-50 p-4 rounded-lg border border-green-200", children: [_jsxs("p", { className: "text-sm font-medium text-green-700", children: ["Approved by: ", requisition.approvedBy] }), requisition.approvedDate && (_jsxs("p", { className: "text-sm text-green-600 mt-1", children: ["on", " ", new Date(requisition.approvedDate).toLocaleDateString("en-US", {
                                                                month: "long",
                                                                day: "numeric",
                                                                year: "numeric",
                                                            })] }))] }))] }), _jsxs("div", { className: "bg-gray-50 rounded-lg p-4 border border-gray-200", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 mb-3", children: "Justification" }), _jsx("div", { className: "bg-white p-4 rounded-lg border border-gray-200", children: _jsx("p", { className: "text-sm text-gray-700", children: requisition.justification }) })] }), _jsxs("div", { className: "bg-gray-50 rounded-lg p-4 border border-gray-200", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 mb-3", children: "Requested Items" }), _jsx("div", { className: "space-y-3 max-h-[300px] overflow-y-auto pr-2", children: requisition.items.map((item, index) => (_jsxs("div", { className: "bg-white rounded-lg p-3 border border-gray-200", children: [_jsx("div", { className: "mb-2", children: _jsxs("h4", { className: "font-semibold text-gray-700 text-xs", children: ["Item #", index + 1] }) }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Item Name" }), _jsx("input", { type: "text", value: item.name, disabled: true, className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 cursor-not-allowed" })] }), _jsxs("div", { className: "grid grid-cols-3 gap-2", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Quantity" }), _jsx("input", { type: "text", value: `${item.quantity} ${item.unit}`, disabled: true, className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 cursor-not-allowed" })] }), _jsxs("div", { className: "col-span-2", children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Estimated Cost (\u20B1)" }), _jsx("input", { type: "text", value: item.estimatedCost.toLocaleString("en-PH", { minimumFractionDigits: 2 }), disabled: true, className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 font-semibold cursor-not-allowed" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Reason" }), _jsx("textarea", { value: item.reason, disabled: true, rows: 2, className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 cursor-not-allowed resize-none" })] })] })] }, index))) })] }), requisition.notes && (_jsxs("div", { className: "bg-gray-50 rounded-lg p-4 border border-gray-200", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 mb-3", children: "Notes" }), _jsx("div", { className: "bg-blue-50 p-4 rounded-lg border border-blue-200", children: _jsx("p", { className: "text-sm text-blue-700", children: requisition.notes }) })] })), _jsx("div", { className: "bg-gradient-to-r from-heritage-green/10 to-emerald-50 rounded-lg p-4 border border-heritage-green/20", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-base font-bold text-gray-800", children: "Total Estimated Cost:" }), _jsxs("span", { className: "text-2xl font-black text-heritage-green", children: ["\u20B1", requisition.totalEstimatedCost.toLocaleString("en-PH", {
                                                            minimumFractionDigits: 2,
                                                        })] })] }) })] }) }), _jsxs("div", { className: "flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50", children: [_jsx("button", { onClick: onClose, disabled: isLoading, className: "px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed", children: "CLOSE" }), requisition.status === "pending" && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: handleApprove, disabled: isLoading, className: "px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]", children: isApproving ? (_jsxs(_Fragment, { children: [_jsxs("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Processing..."] })) : ("APPROVE") }), _jsx("button", { onClick: handleReject, disabled: isLoading, className: "px-6 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]", children: isRejecting ? (_jsxs(_Fragment, { children: [_jsxs("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Processing..."] })) : ("REJECT") })] })), requisition.status === "approved" && (_jsx("button", { onClick: handleMarkFulfilled, disabled: isLoading, className: "px-6 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[180px]", children: isFulfilling ? (_jsxs(_Fragment, { children: [_jsxs("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Processing..."] })) : ("MARK AS FULFILLED") }))] })] }) })] }));
    return createPortal(modalContent, document.body);
};
