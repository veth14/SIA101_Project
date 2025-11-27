import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { createPortal } from 'react-dom';
const SimpleModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen)
        return null;
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    return createPortal(_jsxs(_Fragment, { children: [_jsx("style", { children: `
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      ` }), _jsx("div", { className: "fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/45 backdrop-blur-lg overflow-y-auto", onClick: handleBackdropClick, children: _jsxs("div", { className: "relative bg-white/95 rounded-3xl shadow-2xl max-w-4xl w-full transform transition-all duration-300 scale-100 animate-fadeIn ring-1 ring-black/5", children: [_jsxs("div", { className: "relative px-6 pt-6 pb-5 bg-white border-b border-gray-100 rounded-t-3xl", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "flex items-center justify-center w-12 h-12 text-white rounded-full shadow-sm bg-emerald-600", children: _jsxs("svg", { className: "w-5 h-5", viewBox: "0 0 24 24", fill: "currentColor", stroke: "none", children: [_jsx("path", { d: "M9 2h6l4 4v12a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2z" }), _jsx("path", { d: "M9 11h6M9 15h4", stroke: "rgba(255,255,255,0.9)", strokeWidth: "1", fill: "none" })] }) }), _jsx("div", { className: "flex flex-col", children: _jsx("h2", { className: "text-lg font-semibold text-emerald-700 md:text-2xl", children: title }) })] }), _jsx("div", { "aria-hidden": true })] }), _jsx("button", { onClick: onClose, "aria-label": "Close", className: "absolute flex items-center justify-center rounded-md top-4 right-4 w-9 h-9 text-emerald-700 bg-emerald-50 ring-1 ring-emerald-100", children: _jsx("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), _jsx("div", { className: "p-6 space-y-6", children: children })] }) })] }), document.body);
};
export default SimpleModal;
