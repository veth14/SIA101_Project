
import React, { useState } from 'react';
import { DepartmentBackground } from './DepartmentBackground';
import { UltraPremiumDepartmentCards } from './DepartmentCards';
import { UltraPremiumRequestTable } from './DepartmentRequestTracking';

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
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
}

const DepartmentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');

  // Sample departments data matching the image layout
  const departments: Department[] = [
    {
      id: 'DEPT001',
      name: 'Housekeeping',
      manager: 'Maria Santos',
      itemsAssigned: 248,
      totalUsage: 35,
      monthlyConsumption: 45680
    },
    {
      id: 'DEPT002',
      name: 'Laundry Services',
      manager: 'Lisa Fernandez',
      itemsAssigned: 67,
      totalUsage: 6,
      monthlyConsumption: 18560
    },
    {
      id: 'DEPT003',
      name: 'Security',
      manager: 'Roberto Garcia',
      itemsAssigned: 45,
      totalUsage: 5,
      monthlyConsumption: 8970
    },
    {
      id: 'DEPT004',
      name: 'Maintenance',
      manager: 'Juan Dela Cruz',
      itemsAssigned: 156,
      totalUsage: 18,
      monthlyConsumption: 28450
    },
    {
      id: 'DEPT005',
      name: 'Food & Beverages',
      manager: 'Carlos Rivera',
      itemsAssigned: 412,
      totalUsage: 28,
      monthlyConsumption: 76920
    },
    {
      id: 'DEPT006',
      name: 'Front Desk',
      manager: 'Ana Cruz',
      itemsAssigned: 89,
      totalUsage: 8,
      monthlyConsumption: 12340
    }
  ];

  // Sample maintenance requests
  const maintenanceRequests: MaintenanceRequest[] = [
    {
      id: '#00000',
      department: 'Housekeeping',
      itemService: 'Floor Cleaning Machine Repair',
      requestedBy: 'Maria Santos',
      date: '2025-09-10',
      status: 'Pending'
    },
    {
      id: '#00001',
      department: 'Maintenance',
      itemService: 'AC Unit Service - Room 305',
      requestedBy: 'Juan Dela Cruz',
      date: '2025-09-11',
      status: 'Approved'
    },
    {
      id: '#00002',
      department: 'F&B',
      itemService: 'Kitchen Equipment Check',
      requestedBy: 'Carlos Rivera',
      date: '2025-09-12',
      status: 'Rejected'
    },
    {
      id: '#00003',
      department: 'Housekeeping',
      itemService: 'Linen Replacement - 5th Floor',
      requestedBy: 'Maria Santos',
      date: '2025-09-13',
      status: 'Completed'
    },
    {
      id: '#00004',
      department: 'Maintenance',
      itemService: 'Elevator Maintenance Check',
      requestedBy: 'Juan Dela Cruz',
      date: '2025-09-13',
      status: 'Completed'
    },
    {
      id: '#00005',
      department: 'Security',
      itemService: 'CCTV Camera Installation - Lobby',
      requestedBy: 'Roberto Garcia',
      date: '2025-09-14',
      status: 'Pending'
    },
    {
      id: '#00006',
      department: 'Front Desk',
      itemService: 'Computer System Upgrade',
      requestedBy: 'Ana Reyes',
      date: '2025-09-14',
      status: 'Approved'
    },
    {
      id: '#00007',
      department: 'Housekeeping',
      itemService: 'Vacuum Cleaner Replacement',
      requestedBy: 'Lisa Cruz',
      date: '2025-09-15',
      status: 'Pending'
    },
    {
      id: '#00008',
      department: 'F&B',
      itemService: 'Refrigerator Repair - Kitchen',
      requestedBy: 'Miguel Torres',
      date: '2025-09-15',
      status: 'Approved'
    },
    {
      id: '#00009',
      department: 'Maintenance',
      itemService: 'Plumbing Fix - Room 201',
      requestedBy: 'Pedro Morales',
      date: '2025-09-16',
      status: 'Completed'
    },
    {
      id: '#00010',
      department: 'Security',
      itemService: 'Access Card System Update',
      requestedBy: 'Roberto Garcia',
      date: '2025-09-16',
      status: 'Pending'
    },
    {
      id: '#00011',
      department: 'Housekeeping',
      itemService: 'Bed Sheet Inventory Restock',
      requestedBy: 'Maria Santos',
      date: '2025-09-17',
      status: 'Approved'
    },
    {
      id: '#00012',
      department: 'F&B',
      itemService: 'Coffee Machine Maintenance',
      requestedBy: 'Carlos Rivera',
      date: '2025-09-17',
      status: 'Completed'
    },
    {
      id: '#00013',
      department: 'Front Desk',
      itemService: 'Phone System Repair',
      requestedBy: 'Ana Reyes',
      date: '2025-09-18',
      status: 'Pending'
    },
    {
      id: '#00014',
      department: 'Maintenance',
      itemService: 'Generator Testing and Service',
      requestedBy: 'Juan Dela Cruz',
      date: '2025-09-18',
      status: 'Approved'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#F9F6EE]">
      {/* Background */}
      <DepartmentBackground />

      {/* Main Content Container */}
      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">

        {/* Ultra Premium Department Cards Grid */}
        <UltraPremiumDepartmentCards departments={departments} formatCurrency={formatCurrency} />

        {/* Ultra Premium Request Tracking Table */}
        <UltraPremiumRequestTable
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={setSelectedDepartment}
          requests={maintenanceRequests}
        />
      </div>
    </div>
  );
};

export default DepartmentsPage;
