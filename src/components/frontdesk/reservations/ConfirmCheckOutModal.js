import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
export const ConfirmCheckOutModal = ({ isOpen, onClose, reservation, onConfirmCheckOut }) => {
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    // Prevent background scroll
    React.useEffect(() => {
        if (!isOpen)
            return;
        const original = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = original;
        };
    }, [isOpen]);
    const handleConfirm = async () => {
        setIsCheckingOut(true);
        try {
            // Await the parent's atomic batch write
            await onConfirmCheckOut(reservation);
            // Note: The parent component (ReservationsPage) is responsible for 
            // closing this modal via the onClose prop after the operation succeeds.
        }
        catch (error) {
            console.error("Check-out failed:", error);
            setIsCheckingOut(false); // Only reset if error, otherwise component unmounts
        }
    };
    if (!isOpen)
        return null;
    return createPortal(_jsxs("div", { className: "fixed inset-0 z-[1000] flex items-center justify-center", role: "dialog", "aria-modal": "true", children: [_jsx("div", { className: "fixed inset-0 bg-black/45 backdrop-blur-sm transition-opacity", onClick: onClose, "aria-label": "Close overlay" }), _jsxs("div", { className: "relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 transform transition-all", children: [_jsxs("div", { className: "px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Confirm Check-Out" }), _jsxs("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-500 focus:outline-none", children: [_jsx("span", { className: "sr-only", children: "Close" }), _jsx("svg", { className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z", clipRule: "evenodd" }) })] })] }), _jsx("div", { className: "px-6 py-6", children: _jsxs("div", { className: "flex items-start space-x-4", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center", children: _jsx("svg", { className: "h-6 w-6 text-blue-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" }) }) }) }), _jsxs("div", { children: [_jsxs("p", { className: "text-sm text-gray-500", children: ["Are you sure you want to check out", ' ', _jsx("span", { className: "font-semibold text-gray-900", children: reservation.userName }), reservation.roomNumber && (_jsxs(_Fragment, { children: [' ', "from Room", ' ', _jsx("span", { className: "font-semibold text-gray-900", children: reservation.roomNumber })] })), "?"] }), _jsxs("p", { className: "mt-2 text-sm text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-100", children: [_jsx("span", { className: "font-medium text-blue-800", children: "Action:" }), " Room status will be set to", _jsx("span", { className: "font-bold text-blue-800", children: " Cleaning" }), "."] })] })] }) }), _jsxs("div", { className: "px-6 py-4 bg-gray-50 flex justify-end space-x-3", children: [_jsx("button", { type: "button", onClick: onClose, disabled: isCheckingOut, className: "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors", children: "Cancel" }), _jsx("button", { type: "button", onClick: handleConfirm, disabled: isCheckingOut, className: "inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 shadow-sm transition-colors", children: isCheckingOut ? (_jsxs(_Fragment, { children: [_jsxs("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Checking Out..."] })) : ('Confirm Check-Out') })] })] })] }), document.body);
};
