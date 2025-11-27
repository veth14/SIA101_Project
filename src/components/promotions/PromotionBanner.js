import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { X, Tag, Clock } from 'lucide-react';
export const PromotionBanner = ({ promotion, onClose, dismissible = true }) => {
    const [timeLeft, setTimeLeft] = useState('');
    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const end = new Date(promotion.validTo).getTime();
            const difference = end - now;
            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                if (days > 0) {
                    setTimeLeft(`${days}d ${hours}h left`);
                }
                else if (hours > 0) {
                    setTimeLeft(`${hours}h ${minutes}m left`);
                }
                else {
                    setTimeLeft(`${minutes}m left`);
                }
            }
            else {
                setTimeLeft('Expired');
            }
        };
        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 60000); // Update every minute
        return () => clearInterval(interval);
    }, [promotion.validTo]);
    const discountText = promotion.discountPercent
        ? `${promotion.discountPercent}% OFF`
        : `₱${promotion.discountAmount} OFF`;
    return (_jsxs("div", { className: "relative rounded-2xl overflow-hidden shadow-lg", style: {
            background: promotion.bannerColor || 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
        }, children: [_jsx("div", { className: "absolute inset-0 bg-black/5" }), _jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" }), _jsx("div", { className: "absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" }), _jsxs("div", { className: "relative p-6 sm:p-8", children: [_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4", children: [_jsx(Tag, { className: "w-4 h-4 text-white" }), _jsxs("span", { className: "text-sm font-bold text-white", children: ["CODE: ", promotion.promoCode] })] }), _jsx("h2", { className: "text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2", children: promotion.title }), _jsx("p", { className: "text-white/90 text-base sm:text-lg mb-4", children: promotion.description }), _jsxs("div", { className: "flex items-center gap-2 text-white/90 text-sm", children: [_jsx(Clock, { className: "w-4 h-4" }), _jsx("span", { className: "font-semibold", children: timeLeft })] })] }), _jsxs("div", { className: "flex flex-col items-end gap-3", children: [_jsx("div", { className: "bg-white rounded-2xl px-6 py-4 shadow-lg", children: _jsx("div", { className: "text-3xl sm:text-4xl font-black text-transparent bg-gradient-to-r from-heritage-green to-emerald-600 bg-clip-text", children: discountText }) }), dismissible && onClose && (_jsx("button", { onClick: onClose, className: "w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors", children: _jsx(X, { className: "w-5 h-5" }) }))] })] }), _jsx("div", { className: "mt-6", children: _jsx("button", { className: "px-8 py-3 bg-white text-heritage-green rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-200 hover:scale-105", children: "Book Now & Save" }) })] })] }));
};
// Compact Promotion Card (for listing multiple promos)
export const PromotionCard = ({ promotion }) => {
    const discountText = promotion.discountPercent
        ? `${promotion.discountPercent}% OFF`
        : `₱${promotion.discountAmount} OFF`;
    return (_jsxs("div", { className: "bg-gradient-to-br from-heritage-green/10 to-emerald-600/10 rounded-xl p-4 border-2 border-heritage-green/20 hover:border-heritage-green/40 transition-colors", children: [_jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-bold text-gray-900", children: promotion.title }), _jsx("p", { className: "text-sm text-gray-600", children: promotion.description })] }), _jsx("div", { className: "bg-heritage-green text-white px-3 py-1 rounded-lg font-bold text-sm whitespace-nowrap", children: discountText })] }), _jsxs("div", { className: "flex items-center justify-between mt-3", children: [_jsx("code", { className: "px-3 py-1 bg-gray-100 rounded text-sm font-mono font-bold text-heritage-green", children: promotion.promoCode }), _jsxs("span", { className: "text-xs text-gray-500", children: ["Until ", new Date(promotion.validTo).toLocaleDateString()] })] })] }));
};
