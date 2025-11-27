import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
export const SearchBar = ({ value, onChange, placeholder = "Search...", className = "" }) => {
    return (_jsxs("div", { className: `relative ${className}`, children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" }), _jsx(Input, { type: "text", placeholder: placeholder, value: value, onChange: (e) => onChange(e.target.value), className: "pl-10" })] }));
};
