import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const LoadingSpinner = ({ size = 'md', color = 'primary', text }) => {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-2',
        lg: 'w-12 h-12 border-3',
        xl: 'w-16 h-16 border-4'
    };
    const colorClasses = {
        primary: 'border-heritage-green/20 border-t-heritage-green',
        white: 'border-white/20 border-t-white',
        gray: 'border-gray-200 border-t-gray-600'
    };
    const textSizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
        xl: 'text-lg'
    };
    return (_jsxs("div", { className: "flex flex-col items-center justify-center gap-3", children: [_jsx("div", { className: `${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin` }), text && (_jsx("p", { className: `${textSizeClasses[size]} font-medium text-gray-600`, children: text }))] }));
};
// Full Page Loading Overlay
export const LoadingOverlay = ({ text = 'Loading...' }) => {
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm", children: _jsx("div", { className: "text-center", children: _jsx(LoadingSpinner, { size: "xl", text: text }) }) }));
};
// Inline Loading State
export const InlineLoader = ({ text }) => {
    return (_jsx("div", { className: "flex items-center justify-center py-8", children: _jsx(LoadingSpinner, { size: "md", text: text }) }));
};
