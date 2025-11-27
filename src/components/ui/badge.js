import { jsx as _jsx } from "react/jsx-runtime";
export const Badge = ({ children, variant = 'default', className = '' }) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    const variantClasses = {
        default: 'bg-blue-100 text-blue-800',
        secondary: 'bg-gray-100 text-gray-800',
        destructive: 'bg-red-100 text-red-800',
        outline: 'border border-gray-300 text-gray-700'
    };
    return (_jsx("span", { className: `${baseClasses} ${variantClasses[variant]} ${className}`, children: children }));
};
