import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo, useRef } from "react";
import { RequisitionCard } from "./RequisitionCard";
import NewRequisitionModal from "./NewRequisitionModal";
// Status Dropdown Component
const StatusDropdown = ({ selectedStatus, onStatusChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const statuses = [
        "All Status",
        "Pending",
        "Approved",
        "Rejected",
        "Fulfilled",
    ];
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current &&
                !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    const handleStatusSelect = (status) => {
        onStatusChange(status);
        setIsOpen(false);
    };
    return (_jsxs("div", { className: "relative z-[100000]", ref: dropdownRef, children: [_jsxs("div", { className: "relative group", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-heritage-green/20 to-emerald-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" }), _jsxs("button", { onClick: () => setIsOpen(!isOpen), className: "relative flex items-center justify-between px-6 py-3 w-48 border border-white/40 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-heritage-green/50 focus:border-heritage-green/50 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300 cursor-pointer hover:bg-white/90", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-2 h-2 bg-gradient-to-r from-heritage-green to-emerald-500 rounded-full" }), _jsx("span", { className: "text-gray-800", children: selectedStatus })] }), _jsx("svg", { className: `w-4 h-4 text-heritage-green transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })] })] }), isOpen && (_jsx("div", { className: "absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[99999]", children: statuses.map((status) => (_jsxs("button", { onClick: () => handleStatusSelect(status), className: `w-full flex items-center space-x-3 px-6 py-3 text-left text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-heritage-green/10 hover:to-emerald-500/10 ${selectedStatus === status
                        ? "bg-gradient-to-r from-heritage-green/20 to-emerald-500/20 text-heritage-green border-l-4 border-heritage-green"
                        : "text-gray-700 hover:text-heritage-green"}`, children: [_jsx("div", { className: `w-2 h-2 rounded-full transition-all duration-200 ${selectedStatus === status
                                ? "bg-gradient-to-r from-heritage-green to-emerald-500"
                                : "bg-gray-300"}` }), _jsx("span", { className: "flex-1", children: status }), selectedStatus === status && (_jsx("svg", { className: "w-4 h-4 text-heritage-green", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }))] }, status))) })), isOpen && (_jsx("div", { className: "fixed inset-0 z-[99998]", onClick: () => setIsOpen(false) }))] }));
};
export const RequisitionGrid = ({ requisitions, formatCurrency, getStatusBadge, getPriorityBadge, setRequisitions, }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("All Status");
    const [isNewRequisitionModalOpen, setIsNewRequisitionModalOpen] = useState(false);
    const itemsPerPage = 3;
    // Filter requisitions based on search term and selected status
    const filteredRequisitions = useMemo(() => {
        if (!requisitions || requisitions.length === 0) {
            return [];
        }
        return requisitions.filter((requisition) => {
            // Search filter - check if search term is empty or matches any field
            const searchLower = (searchTerm || "").toLowerCase().trim();
            const matchesSearch = searchLower === "" ||
                (requisition.requestNumber &&
                    requisition.requestNumber.toLowerCase().includes(searchLower)) ||
                (requisition.department &&
                    requisition.department.toLowerCase().includes(searchLower)) ||
                (requisition.requestedBy &&
                    requisition.requestedBy.toLowerCase().includes(searchLower)) ||
                (requisition.status &&
                    requisition.status.toLowerCase().includes(searchLower)) ||
                (requisition.priority &&
                    requisition.priority.toLowerCase().includes(searchLower));
            // Status filter
            const matchesStatus = !selectedStatus ||
                selectedStatus === "All Status" ||
                requisition.status.toLowerCase() === selectedStatus.toLowerCase();
            return matchesSearch && matchesStatus;
        });
    }, [requisitions, searchTerm, selectedStatus]);
    // Calculate pagination
    const totalPages = Math.ceil(filteredRequisitions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentRequisitions = filteredRequisitions.slice(startIndex, endIndex);
    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedStatus]);
    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        if (totalPages <= maxVisiblePages) {
            // Show all pages if total is less than max visible
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        }
        else {
            // Show smart pagination
            if (currentPage <= 3) {
                // Show first 5 pages
                for (let i = 1; i <= 5; i++) {
                    pages.push(i);
                }
            }
            else if (currentPage >= totalPages - 2) {
                // Show last 5 pages
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pages.push(i);
                }
            }
            else {
                // Show current page and 2 on each side
                for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                    pages.push(i);
                }
            }
        }
        return pages;
    };
    const handleNewRequisitionSuccess = () => {
        // Refresh requisitions or handle success
        console.log("New requisition created successfully");
    };
    // Show empty state if no requisitions
    if (requisitions.length === 0) {
        return (_jsx("div", { className: "bg-white border border-gray-200 rounded-lg shadow-sm", children: _jsxs("div", { className: "py-12 text-center", children: [_jsx("div", { className: "mb-4 text-6xl", children: "\uD83D\uDCCB" }), _jsx("h3", { className: "mb-2 text-xl font-semibold text-gray-900", children: "No requisitions found" }), _jsx("p", { className: "text-gray-600", children: "Try adjusting your search criteria or filters." })] }) }));
    }
    return (_jsxs("div", { className: "overflow-hidden border shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60", children: [_jsx("div", { className: "px-8 py-6 border-b bg-gradient-to-r from-slate-50 to-white border-gray-200/50", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "flex items-center justify-center w-10 h-10 shadow-xl bg-gradient-to-br from-heritage-green to-emerald-600 rounded-2xl", children: _jsx("svg", { className: "w-5 h-5 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }) }), _jsx("div", { className: "absolute -inset-1 bg-gradient-to-r from-heritage-green to-emerald-400 rounded-2xl blur opacity-30" })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-black text-gray-900", children: "Requisitions" }), _jsxs("p", { className: "text-sm font-medium text-gray-500", children: ["Showing ", startIndex + 1, "-", Math.min(endIndex, filteredRequisitions.length), " of", " ", filteredRequisitions.length, " requisitions \u2022 Page ", currentPage, " ", "of ", totalPages, searchTerm && (_jsxs("span", { className: "ml-2 text-heritage-green", children: ["\u2022 Searching: \"", searchTerm, "\""] })), selectedStatus !== "All Status" && (_jsxs("span", { className: "ml-2 text-blue-600", children: ["\u2022 Status: ", selectedStatus] }))] })] })] }), _jsxs("div", { className: "flex space-x-4", children: [_jsxs("div", { className: "relative group", children: [_jsx("div", { className: "absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-heritage-green/20 to-emerald-500/20 rounded-xl blur group-hover:opacity-100" }), _jsxs("div", { className: "relative flex items-center", children: [_jsx("svg", { className: "absolute z-10 w-5 h-5 transform -translate-y-1/2 left-4 top-1/2 text-heritage-green", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }), _jsx("input", { type: "text", placeholder: "Search requisitions, departments, or status...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "py-3 pl-12 pr-6 text-sm font-medium placeholder-gray-500 transition-all duration-300 border shadow-lg w-80 border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-heritage-green/50 focus:border-heritage-green/50 bg-white/70 backdrop-blur-sm" })] })] }), _jsx(StatusDropdown, { selectedStatus: selectedStatus, onStatusChange: setSelectedStatus }), _jsxs("button", { onClick: () => setIsNewRequisitionModalOpen(true), className: "inline-flex items-center px-6 py-3 font-semibold text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-heritage-green to-emerald-600 rounded-xl hover:from-heritage-green/90 hover:to-emerald-600/90 hover:shadow-xl hover:scale-105", children: [_jsx("svg", { className: "w-5 h-5 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6v6m0 0v6m0-6h6m-6 0H6" }) }), "New Requisition"] })] })] }) }), _jsxs("div", { className: "p-6", children: [_jsx("div", { className: "grid grid-cols-1 gap-8 mb-8 md:grid-cols-2 lg:grid-cols-3", children: currentRequisitions.map((requisition, index) => (_jsx("div", { className: "opacity-0 animate-pulse", style: {
                                animation: `fadeInUp 0.6s ease-out ${index * 100}ms forwards`,
                            }, children: _jsx(RequisitionCard, { requisition: requisition, formatCurrency: formatCurrency, getStatusBadge: getStatusBadge, getPriorityBadge: getPriorityBadge, setRequisitions: setRequisitions }) }, requisition.id))) }), _jsx("style", { dangerouslySetInnerHTML: {
                            __html: `
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `,
                        } }), totalPages > 1 && (_jsxs("div", { className: "flex items-center justify-center pt-6 space-x-2 border-t border-gray-100", children: [_jsxs("button", { onClick: () => setCurrentPage((prev) => Math.max(prev - 1, 1)), disabled: currentPage === 1, className: `inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${currentPage === 1
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"} transition-colors`, children: [_jsx("svg", { className: "w-4 h-4 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }), "Previous"] }), _jsx("div", { className: "flex items-center space-x-1", children: getPageNumbers().map((pageNum) => (_jsx("button", { onClick: () => setCurrentPage(pageNum), className: `inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-md transition-colors ${currentPage === pageNum
                                        ? "bg-heritage-green text-white"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"}`, children: pageNum }, pageNum))) }), _jsxs("button", { onClick: () => setCurrentPage((prev) => Math.min(prev + 1, totalPages)), disabled: currentPage === totalPages, className: `inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${currentPage === totalPages
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"} transition-colors`, children: ["Next", _jsx("svg", { className: "w-4 h-4 ml-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })] })] }))] }), _jsx(NewRequisitionModal, { isOpen: isNewRequisitionModalOpen, onClose: () => setIsNewRequisitionModalOpen(false), onSuccess: handleNewRequisitionSuccess })] }));
};
