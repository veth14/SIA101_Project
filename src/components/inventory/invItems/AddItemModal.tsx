import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import type { InventoryItem } from './items-backendLogic/inventoryService';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemData: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void> | void;
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

const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose, onSave }) => {

  const [newItem, setNewItem] = useState<NewItemData>({
    name: '',
    description: '',
    category: '',
    supplier: '',
    location: '',
    unit: '',
    unitPrice: 0,
    reorderLevel: 0,
    initialStock: 0
  });

  const handleSave = async () => {

    // Validation
    if (!newItem.name.trim() || !newItem.category.trim() || !newItem.supplier.trim()) {
      console.log('Validation failed: Missing required fields');
      return;
    }

    if (newItem.unitPrice <= 0 || newItem.reorderLevel < 0 || newItem.initialStock < 0) {
      console.log('Validation failed: Invalid price, reorder level, or initial stock');
      return;
    }

    const payload: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'> = {
      name: newItem.name,
      description: newItem.description,
      category: newItem.category,
      currentStock: newItem.initialStock,
      reorderLevel: newItem.reorderLevel,
      unitPrice: newItem.unitPrice,
      supplier: newItem.supplier,
      lastRestocked: new Date().toISOString().split('T')[0],
      image: undefined,
      unit: newItem.unit || 'pieces',
      location: newItem.location,
    };

    try {
      await onSave(payload);
      handleCancel();
    } catch (error) {
      console.error('Error saving new inventory item:', error);
    }
  };

  const handleCancel = () => {
    setNewItem({
      name: '',
      description: '',
      category: '',
      supplier: '',
      location: '',
      unit: '',
      unitPrice: 0,
      reorderLevel: 0,
      initialStock: 0
    });
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 transition-opacity duration-200 bg-black/45 backdrop-blur-lg"
        onClick={handleCancel}
        aria-label="Close overlay"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-4xl max-h-[80vh] mx-6 my-6 overflow-hidden rounded-3xl bg-white/95 shadow-2xl border border-white/60 flex flex-col">
        {/* Header */}
        <div className="relative px-6 py-4 bg-white border-b border-gray-100 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 text-white rounded-2xl shadow-sm bg-[#82A33D]">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M4 7l8-4 8 4v10a2 2 0 01-1.106 1.79l-6.5 3.25a2 2 0 01-1.788 0l-6.5-3.25A2 2 0 014 17V7z" />
                  <path d="M9 12h6M9 16h3" stroke="rgba(255,255,255,0.9)" strokeWidth="1" fill="none" />
                </svg>
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-[#82A33D] md:text-2xl">Add Inventory Item</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Create a new stock item for your inventory. Required fields are marked with
                  <span className="ml-1 font-semibold text-red-500">*</span>.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleCancel}
            aria-label="Close"
            className="absolute flex items-center justify-center rounded-md top-4 right-4 w-9 h-9 text-[#82A33D] bg-[#82A33D]/10 ring-1 ring-[#82A33D]/20"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 pb-8 overflow-y-auto overflow-x-hidden flex-1 min-h-0 space-y-6 bg-gray-50/40">
          {/* Item & Supplier Details */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <h4 className="flex items-center mb-4 text-lg font-semibold text-gray-800">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7l9-4 9 4-9 4-9-4z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13l9 4 9-4" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 17l9 4 9-4" />
                </svg>
                Item Details
              </h4>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Item Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full px-4 py-3 transition-colors border rounded-lg border-gray-200 focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D]"
                    placeholder="Enter item name"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full px-4 py-3 transition-colors border rounded-lg border-gray-200 focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D]"
                  >
                    <option value="">Select category</option>
                    <option value="Front Office">Front Office</option>
                    <option value="Housekeeping">Housekeeping</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Office Supplies">Office Supplies</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newItem.location}
                    onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                    className="w-full px-4 py-3 transition-colors border rounded-lg border-gray-200 focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D]"
                    placeholder="Storage location (e.g., Security Office)"
                  />
                </div>
              </div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <h4 className="flex items-center mb-4 text-lg font-semibold text-gray-800">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 10-8 0v4" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11h14l-1 9H6l-1-9z" />
                </svg>
                Supplier & Unit
              </h4>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Supplier <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newItem.supplier}
                    onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                    className="w-full px-4 py-3 transition-colors border rounded-lg border-gray-200 focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D]"
                    placeholder="Supplier name"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Unit</label>
                  <select
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    className="w-full px-4 py-3 transition-colors border rounded-lg border-gray-200 focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D]"
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
              </div>
            </div>
          </div>

          {/* Stock & Pricing */}
          <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <h4 className="flex items-center mb-4 text-lg font-semibold text-gray-800">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18v4H3zM3 9h18v4H3zM3 15h18v4H3z" />
              </svg>
              Stock & Pricing
            </h4>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Unit Price (₱)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newItem.unitPrice}
                  onChange={(e) =>
                    setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-3 transition-colors border rounded-lg border-gray-200 focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D]"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Initial Stock</label>
                <input
                  type="number"
                  min="0"
                  value={newItem.initialStock}
                  onChange={(e) =>
                    setNewItem({ ...newItem, initialStock: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-3 transition-colors border rounded-lg border-gray-200 focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D]"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Reorder Level</label>
                <input
                  type="number"
                  min="0"
                  value={newItem.reorderLevel}
                  onChange={(e) =>
                    setNewItem({ ...newItem, reorderLevel: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-3 transition-colors border rounded-lg border-gray-200 focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D]"
                  placeholder="Minimum stock before alert"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 transition-colors border rounded-lg resize-none border-gray-200 focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D]"
              placeholder="Add any useful details about this item..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/80">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#82A33D]/20"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-lg shadow-md bg-[#82A33D] border border-[#82A33D]/20 focus:outline-none focus:ring-2 focus:ring-[#82A33D]/30 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Create Item</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Use createPortal to render modal directly in document.body
  return createPortal(modalContent, document.body);
};

export default AddItemModal;