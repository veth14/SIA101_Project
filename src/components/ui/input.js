import { jsx as _jsx } from "react/jsx-runtime";
export const Input = ({ type = 'text', placeholder, value, onChange, className = '', disabled = false }) => {
    const baseClasses = 'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm';
    const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed' : '';
    return (_jsx("input", { type: type, placeholder: placeholder, value: value, onChange: onChange, disabled: disabled, className: `${baseClasses} ${disabledClasses} ${className}` }));
};
