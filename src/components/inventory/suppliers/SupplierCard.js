import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { SupplierDetailsModal } from "./SupplierDetailsModal";
import EditSupplierModal from "./EditSupplierModal";
import usePatchInvSupplier from "@/api/patchInvSupplier";
export const SupplierCard = ({ supplier, formatCurrency, getStatusBadge, getRatingStars, setSuppliers, }) => {
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { patchInvSupplier, loadingForPatchInvSupplier } = usePatchInvSupplier();
    const handleEditSuccess = async (updatedData) => {
        console.log("Supplier updated successfully");
        console.log("Supplier ID:", supplier.id);
        console.log("Updated Data:", updatedData);
        // Complete updated supplier object
        const completeSupplier = {
            ...supplier,
            ...updatedData,
        };
        console.log("Complete Supplier:", completeSupplier);
        try {
            const response = await patchInvSupplier(supplier.id, updatedData);
            if (response.success) {
                alert("Supplier edited successfully!");
                console.log(response);
                setSuppliers(response.updatedData);
                // setRequisitions(response.updatedData);
            }
            else {
                alert(response.message || "Failed to edit Supplier");
            }
        }
        catch (error) {
            console.error("Error editing Supplier:", error);
            alert("An error occurred while editing the Supplier");
        }
        finally {
            // setIsApproving(false);
        }
        // You can add additional logic here, such as refreshing the supplier list
        // For example: onSupplierUpdate(completeSupplier);
    };
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow h-full flex flex-col", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: supplier.name }), _jsx("p", { className: "text-sm text-gray-600", children: supplier.contactPerson })] }), getStatusBadge(supplier.status)] }), _jsxs("div", { className: "mb-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-700 mb-2", children: "Contact Information" }), _jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center text-sm text-gray-600", children: [_jsx("svg", { className: "w-4 h-4 mr-2 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }) }), supplier.email] }), _jsxs("div", { className: "flex items-center text-sm text-gray-600", children: [_jsx("svg", { className: "w-4 h-4 mr-2 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" }) }), supplier.phone] })] })] }), _jsxs("div", { className: "mb-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-700 mb-1", children: "Category" }), _jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800", children: supplier.category })] }), _jsxs("div", { className: "mb-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-700 mb-1", children: "Rating" }), getRatingStars(supplier.rating)] }), _jsx("div", { className: "flex justify-between items-center py-3 border-t border-gray-200 mb-4", children: _jsxs("div", { children: [_jsxs("p", { className: "text-sm text-gray-600", children: ["Total Orders: ", supplier.totalOrders] }), _jsx("p", { className: "text-sm font-medium text-heritage-green", children: formatCurrency(supplier.totalValue) })] }) }), _jsxs("div", { className: "flex justify-between text-sm text-gray-600 mb-4", children: [_jsxs("span", { children: ["Payment: ", supplier.paymentTerms] }), _jsxs("span", { children: ["Delivery: ", supplier.deliveryTime] })] }), _jsx("div", { className: "mb-4", children: _jsxs("p", { className: "text-sm text-gray-600", children: ["Last Order:", " ", new Date(supplier.lastOrderDate).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })] }) }), supplier.notes ? (_jsxs("div", { className: "bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400 min-h-[60px] flex flex-col justify-center mb-4", children: [_jsx("p", { className: "text-xs text-blue-600 font-medium mb-1", children: "Notes:" }), _jsxs("p", { className: "text-sm text-blue-700 italic", children: ["\"", supplier.notes, "\""] })] })) : (_jsx("div", { className: "bg-gray-50 p-3 rounded-lg border-l-4 border-gray-300 min-h-[60px] flex items-center mb-4", children: _jsx("p", { className: "text-sm text-gray-400 italic", children: "No additional notes provided" }) })), _jsxs("div", { className: "mt-auto pt-4 flex gap-2", children: [_jsx("button", { onClick: () => setIsDetailsModalOpen(true), className: "flex-1 px-4 py-2 bg-heritage-green text-white rounded-lg hover:bg-heritage-green/90 transition-colors text-sm font-medium", disabled: loadingForPatchInvSupplier, children: "View Details" }), _jsx("button", { onClick: () => setIsEditModalOpen(true), className: `flex-1 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors ${loadingForPatchInvSupplier
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-gray-600 hover:bg-gray-700"}`, disabled: loadingForPatchInvSupplier, children: loadingForPatchInvSupplier ? (_jsxs("div", { className: "flex items-center justify-center gap-2", children: [_jsxs("svg", { className: "w-4 h-4 animate-spin text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l3 3-3 3v-4a8 8 0 01-8-8z" })] }), "Saving..."] })) : ("Edit") })] })] }), _jsx(SupplierDetailsModal, { supplier: supplier, isOpen: isDetailsModalOpen, onClose: () => setIsDetailsModalOpen(false), formatCurrency: formatCurrency, getStatusBadge: getStatusBadge, getRatingStars: getRatingStars }), _jsx(EditSupplierModal, { supplier: supplier, isOpen: isEditModalOpen, onClose: () => setIsEditModalOpen(false), onSuccess: handleEditSuccess })] }));
};
