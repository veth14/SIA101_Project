import React from 'react';
import { createPortal } from 'react-dom';

interface RequisitionItem {
  name: string;
  quantity: number;
  unit: string;
  estimatedCost: number;
  reason: string;
}

interface Requisition {
  id: string;
  requestNumber: string;
  department: string;
  requestedBy: string;
  items: RequisitionItem[];
  totalEstimatedCost: number;
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requestDate: string;
  requiredDate: string;
  justification: string;
  approvedBy?: string;
  approvedDate?: string;
  notes?: string;
}

interface RequisitionDetailsModalProps {
  requisition: Requisition | null;
  isOpen: boolean;
  onClose: () => void;
}

const RequisitionDetailsModal: React.FC<RequisitionDetailsModalProps> = ({ requisition, isOpen, onClose }) => {
  if (!requisition || !isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatDate = (value: string) => {
    if (!value) return 'N/A';
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString();
  };

  const formatStatusLabel = (status: Requisition['status']) => {
    if (!status) return 'Pending';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/45 backdrop-blur-lg overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="relative z-10 w-full max-w-4xl rounded-3xl bg-white/95 shadow-2xl border border-white/60">
        {/* Modal Header */}
        <div className="relative px-6 pt-6 pb-5 bg-white border-b border-gray-100 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 text-white rounded-2xl shadow-sm bg-[#82A33D]">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M4 4h10l4 4v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" />
                  <path d="M8 11h8M8 15h5" stroke="rgba(255,255,255,0.9)" strokeWidth="1" fill="none" />
                </svg>
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-[#82A33D] md:text-2xl">Requisition Details</h2>
                <p className="mt-1 text-sm text-gray-500">{requisition.requestNumber}</p>
              </div>
            </div>
            <div aria-hidden />
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

        {/* Modal Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left Column - Overview & Items */}
            <div className="space-y-6">
              {/* Requisition Overview */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#82A33D]/5 to-[#82A33D]/10 ring-1 ring-[#82A33D]/20">
                <h3 className="flex items-center mb-4 text-lg font-semibold text-[#82A33D]">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 4h5m-9 7h14a2 2 0 002-2V7.414a2 2 0 00-.586-1.414l-2.414-2.414A2 2 0 0015.586 3H5a2 2 0 00-2 2v11a2 2 0 002 2z" />
                  </svg>
                  Requisition Overview
                </h3>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Department</label>
                    <p className="text-lg font-semibold text-gray-900">{requisition.department}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Requested By</label>
                    <p className="text-lg font-semibold text-gray-900">{requisition.requestedBy}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-600">Status</label>
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          requisition.status === 'approved'
                            ? 'bg-blue-50 text-blue-700'
                            : requisition.status === 'fulfilled'
                            ? 'bg-[#82A33D]/10 text-[#82A33D]'
                            : requisition.status === 'rejected'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-yellow-50 text-yellow-700'
                        }`}
                      >
                        {formatStatusLabel(requisition.status)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Priority</label>
                    <p className="text-sm font-semibold text-gray-900 capitalize">{requisition.priority}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Total Estimated Cost</label>
                    <p className="text-2xl font-black text-[#82A33D]">
                      ₱{requisition.totalEstimatedCost.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Items</label>
                    <p className="text-lg font-semibold text-gray-900">{requisition.items.length} line items</p>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="p-6 bg-white rounded-2xl ring-1 ring-gray-100">
                <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Line Items
                </h3>
                <div className="space-y-3 text-sm">
                  {requisition.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          Qty {item.quantity} {item.unit} · ₱{item.estimatedCost.toLocaleString()}
                        </p>
                        {item.reason && (
                          <p className="text-xs text-gray-400 mt-0.5">Reason: {item.reason}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {requisition.items.length === 0 && (
                    <p className="text-sm text-gray-500">No items recorded for this requisition.</p>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="p-6 bg-white rounded-2xl ring-1 ring-gray-100">
                <h3 className="flex items-center mb-3 text-lg font-semibold text-gray-900">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h8" />
                  </svg>
                  Notes & Justification
                </h3>
                <div className="space-y-3 text-sm leading-relaxed text-gray-600">
                  <div>
                    <p className="font-medium text-gray-700 mb-1">Notes</p>
                    <p>
                      {requisition.notes || 'No additional notes provided for this requisition.'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 mb-1">Justification</p>
                    <p>{requisition.justification || 'No justification provided.'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Dates & Approval */}
            <div className="space-y-6">
              {/* Dates & Timeline */}
              <div className="p-6 bg-white rounded-2xl ring-1 ring-gray-100">
                <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Timeline
                </h3>

                <div className="space-y-4 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Requested Date</p>
                      <p className="text-xs text-gray-500">{formatDate(requisition.requestDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Required Date</p>
                      <p className="text-xs text-gray-500">{formatDate(requisition.requiredDate)}</p>
                    </div>
                  </div>
                  {requisition.status === 'fulfilled' && requisition.approvedDate && (
                    <div className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Fulfilled / Approved Date</p>
                        <p className="text-xs text-gray-500">{formatDate(requisition.approvedDate)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Approval Information */}
              <div className="p-6 bg-white rounded-2xl ring-1 ring-gray-100">
                <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Approval Details
                </h3>
                {requisition.approvedBy ? (
                  <div className="space-y-2 text-sm">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Approved By</label>
                      <p className="font-medium text-gray-900">{requisition.approvedBy}</p>
                    </div>
                    {requisition.approvedDate && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Approved Date</label>
                        <p className="font-medium text-gray-900">{formatDate(requisition.approvedDate)}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No approval information recorded for this requisition.</p>
                )}
              </div>

              {/* Quick Actions */}
              <div className="p-6 bg-white rounded-2xl ring-1 ring-gray-100">
                <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Quick Actions
                </h3>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <button className="flex items-center justify-center px-4 py-3 text-sm font-medium transition-colors bg-white border border-[#82A33D]/20 text-gray-700 rounded-xl hover:bg-[#82A33D]/5">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print
                  </button>
                  <button className="flex items-center justify-center px-4 py-3 text-sm font-medium transition-colors bg-white border border-[#82A33D]/20 text-gray-700 rounded-xl hover:bg-[#82A33D]/5">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default RequisitionDetailsModal;
