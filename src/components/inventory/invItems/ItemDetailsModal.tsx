import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { updateItemStock } from './items-backendLogic/inventoryService';

import type { InventoryItem } from './items-backendLogic/inventoryService';

interface ItemDetailsModalProps {
  item: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({ item, isOpen, onClose }) => {
  const [showAdjustStock, setShowAdjustStock] = useState(false);
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'remove'>('add');
  const [adjustmentQuantity, setAdjustmentQuantity] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');

  const handleAdjustStock = () => {
    setShowAdjustStock(true);
  };

  const handleStockAdjustmentSubmit = async () => {
    if (!item) return;

    if (!adjustmentQuantity.trim() || !adjustmentReason.trim()) {
      alert('Please enter a quantity and a reason for the adjustment.');
      console.log('Validation failed: Missing quantity or reason');
      return;
    }

    const quantity = parseInt(adjustmentQuantity, 10);
    if (Number.isNaN(quantity) || quantity <= 0) {
      alert('Quantity must be a whole number greater than 0.');
      console.log('Validation failed: Invalid quantity');
      return;
    }

    const finalQuantity = adjustmentType === 'add' ? quantity : -quantity;
    const currentStock = item.currentStock ?? 0;
    const newStock = currentStock + finalQuantity;

    if (newStock < 0) {
      alert('Cannot reduce stock below 0.');
      console.log('Validation failed: Cannot reduce stock below 0');
      return;
    }

    try {
      await updateItemStock(item.id, newStock);

      console.log('Stock Adjustment saved to backend:', {
        itemId: item.id,
        itemName: item.name,
        oldStock: currentStock,
        adjustment: finalQuantity,
        newStock,
        reason: adjustmentReason,
        timestamp: new Date().toISOString(),
      });

      // Reset form
      setShowAdjustStock(false);
      setAdjustmentQuantity('');
      setAdjustmentReason('');
      setAdjustmentType('add');
    } catch (error) {
      console.error('Error adjusting stock:', error);
      alert('Failed to adjust stock. Please try again.');
    }
  };

  const handleCancelAdjustment = () => {
    setShowAdjustStock(false);
    setAdjustmentQuantity('');
    setAdjustmentReason('');
    setAdjustmentType('add');
  };

  const handlePrintLabel = () => {
    if (!item) return;

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
    const printWindow = window.open('', '_blank', 'width=600,height=400');
    if (printWindow) {
      printWindow.document.write(labelContent);
      printWindow.document.close();
      printWindow.focus();
      
      // Auto-print after a short delay
      setTimeout(() => {
        printWindow.print();
      }, 500);

      console.log('Print Label generated for:', item.name);
    } else {
      console.log('Unable to open print window - popup blocked');
    }
  };

  if (!isOpen || !item) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getStatusColor = (currentStock: number, reorderLevel: number) => {
    if (currentStock === 0) {
      return 'bg-red-100 text-red-800 border-red-200';
    } else if (currentStock <= reorderLevel) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } else {
      return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getStatusText = (currentStock: number, reorderLevel: number) => {
    if (currentStock === 0) {
      return 'Out of Stock';
    } else if (currentStock <= reorderLevel) {
      return 'Low Stock';
    } else {
      return 'In Stock';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalValue = item.currentStock * item.unitPrice;

  const modalContent = (
    <div 
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/45 backdrop-blur-lg overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="relative z-10 w-full max-w-4xl rounded-3xl bg-white/95 shadow-2xl border border-white/60">

        {/* Header */}
        <div className="relative px-6 pt-6 pb-5 bg-white border-b border-gray-100 rounded-t-3xl">

          {/* Left: icon + title */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-[#82A33D] rounded-2xl flex items-center justify-center shadow-lg">

              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>

              <p className="text-sm text-gray-600">Item ID: {item.id} • Category: {item.category}</p>
            </div>
          </div>

          {/* Right: status pill + close button */}
          <div className="absolute top-4 right-4 flex items-center space-x-3">
            <span
              className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(
                item.currentStock,
                item.reorderLevel
              )}`}
            >

              <div className="w-2 h-2 rounded-full mr-2 bg-current opacity-80" />
              {getStatusText(item.currentStock, item.reorderLevel)}
            </span>
            <button
              onClick={onClose}
              aria-label="Close"
              className="flex items-center justify-center w-9 h-9 text-[#82A33D] bg-[#82A33D]/10 rounded-md ring-1 ring-[#82A33D]/20 hover:bg-[#82A33D]/20 transition-colors"
            >

              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-emerald-50/20">

          <div className="px-6 py-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Left Column - Overview & Description */}
              <div className="space-y-6">
                {/* Item Overview */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#82A33D]/5 to-[#82A33D]/10 ring-1 ring-[#82A33D]/20">
                  <h3 className="flex items-center mb-4 text-lg font-semibold text-[#82A33D]">

                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Item Overview
                  </h3>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Item Name</label>
                      <p className="mt-1 font-semibold text-gray-900">{item.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Item ID</label>
                      <p className="mt-1 font-medium text-gray-900">{item.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Category</label>
                      <p className="mt-1 font-medium text-gray-900">{item.category}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Supplier</label>
                      <p className="mt-1 font-medium text-gray-900">{item.supplier}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Location</label>
                      <p className="mt-1 font-medium text-gray-900">{item.location || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Unit</label>
                      <p className="mt-1 font-medium text-gray-900">{item.unit}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="p-6 bg-white rounded-2xl ring-1 ring-gray-100">

                  <h3 className="flex items-center mb-3 text-lg font-semibold text-gray-900">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    Description
                  </h3>
                  <p className="leading-relaxed text-gray-600">{item.description || 'No description provided.'}</p>
                </div>
              </div>

              {/* Right Column - Stock & Quick Actions */}
              <div className="space-y-6">
                {/* Stock & Value */}
                <div className="p-6 bg-white rounded-2xl ring-1 ring-gray-100">

                  <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Stock & Pricing
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Current Stock</span>
                      <span className="font-semibold text-gray-900">{item.currentStock}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Reorder Level</span>
                      <span className="font-semibold text-gray-900">{item.reorderLevel}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Unit Price</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(item.unitPrice)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Total Value</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(totalValue)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Last Restocked</span>
                      <span className="font-medium text-gray-900">{item.lastRestocked}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="p-6 bg-white rounded-2xl ring-1 ring-gray-100">

                  <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Quick Actions
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex flex-col sm:flex-row sm:justify-center gap-3">
                      <button
                        onClick={handlePrintLabel}
                        className="flex-1 sm:flex-initial flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-700 transition-colors bg-white border border-[#82A33D]/20 rounded-xl hover:bg-[#82A33D]/5"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print Label
                      </button>
                      <button
                        onClick={handleAdjustStock}
                        className="flex-1 sm:flex-initial flex items-center justify-center px-4 py-3 text-sm font-medium text-white transition-colors bg-[#82A33D] rounded-xl hover:bg-[#82A33D]/90"
                      >

                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-1 16h12L17 4M10 8v8M14 8v8" />
                        </svg>
                        Adjust Stock
                      </button>
                    </div>

                    <button
                      onClick={onClose}
                      className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium transition-colors bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50"
                    >

                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Use createPortal to render modal directly in document.body
  return isOpen ? createPortal(modalContent, document.body) : null;
};

export default ItemDetailsModal;