import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
export const SearchInput = ({ placeholder = 'Search...', onSearch, className = '' }) => {
    const [query, setQuery] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query);
    };
    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        // Debounced search - you might want to add debouncing here
        onSearch(value);
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: `relative ${className}`, children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx("svg", { className: "h-5 w-5 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }) }), _jsx("input", { type: "text", value: query, onChange: handleChange, placeholder: placeholder, className: "block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-heritage-green focus:border-heritage-green" }), query && (_jsx("button", { type: "button", onClick: () => {
                    setQuery('');
                    onSearch('');
                }, className: "absolute inset-y-0 right-0 pr-3 flex items-center", children: _jsx("svg", { className: "h-5 w-5 text-gray-400 hover:text-gray-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) }))] }));
};
