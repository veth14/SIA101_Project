import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { createPortal } from "react-dom";
const ItemDetailsModal = ({ item, isOpen, onClose, onStockUpdated, }) => {
    const [activeTab, setActiveTab] = useState("overview");
    const [showAdjustStock, setShowAdjustStock] = useState(false);
    const [adjustmentType, setAdjustmentType] = useState("add");
    const [adjustmentQuantity, setAdjustmentQuantity] = useState("");
    const [adjustmentReason, setAdjustmentReason] = useState("");
    // Edit Item States
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedItem, setEditedItem] = useState({
        name: "",
        description: "",
        category: "",
        supplier: "",
        location: "",
        unit: "",
        unitPrice: 0,
        reorderLevel: 0,
    });
    const handleEditItem = () => {
        if (!item)
            return;
        setEditedItem({
            name: item.name,
            description: item.description || "",
            category: item.category,
            supplier: item.supplier,
            location: item.location,
            unit: item.unit,
            unitPrice: item.unitPrice,
            reorderLevel: item.reorderLevel,
        });
        setIsEditMode(true);
    };
    const handleSaveEdit = () => {
        // Validation
        if (!editedItem.name.trim() ||
            !editedItem.category.trim() ||
            !editedItem.supplier.trim()) {
            console.log("Validation failed: Missing required fields");
            return;
        }
        if (editedItem.unitPrice <= 0 || editedItem.reorderLevel < 0) {
            console.log("Validation failed: Invalid price or reorder level");
            return;
        }
        // Here you would typically update the database
        console.log("Item Edit:", {
            itemId: item?.id,
            oldData: {
                name: item?.name,
                description: item?.description,
                category: item?.category,
                supplier: item?.supplier,
                location: item?.location,
                unit: item?.unit,
                unitPrice: item?.unitPrice,
                reorderLevel: item?.reorderLevel,
            },
            newData: editedItem,
            timestamp: new Date().toISOString(),
        });
        console.log(`Item updated successfully: ${editedItem.name}`);
        setIsEditMode(false);
    };
    const handleCancelEdit = () => {
        setIsEditMode(false);
        setEditedItem({
            name: "",
            description: "",
            category: "",
            supplier: "",
            location: "",
            unit: "",
            unitPrice: 0,
            reorderLevel: 0,
        });
    };
    const handleAdjustStock = () => {
        setShowAdjustStock(true);
    };
    const handleStockAdjustmentSubmit = async () => {
        if (!adjustmentQuantity || !adjustmentReason) {
            console.log("Validation failed: Missing quantity or reason");
            alert("Please enter both quantity and reason");
            return;
        }
        const quantity = parseInt(adjustmentQuantity);
        if (isNaN(quantity) || quantity <= 0) {
            console.log("Validation failed: Invalid quantity");
            alert("Please enter a valid quantity greater than 0");
            return;
        }
        const finalQuantity = adjustmentType === "add" ? quantity : -quantity;
        const newStock = (item?.currentStock || 0) + finalQuantity;
        if (newStock < 0) {
            console.log("Validation failed: Cannot reduce stock below 0");
            alert("Cannot reduce stock below 0");
            return;
        }
        if (!item?.id) {
            console.log("Error: Item ID is missing");
            return;
        }
        try {
            const response = await fetch("http://localhost:3000/api/inventory-inventory/adjust-stock", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    itemId: item.id,
                    adjustment: quantity,
                    reason: adjustmentReason,
                    type: adjustmentType,
                    itemName: item.name,
                    oldStock: item.currentStock,
                }),
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to update stock");
            }
            console.log("Stock Adjustment:", data.data);
            alert(`Stock updated successfully! ${item.name}\n${finalQuantity > 0 ? "+" : ""}${finalQuantity} = ${data.data.newStock}`);
            // Reset form
            setShowAdjustStock(false);
            setAdjustmentQuantity("");
            setAdjustmentReason("");
            setAdjustmentType("add");
            if (onStockUpdated) {
                await onStockUpdated();
            }
            // Close the modal after a short delay to show the success message
            setTimeout(() => {
                onClose();
            }, 500);
            // Optionally refresh the inventory list
            // window.location.reload(); // or call your fetch function
        }
        catch (error) {
            console.error("Error updating stock:", error);
            alert(error instanceof Error
                ? error.message
                : "Failed to update stock. Please try again.");
        }
    };
    const handleCancelAdjustment = () => {
        setShowAdjustStock(false);
        setAdjustmentQuantity("");
        setAdjustmentReason("");
        setAdjustmentType("add");
    };
    const handlePrintLabel = () => {
        if (!item)
            return;
        // Create printable label content
        const labelContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Item Label - ${item.name}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px;
            background: white;
          }
          .label {
            width: 4in;
            height: 2in;
            border: 2px solid #000;
            padding: 10px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .header { 
            text-align: center; 
            font-weight: bold; 
            font-size: 16px;
            border-bottom: 1px solid #000;
            padding-bottom: 5px;
            margin-bottom: 5px;
          }
          .item-name { 
            font-size: 14px; 
            font-weight: bold; 
            margin: 5px 0;
          }
          .details { 
            font-size: 10px; 
            line-height: 1.2;
          }
          .barcode {
            text-align: center;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            letter-spacing: 2px;
            margin-top: 5px;
          }
          @media print {
            body { margin: 0; padding: 0; }
            .label { margin: 0; }
          }
        </style>
      </head>
      <body>
        <div class="label">
          <div class="header">INVENTORY LABEL</div>
          <div class="item-name">${item.name}</div>
          <div class="details">
            <div><strong>ID:</strong> ${item.id}</div>
            <div><strong>Category:</strong> ${item.category}</div>
            <div><strong>Location:</strong> ${item.location}</div>
            <div><strong>Stock:</strong> ${item.currentStock} ${item.unit}</div>
            <div><strong>Price:</strong> ₱${item.unitPrice}</div>
          </div>
          <div class="barcode">||||| ${item.id} |||||</div>
        </div>
      </body>
      </html>
    `;
        // Open print window
        const printWindow = window.open("", "_blank", "width=600,height=400");
        if (printWindow) {
            printWindow.document.write(labelContent);
            printWindow.document.close();
            printWindow.focus();
            // Auto-print after a short delay
            setTimeout(() => {
                printWindow.print();
            }, 500);
            console.log("Print Label generated for:", item.name);
        }
        else {
            console.log("Unable to open print window - popup blocked");
        }
    };
    if (!isOpen || !item)
        return null;
    // Sample recent activity data
    const recentActivity = [
        {
            id: "1",
            type: "stock_in",
            description: "Stock received from supplier",
            quantity: 50,
            timestamp: "2 hours ago",
            user: "John Doe",
        },
        {
            id: "2",
            type: "stock_out",
            description: "Used for housekeeping",
            quantity: -15,
            timestamp: "1 day ago",
            user: "Maria Garcia",
        },
        {
            id: "3",
            type: "adjustment",
            description: "Stock count adjustment",
            quantity: -2,
            timestamp: "3 days ago",
            user: "Admin",
        },
    ];
    const getStatusColor = (currentStock, reorderLevel) => {
        if (currentStock === 0) {
            return "bg-red-100 text-red-800 border-red-200";
        }
        else if (currentStock <= reorderLevel) {
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
        }
        else {
            return "bg-green-100 text-green-800 border-green-200";
        }
    };
    const getStatusText = (currentStock, reorderLevel) => {
        if (currentStock === 0) {
            return "Out of Stock";
        }
        else if (currentStock <= reorderLevel) {
            return "Low Stock";
        }
        else {
            return "In Stock";
        }
    };
    const getActivityIcon = (type) => {
        switch (type) {
            case "stock_in":
                return (_jsx("svg", { className: "w-4 h-4 text-green-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6v6m0 0v6m0-6h6m-6 0H6" }) }));
            case "stock_out":
                return (_jsx("svg", { className: "w-4 h-4 text-red-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M20 12H4" }) }));
            case "adjustment":
                return (_jsx("svg", { className: "w-4 h-4 text-blue-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" }) }));
            default:
                return (_jsx("svg", { className: "w-4 h-4 text-gray-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }));
        }
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 0,
        }).format(amount);
    };
    const totalValue = item.currentStock * item.unitPrice;
    const modalContent = (_jsxs("div", { className: "fixed inset-0 z-[99999] overflow-y-auto", style: {
            zIndex: 99999,
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        }, children: [_jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity", onClick: onClose, style: { zIndex: 99998 } }), _jsx("div", { className: "relative min-h-screen flex items-center justify-center p-6", style: { zIndex: 99999 }, children: _jsxs("div", { className: "relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl transform transition-all overflow-hidden", style: { zIndex: 99999 }, children: [_jsxs("div", { className: "bg-gradient-to-r from-heritage-green/5 to-emerald-50 border-b border-gray-200", children: [_jsx("div", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-xl flex items-center justify-center shadow-lg", children: _jsx("svg", { className: "w-6 h-6 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" }) }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: item.name }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Item ID: ", item.id, " \u2022 Category: ", item.category] })] })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsxs("span", { className: `inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold border ${getStatusColor(item.currentStock, item.reorderLevel)}`, children: [_jsx("div", { className: "w-2 h-2 rounded-full mr-2 bg-current opacity-80" }), getStatusText(item.currentStock, item.reorderLevel)] }), _jsx("button", { onClick: onClose, className: "p-2 hover:bg-gray-100 rounded-xl transition-colors group", children: _jsx("svg", { className: "w-5 h-5 text-gray-500 group-hover:text-gray-700", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] })] }) }), _jsx("div", { className: "border-t border-gray-200/50", children: _jsx("div", { className: "px-6", children: _jsx("nav", { className: "flex space-x-6", children: [
                                                { id: "overview", label: "Overview", icon: "📋" },
                                                { id: "history", label: "History", icon: "📈" },
                                                { id: "analytics", label: "Analytics", icon: "📊" },
                                            ].map((tab) => (_jsxs("button", { onClick: () => setActiveTab(tab.id), className: `py-4 px-2 border-b-2 font-medium text-sm transition-all duration-200 ${activeTab === tab.id
                                                    ? "border-heritage-green text-heritage-green"
                                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`, children: [_jsx("span", { className: "mr-2 text-base", children: tab.icon }), tab.label] }, tab.id))) }) }) })] }), _jsx("div", { className: "flex-1 overflow-y-auto bg-gradient-to-br from-heritage-light/30 via-white to-emerald-50/30", children: _jsxs("div", { className: "px-6 py-6", children: [activeTab === "overview" && !isEditMode && (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 space-y-4", children: [_jsxs("div", { className: "bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/60 p-6", children: [_jsxs("div", { className: "flex items-center mb-4", children: [_jsx("div", { className: "w-8 h-8 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-lg flex items-center justify-center mr-3", children: _jsx("svg", { className: "w-4 h-4 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }), _jsx("h3", { className: "text-lg font-bold text-gray-900", children: "Description" })] }), _jsx("p", { className: "text-gray-700 text-base leading-relaxed", children: item.description ||
                                                                    "White A4 copy paper, 80gsm. 500 sheets per ream." })] }), _jsxs("div", { className: "bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/60 p-6", children: [_jsxs("div", { className: "flex items-center mb-4", children: [_jsx("div", { className: "w-8 h-8 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-lg flex items-center justify-center mr-3", children: _jsx("svg", { className: "w-4 h-4 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" }) }) }), _jsx("h3", { className: "text-lg font-bold text-gray-900", children: "Stock Information" })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "text-center bg-gradient-to-br from-heritage-green/10 to-emerald-100/50 rounded-xl p-4 border border-heritage-green/20", children: [_jsx("div", { className: "text-2xl font-black text-heritage-green mb-1", children: item.currentStock }), _jsx("div", { className: "text-xs font-medium text-gray-600", children: "Current Stock" })] }), _jsxs("div", { className: "text-center bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-4 border border-orange-200", children: [_jsx("div", { className: "text-2xl font-black text-orange-600 mb-1", children: item.reorderLevel }), _jsx("div", { className: "text-xs font-medium text-gray-600", children: "Reorder Level" })] }), _jsxs("div", { className: "text-center bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200", children: [_jsx("div", { className: "text-lg font-black text-blue-600 mb-1", children: formatCurrency(item.unitPrice) }), _jsx("div", { className: "text-xs font-medium text-gray-600", children: "Unit Price" })] }), _jsxs("div", { className: "text-center bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-200", children: [_jsx("div", { className: "text-lg font-black text-purple-600 mb-1", children: formatCurrency(totalValue) }), _jsx("div", { className: "text-xs font-medium text-gray-600", children: "Total Value" })] })] })] })] }), _jsx("div", { className: "space-y-4", children: _jsxs("div", { className: "bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/60 p-5", children: [_jsx("h4", { className: "text-base font-bold text-gray-900 mb-3", children: "Item Details" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex justify-between items-center py-2 border-b border-gray-100", children: [_jsx("span", { className: "text-sm font-medium text-gray-500", children: "Category" }), _jsx("span", { className: "text-sm font-semibold text-gray-900", children: item.category })] }), _jsxs("div", { className: "flex justify-between items-center py-2 border-b border-gray-100", children: [_jsx("span", { className: "text-sm font-medium text-gray-500", children: "Supplier" }), _jsx("span", { className: "text-sm font-semibold text-gray-900", children: item.supplier })] }), _jsxs("div", { className: "flex justify-between items-center py-2 border-b border-gray-100", children: [_jsx("span", { className: "text-sm font-medium text-gray-500", children: "Location" }), _jsx("span", { className: "text-sm font-semibold text-gray-900", children: item.location })] }), _jsxs("div", { className: "flex justify-between items-center py-2 border-b border-gray-100", children: [_jsx("span", { className: "text-sm font-medium text-gray-500", children: "Unit" }), _jsx("span", { className: "text-sm font-semibold text-gray-900", children: item.unit })] }), _jsxs("div", { className: "flex justify-between items-center py-2", children: [_jsx("span", { className: "text-sm font-medium text-gray-500", children: "Last Restocked" }), _jsx("span", { className: "text-sm font-semibold text-gray-900", children: item.lastRestocked || "-" })] })] })] }) })] })), activeTab === "overview" && isEditMode && (_jsxs("div", { className: "bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/60 p-6", children: [_jsxs("div", { className: "flex items-center mb-6", children: [_jsx("div", { className: "w-8 h-8 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-lg flex items-center justify-center mr-3", children: _jsx("svg", { className: "w-4 h-4 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" }) }) }), _jsx("h3", { className: "text-lg font-bold text-gray-900", children: "Edit Item Details" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Item Name *" }), _jsx("input", { type: "text", value: editedItem.name, onChange: (e) => setEditedItem({ ...editedItem, name: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", placeholder: "Enter item name" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Category *" }), _jsxs("select", { value: editedItem.category, onChange: (e) => setEditedItem({
                                                                    ...editedItem,
                                                                    category: e.target.value,
                                                                }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", children: [_jsx("option", { value: "", children: "Select category" }), _jsx("option", { value: "Front Office", children: "Front Office" }), _jsx("option", { value: "Housekeeping", children: "Housekeeping" }), _jsx("option", { value: "Kitchen", children: "Kitchen" }), _jsx("option", { value: "Maintenance", children: "Maintenance" }), _jsx("option", { value: "Office Supplies", children: "Office Supplies" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Supplier *" }), _jsx("input", { type: "text", value: editedItem.supplier, onChange: (e) => setEditedItem({
                                                                    ...editedItem,
                                                                    supplier: e.target.value,
                                                                }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", placeholder: "Enter supplier name" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Location" }), _jsx("input", { type: "text", value: editedItem.location, onChange: (e) => setEditedItem({
                                                                    ...editedItem,
                                                                    location: e.target.value,
                                                                }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", placeholder: "Enter storage location" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Unit" }), _jsxs("select", { value: editedItem.unit, onChange: (e) => setEditedItem({ ...editedItem, unit: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", children: [_jsx("option", { value: "", children: "Select unit" }), _jsx("option", { value: "pieces", children: "Pieces" }), _jsx("option", { value: "boxes", children: "Boxes" }), _jsx("option", { value: "reams", children: "Reams" }), _jsx("option", { value: "bottles", children: "Bottles" }), _jsx("option", { value: "packs", children: "Packs" }), _jsx("option", { value: "rolls", children: "Rolls" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Unit Price (\u20B1)" }), _jsx("input", { type: "number", min: "0", step: "0.01", value: editedItem.unitPrice, onChange: (e) => setEditedItem({
                                                                    ...editedItem,
                                                                    unitPrice: parseFloat(e.target.value) || 0,
                                                                }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", placeholder: "0.00" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Reorder Level" }), _jsx("input", { type: "number", min: "0", value: editedItem.reorderLevel, onChange: (e) => setEditedItem({
                                                                    ...editedItem,
                                                                    reorderLevel: parseInt(e.target.value) || 0,
                                                                }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", placeholder: "0" })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Description" }), _jsx("textarea", { value: editedItem.description, onChange: (e) => setEditedItem({
                                                                    ...editedItem,
                                                                    description: e.target.value,
                                                                }), rows: 3, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", placeholder: "Enter item description" })] })] }), _jsxs("div", { className: "flex space-x-3 mt-6", children: [_jsx("button", { onClick: handleCancelEdit, className: "flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors", children: "Cancel" }), _jsx("button", { onClick: handleSaveEdit, className: "flex-1 px-4 py-2 text-white bg-heritage-green rounded-lg hover:bg-heritage-green/90 transition-colors", children: "Save Changes" })] })] })), activeTab === "history" && (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/60 p-5", children: [_jsxs("div", { className: "flex items-center mb-4", children: [_jsx("div", { className: "w-8 h-8 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-lg flex items-center justify-center mr-3", children: _jsx("svg", { className: "w-4 h-4 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }), _jsx("h3", { className: "text-lg font-bold text-gray-900", children: "Recent Activity" })] }), _jsx("div", { className: "space-y-3", children: recentActivity.slice(0, 4).map((activity) => (_jsxs("div", { className: "flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg hover:shadow-sm transition-all duration-200", children: [_jsx("div", { className: "w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 flex-shrink-0", children: getActivityIcon(activity.type) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("p", { className: "text-sm font-medium text-gray-900 truncate", children: activity.description }), _jsxs("div", { className: `px-2 py-1 rounded text-xs font-bold ${activity.quantity > 0
                                                                                        ? "text-green-700 bg-green-100"
                                                                                        : "text-red-700 bg-red-100"}`, children: [activity.quantity > 0 ? "+" : "", activity.quantity] })] }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: [activity.user, " \u2022 ", activity.timestamp] })] })] }, activity.id))) })] }), _jsxs("div", { className: "bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/60 p-5", children: [_jsxs("div", { className: "flex items-center mb-4", children: [_jsx("div", { className: "w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3", children: _jsx("svg", { className: "w-4 h-4 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }) }) }), _jsx("h3", { className: "text-lg font-bold text-gray-900", children: "Stock Trend" })] }), _jsx("div", { className: "h-40 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center border border-blue-100", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl mb-2", children: "\uD83D\uDCC8" }), _jsx("p", { className: "text-sm font-medium text-gray-600", children: "Stock Movement" }), _jsx("p", { className: "text-xs text-gray-500", children: "Last 30 days" })] }) })] })] })), activeTab === "analytics" && (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/60 p-5", children: [_jsxs("div", { className: "flex items-center mb-4", children: [_jsx("div", { className: "w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3", children: _jsx("svg", { className: "w-4 h-4 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }) }) }), _jsx("h3", { className: "text-lg font-bold text-gray-900", children: "Usage Analytics" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-4 border border-blue-200", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h4", { className: "text-sm font-bold text-blue-900", children: "Monthly Usage" }), _jsx("div", { className: "w-6 h-6 bg-blue-500 rounded flex items-center justify-center", children: _jsx("svg", { className: "w-3 h-3 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" }) }) })] }), _jsxs("div", { className: "text-2xl font-black text-blue-600 mb-1", children: ["45 ", item.unit] }), _jsx("p", { className: "text-xs font-medium text-blue-700", children: "Average per month" })] }), _jsxs("div", { className: "bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg p-4 border border-green-200", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h4", { className: "text-sm font-bold text-green-900", children: "Reorder In" }), _jsx("div", { className: "w-6 h-6 bg-green-500 rounded flex items-center justify-center", children: _jsx("svg", { className: "w-3 h-3 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }) })] }), _jsx("div", { className: "text-2xl font-black text-green-600 mb-1", children: "12 days" }), _jsx("p", { className: "text-xs font-medium text-green-700", children: "Based on usage" })] })] })] }), _jsxs("div", { className: "bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/60 p-5", children: [_jsxs("div", { className: "flex items-center mb-4", children: [_jsx("div", { className: "w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mr-3", children: _jsx("svg", { className: "w-4 h-4 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }) }), _jsx("h3", { className: "text-lg font-bold text-gray-900", children: "Performance" })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200", children: [_jsx("div", { className: "w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3", children: _jsx("svg", { className: "w-3 h-3 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-green-900", children: "Optimal Level" }), _jsx("p", { className: "text-xs text-green-700", children: "Within range" })] })] }), _jsxs("div", { className: "flex items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200", children: [_jsx("div", { className: "w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3", children: _jsx("svg", { className: "w-3 h-3 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" }) }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-blue-900", children: "Usage Trend" }), _jsx("p", { className: "text-xs text-blue-700", children: "+15% this month" })] })] }), _jsxs("div", { className: "flex items-center p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200", children: [_jsx("div", { className: "w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3", children: _jsx("svg", { className: "w-3 h-3 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" }) }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-purple-900", children: "Cost Efficiency" }), _jsx("p", { className: "text-xs text-purple-700", children: "5% below market" })] })] })] })] }), _jsxs("div", { className: "bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl shadow-lg border border-yellow-200 p-5", children: [_jsxs("div", { className: "flex items-center mb-4", children: [_jsx("div", { className: "w-8 h-8 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg flex items-center justify-center mr-3", children: _jsx("svg", { className: "w-4 h-4 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" }) }) }), _jsx("h3", { className: "text-lg font-bold text-gray-900", children: "Recommendations" })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("div", { className: "w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" }), _jsx("p", { className: "text-sm font-medium text-yellow-900", children: "Increase reorder level to 25 units" })] }), _jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("div", { className: "w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" }), _jsx("p", { className: "text-sm font-medium text-yellow-900", children: "Reorder in 12 days to avoid stockout" })] }), _jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("div", { className: "w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" }), _jsx("p", { className: "text-sm font-medium text-yellow-900", children: "Consider bulk purchasing for better rates" })] })] })] })] }))] }) }), _jsx("div", { className: "bg-gradient-to-r from-gray-50 to-white border-t border-gray-200", children: _jsx("div", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsxs("button", { onClick: handlePrintLabel, className: "inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm", children: [_jsx("svg", { className: "w-4 h-4 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" }) }), "Print Label"] }), _jsxs("button", { onClick: handleAdjustStock, className: "inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm", children: [_jsx("svg", { className: "w-4 h-4 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-1 16h12L17 4M10 8v8M14 8v8" }) }), "Adjust Stock"] })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("button", { onClick: onClose, className: "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm", children: "Close" }), _jsxs("button", { onClick: handleEditItem, className: "inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-heritage-green rounded-lg hover:bg-heritage-green/90 transition-all duration-200 shadow-sm", children: [_jsx("svg", { className: "w-4 h-4 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" }) }), "Edit Item"] })] })] }) }) })] }) }), showAdjustStock && (_jsxs("div", { className: "fixed inset-0 z-[99999] flex items-center justify-center p-4", style: { zIndex: 100000 }, children: [_jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm", onClick: handleCancelAdjustment }), _jsxs("div", { className: "relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900", children: "Adjust Stock" }), _jsx("button", { onClick: handleCancelAdjustment, className: "p-2 hover:bg-gray-100 rounded-lg", children: _jsx("svg", { className: "w-5 h-5 text-gray-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Item" }), _jsxs("div", { className: "p-3 bg-gray-50 rounded-lg", children: [_jsx("p", { className: "font-medium text-gray-900", children: item.name }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Current Stock: ", item.currentStock, " ", item.unit] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Adjustment Type" }), _jsxs("div", { className: "flex space-x-3", children: [_jsx("button", { onClick: () => setAdjustmentType("add"), className: `flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${adjustmentType === "add"
                                                            ? "border-green-500 bg-green-50 text-green-700"
                                                            : "border-gray-300 text-gray-700 hover:border-gray-400"}`, children: "Add Stock" }), _jsx("button", { onClick: () => setAdjustmentType("remove"), className: `flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${adjustmentType === "remove"
                                                            ? "border-red-500 bg-red-50 text-red-700"
                                                            : "border-gray-300 text-gray-700 hover:border-gray-400"}`, children: "Remove Stock" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Quantity" }), _jsx("input", { type: "number", min: "1", value: adjustmentQuantity, onChange: (e) => setAdjustmentQuantity(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", placeholder: "Enter quantity" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Reason" }), _jsxs("select", { value: adjustmentReason, onChange: (e) => setAdjustmentReason(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", children: [_jsx("option", { value: "", children: "Select reason" }), _jsx("option", { value: "received_shipment", children: "Received Shipment" }), _jsx("option", { value: "damaged_goods", children: "Damaged Goods" }), _jsx("option", { value: "inventory_correction", children: "Inventory Correction" }), _jsx("option", { value: "returned_items", children: "Returned Items" }), _jsx("option", { value: "theft_loss", children: "Theft/Loss" }), _jsx("option", { value: "expired_items", children: "Expired Items" }), _jsx("option", { value: "other", children: "Other" })] })] }), adjustmentQuantity && (_jsx("div", { className: "p-3 bg-blue-50 rounded-lg", children: _jsxs("p", { className: "text-sm text-blue-800", children: [_jsx("strong", { children: "Preview:" }), " ", item.currentStock, " ", adjustmentType === "add" ? "+" : "-", " ", adjustmentQuantity, " ", "=", " ", adjustmentType === "add"
                                                    ? item.currentStock + parseInt(adjustmentQuantity || "0")
                                                    : item.currentStock -
                                                        parseInt(adjustmentQuantity || "0"), " ", item.unit] }) }))] }), _jsxs("div", { className: "flex space-x-3 mt-6", children: [_jsx("button", { onClick: handleCancelAdjustment, className: "flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors", children: "Cancel" }), _jsx("button", { onClick: handleStockAdjustmentSubmit, className: "flex-1 px-4 py-2 text-white bg-heritage-green rounded-lg hover:bg-heritage-green/90 transition-colors", children: "Adjust Stock" })] })] })] }))] }));
    // Use createPortal to render modal directly in document.body
    return isOpen ? createPortal(modalContent, document.body) : null;
};
export default ItemDetailsModal;
