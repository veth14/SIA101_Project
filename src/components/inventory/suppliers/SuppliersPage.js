import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { SupplierBackground } from "./SupplierBackground";
import { SupplierStats } from "./SupplierStats";
import { SupplierGrid } from "./SupplierGrid";
import useGetInvSupplier from "@/api/getInvSupplier";
const SuppliersPage = () => {
    const [suppliers, setSuppliers] = useState([]);
    const { getInvSuppliers, loadingForGetInvSupplier } = useGetInvSupplier();
    useEffect(() => {
        const useGetInvSupplierFunc = async () => {
            const response = await getInvSuppliers();
            if (!response.success) {
                alert(response.message);
                return;
            }
            setSuppliers(response.data);
        };
        useGetInvSupplierFunc();
    }, []);
    const getStatusBadge = (status) => {
        const statusConfig = {
            active: { bg: "bg-green-100", text: "text-green-800", label: "Active" },
            inactive: { bg: "bg-red-100", text: "text-red-800", label: "Inactive" },
            suspended: {
                bg: "bg-yellow-100",
                text: "text-yellow-800",
                label: "Suspended",
            },
        };
        const config = statusConfig[status] ||
            statusConfig["active"];
        return (_jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`, children: config.label }));
    };
    const getRatingStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        for (let i = 0; i < fullStars; i++) {
            stars.push(_jsx("svg", { className: "w-4 h-4 text-yellow-400 fill-current", viewBox: "0 0 20 20", children: _jsx("path", { d: "M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" }) }, i));
        }
        if (hasHalfStar) {
            stars.push(_jsxs("svg", { className: "w-4 h-4 text-yellow-400", viewBox: "0 0 20 20", children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "half-fill", children: [_jsx("stop", { offset: "50%", stopColor: "currentColor" }), _jsx("stop", { offset: "50%", stopColor: "transparent" })] }) }), _jsx("path", { fill: "url(#half-fill)", d: "M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" })] }, "half"));
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(_jsx("svg", { className: "w-4 h-4 text-gray-300", viewBox: "0 0 20 20", children: _jsx("path", { fill: "currentColor", d: "M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" }) }, `empty-${i}`));
        }
        return (_jsxs("div", { className: "flex items-center space-x-1", children: [_jsx("div", { className: "flex", children: stars }), _jsxs("span", { className: "text-sm text-gray-600", children: ["(", rating, ")"] })] }));
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 0,
        }).format(amount);
    };
    const stats = {
        totalSuppliers: suppliers.length,
        activeSuppliers: suppliers.filter((s) => s.status === "active").length,
        inactiveSuppliers: suppliers.filter((s) => s.status === "inactive").length,
        suspendedSuppliers: suppliers.filter((s) => s.status === "suspended")
            .length,
        totalValue: suppliers.reduce((sum, s) => sum + (s.totalValue || 0), 0),
    };
    return (_jsxs("div", { className: "min-h-screen bg-[#F9F6EE]", children: [_jsx(SupplierBackground, {}), _jsx("div", { className: "relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full", children: loadingForGetInvSupplier ? (_jsxs("div", { className: "flex items-center justify-center py-12", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-heritage-green" }), _jsx("span", { className: "ml-3 text-gray-600", children: "Loading suppliers..." })] })) : (_jsxs(_Fragment, { children: [_jsx(SupplierStats, { stats: stats, formatCurrency: formatCurrency }), _jsx(SupplierGrid, { suppliers: suppliers, formatCurrency: formatCurrency, getStatusBadge: getStatusBadge, getRatingStars: getRatingStars, setSuppliers: setSuppliers })] })) })] }));
};
export default SuppliersPage;
