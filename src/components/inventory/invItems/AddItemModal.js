import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import usePostInvInventoryItem from "@/api/postInvInventory";
import { useState } from "react";
import { createPortal } from "react-dom";
const AddItemModal = ({ isOpen, onClose }) => {
    const [newItem, setNewItem] = useState({
        name: "",
        description: "",
        category: "",
        supplier: "",
        location: "",
        unit: "",
        unitPrice: 0,
        reorderLevel: 0,
        initialStock: 0,
    });
    const { postInvInventoryItem, loadingForPostInvInventoryItem } = usePostInvInventoryItem();
    const handleSave = async () => {
        // Validation
        if (!newItem.name.trim() ||
            !newItem.category.trim() ||
            !newItem.supplier.trim()) {
            console.log("Validation failed: Missing required fields");
            return;
        }
        if (newItem.unitPrice <= 0 ||
            newItem.reorderLevel < 0 ||
            newItem.initialStock < 0) {
            console.log("Validation failed: Invalid price, reorder level, or initial stock");
            return;
        }
        // Generate new item ID (in real app, this would be handled by backend)
        const newId = "F" + String(Math.floor(Math.random() * 9000) + 1000);
        // Here you would typically save to the database
        console.log("New Item Created:", {
            id: newId,
            ...newItem,
            currentStock: newItem.initialStock,
            lastRestocked: new Date().toISOString().split("T")[0],
            timestamp: new Date().toISOString(),
        });
        const itemToBeInserted = {
            id: newId,
            ...newItem,
            currentStock: newItem.initialStock,
            lastRestocked: new Date().toISOString().split("T")[0],
            timestamp: new Date().toISOString(),
        };
        const response = await postInvInventoryItem(itemToBeInserted);
        console.log(response);
        console.log(`Item created successfully: ${newItem.name}`);
        // Reset form and close modal
        handleCancel();
    };
    const handleCancel = () => {
        setNewItem({
            name: "",
            description: "",
            category: "",
            supplier: "",
            location: "",
            unit: "",
            unitPrice: 0,
            reorderLevel: 0,
            initialStock: 0,
        });
        onClose();
    };
    if (!isOpen)
        return null;
    const modalContent = (_jsxs("div", { className: "fixed inset-0 z-[99999] overflow-y-auto", style: {
            zIndex: 99999,
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        }, children: [_jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity", onClick: onClose, style: { zIndex: 99998 } }), _jsx("div", { className: "relative min-h-screen flex items-center justify-center p-6", style: { zIndex: 99999 }, children: _jsxs("div", { className: "relative w-full max-w-4xl  bg-white rounded-2xl shadow-2xl transform transition-all overflow-hidden", style: { zIndex: 99999 }, children: [_jsx("div", { className: "bg-gradient-to-r from-heritage-green/5 to-emerald-50 border-b border-gray-200", children: _jsx("div", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-xl flex items-center justify-center shadow-lg", children: _jsx("svg", { className: "w-6 h-6 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6v6m0 0v6m0-6h6m-6 0H6" }) }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Add New Item" }), _jsx("p", { className: "text-sm text-gray-600", children: "Create a new inventory item" })] })] }), _jsx("button", { onClick: onClose, className: "p-2 hover:bg-gray-100 rounded-xl transition-colors group", children: _jsx("svg", { className: "w-5 h-5 text-gray-500 group-hover:text-gray-700", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }) }) }), _jsx("div", { className: "overflow-y-auto max-h-[calc(100vh-250px)] bg-gradient-to-br from-heritage-light/30 via-white to-emerald-50/30", children: _jsx("div", { className: "px-6 py-6", children: _jsx("div", { className: "bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/60 p-6", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Item Name ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", value: newItem.name, onChange: (e) => setNewItem({ ...newItem, name: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", placeholder: "Enter item name" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Category ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("select", { value: newItem.category, onChange: (e) => setNewItem({ ...newItem, category: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", children: [_jsx("option", { value: "", children: "Select category" }), _jsx("option", { value: "Front Office", children: "Front Office" }), _jsx("option", { value: "Housekeeping", children: "Housekeeping" }), _jsx("option", { value: "Maintenance", children: "Maintenance" }), _jsx("option", { value: "Food & Beverage", children: "Food & Beverage" }), _jsx("option", { value: "Guest Amenities", children: "Guest Amenities" }), _jsx("option", { value: "Security", children: "Security" }), _jsx("option", { value: "Laundry", children: "Laundry" })] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Supplier ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", value: newItem.supplier, onChange: (e) => setNewItem({ ...newItem, supplier: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", placeholder: "Enter supplier name" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Location" }), _jsx("input", { type: "text", value: newItem.location, onChange: (e) => setNewItem({ ...newItem, location: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", placeholder: "Enter storage location" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Unit" }), _jsxs("select", { value: newItem.unit, onChange: (e) => setNewItem({ ...newItem, unit: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", children: [_jsx("option", { value: "", children: "Select unit" }), _jsx("option", { value: "pieces", children: "Pieces" }), _jsx("option", { value: "boxes", children: "Boxes" }), _jsx("option", { value: "reams", children: "Reams" }), _jsx("option", { value: "bottles", children: "Bottles" }), _jsx("option", { value: "packs", children: "Packs" }), _jsx("option", { value: "rolls", children: "Rolls" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Unit Price (\u20B1)" }), _jsx("input", { type: "number", min: "0", step: "0.01", value: newItem.unitPrice, onChange: (e) => setNewItem({
                                                            ...newItem,
                                                            unitPrice: parseFloat(e.target.value) || 0,
                                                        }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", placeholder: "0.00" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Initial Stock" }), _jsx("input", { type: "number", min: "0", value: newItem.initialStock, onChange: (e) => setNewItem({
                                                            ...newItem,
                                                            initialStock: parseInt(e.target.value) || 0,
                                                        }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", placeholder: "0" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Reorder Level" }), _jsx("input", { type: "number", min: "0", value: newItem.reorderLevel, onChange: (e) => setNewItem({
                                                            ...newItem,
                                                            reorderLevel: parseInt(e.target.value) || 0,
                                                        }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", placeholder: "0" })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Description" }), _jsx("input", { value: newItem.description, onChange: (e) => setNewItem({ ...newItem, description: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", placeholder: "Enter item description" })] })] }) }) }) }), _jsx("div", { className: "bg-gradient-to-r from-gray-50 to-white border-t border-gray-200", children: _jsx("div", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center justify-end space-x-3", children: [_jsx("button", { onClick: handleCancel, className: "px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm", children: "Cancel" }), _jsx("button", { onClick: handleSave, className: "px-6 py-2 text-sm font-medium text-white bg-heritage-green rounded-lg hover:bg-heritage-green/90 transition-all duration-200 shadow-sm", children: "Create Item" })] }) }) })] }) })] }));
    // Use createPortal to render modal directly in document.body
    return createPortal(modalContent, document.body);
};
export default AddItemModal;
