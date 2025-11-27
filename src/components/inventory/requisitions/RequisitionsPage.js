import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { RequisitionBackground } from "./RequisitionBackground";
import { RequisitionStats } from "./RequisitionStats";
import { RequisitionGrid } from "./RequisitionGrid";
import useGetInvRequisition from "@/api/getInvRequisition";
const RequisitionsPage = () => {
    // Sample requisitions data
    const { getInvRequisitions, loadingForGetInvRequisition } = useGetInvRequisition();
    const [requisitions, setRequisitions] = useState([]);
    useEffect(() => {
        const useGetRequisitionsFunc = async () => {
            const response = await getInvRequisitions();
            if (!response.data) {
                alert(response.message);
                return;
            }
            setRequisitions(response.data);
        };
        useGetRequisitionsFunc();
    }, []);
    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: {
                bg: "bg-yellow-100",
                text: "text-yellow-800",
                label: "Pending",
            },
            approved: { bg: "bg-blue-100", text: "text-blue-800", label: "Approved" },
            rejected: { bg: "bg-red-100", text: "text-red-800", label: "Rejected" },
            fulfilled: {
                bg: "bg-green-100",
                text: "text-green-800",
                label: "Fulfilled",
            },
        };
        const config = statusConfig[status] ||
            statusConfig["pending"];
        return (_jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`, children: config.label }));
    };
    const getPriorityBadge = (priority) => {
        const priorityConfig = {
            low: { bg: "bg-gray-100", text: "text-gray-800", label: "Low" },
            medium: { bg: "bg-orange-100", text: "text-orange-800", label: "Medium" },
            high: { bg: "bg-red-100", text: "text-red-800", label: "High" },
            urgent: { bg: "bg-purple-100", text: "text-purple-800", label: "Urgent" },
        };
        const config = priorityConfig[priority] ||
            priorityConfig["low"];
        return (_jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`, children: config.label }));
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 0,
        }).format(amount);
    };
    const stats = {
        totalRequisitions: requisitions.length,
        pendingRequisitions: requisitions.filter((req) => req.status === "pending")
            .length,
        approvedRequisitions: requisitions.filter((req) => req.status === "approved").length,
        fulfilledRequisitions: requisitions.filter((req) => req.status === "fulfilled").length,
        totalValue: requisitions.reduce((sum, req) => sum + req.totalEstimatedCost, 0),
    };
    return (_jsxs("div", { className: "min-h-screen bg-[#F9F6EE]", children: [_jsx(RequisitionBackground, {}), _jsxs("div", { className: "relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full", children: [_jsx(RequisitionStats, { stats: stats, formatCurrency: formatCurrency }), _jsx(RequisitionGrid, { requisitions: requisitions, formatCurrency: formatCurrency, getStatusBadge: getStatusBadge, getPriorityBadge: getPriorityBadge, setRequisitions: setRequisitions })] })] }));
};
export default RequisitionsPage;
