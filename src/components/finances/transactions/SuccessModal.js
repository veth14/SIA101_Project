import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { createPortal } from 'react-dom';
const SuccessModal = ({ isOpen, onClose, title, message, invoiceNumber, onViewInvoice }) => {
    if (!isOpen)
        return null;
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    return createPortal(_jsxs(_Fragment, { children: [_jsx("style", { children: `
        @keyframes successPulse {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes slideInDown {
          0% {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-successPulse {
          animation: successPulse 0.6s ease-out;
        }
        
        .animate-slideInDown {
          animation: slideInDown 0.4s ease-out;
        }
      ` }), _jsx("div", { className: "fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm", onClick: handleBackdropClick, children: _jsxs("div", { className: "bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 animate-slideInDown border border-heritage-neutral/10", children: [_jsxs("div", { className: "text-center p-8", children: [_jsx("div", { className: "mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center animate-successPulse shadow-lg", children: _jsx("svg", { className: "w-10 h-10 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 3, d: "M5 13l4 4L19 7" }) }) }), _jsx("h2", { className: "text-2xl font-bold text-heritage-green mb-2", children: title }), _jsx("p", { className: "text-heritage-neutral mb-6", children: message }), invoiceNumber && (_jsxs("div", { className: "p-4 bg-gradient-to-r from-heritage-green/10 to-heritage-light/20 rounded-xl border border-heritage-green/20 mb-6", children: [_jsxs("div", { className: "flex items-center justify-center space-x-2", children: [_jsx("svg", { className: "w-5 h-5 text-heritage-green", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }), _jsx("span", { className: "text-sm font-medium text-heritage-neutral", children: "Invoice Number:" })] }), _jsx("p", { className: "text-xl font-bold text-heritage-green mt-1", children: invoiceNumber })] })), _jsxs("div", { className: "space-y-3 mb-6", children: [_jsxs("div", { className: "flex items-center justify-center space-x-2 text-green-600", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }), _jsx("span", { className: "text-sm font-medium", children: "Invoice Created Successfully" })] }), _jsxs("div", { className: "flex items-center justify-center space-x-2 text-green-600", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }) }), _jsx("span", { className: "text-sm font-medium", children: "Ready for Processing" })] }), _jsxs("div", { className: "flex items-center justify-center space-x-2 text-green-600", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 8l7.89 7.89a2 2 0 002.82 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }) }), _jsx("span", { className: "text-sm font-medium", children: "Email Notification Sent" })] })] })] }), _jsx("div", { className: "p-6 border-t border-heritage-neutral/10 bg-gradient-to-r from-heritage-green/5 to-heritage-light/10", children: _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx("button", { onClick: onClose, className: "px-4 py-3 border-2 border-heritage-neutral/30 text-heritage-neutral rounded-xl hover:bg-heritage-neutral/5 transition-all duration-300 font-medium", children: "Close" }), _jsx("button", { onClick: () => {
                                            if (onViewInvoice) {
                                                onViewInvoice();
                                            }
                                            else {
                                                onClose();
                                            }
                                        }, className: "px-4 py-3 bg-gradient-to-r from-heritage-green to-heritage-neutral text-white rounded-xl hover:from-heritage-green/90 hover:to-heritage-neutral/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] font-medium", children: "View Invoice" })] }) })] }) })] }), document.body);
};
export default SuccessModal;
