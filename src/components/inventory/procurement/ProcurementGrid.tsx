import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ProcurementCard } from './ProcurementCard';
import { createPurchaseOrder, type PurchaseOrderItemRecord } from '../../../backend/purchaseOrders/purchaseOrdersService';

// Status Dropdown Component
const StatusDropdown: React.FC<{
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}> = ({ selectedStatus, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const statuses = ['All Status', 'Pending', 'Approved', 'Received', 'Cancelled'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleStatusSelect = (status: string) => {
    onStatusChange(status);
    setIsOpen(false);
  };

  return (
    <div className="relative z-[100000]" ref={dropdownRef}>
      <div className="relative group">
        <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-heritage-green/20 to-emerald-500/20 rounded-xl blur group-hover:opacity-100"></div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center justify-between w-48 px-6 py-3 text-sm font-medium transition-all duration-300 border shadow-lg cursor-pointer border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-heritage-green/50 focus:border-heritage-green/50 bg-white/80 backdrop-blur-sm hover:bg-white/90"
        >
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-heritage-green to-emerald-500"></div>
            <span className="text-gray-800">{selectedStatus}</span>
          </div>
          <svg
            className={`w-4 h-4 text-heritage-green transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[99999]">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusSelect(status)}
              className={`w-full flex items-center space-x-3 px-6 py-3 text-left text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-heritage-green/10 hover:to-emerald-500/10 ${
                selectedStatus === status
                  ? 'bg-gradient-to-r from-heritage-green/20 to-emerald-500/20 text-heritage-green border-l-4 border-heritage-green'
                  : 'text-gray-700 hover:text-heritage-green'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  selectedStatus === status
                    ? 'bg-gradient-to-r from-heritage-green to-emerald-500'
                    : 'bg-gray-300'
                }`}
              ></div>
              <span className="flex-1">{status}</span>
              {selectedStatus === status && (
                <svg className="w-4 h-4 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}

      {isOpen && <div className="fixed inset-0 z-[99998]" onClick={() => setIsOpen(false)}></div>}
    </div>
  );
};

type PurchaseOrderItem = PurchaseOrderItemRecord & {
  quantity: number | string;
  unitPrice: number | string;
};

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
  notes?: string;
  hasInvoice?: boolean;
}

interface ProcurementGridProps {
  orders: PurchaseOrder[];
  formatCurrency: (amount: number) => string;
  getStatusBadge: (status: string) => React.ReactNode;
  onViewDetails?: (order: PurchaseOrder) => void;
  onMarkReceived?: (order: PurchaseOrder) => void;
}

export const ProcurementGrid: React.FC<ProcurementGridProps> = ({
  orders,
  formatCurrency,
  getStatusBadge,
  onViewDetails,
  onMarkReceived,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const generateOrderNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const random = Math.floor(Math.random() * 900) + 100; // 100-999
    return `PO-${year}-${random}`;
  };

  const [poData, setPoData] = useState({
    supplier: '',
    orderNumber: generateOrderNumber(),
    orderDate: new Date().toISOString().split('T')[0],
    expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: '',
  });

  const [items, setItems] = useState<PurchaseOrderItem[]>([
    {
      name: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemsPerPage = 3;

  // Reset to page 1 when orders change (e.g., after filtering)
  useEffect(() => {
    setCurrentPage(1);
  }, [orders]);

  // Filter orders based on search term and selected status
  const filteredOrders = useMemo(() => {
    if (!orders || orders.length === 0) {
      return [];
    }

    const byFilter = orders.filter((order) => {
      const searchLower = (searchTerm || '').toLowerCase().trim();
      const matchesSearch =
        searchLower === '' ||
        (order.orderNumber && order.orderNumber.toLowerCase().includes(searchLower)) ||
        (order.supplier && order.supplier.toLowerCase().includes(searchLower)) ||
        (order.status && order.status.toLowerCase().includes(searchLower));

      const matchesStatus =
        !selectedStatus ||
        selectedStatus === 'All Status' ||
        order.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });

    const getPriority = (order: PurchaseOrder) => {
      if ((order as any).hasInvoice) return 0;
      const status = (order.status || '').toLowerCase();
      if (status === 'approved') return 1;
      if (status === 'pending') return 2;
      if (status === 'received') return 3;
      return 4;
    };

    return [...byFilter].sort((a, b) => getPriority(a) - getPriority(b));
  }, [orders, searchTerm, selectedStatus]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus]);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }

    return pages;
  };

  // Create PO modal helpers
  const handleOpenCreate = () => {
    setIsCreateOpen(true);
  };

  const resetCreateForm = useCallback(() => {
    setPoData({
      supplier: '',
      orderNumber: generateOrderNumber(),
      orderDate: new Date().toISOString().split('T')[0],
      expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: '',
    });
    setItems([
      {
        name: '',
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
    ]);
    setIsSubmitting(false);
  }, []);

  const handleCloseCreate = useCallback(() => {
    resetCreateForm();
    setIsCreateOpen(false);
  }, [resetCreateForm]);

  const handleCreateBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseCreate();
    }
  };

  const handleCreateInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // orderNumber is auto-generated and not user-editable
    if (name === 'orderNumber') return;
    setPoData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (
    index: number,
    field: keyof PurchaseOrderItem,
    value: string
  ) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const updated: any = { ...item };
        if (field === 'quantity' || field === 'unitPrice') {
          updated[field] = value === '' ? '' : Number(value) || 0;
        } else {
          updated[field] = value;
        }
        const qty = Number(updated.quantity || 0);
        const price = Number(updated.unitPrice || 0);
        updated.total = qty * price;
        return updated as PurchaseOrderItem;
      })
    );
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        name: '',
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  };

  const calculateTotal = () =>
    items.reduce((sum, item) => sum + (Number(item.total) || 0), 0);

  const isFormValid = () => {
    return (
      poData.supplier.trim().length > 0 &&
      items.some((it) => it.name && Number(it.unitPrice) > 0 && Number(it.quantity) > 0)
    );
  };

  const handleSubmitCreate = async () => {
    if (!isFormValid()) return;
    setIsSubmitting(true);
    const cleanItems: PurchaseOrderItemRecord[] = items
      .filter((it) => it.name && Number(it.unitPrice) > 0 && Number(it.quantity) > 0)
      .map((it) => ({
        name: it.name,
        quantity: Number(it.quantity) || 0,
        unitPrice: Number(it.unitPrice) || 0,
        total: Number(it.total) || (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0),
      }));

    const totalAmount = cleanItems.reduce((sum, it) => sum + (it.total || 0), 0);

    try {
      await createPurchaseOrder({
        orderNumber: poData.orderNumber || generateOrderNumber(),
        supplier: poData.supplier,
        items: cleanItems,
        totalAmount,
        orderDate: poData.orderDate,
        expectedDelivery: poData.expectedDelivery,
        notes: poData.notes,
      });
    } catch (err) {
      console.error('Failed to create purchase order', err);
    }
    handleCloseCreate();
  };

  return (
    <div className="overflow-hidden border shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60">
      {/* Header */}
      <div className="p-6 border-b border-gray-200/70 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left: title + stats */}
          <div>
            <h3 className="flex items-center gap-3 text-2xl font-black text-gray-900">
              <div className="p-2 bg-[#82A33D]/10 rounded-xl">
                <svg className="w-6 h-6 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              Purchase Orders
            </h3>
            <p className="flex items-center gap-2 mt-2 text-sm text-gray-600">
              <span className="inline-flex items-center px-2 py-1 bg-[#82A33D]/10 text-[#82A33D] rounded-lg text-xs font-semibold">
                {filteredOrders.length === 0
                  ? '0 results'
                  : `${startIndex + 1}-${Math.min(endIndex, filteredOrders.length)} of ${
                      filteredOrders.length
                    }`}
              </span>
              <span className="text-gray-400"> Paginated view</span>
              {searchTerm && (
                <span className="ml-2 text-heritage-green">Searching: "{searchTerm}"</span>
              )}
              {selectedStatus !== 'All Status' && (
                <span className="ml-2 text-blue-600">Status: {selectedStatus}</span>
              )}
            </p>
          </div>

          {/* Right: search, status filter, and New Order button */}
          <div className="flex flex-wrap items-center gap-3 justify-end">
            {/* Search */}
            <div className="relative group max-w-sm w-full md:w-80">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400 group-focus-within:text-[#82A33D] transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search orders, suppliers, or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium placeholder:text-gray-400 hover:border-gray-300"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center min-w-[190px]">
              <StatusDropdown selectedStatus={selectedStatus} onStatusChange={setSelectedStatus} />
            </div>

            {/* Primary Action */}
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-[#82A33D] transition-all bg-white border-2 border-[#82A33D]/20 rounded-xl hover:bg-[#82A33D] hover:text-white hover:border-[#82A33D] shadow-sm hover:shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>New Order</span>
            </button>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="mt-6">
          {filteredOrders.length === 0 ? (
            <div className="flex items-center justify-center min-h-[260px] mb-6 rounded-2xl border border-dashed border-gray-200 bg-gray-50/60">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 text-gray-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-2m3 2v-4m3 4v-6M4 6h16M6 6v12a2 2 0 002 2h8a2 2 0 002-2V6"
                    />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-800">No purchase orders match your filters</p>
                <p className="mt-1 text-xs text-gray-500">Try changing the status filter or clearing your search.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2 lg:grid-cols-3 min-h-[260px]">
              {currentOrders.map((order, index) => (
                <div
                  key={order.id}
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 100}ms forwards`,
                  }}
                >
                  <ProcurementCard
                    order={order}
                    formatCurrency={formatCurrency}
                    getStatusBadge={getStatusBadge}
                    onViewDetails={onViewDetails}
                    onMarkReceived={onMarkReceived}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inline styles for animation */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `,
          }}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center pt-6 space-x-2 border-t border-gray-100">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              } transition-colors`}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {getPageNumbers().map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-md transition-colors ${
                    currentPage === pageNum
                      ? 'bg-heritage-green text-white'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              } transition-colors`}
            >
              Next
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* New Purchase Order Modal */}
      {isCreateOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            onClick={handleCreateBackdropClick}
          >
            {/* Overlay */}
            <div className="fixed inset-0 transition-opacity duration-200 bg-black/45 backdrop-blur-lg" />

            {/* Modal Card */}
            <div
              className="relative z-10 w-full max-w-5xl max-h-[80vh] mx-6 my-6 overflow-hidden rounded-3xl bg-white/95 shadow-2xl ring-1 ring-black/5 pb-2 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative px-6 py-4 bg-white border-b border-gray-100 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 text-white rounded-full shadow-sm bg-[#82A33D]">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        <path d="M9 2h6l4 4v12a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2z" />
                        <path
                          d="M9 11h6M9 15h4"
                          stroke="rgba(255,255,255,0.9)"
                          strokeWidth="1"
                          fill="none"
                        />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <h2 className="text-lg font-semibold text-[#82A33D] md:text-2xl">
                        Create New Purchase Order
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Capture supplier details and line items for a new purchase order. This is a
                        draft-only form for now.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseCreate}
                    aria-label="Close"
                    className="absolute flex items-center justify-center rounded-md top-4 right-4 w-9 h-9 text-[#82A33D] bg-[#82A33D]/10 ring-1 ring-[#82A33D]/20"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 pb-10 overflow-y-auto overflow-x-hidden flex-1 min-h-0 space-y-6">
                {/* Summary banner */}
                <div className="p-4 rounded-xl bg-[#82A33D]/5 border border-[#82A33D]/20 ring-1 ring-black/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl text-[#82A33D]">📦</div>
                      <div>
                        <h3 className="text-base font-semibold text-[#82A33D]">Order Summary</h3>
                        <p className="text-sm text-[#527235]">
                          Review the current total before creating this purchase order.
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-gray-500">Current Total</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ₱{calculateTotal().toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Supplier + Dates */}
                <div className="grid grid-cols-1 gap-8 mb-4 md:grid-cols-2">
                  <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <h4 className="flex items-center mb-4 text-lg font-semibold ">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Supplier Information
                    </h4>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-600">
                          Supplier Name *
                        </label>
                        <input
                          type="text"
                          name="supplier"
                          value={poData.supplier}
                          onChange={handleCreateInputChange}
                          className="w-full px-4 py-3 transition-colors border rounded-lg border-gray-200 focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D]"
                          placeholder="Enter supplier name"
                          required
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-600">
                          PO Number
                        </label>
                        <input
                          type="text"
                          name="orderNumber"
                          value={poData.orderNumber}
                          readOnly
                          className="w-full px-4 py-3 transition-colors border rounded-lg border-gray-200 bg-gray-50 text-gray-700 cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-600">Notes</label>
                        <textarea
                          name="notes"
                          value={poData.notes}
                          onChange={handleCreateInputChange}
                          rows={3}
                          className="w-full px-4 py-3 transition-colors border rounded-lg resize-none border-gray-200 focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D]"
                          placeholder="Optional notes or special instructions"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <h4 className="flex items-center mb-4 text-lg font-semibold">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3a2 2 0 012-2h8a2 2 0 012 2v4h1a2 2 0 012 2v1l-1 5-2 5H3l-1-5-1-5v-1a2 2 0 012-2h1z"
                        />
                      </svg>
                      Order Dates
                    </h4>

                    <div className="grid grid-cols-1 gap-4 mt-1">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-600">
                          Order Date
                        </label>
                        <input
                          type="date"
                          name="orderDate"
                          value={poData.orderDate}
                          onChange={handleCreateInputChange}
                          className="w-full px-4 py-3 transition-colors border rounded-md border-gray-200 focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D]"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-600">
                          Expected Delivery
                        </label>
                        <input
                          type="date"
                          name="expectedDelivery"
                          value={poData.expectedDelivery}
                          onChange={handleCreateInputChange}
                          className="w-full px-4 py-3 transition-colors border rounded-md border-gray-200 focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="flex items-center text-lg font-semibold">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        />
                      </svg>
                      Order Items
                    </h4>
                    <button
                      onClick={addItem}
                      className="px-3 py-1 text-sm font-medium rounded-md bg-[#82A33D]/10 text-[#82A33D] border border-[#82A33D]/30 hover:bg-[#82A33D] hover:text-white shadow-sm transition-colors"
                    >
                      Add Item
                    </button>
                  </div>

                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-4 p-5 bg-white border rounded-lg border-gray-100 md:grid md:grid-cols-12 md:gap-6"
                      >
                        <div className="col-span-12 md:col-span-5">
                          <label className="block mb-1 text-xs font-medium text-gray-600">
                            Item description
                          </label>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 text-sm border rounded-md border-gray-200 focus:ring-1 focus:ring-[#82A33D]/20 focus:border-[#82A33D]"
                            placeholder="e.g., Cleaning supplies"
                          />
                        </div>
                        <div className="col-span-4 md:col-span-2">
                          <label className="block mb-1 text-xs font-medium text-gray-600">
                            Quantity
                          </label>
                          <input
                            type="number"
                            min="1"
                            step="1"
                            value={item.quantity as any}
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                            className="w-full px-3 py-2 text-sm border rounded-md border-gray-200 focus:ring-1 focus:ring-[#82A33D]/20 focus:border-[#82A33D]"
                          />
                        </div>
                        <div className="col-span-4 md:col-span-2">
                          <label className="block mb-1 text-xs font-medium text-gray-600">
                            Unit Price
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice as any}
                            onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                            className="w-full px-3 py-2 text-sm border rounded-md border-gray-200 focus:ring-1 focus:ring-[#82A33D]/20 focus:border-[#82A33D]"
                            placeholder="0.00"
                          />
                        </div>
                        <div className="flex items-end col-span-4 md:col-span-3">
                          <div className="w-full">
                            <label className="block mb-1 text-xs font-medium text-gray-600">
                              Line Total
                            </label>
                            <div className="px-3 py-2 text-sm font-medium border rounded-md bg-gray-50 border-gray-100 text-[#527235]">
                              ₱{(Number(item.total) || 0).toFixed(2)}
                            </div>
                          </div>
                          {items.length > 1 && (
                            <button
                              onClick={() => removeItem(index)}
                              className="p-2 ml-2 text-red-500 transition-colors rounded-md hover:bg-red-50"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <h4 className="flex items-center mb-3 text-lg font-semibold black">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 7h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Order Summary
                  </h4>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-lg font-semibold text-gray-700">Total Amount:</span>
                      <span className="text-xl font-bold text-[#527235]">
                        ₱{calculateTotal().toFixed(2)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {items.filter((item) => item.name && Number(item.unitPrice) > 0).length} item(s)
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/80">
                <button
                  type="button"
                  onClick={handleCloseCreate}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#82A33D]/20"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitCreate}
                  disabled={!isFormValid() || isSubmitting}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-lg shadow-md bg-gradient-to-r from-[#82A33D] to-[#6b8b30] border border-[#82A33D]/40 focus:outline-none focus:ring-2 focus:ring-[#82A33D]/25 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Creating Order...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Create Order</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

