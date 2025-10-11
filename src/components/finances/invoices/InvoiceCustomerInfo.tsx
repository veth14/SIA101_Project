import React from 'react';
import type { Invoice } from './InvoiceList';

interface InvoiceCustomerInfoProps {
  invoice: Invoice;
}

const InvoiceCustomerInfo: React.FC<InvoiceCustomerInfoProps> = ({ invoice }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      {/* Customer Details */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-heritage-neutral/20 shadow-sm">
        <h3 className="text-lg font-bold text-heritage-green mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Guest Information
        </h3>
        <div className="space-y-3">
          <div>
            <span className="text-sm font-medium text-heritage-neutral/70">Full Name</span>
            <p className="text-base font-semibold text-heritage-green">{invoice.guestName}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-heritage-neutral/70">Room Number</span>
            <p className="text-base font-semibold text-heritage-green">Room {invoice.roomNumber}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-heritage-neutral/70">Guest Type</span>
            <p className="text-base font-semibold text-heritage-green">Premium Guest</p>
          </div>
        </div>
      </div>

      {/* Stay Details */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-heritage-neutral/20 shadow-sm">
        <h3 className="text-lg font-bold text-heritage-green mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Stay Information
        </h3>
        <div className="space-y-3">
          <div>
            <span className="text-sm font-medium text-heritage-neutral/70">Check-in Date</span>
            <p className="text-base font-semibold text-heritage-green">{invoice.checkIn}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-heritage-neutral/70">Check-out Date</span>
            <p className="text-base font-semibold text-heritage-green">{invoice.checkOut}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-heritage-neutral/70">Payment Status</span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
              invoice.status === 'paid' 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                : invoice.status === 'pending'
                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                invoice.status === 'paid' ? 'bg-emerald-500' :
                invoice.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
              }`}></div>
              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCustomerInfo;