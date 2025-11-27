import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { RequisitionDetailsModal } from "./RequisitionDetailsModal";
import usePatchInvRequisition from "@/api/patchInvRequisition";
export const RequisitionCard = ({ requisition, formatCurrency, getStatusBadge, getPriorityBadge, setRequisitions, }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
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
    // Handle Delete (optional - if you want to add delete functionality)
    const handleDelete = () => {
        console.log("Deleting requisition with ID:", requisition.id);
        console.log("Request Number:", requisition.requestNumber);
        // TODO: Add API call to delete requisition
    };
    // Check if any action is loading
    const isLoading = isApproving || isRejecting || isFulfilling;
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow h-full flex flex-col", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: requisition.requestNumber }), _jsxs("p", { className: "text-sm text-gray-600", children: [requisition.department, " - ", requisition.requestedBy] })] }), _jsxs("div", { className: "flex flex-col space-y-1", children: [getStatusBadge(requisition.status), getPriorityBadge(requisition.priority)] })] }), _jsxs("div", { className: "mb-4", children: [_jsxs("p", { className: "text-sm font-medium text-gray-700 mb-2", children: ["Items (", requisition.items.length, ")"] }), _jsxs("div", { className: "space-y-1", children: [requisition.items.slice(0, 2).map((item, index) => (_jsxs("div", { className: "flex justify-between text-sm text-gray-600", children: [_jsxs("span", { children: [item.name, " (\u00D7", item.quantity, ")"] }), _jsx("span", { children: formatCurrency(item.estimatedCost) })] }, index))), requisition.items.length > 2 && (_jsxs("p", { className: "text-sm text-gray-500", children: ["+", requisition.items.length - 2, " more items"] }))] })] }), _jsxs("div", { className: "flex justify-between items-center py-3 border-t border-gray-200 mb-4", children: [_jsx("span", { className: "text-sm font-medium text-gray-700", children: "Total Estimated" }), _jsx("span", { className: "text-lg font-bold text-heritage-green", children: formatCurrency(requisition.totalEstimatedCost) })] }), _jsxs("div", { className: "flex justify-between text-sm text-gray-600 mb-4", children: [_jsxs("span", { children: ["Requested: ", new Date(requisition.requestDate).toLocaleDateString()] }), _jsxs("span", { children: ["Required: ", new Date(requisition.requiredDate).toLocaleDateString()] })] }), requisition.status === "approved" ||
                        requisition.status === "fulfilled" ? (requisition.approvedBy ? (_jsxs("div", { className: "bg-green-50 p-3 rounded-lg border-l-4 border-green-400 mb-4", children: [_jsxs("p", { className: "text-sm text-green-700 font-medium", children: ["Approved by: ", requisition.approvedBy] }), requisition.approvedDate && (_jsxs("p", { className: "text-xs text-green-600 mt-1", children: ["Approved on:", " ", new Date(requisition.approvedDate).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })] }))] })) : (_jsx("div", { className: "bg-gray-50 p-3 rounded-lg border-l-4 border-gray-300 mb-4", children: _jsx("p", { className: "text-sm text-gray-500 italic", children: "Approval information not available" }) }))) : requisition.status === "rejected" ? (_jsxs("div", { className: "bg-red-50 p-3 rounded-lg border-l-4 border-red-400 mb-4", children: [_jsx("p", { className: "text-sm text-red-700 font-medium", children: "Request rejected" }), _jsx("p", { className: "text-xs text-red-600 mt-1", children: "Review required for resubmission" })] })) : (_jsxs("div", { className: "bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400 mb-4", children: [_jsx("p", { className: "text-sm text-yellow-700 font-medium", children: "Pending approval" }), _jsx("p", { className: "text-xs text-yellow-600 mt-1", children: "Awaiting manager review" })] })), requisition.notes ? (_jsxs("div", { className: "bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400 min-h-[60px] flex flex-col justify-center mb-4", children: [_jsx("p", { className: "text-xs text-blue-600 font-medium mb-1", children: "Notes:" }), _jsxs("p", { className: "text-sm text-blue-700 italic", children: ["\"", requisition.notes, "\""] })] })) : (_jsx("div", { className: "bg-gray-50 p-3 rounded-lg border-l-4 border-gray-300 min-h-[60px] flex items-center mb-4", children: _jsx("p", { className: "text-sm text-gray-400 italic", children: "No additional notes provided" }) })), _jsxs("div", { className: "text-sm text-gray-600 mb-4 flex-grow", children: [_jsx("p", { className: "text-xs text-gray-500 font-medium mb-1", children: "Justification:" }), _jsx("p", { className: "line-clamp-2", children: requisition.justification })] }), _jsxs("div", { className: "mt-auto pt-4 flex gap-2", children: [_jsx("button", { onClick: () => setIsModalOpen(true), disabled: isLoading, className: "flex-1 px-4 py-2 bg-heritage-green text-white rounded-lg hover:bg-heritage-green/90 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed", children: "View Details" }), requisition.status === "pending" && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: handleApprove, disabled: isLoading, className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]", children: isApproving ? (_jsxs(_Fragment, { children: [_jsxs("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Processing..."] })) : ("Approve") }), _jsx("button", { onClick: handleReject, disabled: isLoading, className: "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]", children: isRejecting ? (_jsxs(_Fragment, { children: [_jsxs("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Processing..."] })) : ("Reject") })] })), requisition.status === "approved" && (_jsx("button", { onClick: handleMarkFulfilled, disabled: isLoading, className: "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]", children: isFulfilling ? (_jsxs(_Fragment, { children: [_jsxs("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Processing..."] })) : ("Mark Fulfilled") }))] })] }), _jsx(RequisitionDetailsModal, { requisition: requisition, isOpen: isModalOpen, onClose: () => setIsModalOpen(false), formatCurrency: formatCurrency, getStatusBadge: getStatusBadge, getPriorityBadge: getPriorityBadge, setRequisitions: setRequisitions })] }));
};
