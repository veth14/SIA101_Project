import { jsx as _jsx } from "react/jsx-runtime";
export const AlertDialog = ({ children, open = true, onOpenChange }) => {
    if (!open)
        return null;
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && onOpenChange) {
            onOpenChange(false);
        }
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50", onClick: handleBackdropClick, children: children }));
};
export const AlertDialogContent = ({ children }) => {
    return (_jsx("div", { className: "bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4", children: children }));
};
export const AlertDialogHeader = ({ children }) => {
    return _jsx("div", { className: "mb-4", children: children });
};
export const AlertDialogTitle = ({ children }) => {
    return _jsx("h2", { className: "text-lg font-semibold text-gray-900", children: children });
};
export const AlertDialogDescription = ({ children }) => {
    return _jsx("p", { className: "text-sm text-gray-600 mt-2", children: children });
};
export const AlertDialogFooter = ({ children }) => {
    return _jsx("div", { className: "flex justify-end space-x-2 mt-6", children: children });
};
export const AlertDialogAction = ({ children, onClick, className = '' }) => {
    return (_jsx("button", { onClick: onClick, className: `px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors ${className}`, children: children }));
};
export const AlertDialogCancel = ({ children, onClick, className = '' }) => {
    return (_jsx("button", { onClick: onClick, className: `px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors ${className}`, children: children }));
};
