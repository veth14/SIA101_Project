import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
export const DateRangePicker = ({ value, onChange, className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleStartDateChange = (date) => {
        onChange({ ...value, startDate: date });
    };
    const handleEndDateChange = (date) => {
        onChange({ ...value, endDate: date });
    };
    const formatDate = (dateString) => {
        if (!dateString)
            return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };
    const getDisplayText = () => {
        if (!value.startDate && !value.endDate) {
            return 'Select date range';
        }
        if (value.startDate && value.endDate) {
            return `${formatDate(value.startDate)} - ${formatDate(value.endDate)}`;
        }
        if (value.startDate) {
            return `From ${formatDate(value.startDate)}`;
        }
        return `Until ${formatDate(value.endDate)}`;
    };
    return (_jsxs("div", { className: `relative ${className}`, children: [_jsxs("button", { type: "button", onClick: () => setIsOpen(!isOpen), className: "flex items-center justify-between w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("svg", { className: "w-4 h-4 text-gray-400 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }), _jsx("span", { className: "text-gray-700", children: getDisplayText() })] }), _jsx("svg", { className: "w-4 h-4 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })] }), isOpen && (_jsx("div", { className: "absolute z-10 mt-1 w-80 bg-white border border-gray-200 rounded-md shadow-lg", children: _jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Start Date" }), _jsx("input", { type: "date", value: value.startDate, onChange: (e) => handleStartDateChange(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "End Date" }), _jsx("input", { type: "date", value: value.endDate, onChange: (e) => handleEndDateChange(e.target.value), min: value.startDate, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green" })] })] }), _jsxs("div", { className: "flex justify-between mt-4 pt-3 border-t border-gray-200", children: [_jsx("button", { type: "button", onClick: () => {
                                        onChange({ startDate: '', endDate: '' });
                                        setIsOpen(false);
                                    }, className: "text-sm text-gray-500 hover:text-gray-700", children: "Clear" }), _jsx("button", { type: "button", onClick: () => setIsOpen(false), className: "px-4 py-2 text-sm font-medium text-white bg-heritage-green rounded-md hover:bg-heritage-green/90 focus:outline-none focus:ring-2 focus:ring-heritage-green", children: "Apply" })] })] }) }))] }));
};
