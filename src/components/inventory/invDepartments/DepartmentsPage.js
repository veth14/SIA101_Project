import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { DepartmentBackground } from "./DepartmentBackground";
import { UltraPremiumDepartmentCards } from "./DepartmentCards";
import { UltraPremiumRequestTable } from "./DepartmentRequestTracking";
import useGetInvDepartment from "@/api/getInvDepartment";
const DepartmentsPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
    const [departments, setDepartments] = useState([]);
    const [maintenanceRequests, setMaintenanceRequests] = useState([]);
    const { getInvDepartment, loadingForGetInvDepartment } = useGetInvDepartment();
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 0,
        }).format(amount);
    };
    useEffect(() => {
        fetchDepartments();
    }, []);
    const fetchDepartments = async () => {
        const response = await getInvDepartment();
        if (response.success && response.data) {
            setDepartments(response.data.departments || []);
            setMaintenanceRequests(response.data.maintenanceRequests || []);
        }
    };
    const handleRequestSuccess = () => {
        // Refresh both departments and maintenance requests
        fetchDepartments();
    };
    return (_jsxs("div", { className: "min-h-screen bg-[#F9F6EE]", children: [_jsx(DepartmentBackground, {}), _jsx("div", { className: "relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full", children: loadingForGetInvDepartment ? (_jsxs("div", { className: "flex items-center justify-center py-12", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-heritage-green" }), _jsx("span", { className: "ml-3 text-gray-600", children: "Loading departments..." })] })) : (_jsxs(_Fragment, { children: [_jsx(UltraPremiumDepartmentCards, { departments: departments, formatCurrency: formatCurrency, setDepartments: setDepartments, onRequestSuccess: handleRequestSuccess }), _jsx(UltraPremiumRequestTable, { searchTerm: searchTerm, onSearchChange: setSearchTerm, selectedDepartment: selectedDepartment, onDepartmentChange: setSelectedDepartment, requests: maintenanceRequests, onSuccess: fetchDepartments, setRequests: setMaintenanceRequests })] })) })] }));
};
export default DepartmentsPage;
