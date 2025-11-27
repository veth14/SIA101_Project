import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
const EditSupplierModal = ({ isOpen, onClose, supplier, onSuccess, }) => {
    const [formData, setFormData] = useState({
        name: "",
        contactPerson: "",
        email: "",
        phone: "",
        address: "",
        category: "",
        status: "active",
        paymentTerms: "",
        deliveryTime: "",
        notes: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Populate form with supplier data when modal opens
    useEffect(() => {
        if (isOpen && supplier) {
            setFormData({
                name: supplier.name || "",
                contactPerson: supplier.contactPerson || "",
                email: supplier.email || "",
                phone: supplier.phone || "",
                address: supplier.address || "",
                category: supplier.category || "",
                status: supplier.status || "active",
                paymentTerms: supplier.paymentTerms || "",
                deliveryTime: supplier.deliveryTime || "",
                notes: supplier.notes || "",
            });
            // Prevent body scroll when modal is open
            document.body.style.overflow = "hidden";
        }
        else {
            // Re-enable body scroll when modal is closed
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen, supplier]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // TODO: Replace with your actual API call
            // const response = await updateSupplier(supplier.id, formData);
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log("Updating supplier:", supplier.id, formData);
            // Pass the updated data back to parent component
            if (onSuccess) {
                onSuccess(formData);
            }
            onClose();
        }
        catch (error) {
            console.error("Error updating supplier:", error);
            alert("Failed to update supplier. Please try again.");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    if (!isOpen)
        return null;
    const modalContent = (_jsxs("div", { className: "fixed inset-0 overflow-y-auto", style: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999999,
        }, children: [_jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity", onClick: onClose, style: {
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                } }), _jsx("div", { className: "flex min-h-full items-center justify-center p-4", style: { position: "relative", zIndex: 1000000 }, children: _jsxs("div", { className: "relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all", children: [_jsx("div", { className: "px-8 py-6 bg-gradient-to-r from-slate-50 to-white border-b border-gray-200/50 rounded-t-2xl", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl", children: _jsx("svg", { className: "w-5 h-5 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" }) }) }), _jsx("div", { className: "absolute -inset-1 bg-gradient-to-r from-heritage-green to-emerald-400 rounded-2xl blur opacity-30" })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-black text-gray-900", children: "Edit Supplier" }), _jsx("p", { className: "text-sm text-gray-500 font-medium", children: "Update supplier information" })] })] }), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600 transition-colors", children: _jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }) }), _jsx("form", { onSubmit: handleSubmit, className: "px-8 py-6 max-h-[calc(100vh-200px)] overflow-y-auto", children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-semibold text-gray-900 mb-4", children: "Basic Information" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Supplier Name ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", name: "name", value: formData.name, onChange: handleChange, required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-transparent" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Contact Person ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", name: "contactPerson", value: formData.contactPerson, onChange: handleChange, required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-transparent" })] })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-semibold text-gray-900 mb-4", children: "Contact Information" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Email ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "email", name: "email", value: formData.email, onChange: handleChange, required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-transparent" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Phone ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "tel", name: "phone", value: formData.phone, onChange: handleChange, required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-transparent" })] })] }), _jsxs("div", { className: "mt-4", children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Address ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", name: "address", value: formData.address, onChange: handleChange, required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-transparent" })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-semibold text-gray-900 mb-4", children: "Business Details" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Category ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("select", { name: "category", value: formData.category, onChange: handleChange, required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-transparent", children: [_jsx("option", { value: "", children: "Select Category" }), _jsx("option", { value: "Food & Beverage", children: "Food & Beverage" }), _jsx("option", { value: "Housekeeping", children: "Housekeeping" }), _jsx("option", { value: "Maintenance", children: "Maintenance" }), _jsx("option", { value: "Technology", children: "Technology" }), _jsx("option", { value: "Furniture", children: "Furniture" })] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Status ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("select", { name: "status", value: formData.status, onChange: handleChange, required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-transparent", children: [_jsx("option", { value: "active", children: "Active" }), _jsx("option", { value: "inactive", children: "Inactive" }), _jsx("option", { value: "suspended", children: "Suspended" })] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Payment Terms ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", name: "paymentTerms", value: formData.paymentTerms, onChange: handleChange, required: true, placeholder: "e.g., Net 30", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-transparent" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Delivery Time ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", name: "deliveryTime", value: formData.deliveryTime, onChange: handleChange, required: true, placeholder: "e.g., 2-3 days", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-transparent" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Notes" }), _jsx("textarea", { name: "notes", value: formData.notes, onChange: handleChange, rows: 4, placeholder: "Add any additional notes about this supplier...", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-transparent resize-none" })] })] }) }), _jsxs("div", { className: "px-8 py-6 bg-gray-50 border-t border-gray-200 rounded-b-2xl flex justify-end space-x-3", children: [_jsx("button", { type: "button", onClick: onClose, disabled: isSubmitting, className: "px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed", children: "Cancel" }), _jsx("button", { type: "submit", onClick: handleSubmit, disabled: isSubmitting, className: "px-6 py-2.5 bg-gradient-to-r from-heritage-green to-emerald-600 text-white font-semibold rounded-lg hover:from-heritage-green/90 hover:to-emerald-600/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center", children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsxs("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4 text-white", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Updating..."] })) : ("Update Supplier") })] })] }) })] }));
    // Use React Portal to render modal at document body level
    return ReactDOM.createPortal(modalContent, document.body);
};
export default EditSupplierModal;
