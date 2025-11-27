import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const typeStyles = {
    danger: {
        icon: '⚠️',
        confirmButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
        iconBg: 'bg-red-100',
    },
    warning: {
        icon: '⚠️',
        confirmButton: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
        iconBg: 'bg-yellow-100',
    },
    info: {
        icon: 'ℹ️',
        confirmButton: 'bg-heritage-green hover:bg-heritage-green/90 focus:ring-heritage-green',
        iconBg: 'bg-blue-100',
    },
};
export const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'info', }) => {
    if (!isOpen)
        return null;
    const styles = typeStyles[type];
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 overflow-y-auto", children: _jsxs("div", { className: "flex items-center justify-center min-h-screen p-4 text-center", children: [_jsx("div", { className: "fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity", onClick: onClose }), _jsxs("div", { className: "inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full", children: [_jsx("div", { className: "bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4", children: _jsxs("div", { className: "sm:flex sm:items-start", children: [_jsx("div", { className: `mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${styles.iconBg} sm:mx-0 sm:h-10 sm:w-10`, children: _jsx("span", { className: "text-xl", children: styles.icon }) }), _jsxs("div", { className: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left", children: [_jsx("label", { className: "text-lg leading-6 font-medium text-gray-900", children: title }), _jsx("div", { className: "mt-2", children: _jsx("p", { className: "text-sm text-gray-500", children: message }) })] })] }) }), _jsxs("div", { className: "bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse", children: [_jsx("button", { type: "button", onClick: handleConfirm, className: `w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${styles.confirmButton}`, children: confirmText }), _jsx("button", { type: "button", onClick: onClose, className: "mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heritage-green sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm", children: cancelText })] })] })] }) }));
};
