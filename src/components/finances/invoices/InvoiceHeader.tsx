import React from 'react';

interface InvoiceHeaderProps {
  invoiceId: string;
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ invoiceId }) => {
  return (
    <div className="flex justify-between items-start mb-8 pb-6 border-b border-heritage-neutral/20">
      {/* Company Logo and Info */}
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gradient-to-br from-heritage-green to-heritage-neutral rounded-2xl flex items-center justify-center shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          </svg>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-heritage-green">BALAY GINHAWA</h1>
          <p className="text-sm text-heritage-neutral/70 mt-1">Heritage Hotel & Suites</p>
          <p className="text-xs text-heritage-neutral/60">Est. 2020</p>
        </div>
      </div>
      
      {/* Invoice Number */}
      <div className="text-right">
        <h2 className="text-lg font-bold text-heritage-neutral mb-2">INVOICE</h2>
        <div className="bg-heritage-green/10 border border-heritage-green/30 px-4 py-2 rounded-lg">
          <span className="text-heritage-green font-mono font-bold">{invoiceId}</span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceHeader;