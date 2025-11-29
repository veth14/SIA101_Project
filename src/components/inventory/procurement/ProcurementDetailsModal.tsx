import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import usePatchInvProcurement from '../../../api/patchInvProcurement';

interface PurchaseOrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplier: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  status: 'pending' | 'approved' | 'received' | 'cancelled';
  orderDate: string;
  expectedDelivery: string;
  approvedBy?: string;
  approvedDate?: string;
  notes?: string;
}

interface ProcurementDetailsModalProps {
  order: PurchaseOrder;
  isOpen: boolean;
  onClose: () => void;
  formatCurrency: (amount: number) => string;
  getStatusBadge: (status: string) => React.ReactNode;
  onSuccess?: () => void;
}

export const ProcurementDetailsModal: React.FC<ProcurementDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
  formatCurrency,
  getStatusBadge,
  onSuccess,
}) => {
  const { patchInvProcurement, loadingForPatchInvProcurement } = usePatchInvProcurement();
  const [isApproving, setIsApproving] = useState(false);

  const handleApproveOrder = async () => {
    if (!confirm('Are you sure you want to approve this purchase order?')) {
      return;
    }

    setIsApproving(true);
    try {
      const response = await patchInvProcurement(order.orderNumber, {
        status: 'approved',
        approvedBy: 'Manager Name', // TODO: Replace with actual logged-in user
        approvedDate: new Date().toISOString(),
      });

      if (response.success) {
        alert('Purchase order approved successfully!');
        onClose();
        if (onSuccess) onSuccess();
      } else {
        alert(response.message || 'Failed to approve purchase order');
      }
    } catch (error) {
      console.error('Error approving order:', error);
      alert('An error occurred while approving the purchase order');
    } finally {
      setIsApproving(false);
    }
  };

  const handleMarkReceived = async () => {
    if (!confirm('Are you sure you want to mark this order as received?')) {
      return;
    }

    try {
      const response = await patchInvProcurement(order.orderNumber, {
        status: 'received',
      });

      if (response.success) {
        alert('Purchase order marked as received!');
        onClose();
        if (onSuccess) onSuccess();
      } else {
        alert(response.message || 'Failed to update purchase order');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('An error occurred while updating the purchase order');
    }
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{order.orderNumber}</h2>
                <p className="text-sm text-gray-600">{order.supplier}</p>
              </div>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                    <div className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white">
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Order Date</label>
                    <input
                      type="text"
                      value={new Date(order.orderDate).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                      disabled
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Expected Delivery</label>
                    <input
                      type="text"
                      value={new Date(order.expectedDelivery).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                      disabled
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Supplier</label>
                    <input
                      type="text"
                      value={order.supplier}
                      disabled
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Approval Information */}
                {(order.status === 'approved' || order.status === 'received') && order.approvedBy && (
                  <div className="mt-4 bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm font-medium text-green-700">Approved by: {order.approvedBy}</p>
                    {order.approvedDate && (
                      <p className="text-sm text-green-600 mt-1">
                        on {new Date(order.approvedDate).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Items Section */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Order Items</h3>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="mb-2">
                        <h4 className="font-semibold text-gray-700 text-xs">Item #{index + 1}</h4>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Item Name</label>
                          <input
                            type="text"
                            value={item.name}
                            disabled
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 cursor-not-allowed"
                          />
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                            <input
                              type="text"
                              value={item.quantity}
                              disabled
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 cursor-not-allowed"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Unit Price (₱)</label>
                            <input
                              type="text"
                              value={item.unitPrice.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                              disabled
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 cursor-not-allowed"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Total (₱)</label>
                            <input
                              type="text"
                              value={item.total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                              disabled
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 font-semibold cursor-not-allowed"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes Section */}
              {order.notes && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Notes</h3>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700">{order.notes}</p>
                  </div>
                </div>
              )}

              {/* Total Amount */}
              <div className="bg-gradient-to-r from-heritage-green/10 to-emerald-50 rounded-lg p-4 border border-heritage-green/20">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-gray-800">Total Order Amount:</span>
                  <span className="text-2xl font-black text-heritage-green">
                    ₱{order.totalAmount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              disabled={loadingForPatchInvProcurement || isApproving}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              CLOSE
            </button>
            {order.status === 'pending' && (
              <button 
                onClick={handleApproveOrder}
                disabled={loadingForPatchInvProcurement || isApproving}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isApproving ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Approving...
                  </>
                ) : (
                  'APPROVE ORDER'
                )}
              </button>
            )}
            {order.status === 'approved' && (
              <button 
                onClick={handleMarkReceived}
                disabled={loadingForPatchInvProcurement}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loadingForPatchInvProcurement ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  'MARK AS RECEIVED'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
