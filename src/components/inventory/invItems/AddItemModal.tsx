import usePostInvInventoryItem from "@/api/postInvInventory";
import React, { useState } from "react";
import { createPortal } from "react-dom";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NewItemData {
  name: string;
  description: string;
  category: string;
  supplier: string;
  location: string;
  unit: string;
  unitPrice: number;
  reorderLevel: number;
  initialStock: number;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose }) => {
  const [newItem, setNewItem] = useState<NewItemData>({
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
  const { postInvInventoryItem, loadingForPostInvInventoryItem } =
    usePostInvInventoryItem();
  const handleSave = async () => {
    // Validation
    if (
      !newItem.name.trim() ||
      !newItem.category.trim() ||
      !newItem.supplier.trim()
    ) {
      console.log("Validation failed: Missing required fields");
      return;
    }

    if (
      newItem.unitPrice <= 0 ||
      newItem.reorderLevel < 0 ||
      newItem.initialStock < 0
    ) {
      console.log(
        "Validation failed: Invalid price, reorder level, or initial stock"
      );
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

  if (!isOpen) return null;
  const item = {
    category: "Front Office",
    currentStock: 50,
    description: "White A4 copy paper, 80gsm, 500 sheets per ream",
    location: "Front Office Storage",
    name: "New Name from Postman",
    reorderLevel: 20,
    supplier: "Office Supplies Co.",
    unit: "reams",
    unitPrice: 180,
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] overflow-y-auto"
      style={{
        zIndex: 99999,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        style={{ zIndex: 99998 }}
      ></div>

      {/* Modal */}
      <div
        className="relative min-h-screen flex items-center justify-center p-6"
        style={{ zIndex: 99999 }}
      >
        <div
          className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl transform transition-all overflow-hidden"
          style={{ zIndex: 99999 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-heritage-green/5 to-emerald-50 border-b border-gray-200">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Add New Item
                    </h1>
                    <p className="text-sm text-gray-600">
                      Create a new inventory item
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors group"
                >
                  <svg
                    className="w-5 h-5 text-gray-500 group-hover:text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-br from-heritage-light/30 via-white to-emerald-50/30">
            <div className="px-6 py-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/60 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newItem.name}
                      onChange={(e) =>
                        setNewItem({ ...newItem, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                      placeholder="Enter item name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newItem.category}
                      onChange={(e) =>
                        setNewItem({ ...newItem, category: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                    >
                      <option value="">Select category</option>
                      <option value="Front Office">Front Office</option>
                      <option value="Housekeeping">Housekeeping</option>
                      {/* <option value="Kitchen">Kitchen</option> */}
                      <option value="Maintenance">Maintenance</option>
                      {/* <option value="Office Supplies">Office Supplies</option> */}
                      <option value="Food & Beverage">Food & Beverage</option>
                      <option value="Guest Amenities">Guest Amenities</option>
                      <option value="Security">Security</option>
                      <option value="Laundry">Laundry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supplier <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newItem.supplier}
                      onChange={(e) =>
                        setNewItem({ ...newItem, supplier: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                      placeholder="Enter supplier name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={newItem.location}
                      onChange={(e) =>
                        setNewItem({ ...newItem, location: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                      placeholder="Enter storage location"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit
                    </label>
                    <select
                      value={newItem.unit}
                      onChange={(e) =>
                        setNewItem({ ...newItem, unit: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                    >
                      <option value="">Select unit</option>
                      <option value="pieces">Pieces</option>
                      <option value="boxes">Boxes</option>
                      <option value="reams">Reams</option>
                      <option value="bottles">Bottles</option>
                      <option value="packs">Packs</option>
                      <option value="rolls">Rolls</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit Price (₱)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newItem.unitPrice}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          unitPrice: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Initial Stock
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newItem.initialStock}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          initialStock: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reorder Level
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newItem.reorderLevel}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          reorderLevel: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                      placeholder="0"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newItem.description}
                      onChange={(e) =>
                        setNewItem({ ...newItem, description: e.target.value })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                      placeholder="Enter item description"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="bg-gradient-to-r from-gray-50 to-white border-t border-gray-200">
            <div className="px-6 py-4">
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 text-sm font-medium text-white bg-heritage-green rounded-lg hover:bg-heritage-green/90 transition-all duration-200 shadow-sm"
                >
                  Create Item
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Use createPortal to render modal directly in document.body
  return createPortal(modalContent, document.body);
};

export default AddItemModal;
