import usePostInvProcurementOrder from "../../../api/postInvProcurement";
import useGetInvSupplier from "../../../api/getInvSupplier";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface PurchaseOrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface NewOrderData {
  supplier: string;
  expectedDelivery: string;
  items: PurchaseOrderItem[];
}

const NewOrderModal: React.FC<NewOrderModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [orderData, setOrderData] = useState<NewOrderData>({
    supplier: "",
    expectedDelivery: "",
    items: [{ name: "", quantity: 0, unitPrice: 0, total: 0 }],
  });
  const [suppliers, setSuppliers] = useState<any[]>([]);

  const { postInvProcurementOrder, loadingForPostInvProcurementOrder } = usePostInvProcurementOrder();
  const { getInvSuppliers, loadingForGetInvSupplier } = useGetInvSupplier();

  // Fetch suppliers when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchSuppliers();
    }
  }, [isOpen]);

  const fetchSuppliers = async () => {
    try {
      const response = await getInvSuppliers();
      if (response.success) {
        // fifilter to para ishow only mga active suppliers
        const activeSuppliers = (response.data || []).filter(
          (supplier: any) => supplier.status === "active"
        );
        setSuppliers(activeSuppliers);
      } else {
        console.error("Failed to fetch suppliers:", response.message);
        setSuppliers([]);
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      setSuppliers([]);
    }
  };

  const handleAddItem = () => {
    setOrderData({
      ...orderData,
      items: [...orderData.items, { name: "", quantity: 0, unitPrice: 0, total: 0 }],
    });
  };

  const handleRemoveItem = (index: number) => {
    if (orderData.items.length > 1) {
      const newItems = orderData.items.filter((_, i) => i !== index);
      setOrderData({ ...orderData, items: newItems });
    }
  };

  const handleItemChange = (index: number, field: keyof PurchaseOrderItem, value: string | number) => {
    const newItems = [...orderData.items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === "quantity" || field === "unitPrice") {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }

    setOrderData({ ...orderData, items: newItems });
  };

  const calculateTotalAmount = () => {
    return orderData.items.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSave = async () => {
    // Validation
    if (!orderData.supplier.trim()) {
      alert("Please select a supplier");
      return;
    }

    if (!orderData.expectedDelivery) {
      alert("Please select an expected delivery date");
      return;
    }

    const hasInvalidItems = orderData.items.some(
      (item) => !item.name.trim() || item.quantity <= 0 || item.unitPrice <= 0
    );

    if (hasInvalidItems) {
      alert("Please fill in all item details with valid name, quantity, and unit price");
      return;
    }

    const newOrder = {
      supplier: orderData.supplier,
      orderDate: new Date().toISOString().split("T")[0],
      expectedDelivery: orderData.expectedDelivery,
      items: orderData.items,
      totalAmount: calculateTotalAmount(),
      status: "pending",
    };

    try {
      const response = await postInvProcurementOrder(newOrder);
      
      if (response.success) {
        console.log("Order created successfully:", response);
        alert("Purchase order created successfully!");
        handleCancel();
        if (onSuccess) onSuccess();
      } else {
        alert(response.message || "Failed to create purchase order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("An error occurred while creating the purchase order");
    }
  };

  const handleCancel = () => {
    setOrderData({
      supplier: "",
      expectedDelivery: "",
      items: [{ name: "", quantity: 0, unitPrice: 0, total: 0 }],
    });
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[99999] overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-heritage-green/5 to-emerald-50/30">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Add New Purchase Order</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto max-h-[calc(100vh-250px)] px-6 py-5">
            <div className="space-y-5">
              {/* Order Info Section */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Order Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Order Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={new Date().toISOString().split("T")[0]}
                      disabled
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Expected Delivery <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={orderData.expectedDelivery}
                      onChange={(e) => setOrderData({ ...orderData, expectedDelivery: e.target.value })}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green bg-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Supplier <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={orderData.supplier}
                      onChange={(e) => setOrderData({ ...orderData, supplier: e.target.value })}
                      disabled={loadingForGetInvSupplier}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green bg-white disabled:bg-gray-50 disabled:text-gray-500"
                    >
                      <option value="">
                        {loadingForGetInvSupplier ? "Loading suppliers..." : "Select Supplier"}
                      </option>
                      {suppliers.map((supplier) => (
                        <option key={supplier.id} value={supplier.name}>
                          {supplier.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">Order Items</h3>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-3 py-1.5 bg-heritage-green text-white rounded-lg hover:bg-heritage-green/90 transition-colors font-medium text-xs flex items-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Item
                  </button>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {orderData.items.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-700 text-xs">Item #{index + 1}</h4>
                        {orderData.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Item Name</label>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleItemChange(index, "name", e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                            placeholder="e.g., Coffee Beans"
                          />
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity || ""}
                              onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Unit Price (₱)</label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unitPrice || ""}
                              onChange={(e) => handleItemChange(index, "unitPrice", parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                              placeholder="0.00"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Total (₱)</label>
                            <input
                              type="text"
                              value={item.total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                              disabled
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-semibold"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Amount */}
              <div className="bg-gradient-to-r from-heritage-green/10 to-emerald-50 rounded-lg p-4 border border-heritage-green/20">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-gray-800">Total Order Amount:</span>
                  <span className="text-2xl font-black text-heritage-green">
                    ₱{calculateTotalAmount().toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleCancel}
              disabled={loadingForPostInvProcurementOrder}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              CANCEL
            </button>
            <button
              onClick={handleSave}
              disabled={loadingForPostInvProcurementOrder}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-heritage-green rounded-lg hover:bg-heritage-green/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loadingForPostInvProcurementOrder ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "SAVE ORDER"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default NewOrderModal;
