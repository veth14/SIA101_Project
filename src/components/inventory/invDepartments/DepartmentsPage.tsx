import React, { useState, useEffect } from "react";
import DepartmentsHeader from "./DepartmentsHeader";
import { DepartmentBackground } from "./DepartmentBackground";
import { UltraPremiumDepartmentCards } from "./DepartmentCards";
import { UltraPremiumRequestTable } from "./DepartmentRequestTracking";
import useGetInvDepartment from "../../../api/getInvDepartment";
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

  // Sample departments data matching the image layout

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(amount);
  };
  const [departments, setDepartments] = useState<Department[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<
    MaintenanceRequest[]
  >([]);

  const { getInvDepartment, loadingForGetInvDepartment } =
    useGetInvDepartment();

  useEffect(() => {
    const useGetInvDepartmentFunc = async () => {
      const response = await getInvDepartment();
      console.log(response);
      if (!response.data) {
        alert(response.message);
        return;
      }

      setDepartments(response.data.departments);
      setMaintenanceRequests(response.data.maintenanceRequests);
    };
    useGetInvDepartmentFunc();
  }, []);
  return (
    <div className="min-h-screen bg-[#F9F6EE]">
      {/* Background */}
      <DepartmentBackground />

      {/* Main Content Container */}
      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">
        {/* Header */}
        <DepartmentsHeader />

        {/* Ultra Premium Department Cards Grid */}
        <UltraPremiumDepartmentCards
          departments={departments}
          formatCurrency={formatCurrency}
          setDepartments={setDepartments}
        />

        {/* Ultra Premium Request Tracking Table */}
        <UltraPremiumRequestTable
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={setSelectedDepartment}
          requests={maintenanceRequests}
          setRequests={setMaintenanceRequests}
        />
      </div>
    </div>
  );
};

export default DepartmentsPage;
