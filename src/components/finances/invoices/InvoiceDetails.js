import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { printInvoiceDocument, downloadInvoicePdf } from './printing/invoicePrinting';
const InvoiceDetails = ({ invoice, onClose, onPrint }) => {
    if (!invoice) {
        return (_jsxs(_Fragment, { children: [_jsx("style", { children: `
          @keyframes slide-in-right {
            0% {
              opacity: 0;
              transform: translateX(30px) scale(0.98);
            }
            100% {
              opacity: 1;
              transform: translateX(0) scale(1);
            }
          }
          
          .animate-slide-in-right {
            animation: slide-in-right 0.7s ease-out;
          }
        ` }), _jsx("div", { className: "h-full min-h-0 p-6 border shadow-2xl bg-white/70 backdrop-blur-2xl rounded-3xl border-heritage-neutral/20 animate-slide-in-right", children: _jsxs("div", { className: "relative flex flex-col items-center justify-center h-full overflow-hidden text-center", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-heritage-green/3 via-heritage-light/10 to-heritage-neutral/5 rounded-3xl" }), _jsx("div", { className: "absolute top-0 right-0 w-32 h-32 rounded-full translate-x-1/3 -translate-y-1/3 bg-gradient-to-bl from-heritage-green/8 to-transparent" }), _jsx("div", { className: "absolute w-24 h-24 rounded-full -bottom-8 -left-8 bg-gradient-to-tr from-heritage-light/20 to-transparent" }), _jsxs("div", { className: "relative z-10 max-w-md mx-auto space-y-6", children: [_jsxs("div", { className: "relative mb-8", children: [_jsx("div", { className: "flex items-center justify-center w-24 h-24 mx-auto border shadow-2xl bg-gradient-to-br from-heritage-green/10 to-heritage-neutral/10 rounded-3xl border-heritage-green/20", children: _jsx("svg", { className: "w-12 h-12 text-heritage-green", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }) }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-heritage-green/20 to-heritage-neutral/20 rounded-3xl blur-xl opacity-60" })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-2xl font-bold text-heritage-green", children: "No Invoice Selected" }), _jsx("p", { className: "max-w-sm mx-auto text-base leading-relaxed text-heritage-neutral/70", children: "Click on any invoice to view details" }), _jsx("div", { className: "p-4 mt-8 border bg-heritage-light/20 rounded-2xl border-heritage-green/20 backdrop-blur-sm", children: _jsxs("div", { className: "flex items-center justify-center space-x-3 text-heritage-green/80", children: [_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" }) }), _jsx("span", { className: "text-sm font-medium", children: "Select to get started" })] }) })] })] })] }) })] }));
    }
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
        }).format(amount);
    };
    const handlePrint = () => {
        if (onPrint) {
            onPrint(invoice);
        }
        else {
            printInvoiceDocument(invoice);
        }
    };
    const handleDownload = () => {
        downloadInvoicePdf(invoice);
    };
    return (_jsxs(_Fragment, { children: [_jsx("style", { children: `
        @keyframes slide-in-right {
          0% {
            opacity: 0;
            transform: translateX(30px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.7s ease-out;
        }
        
        .invoice-items-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .invoice-items-scroll::-webkit-scrollbar-track {
          background: rgba(130, 163, 61, 0.05);
          border-radius: 10px;
        }
        .invoice-items-scroll::-webkit-scrollbar-thumb {
          background: rgba(130, 163, 61, 0.3);
          border-radius: 10px;
        }
        .invoice-items-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(130, 163, 61, 0.5);
        }
      ` }), _jsx("div", { className: "h-full min-h-0 p-5 border shadow-2xl bg-white/70 backdrop-blur-2xl rounded-3xl border-heritage-neutral/20 animate-slide-in-right", children: _jsxs("div", { className: "flex flex-col h-full", children: [_jsx("div", { className: "p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-gray-50", children: _jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-[#82A33D]/10 rounded-xl", children: _jsx("svg", { className: "w-6 h-6 text-[#82A33D]", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-black text-gray-900", children: "Invoice Details" }), _jsxs("p", { className: "flex items-center gap-2 mt-1 text-sm text-gray-600", children: [_jsxs("span", { className: "inline-flex items-center px-2 py-1 bg-[#82A33D]/10 text-[#82A33D] rounded-lg text-xs font-semibold", children: ["#", invoice.id] }), _jsx("span", { className: "text-gray-400", children: "\u2022" }), _jsx("span", { className: "truncate max-w-[320px]", children: invoice.guestName })] })] })] }), _jsx("button", { onClick: onClose, className: "p-2 transition-colors rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100", children: _jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }) }), _jsxs("div", { className: "flex-1 flex flex-col min-h-0", children: [_jsxs("div", { className: "flex-1 p-6 space-y-8 overflow-y-auto min-h-0", children: [_jsxs("div", { className: "p-4 rounded-lg bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border border-blue-100/50 flex items-center justify-between", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("p", { className: "text-xs font-semibold tracking-wide uppercase text-gray-600", children: "Guest & Stay" }), _jsx("p", { className: "text-base font-bold text-gray-900", children: invoice.guestName }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Room ", invoice.roomNumber, " \u2022 ", invoice.checkIn, " - ", invoice.checkOut] })] }), _jsxs("div", { className: "text-right space-y-2", children: [_jsx("p", { className: "text-xs font-semibold tracking-wide uppercase text-gray-600", children: "Total Amount" }), _jsx("p", { className: "text-2xl font-black text-gray-900", children: formatCurrency(invoice.totalAmount) }), _jsxs("span", { className: `inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${invoice.status === 'paid'
                                                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                                                : invoice.status === 'pending'
                                                                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                                                    : 'bg-red-100 text-red-800 border border-red-200'}`, children: [_jsx("span", { className: `w-2 h-2 rounded-full mr-2 ${invoice.status === 'paid'
                                                                        ? 'bg-emerald-500'
                                                                        : invoice.status === 'pending'
                                                                            ? 'bg-amber-500'
                                                                            : 'bg-red-500'}` }), invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)] })] })] }), _jsxs("div", { className: "flex-1 space-y-4 overflow-y-auto invoice-items-scroll min-h-0", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "p-4 space-y-2 bg-white border border-gray-200/60 rounded-lg", children: [_jsx("label", { className: "text-xs font-semibold tracking-wide uppercase text-gray-500", children: "Invoice ID" }), _jsx("p", { className: "text-base font-semibold text-gray-900", children: invoice.id })] }), _jsxs("div", { className: "p-4 space-y-2 bg-white border border-gray-200/60 rounded-lg", children: [_jsx("label", { className: "text-xs font-semibold tracking-wide uppercase text-gray-500", children: "Items" }), _jsxs("p", { className: "text-base font-semibold text-gray-900", children: [invoice.items.length, " total items"] })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "p-4 space-y-2 bg-white border border-gray-200/60 rounded-lg", children: [_jsx("label", { className: "text-xs font-semibold tracking-wide uppercase text-gray-500", children: "Guest Name" }), _jsx("p", { className: "text-base font-semibold text-gray-900", children: invoice.guestName })] }), _jsxs("div", { className: "p-4 space-y-2 bg-white border border-gray-200/60 rounded-lg", children: [_jsx("label", { className: "text-xs font-semibold tracking-wide uppercase text-gray-500", children: "Room" }), _jsxs("p", { className: "text-base font-semibold text-gray-900", children: ["Room ", invoice.roomNumber] })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "p-4 space-y-2 bg-white border border-gray-200/60 rounded-lg", children: [_jsx("label", { className: "text-xs font-semibold tracking-wide uppercase text-gray-500", children: "Check-in" }), _jsx("p", { className: "text-base font-semibold text-gray-900", children: invoice.checkIn })] }), _jsxs("div", { className: "p-4 space-y-2 bg-white border border-gray-200/60 rounded-lg", children: [_jsx("label", { className: "text-xs font-semibold tracking-wide uppercase text-gray-500", children: "Check-out" }), _jsx("p", { className: "text-base font-semibold text-gray-900", children: invoice.checkOut })] })] }), _jsxs("div", { className: "p-4 bg-white border border-gray-200/60 rounded-lg", children: [_jsx("label", { className: "block mb-2 text-xs font-semibold tracking-wide uppercase text-gray-500", children: "Invoice Items" }), _jsxs("div", { className: "space-y-1.5 max-h-56 overflow-y-auto", children: [invoice.items.slice(0, 4).map((item, index) => (_jsxs("div", { className: "flex items-center justify-between p-2 rounded-lg bg-[#82A33D]/5", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "flex items-center justify-center w-5 h-5 text-xs font-bold text-white rounded-full bg-[#82A33D]", children: index + 1 }), _jsx("span", { className: "text-xs font-medium text-gray-900 line-clamp-1", children: item.description })] }), _jsx("span", { className: "text-xs font-bold text-[#82A33D]", children: formatCurrency(item.total) })] }, item.id))), invoice.items.length > 4 && (_jsxs("p", { className: "pt-1 text-xs text-center text-gray-500", children: ["+", invoice.items.length - 4, " more items"] }))] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "p-4 bg-white border border-gray-200/60 rounded-lg", children: [_jsx("label", { className: "block mb-0.5 text-xs font-semibold tracking-wide uppercase text-gray-500", children: "Subtotal" }), _jsx("p", { className: "text-sm font-bold text-gray-900", children: formatCurrency(invoice.totalAmount * 0.893) })] }), _jsxs("div", { className: "p-4 bg-white border border-gray-200/60 rounded-lg", children: [_jsx("label", { className: "block mb-0.5 text-xs font-semibold tracking-wide uppercase text-gray-500", children: "Tax (12%)" }), _jsx("p", { className: "text-sm font-bold text-gray-900", children: formatCurrency(invoice.totalAmount * 0.107) })] })] }), _jsx("div", { className: "p-4 space-y-3 bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200/50 rounded-lg", children: _jsxs("div", { className: "grid grid-cols-2 gap-3 text-xs", children: [_jsxs("div", { children: [_jsx("span", { className: "text-gray-600", children: "Payment Method" }), _jsx("p", { className: "font-semibold text-gray-900", children: "Card Payment" })] }), _jsxs("div", { children: [_jsx("span", { className: "text-gray-600", children: "Invoice Date" }), _jsx("p", { className: "font-semibold text-gray-900", children: invoice.checkOut })] })] }) })] })] }), _jsx("div", { className: "p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50", children: _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("button", { onClick: handlePrint, className: "flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-heritage-green to-heritage-neutral text-white rounded-xl hover:from-heritage-green hover:to-heritage-neutral transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02] group text-sm font-semibold", children: [_jsx("svg", { className: "w-4 h-4 transition-transform group-hover:scale-110", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" }) }), _jsx("span", { children: "Print Invoice" })] }), _jsxs("button", { onClick: handleDownload, className: "flex items-center justify-center space-x-2 px-4 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow-md transform hover:scale-[1.02] group text-sm font-semibold", children: [_jsx("svg", { className: "w-4 h-4 transition-transform group-hover:scale-110", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }), _jsx("span", { children: "Download PDF" })] })] }) })] })] }) })] }));
};
export default InvoiceDetails;
