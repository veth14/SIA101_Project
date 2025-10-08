import React, { useState } from 'react';

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  position: string;
  department: 'front_desk' | 'housekeeping' | 'food_beverage' | 'management' | 'maintenance' | 'security';
  employmentType: 'full_time' | 'part_time' | 'contract';
  baseSalary: number;
  hoursWorked: number;
  overtime: number;
  bonuses: number;
  deductions: {
    tax: number;
    insurance: number;
    other: number;
  };
  netPay: number;
  payPeriod: string;
  status: 'active' | 'inactive' | 'terminated';
  bankAccount?: string;
  joinDate: string;
}

interface PayrollListProps {
  onEmployeeSelect: (employee: Employee) => void;
  selectedEmployee: Employee | null;
}

const PayrollList: React.FC<PayrollListProps> = ({ onEmployeeSelect, selectedEmployee }) => {
  const [filters, setFilters] = useState({
    department: 'all',
    employmentType: 'all',
    status: 'all',
    searchTerm: ''
  });

  // Sample employee payroll data
  const employees: Employee[] = [
    {
      id: 'EMP-001',
      employeeId: 'HTL-2024-001',
      name: 'Sarah Johnson',
      position: 'Front Desk Manager',
      department: 'front_desk',
      employmentType: 'full_time',
      baseSalary: 4500.00,
      hoursWorked: 160,
      overtime: 8,
      bonuses: 300.00,
      deductions: {
        tax: 680.00,
        insurance: 150.00,
        other: 50.00
      },
      netPay: 4138.00,
      payPeriod: '2024-10-01 to 2024-10-31',
      status: 'active',
      bankAccount: '****-****-****-1234',
      joinDate: '2023-01-15'
    },
    {
      id: 'EMP-002',
      employeeId: 'HTL-2024-002',
      name: 'Michael Chen',
      position: 'Head Chef',
      department: 'food_beverage',
      employmentType: 'full_time',
      baseSalary: 5200.00,
      hoursWorked: 170,
      overtime: 15,
      bonuses: 500.00,
      deductions: {
        tax: 862.00,
        insurance: 175.00,
        other: 75.00
      },
      netPay: 4888.00,
      payPeriod: '2024-10-01 to 2024-10-31',
      status: 'active',
      bankAccount: '****-****-****-5678',
      joinDate: '2022-08-20'
    },
    {
      id: 'EMP-003',
      employeeId: 'HTL-2024-003',
      name: 'Maria Rodriguez',
      position: 'Housekeeping Supervisor',
      department: 'housekeeping',
      employmentType: 'full_time',
      baseSalary: 3200.00,
      hoursWorked: 160,
      overtime: 5,
      bonuses: 150.00,
      deductions: {
        tax: 420.00,
        insurance: 120.00,
        other: 30.00
      },
      netPay: 2905.00,
      payPeriod: '2024-10-01 to 2024-10-31',
      status: 'active',
      bankAccount: '****-****-****-9012',
      joinDate: '2023-06-10'
    },
    {
      id: 'EMP-004',
      employeeId: 'HTL-2024-004',
      name: 'David Wilson',
      position: 'Maintenance Technician',
      department: 'maintenance',
      employmentType: 'full_time',
      baseSalary: 3800.00,
      hoursWorked: 160,
      overtime: 12,
      bonuses: 200.00,
      deductions: {
        tax: 560.00,
        insurance: 140.00,
        other: 40.00
      },
      netPay: 3532.00,
      payPeriod: '2024-10-01 to 2024-10-31',
      status: 'active',
      bankAccount: '****-****-****-3456',
      joinDate: '2023-03-22'
    },
    {
      id: 'EMP-005',
      employeeId: 'HTL-2024-005',
      name: 'Lisa Thompson',
      position: 'Security Guard',
      department: 'security',
      employmentType: 'part_time',
      baseSalary: 2400.00,
      hoursWorked: 120,
      overtime: 0,
      bonuses: 0,
      deductions: {
        tax: 240.00,
        insurance: 80.00,
        other: 20.00
      },
      netPay: 2060.00,
      payPeriod: '2024-10-01 to 2024-10-31',
      status: 'active',
      bankAccount: '****-****-****-7890',
      joinDate: '2024-02-14'
    }
  ];

  const getDepartmentIcon = (department: string) => {
    switch (department) {
      case 'front_desk':
        return (
          <div className="p-2 bg-blue-50 rounded-lg">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        );
      case 'housekeeping':
        return (
          <div className="p-2 bg-green-50 rounded-lg">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            </svg>
          </div>
        );
      case 'food_beverage':
        return (
          <div className="p-2 bg-orange-50 rounded-lg">
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </div>
        );
      case 'management':
        return (
          <div className="p-2 bg-purple-50 rounded-lg">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0h2a2 2 0 012 2v6.5" />
            </svg>
          </div>
        );
      case 'maintenance':
        return (
          <div className="p-2 bg-yellow-50 rounded-lg">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        );
      case 'security':
        return (
          <div className="p-2 bg-red-50 rounded-lg">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-3 py-1 text-xs font-bold bg-green-100 text-green-800 rounded-full">Active</span>;
      case 'inactive':
        return <span className="px-3 py-1 text-xs font-bold bg-yellow-100 text-yellow-800 rounded-full">Inactive</span>;
      case 'terminated':
        return <span className="px-3 py-1 text-xs font-bold bg-red-100 text-red-800 rounded-full">Terminated</span>;
      default:
        return null;
    }
  };

  const getEmploymentTypeBadge = (type: string) => {
    switch (type) {
      case 'full_time':
        return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Full-time</span>;
      case 'part_time':
        return <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">Part-time</span>;
      case 'contract':
        return <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">Contract</span>;
      default:
        return null;
    }
  };

  const getDepartmentName = (department: string) => {
    switch (department) {
      case 'front_desk':
        return 'Front Desk';
      case 'housekeeping':
        return 'Housekeeping';
      case 'food_beverage':
        return 'Food & Beverage';
      case 'management':
        return 'Management';
      case 'maintenance':
        return 'Maintenance';
      case 'security':
        return 'Security';
      default:
        return 'Unknown';
    }
  };

  const totalPayroll = employees.reduce((sum, emp) => sum + emp.netPay, 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      {/* Header with Filters */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Employee Payroll</h3>
            <p className="text-sm text-gray-600">{employees.length} employees • Total: ${totalPayroll.toLocaleString()}</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-medium text-white bg-[#82A33D] hover:bg-[#6d8735] rounded-lg transition-colors">
              Process Payroll
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Export Report
            </button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search employees..."
            value={filters.searchTerm}
            onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#82A33D] focus:border-transparent text-sm"
          />
          <select
            value={filters.department}
            onChange={(e) => setFilters({...filters, department: e.target.value})}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#82A33D] focus:border-transparent text-sm"
          >
            <option value="all">All Departments</option>
            <option value="front_desk">Front Desk</option>
            <option value="housekeeping">Housekeeping</option>
            <option value="food_beverage">Food & Beverage</option>
            <option value="management">Management</option>
            <option value="maintenance">Maintenance</option>
            <option value="security">Security</option>
          </select>
          <select
            value={filters.employmentType}
            onChange={(e) => setFilters({...filters, employmentType: e.target.value})}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#82A33D] focus:border-transparent text-sm"
          >
            <option value="all">All Types</option>
            <option value="full_time">Full-time</option>
            <option value="part_time">Part-time</option>
            <option value="contract">Contract</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#82A33D] focus:border-transparent text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>
      </div>

      {/* Employee List */}
      <div className="max-h-[600px] overflow-y-auto">
        {employees.map((employee) => (
          <div
            key={employee.id}
            onClick={() => onEmployeeSelect(employee)}
            className={`p-4 border-l-4 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedEmployee?.id === employee.id ? 'bg-[#82A33D]/5 border-l-[#82A33D]' : 'border-l-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getDepartmentIcon(employee.department)}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h4 className="font-semibold text-gray-900">{employee.name}</h4>
                    {getStatusBadge(employee.status)}
                    {getEmploymentTypeBadge(employee.employmentType)}
                  </div>
                  <p className="text-gray-700 font-medium mb-1">{employee.position}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{getDepartmentName(employee.department)}</span>
                    <span>ID: {employee.employeeId}</span>
                    <span>{employee.hoursWorked}h + {employee.overtime}h OT</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-900">
                  ${employee.netPay.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Net Pay</p>
                <p className="text-xs text-gray-400">{employee.payPeriod}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="p-6 border-t border-gray-100 bg-gray-50/50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Total Employees</p>
            <p className="text-lg font-bold text-gray-900">{employees.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Active Staff</p>
            <p className="text-lg font-bold text-green-600">
              {employees.filter(e => e.status === 'active').length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Payroll</p>
            <p className="text-lg font-bold text-[#82A33D]">
              ${totalPayroll.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Avg. Salary</p>
            <p className="text-lg font-bold text-blue-600">
              ${Math.round(totalPayroll / employees.length).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollList;