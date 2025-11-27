import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import StaffStats from './StaffStats';
import StaffFilters from './StaffFilters';
import StaffGrid from './StaffGrid';
const ManageStaffPage = () => {
    return (_jsxs("div", { className: "min-h-screen bg-[#F9F6EE]", children: [_jsxs("div", { className: "fixed inset-0 pointer-events-none", children: [_jsx("div", { className: "absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 rounded-full blur-3xl animate-pulse opacity-30" }), _jsx("div", { className: "absolute top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl animate-pulse delay-1000 opacity-25" }), _jsx("div", { className: "absolute bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 rounded-full blur-3xl animate-pulse delay-2000 opacity-20" }), _jsx("div", { className: "absolute inset-0 opacity-5", children: _jsx("div", { className: "absolute inset-0", style: {
                                backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(134, 134, 134, 0.1) 1px, transparent 0)',
                                backgroundSize: '50px 50px'
                            } }) })] }), _jsxs("div", { className: "relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full", children: [_jsx(StaffStats, {}), _jsx(StaffFilters, {}), _jsx(StaffGrid, {})] })] }));
};
export default ManageStaffPage;
