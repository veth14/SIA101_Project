import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { updateInventoryItem } from './items-backendLogic/inventoryService';
import type { InventoryItem } from './items-backendLogic/inventoryService';

interface ItemEditModalProps {
  item: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const ItemEditModal: React.FC<ItemEditModalProps> = ({ item, isOpen, onClose }) => {
  const [editedItem, setEditedItem] = useState({
    name: '',
    description: '',
    category: '',
    supplier: '',
    location: '',
    unit: '',
    unitPrice: 0,
    reorderLevel: 0,
  });

  useEffect(() => {
    if (item && isOpen) {
      setEditedItem({
        name: item.name,
        description: item.description || '',
        category: item.category,
        supplier: item.supplier,
        location: item.location,
        unit: item.unit,
        unitPrice: item.unitPrice,
        reorderLevel: item.reorderLevel,
      });
    }
  }, [item, isOpen]);

  if (!item || !isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSave = async () => {
    if (!editedItem.name.trim() || !editedItem.category.trim() || !editedItem.supplier.trim()) {
      alert('Please fill in Item Name, Category, and Supplier.');
      return;
    }

    if (editedItem.unitPrice <= 0 || Number.isNaN(editedItem.unitPrice)) {
      alert('Unit price must be a number greater than 0.');
      return;
    }

    if (editedItem.reorderLevel < 0 || !Number.isInteger(editedItem.reorderLevel)) {
      alert('Reorder level must be a whole number greater than or equal to 0.');
      return;
    }

    try {
      await updateInventoryItem(item.id, {
        name: editedItem.name.trim(),
        description: editedItem.description.trim(),
        category: editedItem.category.trim(),
        supplier: editedItem.supplier.trim(),
        location: editedItem.location.trim(),
        unit: editedItem.unit,
        unitPrice: editedItem.unitPrice,
        reorderLevel: editedItem.reorderLevel,
      });

      onClose();
    } catch (error) {
      console.error('Error updating inventory item:', error);
      alert('Failed to save item changes. Please try again.');
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/45 backdrop-blur-lg overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-white/95 shadow-2xl border border-white/60">
        <div className="relative px-6 pt-6 pb-5 bg-white border-b border-gray-100 rounded-t-3xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#82A33D] rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Edit Item Details</h1>
              <p className="text-sm text-gray-600">Item ID: {item.id}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute flex items-center justify-center rounded-md top-4 right-4 w-9 h-9 text-[#82A33D] bg-[#82A33D]/10 ring-1 ring-[#82A33D]/20"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 bg-gradient-to-br from-gray-50 via-white to-emerald-50/20">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Name *</label>
                <input
                  type="text"
                  value={editedItem.name}
                  onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D]"
                  placeholder="Enter item name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  value={editedItem.category}
                  onChange={(e) => setEditedItem({ ...editedItem, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                >
                  <option value="">Select category</option>
                  <option value="Front Office">Front Office</option>
                  <option value="Housekeeping">Housekeeping</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Food & Beverage">Food &amp; Beverage</option>
                  <option value="Guest Amenities">Guest Amenities</option>
                  <option value="Laundry">Laundry</option>
                  <option value="Security">Security</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Office Supplies">Office Supplies</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Supplier *</label>
                <input
                  type="text"
                  value={editedItem.supplier}
                  onChange={(e) => setEditedItem({ ...editedItem, supplier: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                  placeholder="Enter supplier name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={editedItem.location}
                  onChange={(e) => setEditedItem({ ...editedItem, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                  placeholder="Enter storage location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                <select
                  value={editedItem.unit}
                  onChange={(e) => setEditedItem({ ...editedItem, unit: e.target.value })}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit Price (₱)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={editedItem.unitPrice}
                  onChange={(e) =>
                    setEditedItem({ ...editedItem, unitPrice: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reorder Level</label>
                <input
                  type="number"
                  min="0"
                  value={editedItem.reorderLevel}
                  onChange={(e) =>
                    setEditedItem({ ...editedItem, reorderLevel: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                  placeholder="0"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={editedItem.description}
                  onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                  placeholder="Enter item description"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 text-sm font-bold text-white bg-[#82A33D] rounded-lg hover:bg-[#82A33D]/90 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ItemEditModal;
