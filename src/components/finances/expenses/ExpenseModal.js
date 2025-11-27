import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
export const ExpenseModal = ({ isOpen, onClose, children }) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            // Blur the entire app except the modal
            const root = document.getElementById('root');
            if (root) {
                // Apply blur and transition to root
                root.style.filter = 'blur(8px)';
                root.style.transition = 'filter 0.3s ease-in-out';
            }
            return () => {
                document.removeEventListener('keydown', handleEscape);
                document.body.style.overflow = originalOverflow;
                // Remove blur from root
                const rootElement = document.getElementById('root');
                if (rootElement) {
                    rootElement.style.filter = 'none';
                }
            };
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);
    if (!isOpen)
        return null;
    // Render modal outside of root using portal
    return createPortal(
    // Modal portal - renders directly in body, outside of root
    _jsxs("div", { className: "fixed inset-0 z-[1000] flex items-center justify-center", role: "dialog", "aria-modal": "true", children: [_jsx("div", { className: "fixed inset-0 transition-opacity duration-200 bg-black/45 backdrop-blur-lg", onClick: onClose, "aria-label": "Close overlay" }), _jsx("div", { className: "relative z-10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-white/95 shadow-2xl ring-1 ring-black/5", children: _jsx("div", { className: "p-6 overflow-y-auto max-h-[calc(90vh-32px)]", children: children }) })] }), document.body // Render directly to body, bypassing root
    );
};
