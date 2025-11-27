import { jsx as _jsx } from "react/jsx-runtime";
export const Select = ({ children }) => {
    return _jsx("div", { className: "relative", children: children });
};
export const SelectTrigger = ({ children, className = '' }) => {
    return (_jsx("button", { className: `flex items-center justify-between w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`, children: children }));
};
export const SelectContent = ({ children }) => {
    return (_jsx("div", { className: "absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg", children: children }));
};
export const SelectItem = ({ children, onClick }) => {
    return (_jsx("div", { onClick: onClick, className: "px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm", children: children }));
};
export const SelectValue = ({ placeholder }) => {
    return _jsx("span", { className: "text-gray-500", children: placeholder });
};
