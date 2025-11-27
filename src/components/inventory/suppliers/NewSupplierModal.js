import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { createPortal } from "react-dom";
import usePostInvSupplier from "../../../api/postInvSupplier";
const NewSupplierModal = ({ isOpen, onClose, onSuccess }) => {
    const [supplierData, setSupplierData] = useState({
        name: "",
        contactPerson: "",
        email: "",
        phone: "",
        address: "",
        category: "",
        paymentTerms: "",
        deliveryTime: "",
        notes: "",
    });
    const { postInvSupplier, loadingForPostInvSupplier } = usePostInvSupplier();
    const categories = [
        "Food & Beverage",
        "Housekeeping",
        "Maintenance",
        "Technology",
        "Furniture",
        "Office Supplies",
        "Utilities",
        "Others"
    ];
    const paymentTermsOptions = [
        "Net 30",
        "Net 60",
        "Net 90",
        "Cash on Delivery",
        "Advance Payment",
        "50% Advance, 50% on Delivery"
    ];
    const handleSave = async () => {
        // Validation
        if (!supplierData.name.trim()) {
            alert("Please enter supplier name");
            return;
        }
        if (!supplierData.contactPerson.trim()) {
            alert("Please enter contact person");
            return;
        }
        if (!supplierData.email.trim() || !supplierData.email.includes("@")) {
            alert("Please enter a valid email address");
            return;
        }
        if (!supplierData.phone.trim()) {
            alert("Please enter phone number");
            return;
        }
        if (!supplierData.address.trim()) {
            alert("Please enter address");
            return;
        }
        if (!supplierData.category) {
            alert("Please select a category");
            return;
        }
        if (!supplierData.paymentTerms) {
            alert("Please select payment terms");
            return;
        }
        if (!supplierData.deliveryTime.trim()) {
            alert("Please enter delivery time");
            return;
        }
        const newSupplier = {
            name: supplierData.name,
            contactPerson: supplierData.contactPerson,
            email: supplierData.email,
            phone: supplierData.phone,
            address: supplierData.address,
            category: supplierData.category,
            paymentTerms: supplierData.paymentTerms,
            deliveryTime: supplierData.deliveryTime,
            notes: supplierData.notes,
            status: "active",
            rating: 0,
            totalOrders: 0,
            totalValue: 0,
        };
        try {
            const response = await postInvSupplier(newSupplier);
            if (response.success) {
                console.log("Supplier created successfully:", response);
                alert("Supplier created successfully!");
                handleCancel();
                if (onSuccess)
                    onSuccess();
            }
            else {
                alert(response.message || "Failed to create supplier");
            }
        }
        catch (error) {
            console.error("Error creating supplier:", error);
            alert("An error occurred while creating the supplier");
        }
    };
    const handleCancel = () => {
        setSupplierData({
            name: "",
            contactPerson: "",
            email: "",
            phone: "",
            address: "",
            category: "",
            paymentTerms: "",
            deliveryTime: "",
            notes: "",
        });
        onClose();
    };
    if (!isOpen)
        return null;
    const modalContent = (_jsxs("div", { className: "fixed inset-0 z-[99999] overflow-y-auto", children: [_jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity", onClick: onClose }), _jsx("div", { className: "relative min-h-screen flex items-center justify-center p-4", children: _jsxs("div", { className: "relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl transform transition-all", children: [_jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-heritage-green/5 to-emerald-50/30", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-xl flex items-center justify-center shadow-lg", children: _jsx("svg", { className: "w-5 h-5 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" }) }) }), _jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Add New Supplier" })] }), _jsx("button", { onClick: onClose, className: "p-2 hover:bg-gray-100 rounded-lg transition-colors", children: _jsx("svg", { className: "w-5 h-5 text-gray-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), _jsx("div", { className: "overflow-y-auto max-h-[calc(100vh-250px)] px-6 py-5", children: _jsxs("div", { className: "space-y-5", children: [_jsxs("div", { className: "bg-gray-50 rounded-lg p-4 border border-gray-200", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 mb-3", children: "Basic Information" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "md:col-span-2", children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1.5", children: ["Supplier Name ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", value: supplierData.name, onChange: (e) => setSupplierData({ ...supplierData, name: e.target.value }), className: "w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green bg-white", placeholder: "Enter supplier name" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1.5", children: ["Contact Person ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", value: supplierData.contactPerson, onChange: (e) => setSupplierData({ ...supplierData, contactPerson: e.target.value }), className: "w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green bg-white", placeholder: "Enter contact person name" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1.5", children: ["Category ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("select", { value: supplierData.category, onChange: (e) => setSupplierData({ ...supplierData, category: e.target.value }), className: "w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green bg-white", children: [_jsx("option", { value: "", children: "Select Category" }), categories.map((cat) => (_jsx("option", { value: cat, children: cat }, cat)))] })] })] })] }), _jsxs("div", { className: "bg-gray-50 rounded-lg p-4 border border-gray-200", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 mb-3", children: "Contact Information" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1.5", children: ["Email Address ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "email", value: supplierData.email, onChange: (e) => setSupplierData({ ...supplierData, email: e.target.value }), className: "w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green bg-white", placeholder: "supplier@example.com" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1.5", children: ["Phone Number ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "tel", value: supplierData.phone, onChange: (e) => setSupplierData({ ...supplierData, phone: e.target.value }), className: "w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green bg-white", placeholder: "+63 XXX XXX XXXX" })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1.5", children: ["Address ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("textarea", { value: supplierData.address, onChange: (e) => setSupplierData({ ...supplierData, address: e.target.value }), rows: 2, className: "w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green bg-white resize-none", placeholder: "Enter complete address" })] })] })] }), _jsxs("div", { className: "bg-gray-50 rounded-lg p-4 border border-gray-200", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 mb-3", children: "Business Terms" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1.5", children: ["Payment Terms ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("select", { value: supplierData.paymentTerms, onChange: (e) => setSupplierData({ ...supplierData, paymentTerms: e.target.value }), className: "w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green bg-white", children: [_jsx("option", { value: "", children: "Select Payment Terms" }), paymentTermsOptions.map((term) => (_jsx("option", { value: term, children: term }, term)))] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1.5", children: ["Delivery Time ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", value: supplierData.deliveryTime, onChange: (e) => setSupplierData({ ...supplierData, deliveryTime: e.target.value }), className: "w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green bg-white", placeholder: "e.g., 3-5 business days" })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1.5", children: "Notes (Optional)" }), _jsx("textarea", { value: supplierData.notes, onChange: (e) => setSupplierData({ ...supplierData, notes: e.target.value }), rows: 3, className: "w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green bg-white resize-none", placeholder: "Add any additional notes about this supplier..." })] })] })] })] }) }), _jsxs("div", { className: "flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50", children: [_jsx("button", { onClick: handleCancel, disabled: loadingForPostInvSupplier, className: "px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50", children: "CANCEL" }), _jsx("button", { onClick: handleSave, disabled: loadingForPostInvSupplier, className: "px-6 py-2.5 text-sm font-semibold text-white bg-heritage-green rounded-lg hover:bg-heritage-green/90 transition-colors disabled:opacity-50 flex items-center gap-2", children: loadingForPostInvSupplier ? (_jsxs(_Fragment, { children: [_jsxs("svg", { className: "animate-spin h-4 w-4", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Saving..."] })) : ("SAVE SUPPLIER") })] })] }) })] }));
    return createPortal(modalContent, document.body);
};
export default NewSupplierModal;
