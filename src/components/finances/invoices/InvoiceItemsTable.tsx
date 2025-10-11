import React from 'react';

interface InvoiceItem {
  id: string;
  description: string;
  category: 'room' | 'food' | 'services' | 'taxes';
  quantity: number;
  unitPrice: number;
  total: number;
}

interface InvoiceItemsTableProps {
  items: InvoiceItem[];
}

const InvoiceItemsTable: React.FC<InvoiceItemsTableProps> = ({ items }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'room':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          </svg>
        );
      case 'food':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
        );
      case 'services':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case 'taxes':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'room':
        return 'text-blue-700 bg-blue-50 border border-blue-200';
      case 'food':
        return 'text-orange-700 bg-orange-50 border border-orange-200';
      case 'services':
        return 'text-purple-700 bg-purple-50 border border-purple-200';
      case 'taxes':
        return 'text-heritage-neutral bg-heritage-light/50 border border-heritage-neutral/30';
      default:
        return 'text-heritage-neutral bg-heritage-light/50 border border-heritage-neutral/30';
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-heritage-green mb-4 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Invoice Items
      </h3>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-heritage-neutral/20 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="bg-heritage-green/10 border-b border-heritage-neutral/20">
          <div className="grid grid-cols-12 gap-4 p-4 text-sm font-bold text-heritage-green">
            <div className="col-span-1">Type</div>
            <div className="col-span-6">Description</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-1.5 text-right">Price</div>
            <div className="col-span-1.5 text-right">Total</div>
          </div>
        </div>
        
        {/* Table Body */}
        <div className="divide-y divide-heritage-neutral/10">
          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-heritage-green/5 transition-colors">
              <div className="col-span-1">
                <div className={`p-2 rounded-lg ${getCategoryColor(item.category)} flex items-center justify-center`}>
                  {getCategoryIcon(item.category)}
                </div>
              </div>
              <div className="col-span-6">
                <p className="font-semibold text-heritage-green">{item.description}</p>
                <p className="text-sm text-heritage-neutral/70 capitalize">{item.category}</p>
              </div>
              <div className="col-span-2 text-center">
                <span className="bg-heritage-light/50 px-3 py-1 rounded-full text-sm font-medium text-heritage-green">
                  {item.quantity}
                </span>
              </div>
              <div className="col-span-1.5 text-right">
                <span className="font-medium text-heritage-green">${item.unitPrice.toFixed(2)}</span>
              </div>
              <div className="col-span-1.5 text-right">
                <span className="font-bold text-heritage-green">${item.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvoiceItemsTable;