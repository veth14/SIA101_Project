import { useState, useEffect } from "react";
// import { UltraPremiumDepartmentGrid } from "../../components/inventory/invDepartments/DepartmentGrid";
import { UltraPremiumRequestTable } from "../../components/inventory/invDepartments/DepartmentRequestTracking";
import useGetInvDepartment from "../../api/getInvDepartment";

export default function InvDepartments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  const [departments, setDepartments] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const { getInvDepartment, loadingForGetInvDepartment } =
    useGetInvDepartment();

  const fetchData = async () => {
    const response = await getInvDepartment();
    if (response.success) {
      setDepartments(response.data.departments || []);
      setMaintenanceRequests(response.data.maintenanceRequests || []);
    } else {
      console.error(response.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 p-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">
              Department Management
            </h1>
            <p className="text-gray-600 font-medium">
              Monitor department performance and maintenance requests
            </p>
          </div>
        </div>

        {/* Department Grid */}
        {/* <UltraPremiumDepartmentGrid departments={departments} /> */}

        {/* Request Tracking Table */}
        {/* <UltraPremiumRequestTable
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={setSelectedDepartment}
          requests={maintenanceRequests}
          onSuccess={handleRefresh}
        /> */}
      </div>
    </div>
  );
}
