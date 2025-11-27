import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import useGetInvDepartment from "../../api/getInvDepartment";
export default function InvDepartments() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
    const [departments, setDepartments] = useState([]);
    const [maintenanceRequests, setMaintenanceRequests] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const { getInvDepartment, loadingForGetInvDepartment } = useGetInvDepartment();
    const fetchData = async () => {
        const response = await getInvDepartment();
        if (response.success) {
            setDepartments(response.data.departments || []);
            setMaintenanceRequests(response.data.maintenanceRequests || []);
        }
        else {
            console.error(response.message);
        }
    };
    useEffect(() => {
        fetchData();
    }, [refreshKey]);
    const handleRefresh = () => {
        setRefreshKey((prev) => prev + 1);
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 p-8", children: _jsx("div", { className: "max-w-[1600px] mx-auto space-y-8", children: _jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsx("h1", { className: "text-4xl font-black text-gray-900 mb-2", children: "Department Management" }), _jsx("p", { className: "text-gray-600 font-medium", children: "Monitor department performance and maintenance requests" })] }) }) }) }));
}
