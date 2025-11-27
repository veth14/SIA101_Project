import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Header } from '../shared/navigation/Header';
import { Footer } from '../shared/navigation/Footer';
/**
 * GuestLayout - Reusable layout wrapper for guest-facing pages
 * Eliminates duplication of Header/Footer wrapper in route definitions
 */
export const GuestLayout = ({ children }) => {
    return (_jsxs(_Fragment, { children: [_jsx(Header, {}), children, _jsx(Footer, {})] }));
};
