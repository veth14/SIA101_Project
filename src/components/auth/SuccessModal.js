import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
export const SuccessModal = ({ isOpen, onClose, title, message, buttonText = "Continue" }) => {
    // Disable escape key for this critical modal - users must read it
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                // Prevent closing - this is a critical verification notice
                e.preventDefault();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen]);
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);
    if (!isOpen)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [_jsx("div", { className: "absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300" }), _jsxs("div", { className: "relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 transform transition-all duration-300 scale-100", children: [_jsx("div", { className: "flex items-center justify-center pt-8 pb-4", children: _jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center animate-pulse", children: _jsx("svg", { className: "w-10 h-10 text-blue-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }) }) }), _jsx("div", { className: "absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-bounce", children: _jsx("span", { className: "text-white text-xs font-bold", children: "1" }) })] }) }), _jsxs("div", { className: "px-8 pb-8 text-center", children: [_jsx("h3", { className: "text-2xl font-bold text-gray-900 mb-3", children: "\uD83D\uDCE7 Check Your Email!" }), _jsx("div", { className: "mb-6", children: _jsx("p", { className: "text-gray-700 font-medium mb-2 leading-relaxed", children: message }) }), _jsx("div", { className: "bg-amber-50 border-2 border-amber-200 rounded-lg p-4 mb-6", children: _jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("svg", { className: "w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }), _jsxs("div", { className: "text-left", children: [_jsx("p", { className: "text-sm font-bold text-amber-900 mb-1", children: "\u26A0\uFE0F IMPORTANT - Action Required!" }), _jsxs("p", { className: "text-sm text-amber-800", children: ["You ", _jsx("strong", { children: "CANNOT log in" }), " until you verify your email. Please check your inbox now."] })] })] }) }), _jsxs("div", { className: "bg-gray-50 rounded-lg p-4 mb-6 text-left", children: [_jsx("p", { className: "text-sm font-semibold text-gray-700 mb-3", children: "\uD83D\uDCCB What to do next:" }), _jsxs("ol", { className: "text-sm text-gray-600 space-y-2", children: [_jsxs("li", { className: "flex items-start", children: [_jsx("span", { className: "font-bold text-heritage-green mr-2", children: "1." }), _jsxs("span", { children: ["Open your ", _jsx("strong", { children: "Gmail inbox" })] })] }), _jsxs("li", { className: "flex items-start", children: [_jsx("span", { className: "font-bold text-heritage-green mr-2", children: "2." }), _jsxs("span", { children: ["Look for email from ", _jsx("strong", { children: "Firebase/Balay Ginhawa" })] })] }), _jsxs("li", { className: "flex items-start", children: [_jsx("span", { className: "font-bold text-heritage-green mr-2", children: "3." }), _jsxs("span", { children: [_jsx("strong", { children: "Check your Spam/Junk folder" }), " if not in inbox"] })] }), _jsxs("li", { className: "flex items-start", children: [_jsx("span", { className: "font-bold text-heritage-green mr-2", children: "4." }), _jsxs("span", { children: ["Click the ", _jsx("strong", { children: "verification link" }), " in the email"] })] }), _jsxs("li", { className: "flex items-start", children: [_jsx("span", { className: "font-bold text-heritage-green mr-2", children: "5." }), _jsxs("span", { children: ["Return here and ", _jsx("strong", { children: "log in" }), " with your credentials"] })] })] })] }), _jsxs("div", { className: "text-xs text-gray-500 mb-6 text-left border-l-4 border-blue-400 pl-3 py-2 bg-blue-50", children: [_jsx("p", { className: "font-semibold text-gray-700 mb-1", children: "\uD83D\uDCA1 Tips:" }), _jsxs("ul", { className: "space-y-1", children: [_jsx("li", { children: "\u2022 Email may take 1-2 minutes to arrive" }), _jsx("li", { children: "\u2022 Check Promotions tab in Gmail" }), _jsx("li", { children: "\u2022 If you can't find it, use \"Resend\" when you try to log in" })] })] }), _jsx("button", { onClick: onClose, className: "w-full bg-heritage-green text-white py-3 px-6 rounded-lg font-semibold hover:bg-heritage-green/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-heritage-green focus:ring-offset-2 shadow-lg hover:shadow-xl", children: "\u2713 I Understand - Go to Login" }), _jsx("p", { className: "text-xs text-gray-400 mt-3", children: "You'll be able to log in after verifying your email" })] })] })] }));
};
