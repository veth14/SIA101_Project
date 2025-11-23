import React, { useState, useEffect } from "react";
import { DepartmentBackground } from "./DepartmentBackground";
import { UltraPremiumDepartmentCards } from "./DepartmentCards";
import { UltraPremiumRequestTable } from "./DepartmentRequestTracking";
import useGetInvDepartment from "@/api/getInvDepartment";
interface Department {
  id: string;
  name: string;
  manager: string;
  itemsAssigned: number;
  totalUsage: number;
  monthlyConsumption: number;
}

interface MaintenanceRequest {
  id: string;
  department: string;
  itemService: string;
  requestedBy: string;
  date: string;
  status: "Pending" | "Approved" | "Rejected" | "Completed";
}

const DepartmentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<
    MaintenanceRequest[]
  >([]);

  const { getInvDepartment, loadingForGetInvDepartment } =
    useGetInvDepartment();

  const formatCurrency = (amount: number) => {
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

  return (
    <div className="min-h-screen bg-[#F9F6EE]">
      <DepartmentBackground />

      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">

        {loadingForGetInvDepartment ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-heritage-green"></div>
            <span className="ml-3 text-gray-600">Loading departments...</span>
          </div>
        ) : (
          <>
            <UltraPremiumDepartmentCards
              departments={departments}
              formatCurrency={formatCurrency}
              setDepartments={setDepartments}
              onRequestSuccess={handleRequestSuccess}
            />

            <UltraPremiumRequestTable
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedDepartment={selectedDepartment}
              onDepartmentChange={setSelectedDepartment}
              requests={maintenanceRequests}
              onSuccess={fetchDepartments}
              setRequests={setMaintenanceRequests}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default DepartmentsPage;
