import React from 'react';

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
  status: 'active' | 'inactive' | 'suspended';
  paymentTerms: string;
  deliveryTime: string;
  notes?: string;
}

interface SupplierCardProps {
  supplier: Supplier;
  formatCurrency: (amount: number) => string;
  getStatusBadge: (status: string) => React.ReactNode;
  getRatingStars: (rating: number) => React.ReactNode;
}

export const SupplierCard: React.FC<SupplierCardProps> = ({
  supplier,
  formatCurrency,
  getStatusBadge,
  getRatingStars,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{supplier.name}</h3>
          <p className="text-sm text-gray-600">{supplier.contactPerson}</p>
        </div>
        {getStatusBadge(supplier.status)}
      </div>
      
      {/* Contact Information */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Contact Information</p>
        <div className="space-y-1">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {supplier.email}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {supplier.phone}
          </div>
        </div>
      </div>
      
      {/* Category */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-1">Category</p>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {supplier.category}
        </span>
      </div>
      
      {/* Rating */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-1">Rating</p>
        {getRatingStars(supplier.rating)}
      </div>
      
      {/* Order Statistics */}
      <div className="flex justify-between items-center py-3 border-t border-gray-200 mb-4">
        <div>
          <p className="text-sm text-gray-600">Total Orders: {supplier.totalOrders}</p>
          <p className="text-sm font-medium text-heritage-green">{formatCurrency(supplier.totalValue)}</p>
        </div>
      </div>
      
      {/* Payment & Delivery Terms */}
      <div className="flex justify-between text-sm text-gray-600 mb-4">
        <span>Payment: {supplier.paymentTerms}</span>
        <span>Delivery: {supplier.deliveryTime}</span>
      </div>
      
      {/* Last Order Date */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Last Order: {new Date(supplier.lastOrderDate).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </p>
      </div>
      
      {/* Notes Section */}
      {supplier.notes ? (
        <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400 min-h-[60px] flex flex-col justify-center mb-4">
          <p className="text-xs text-blue-600 font-medium mb-1">Notes:</p>
          <p className="text-sm text-blue-700 italic">"{supplier.notes}"</p>
        </div>
      ) : (
        <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-gray-300 min-h-[60px] flex items-center mb-4">
          <p className="text-sm text-gray-400 italic">No additional notes provided</p>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="mt-auto pt-4 flex gap-2">
        <button className="flex-1 px-4 py-2 bg-heritage-green text-white rounded-lg hover:bg-heritage-green/90 transition-colors text-sm font-medium">
          View Details
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
          New Order
        </button>
        <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium">
          Edit
        </button>
      </div>
    </div>
  );
};
