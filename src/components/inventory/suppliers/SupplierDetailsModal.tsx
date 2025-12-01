import React from "react";
import { createPortal } from "react-dom";

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  rating: number;
  totalOrders: number;
  totalValue: number;
  lastOrderDate: string;
  status: "active" | "inactive" | "suspended";
  paymentTerms: string;
  deliveryTime: string;
  notes?: string;
}

interface SupplierDetailsModalProps {
  supplier: Supplier;
  isOpen: boolean;
  onClose: () => void;
  formatCurrency: (amount: number) => string;
  getStatusBadge: (status: string) => React.ReactNode;
  getRatingStars: (rating: number) => React.ReactNode;
}

export const SupplierDetailsModal: React.FC<SupplierDetailsModalProps> = ({
  supplier,
  isOpen,
  onClose,
  formatCurrency,
  getStatusBadge,
  getRatingStars,
}) => {
  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/45 backdrop-blur-lg overflow-y-auto"
      onClick={(e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
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
                <h2 className="text-lg font-semibold text-[#82A33D] md:text-2xl">Supplier Details</h2>
                <p className="mt-1 text-sm text-gray-500">{supplier.name}</p>
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
            {/* Left Column - Overview & Contact */}
            <div className="space-y-6">
              {/* Supplier Overview */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#82A33D]/5 to-[#82A33D]/10 ring-1 ring-[#82A33D]/20">
                <h3 className="flex items-center mb-4 text-lg font-semibold text-[#82A33D]">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 10h16M4 14h10M4 18h6"
                    />
                  </svg>
                  Supplier Overview
                </h3>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <div className="mt-1">{getStatusBadge(supplier.status)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Category</label>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{supplier.category}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Contact Person</label>
                    <p className="mt-1 text-sm font-semibold text-gray-900">{supplier.contactPerson}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Rating</label>
                    <div className="mt-1">{getRatingStars(supplier.rating)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Total Orders</label>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{supplier.totalOrders}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Total Value</label>
                    <p className="mt-1 text-2xl font-black text-[#82A33D]">{formatCurrency(supplier.totalValue)}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-6 bg-white rounded-2xl ring-1 ring-gray-100">
                <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5h18M5 5v14a2 2 0 002 2h10a2 2 0 002-2V5"
                    />
                  </svg>
                  Contact Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                    <div className="flex items-center w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white text-gray-700">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      {supplier.email}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                    <div className="flex items-center w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white text-gray-700">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      {supplier.phone}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
                    <div className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white text-gray-700 leading-relaxed min-h-[60px]">
                      {supplier.address}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="p-6 bg-white rounded-2xl ring-1 ring-gray-100">
                <h3 className="flex items-center mb-3 text-lg font-semibold text-gray-900">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h8m-8 6h8"
                    />
                  </svg>
                  Notes
                </h3>
                <div className="space-y-3 text-sm leading-relaxed text-gray-600">
                  <p>
                    {supplier.notes || 'No additional notes provided for this supplier.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Terms & Activity */}
            <div className="space-y-6">
              {/* Business Terms */}
              <div className="p-6 bg-white rounded-2xl ring-1 ring-gray-100">
                <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 10h10M4 14h8M4 18h6"
                    />
                  </svg>
                  Business Terms
                </h3>

                <div className="space-y-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">Payment Terms</p>
                    <p className="text-xs text-gray-500 mt-0.5">How and when this supplier is paid.</p>
                    <p className="mt-1 text-sm text-gray-800">{supplier.paymentTerms}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Delivery Time</p>
                    <p className="text-xs text-gray-500 mt-0.5">Typical lead time for fulfilling orders.</p>
                    <p className="mt-1 text-sm text-gray-800">{supplier.deliveryTime}</p>
                  </div>
                </div>
              </div>

              {/* Activity / Dates */}
              <div className="p-6 bg-white rounded-2xl ring-1 ring-gray-100">
                <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Activity
                </h3>

                <div className="space-y-4 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Last Order Date</p>
                      <p className="text-xs text-gray-500">
                        {new Date(supplier.lastOrderDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-6 bg-white rounded-2xl ring-1 ring-gray-100">
                <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Quick Actions
                </h3>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <button className="flex items-center justify-center px-4 py-3 text-sm font-medium transition-colors bg-white border border-[#82A33D]/20 text-gray-700 rounded-xl hover:bg-[#82A33D]/5">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                      />
                    </svg>
                    Print
                  </button>
                  <button className="flex items-center justify-center px-4 py-3 text-sm font-medium transition-colors bg-white border border-[#82A33D]/20 text-gray-700 rounded-xl hover:bg-[#82A33D]/5">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
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
