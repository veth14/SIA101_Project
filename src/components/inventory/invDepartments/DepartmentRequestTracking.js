import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from "react";
import { PremiumDepartmentDropdown } from "./TableDropdown";
import { RequestDetailsModal } from "./RequestDetailsModal";
export const UltraPremiumRequestTable = ({ searchTerm, onSearchChange, selectedDepartment, onDepartmentChange, requests, onSuccess, setRequests, }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const itemsPerPage = 5;
    const handleViewDetails = (request) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRequest(null);
    };
    // Filter requests based on search term and selected department
    const filteredRequests = useMemo(() => {
        if (!requests || requests.length === 0) {
            return [];
        }
        return requests.filter((request) => {
            // Search filter - check if search term is empty or matches any field
            const searchLower = (searchTerm || "").toLowerCase().trim();
            const matchesSearch = searchLower === "" ||
                (request.id && request.id.toLowerCase().includes(searchLower)) ||
                (request.department &&
                    request.department.toLowerCase().includes(searchLower)) ||
                (request.itemService &&
                    request.itemService.toLowerCase().includes(searchLower)) ||
                (request.requestedBy &&
                    request.requestedBy.toLowerCase().includes(searchLower)) ||
                (request.status && request.status.toLowerCase().includes(searchLower));
            // Department filter
            const matchesDepartment = !selectedDepartment ||
                selectedDepartment === "All Departments" ||
                request.department === selectedDepartment;
            return matchesSearch && matchesDepartment;
        });
    }, [requests, searchTerm, selectedDepartment]);
    // Calculate pagination
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentRequests = filteredRequests.slice(startIndex, endIndex);
    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedDepartment]);
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const getPaginationRange = () => {
        const range = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        const end = Math.min(totalPages, start + maxVisible - 1);
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }
        for (let i = start; i <= end; i++) {
            range.push(i);
        }
        return range;
    };
    const getStatusColor = (status) => {
        switch (status) {
            case "Pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "Approved":
                return "bg-green-100 text-green-800 border-green-200";
            case "Rejected":
                return "bg-red-100 text-red-800 border-red-200";
            case "Completed":
                return "bg-blue-100 text-blue-800 border-blue-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden", children: [_jsx("div", { className: "px-8 py-6 bg-gradient-to-r from-slate-50 to-white border-b border-gray-200/50", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl", children: _jsx("svg", { className: "w-5 h-5 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" }) }) }), _jsx("div", { className: "absolute -inset-1 bg-gradient-to-r from-heritage-green to-emerald-400 rounded-2xl blur opacity-30" })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-black text-gray-900", children: "Maintenance Request Tracking" }), _jsxs("p", { className: "text-sm text-gray-500 font-medium", children: ["Showing ", startIndex + 1, "-", Math.min(endIndex, filteredRequests.length), " of", " ", filteredRequests.length, " requests \u2022 Page ", currentPage, " of", " ", totalPages, searchTerm && (_jsxs("span", { className: "ml-2 text-heritage-green", children: ["\u2022 Searching: \"", searchTerm, "\""] })), selectedDepartment !== "All Departments" && (_jsxs("span", { className: "ml-2 text-blue-600", children: ["\u2022 Dept: ", selectedDepartment] }))] })] })] }), _jsxs("div", { className: "flex space-x-4", children: [_jsxs("div", { className: "relative group", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-heritage-green/20 to-emerald-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" }), _jsxs("div", { className: "relative flex items-center", children: [_jsx("svg", { className: "absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-heritage-green z-10", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }), _jsx("input", { type: "text", placeholder: "Search requests, departments, or services...", value: searchTerm, onChange: (e) => onSearchChange(e.target.value), className: "pl-12 pr-6 py-3 w-80 border border-white/40 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-heritage-green/50 focus:border-heritage-green/50 bg-white/70 backdrop-blur-sm shadow-lg placeholder-gray-500 transition-all duration-300" })] })] }), _jsx(PremiumDepartmentDropdown, { selectedDepartment: selectedDepartment, onDepartmentChange: onDepartmentChange })] })] }) }), _jsx("div", { style: { height: "400px" }, children: _jsxs("table", { className: "w-full h-full", children: [_jsx("thead", { className: "bg-gray-50 border-b border-gray-200", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider", children: "Request ID" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider", children: "Department" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider", children: "Item/Service" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider", children: "Requested By" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider", children: "Date" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider", children: "Status" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider", children: "Actions" })] }) }), _jsxs("tbody", { className: "bg-white divide-y divide-gray-200", children: [currentRequests.map((request) => (_jsxs("tr", { className: "hover:bg-gray-50 transition-colors duration-200 h-16", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "text-sm font-medium text-gray-900 font-mono", children: request.id }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center", children: _jsx("svg", { className: "w-4 h-4 text-blue-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" }) }) }), _jsx("span", { className: "text-sm font-medium text-gray-900", children: request.department })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "max-w-xs", children: [_jsx("p", { className: "text-sm font-medium text-gray-900 truncate", children: request.itemService }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Service Request" })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-8 h-8 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center", children: _jsx("span", { className: "text-xs font-bold text-emerald-700", children: request.requestedBy
                                                                        .split(" ")
                                                                        .map((n) => n[0])
                                                                        .join("") }) }), _jsx("span", { className: "text-sm font-medium text-gray-900", children: request.requestedBy })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "text-sm font-medium text-gray-900", children: request.date }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("span", { className: `inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(request.status)}`, children: [_jsx("div", { className: "w-2 h-2 rounded-full mr-2 bg-current opacity-60" }), request.status] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("button", { onClick: () => handleViewDetails(request), className: "inline-flex items-center px-3 py-1.5 text-sm font-medium text-heritage-green bg-heritage-green/10 border border-heritage-green/30 rounded-lg hover:bg-heritage-green hover:text-white transition-all duration-200", children: [_jsxs("svg", { className: "w-4 h-4 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }), _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" })] }), "View Details"] }) })] }, request.id))), Array.from({
                                            length: Math.max(0, itemsPerPage - currentRequests.length),
                                        }).map((_, index) => (_jsxs("tr", { className: "h-16", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "text-sm text-gray-400", children: "-" }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "text-sm text-gray-400", children: "-" }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "text-sm text-gray-400", children: "-" }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "text-sm text-gray-400", children: "-" }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "text-sm text-gray-400", children: "-" }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "text-sm text-gray-400", children: "-" }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "text-sm text-gray-400", children: "-" }) })] }, `empty-${index}`)))] })] }) }), totalPages > 1 && (_jsx("div", { className: "flex items-center justify-center pt-6 pb-4", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("button", { onClick: () => handlePageChange(currentPage - 1), disabled: currentPage === 1, className: `inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${currentPage === 1
                                        ? "text-gray-400 cursor-not-allowed"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"} transition-colors`, children: [_jsx("svg", { className: "w-4 h-4 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }), "Previous"] }), _jsx("div", { className: "flex items-center space-x-1", children: getPaginationRange().map((page) => (_jsx("button", { onClick: () => handlePageChange(page), className: `inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-md transition-colors ${page === currentPage
                                            ? "bg-heritage-green text-white"
                                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"}`, children: page }, page))) }), _jsxs("button", { onClick: () => handlePageChange(currentPage + 1), disabled: currentPage === totalPages, className: `inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${currentPage === totalPages
                                        ? "text-gray-400 cursor-not-allowed"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"} transition-colors`, children: ["Next", _jsx("svg", { className: "w-4 h-4 ml-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })] })] }) }))] }), _jsx(RequestDetailsModal, { request: selectedRequest, isOpen: isModalOpen, onClose: handleCloseModal, onSuccess: onSuccess })] }));
};
