import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { ViewItemsModal } from "./ViewItemsModal";
import { RequestItemModal } from "./RequestItemModal";
import { EditDepartmentModal } from "./EditDepartmentModal";
export const UltraPremiumDepartmentCards = ({ departments, formatCurrency, setDepartments, onRequestSuccess }) => {
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [modalItems, setModalItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isViewItemsModalOpen, setIsViewItemsModalOpen] = useState(false);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const handleViewItems = async (dept) => {
        setSelectedDepartment(dept);
        setIsLoading(true);
        setIsViewItemsModalOpen(true);
        try {
            // Fetch items assigned to this department
            const response = await fetch(`http://localhost:3000/api/inventory-inventory/get-items`);
            const result = await response.json();
            if (result.success) {
                // Filter items by department
                const deptItems = result.data.filter((item) => item.assignedDepartment === dept.id || item.category === dept.name);
                setModalItems(deptItems);
            }
            else {
                console.error('Failed to fetch department items');
                setModalItems([]);
            }
        }
        catch (error) {
            console.error('Error fetching department items:', error);
            setModalItems([]);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleRequestClick = (dept) => {
        setSelectedDepartment(dept);
        setIsRequestModalOpen(true);
    };
    const handleEditClick = (dept) => {
        setSelectedDepartment(dept);
        setIsEditModalOpen(true);
    };
    const handleCloseViewItems = () => {
        setIsViewItemsModalOpen(false);
        setSelectedDepartment(null);
        setModalItems([]);
    };
    const handleCloseRequest = () => {
        setIsRequestModalOpen(false);
        setSelectedDepartment(null);
    };
    const handleCloseEdit = () => {
        setIsEditModalOpen(false);
        setSelectedDepartment(null);
    };
    const handleRequestSuccess = () => {
        // Call parent callback to refresh all data
        onRequestSuccess?.();
    };
    const handleEditSuccess = () => {
        // Refresh page to show updated department info
        window.location.reload();
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10", children: departments.map((dept, index) => (_jsxs("div", { className: "group relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/40 p-8 hover:shadow-3xl hover:-translate-y-2 hover:scale-105 transition-all duration-500 overflow-hidden", style: {
                        animation: `fadeInUp 0.6s ease-out ${index * 150}ms forwards`,
                    }, children: [_jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-heritage-green/10 to-emerald-500/10 rounded-full blur-2xl transform translate-x-8 -translate-y-8" }), _jsx("div", { className: "absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full blur-xl transform -translate-x-4 translate-y-4" }), _jsxs("div", { className: "relative z-10 flex items-start justify-between mb-8", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center space-x-3 mb-2", children: [_jsx("div", { className: "w-3 h-3 bg-gradient-to-r from-heritage-green to-emerald-500 rounded-full animate-pulse" }), _jsx("h3", { className: "text-2xl font-black text-gray-900 tracking-tight", children: dept.name })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("svg", { className: "w-4 h-4 text-heritage-neutral", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }) }), _jsx("p", { className: "text-sm font-medium text-heritage-neutral", children: dept.manager })] })] }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-heritage-green via-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:rotate-12 group-hover:scale-110 transition-all duration-500", children: _jsx("svg", { className: "w-8 h-8 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" }) }) }), _jsx("div", { className: "absolute -inset-2 bg-gradient-to-r from-heritage-green to-emerald-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500" })] })] }), _jsxs("div", { className: "relative z-10 grid grid-cols-2 gap-6 mb-8", children: [_jsxs("div", { className: "relative overflow-hidden bg-gradient-to-br from-blue-50/80 via-blue-100/60 to-indigo-100/80 backdrop-blur-sm rounded-2xl p-5 border border-blue-200/50 group-hover:shadow-lg transition-all duration-300", children: [_jsx("div", { className: "absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-xl transform translate-x-4 -translate-y-4" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "flex items-center justify-between mb-2", children: _jsx("svg", { className: "w-5 h-5 text-blue-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" }) }) }), _jsx("p", { className: "text-3xl font-black text-blue-700 mb-1", children: dept.itemsAssigned }), _jsx("p", { className: "text-xs font-bold text-blue-600 uppercase tracking-wider", children: "Items Assigned" })] })] }), _jsxs("div", { className: "relative overflow-hidden bg-gradient-to-br from-emerald-50/80 via-emerald-100/60 to-green-100/80 backdrop-blur-sm rounded-2xl p-5 border border-emerald-200/50 group-hover:shadow-lg transition-all duration-300", children: [_jsx("div", { className: "absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-400/20 to-green-500/20 rounded-full blur-xl transform translate-x-4 -translate-y-4" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "flex items-center justify-between mb-2", children: _jsx("svg", { className: "w-5 h-5 text-emerald-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }) }) }), _jsxs("p", { className: "text-3xl font-black text-emerald-700 mb-1", children: [dept.totalUsage, "%"] }), _jsx("p", { className: "text-xs font-bold text-emerald-600 uppercase tracking-wider", children: "Total Usage" })] })] })] }), _jsx("div", { className: "relative z-10 mb-8", children: _jsxs("div", { className: "bg-gradient-to-r from-heritage-light/30 to-white/50 backdrop-blur-sm rounded-2xl p-6 border border-heritage-neutral/20", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("svg", { className: "w-5 h-5 text-heritage-green", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" }) }), _jsx("p", { className: "text-sm font-bold text-gray-800", children: "Monthly Consumption" })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-lg font-black text-heritage-green", children: formatCurrency(dept.monthlyConsumption) }), _jsx("p", { className: "text-xs text-heritage-neutral font-medium", children: "Current Month" })] })] }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-full h-4 overflow-hidden shadow-inner", children: _jsxs("div", { className: "bg-gradient-to-r from-heritage-green via-emerald-500 to-teal-500 h-4 rounded-full transition-all duration-1000 shadow-lg relative overflow-hidden", style: { width: `${Math.min(dept.totalUsage, 100)}%` }, children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/10 rounded-full" })] }) }), _jsxs("div", { className: "flex justify-between text-xs font-medium text-gray-600 mt-2", children: [_jsx("span", { children: "0%" }), _jsxs("span", { className: "text-heritage-green font-bold", children: [dept.totalUsage, "%"] }), _jsx("span", { children: "100%" })] })] })] }) }), _jsxs("div", { className: "relative z-10 flex space-x-3", children: [_jsxs("button", { onClick: () => handleViewItems(dept), className: "flex-1 group/btn relative overflow-hidden px-5 py-3 text-sm font-bold text-white bg-gradient-to-r from-heritage-green to-emerald-600 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" }), _jsxs("div", { className: "relative flex items-center justify-center space-x-2", children: [_jsxs("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }), _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" })] }), _jsx("span", { children: "View Items" })] })] }), _jsx("button", { onClick: () => handleRequestClick(dept), className: "flex-1 px-5 py-3 text-sm font-bold text-blue-700 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-blue-200 hover:shadow-lg transition-all duration-300", children: _jsxs("div", { className: "flex items-center justify-center space-x-2", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" }) }), _jsx("span", { children: "Request" })] }) }), _jsx("button", { onClick: () => handleEditClick(dept), className: "px-5 py-3 text-sm font-bold text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl hover:from-gray-100 hover:to-gray-200 hover:shadow-lg transition-all duration-300", children: _jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" }) }) })] })] }, dept.id))) }), selectedDepartment && (_jsxs(_Fragment, { children: [_jsx(ViewItemsModal, { isOpen: isViewItemsModalOpen, onClose: handleCloseViewItems, departmentName: selectedDepartment.name, departmentId: selectedDepartment.id, items: modalItems, isLoading: isLoading }), _jsx(RequestItemModal, { isOpen: isRequestModalOpen, onClose: handleCloseRequest, departmentName: selectedDepartment.name, departmentId: selectedDepartment.id, onSuccess: handleRequestSuccess }), _jsx(EditDepartmentModal, { isOpen: isEditModalOpen, onClose: handleCloseEdit, department: selectedDepartment, onSuccess: handleEditSuccess })] }))] }));
};
