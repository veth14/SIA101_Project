import React, { useState } from 'react';
import { calculatePayroll } from '../../../utils/philippineTaxCalculations';

export interface EmployeePayroll {
  id: string;
  employeeId: string;
  name: string;
  position: string;
  department: 'front_desk' | 'housekeeping' | 'food_beverage' | 'management' | 'maintenance' | 'security';
  basicPay: number;
  allowance: number;
  overtime: number;
  overtimeRate: number;
  status: 'paid' | 'pending' | 'delayed';
  payPeriod: string;
}

interface PayrollTableProps {
  employees: EmployeePayroll[];
  onEmployeeSelect: (employee: EmployeePayroll) => void;
  selectedEmployee: EmployeePayroll | null;
}

export const PayrollTable: React.FC<PayrollTableProps> = ({ employees, onEmployeeSelect, selectedEmployee }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter and sort employees (prioritize: pending > delayed > paid)
  const filteredEmployees = employees
    .filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = departmentFilter === 'all' || emp.department === departmentFilter;
      const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
      
      return matchesSearch && matchesDepartment && matchesStatus;
    })
    .sort((a, b) => {
      // Status priority: pending (1) > delayed (2) > paid (3)
      const statusPriority: Record<string, number> = { pending: 1, delayed: 2, paid: 3 };
      return statusPriority[a.status] - statusPriority[b.status];
    });

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, departmentFilter, statusFilter, monthFilter]);

  const getDepartmentName = (department: string) => {
    const names: Record<string, string> = {
      front_desk: 'Front Desk',
      housekeeping: 'Housekeeping',
      food_beverage: 'Food & Beverage',
      management: 'Management',
      maintenance: 'Maintenance',
      security: 'Security'
    };
    return names[department] || department;
  };

  const handleExportToExcel = () => {
    // Create CSV content
    const headers = ['Employee ID', 'Name', 'Position', 'Department', 'Basic Pay', 'Allowance', 'Overtime', 'Gross Pay', 'SSS', 'PhilHealth', 'Pag-IBIG', 'Tax', 'Total Deductions', 'Net Pay', 'Status'];
    
    const rows = filteredEmployees.map(emp => {
      const payroll = calculatePayroll(emp.basicPay, emp.allowance, emp.overtime, emp.overtimeRate);
      return [
        emp.employeeId,
        emp.name,
        emp.position,
        getDepartmentName(emp.department),
        payroll.basicPay,
        payroll.allowance,
        payroll.overtimePay,
        payroll.grossPay,
        payroll.sss,
        payroll.philHealth,
        payroll.pagIBIG,
        payroll.withholdingTax,
        payroll.totalDeductions,
        payroll.netPay,
        emp.status.toUpperCase()
      ];
    });

    // Convert to CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Payroll_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white border shadow-md rounded-xl border-gray-200/70">
      {/* Header with Search and Filters */}
      <div className="p-6 border-b border-gray-200/70 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="flex items-center gap-3 text-2xl font-black text-gray-900">
              <div className="p-2 bg-[#82A33D]/10 rounded-xl">
                <svg className="w-6 h-6 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              Payroll Records
            </h3>
            <p className="flex items-center gap-2 mt-2 text-sm text-gray-600">
              <span className="inline-flex items-center px-2 py-1 bg-[#82A33D]/10 text-[#82A33D] rounded-lg text-xs font-semibold">
                {startIndex + 1}-{Math.min(endIndex, filteredEmployees.length)} of {filteredEmployees.length}
              </span>
              <span className="text-gray-400">•</span>
              <span>Current Period Employees</span>
            </p>
          </div>
          <button
            onClick={handleExportToExcel}
            className="flex items-center gap-2 px-5 py-3 text-sm font-bold text-white transition-all shadow-lg bg-gradient-to-r from-heritage-green to-heritage-neutral rounded-xl hover:from-heritage-green hover:to-heritage-neutral hover:shadow-xl hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export to Excel
          </button>
        </div>

        {/* Search and Filter Row */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Search */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400 group-focus-within:text-[#82A33D] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium placeholder:text-gray-400 hover:border-gray-300"
            />
          </div>

          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium hover:border-gray-300 cursor-pointer"
          >
            <option value="all">All Departments</option>
            <option value="front_desk">Front Desk</option>
            <option value="housekeeping">Housekeeping</option>
            <option value="food_beverage">Food & Beverage</option>
            <option value="management">Management</option>
            <option value="maintenance">Maintenance</option>
            <option value="security">Security</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium hover:border-gray-300 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="delayed">Delayed</option>
            <option value="paid">Paid</option>
          </select>

          {/* Month Filter */}
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium hover:border-gray-300 cursor-pointer"
          >
            <option value="all">All Months</option>
            <option value="2024-10">October 2024</option>
            <option value="2024-09">September 2024</option>
            <option value="2024-08">August 2024</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50">
            <tr>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase">
                Employee ID
              </th>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase">
                Name
              </th>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase">
                Position
              </th>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-right text-gray-700 uppercase">
                Basic Pay
              </th>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-right text-gray-700 uppercase">
                Total Deductions
              </th>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-right text-gray-700 uppercase">
                Net Pay
              </th>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentEmployees.map((employee, index) => {
              const payroll = calculatePayroll(
                employee.basicPay,
                employee.allowance,
                employee.overtime,
                employee.overtimeRate
              );

              return (
                <tr
                  key={employee.id}
                  onClick={() => onEmployeeSelect(employee)}
                  style={{ animationDelay: `${index * 50}ms`, height: '74px' }}
                  className={`group cursor-pointer transition-all duration-300 hover:shadow-sm animate-fade-in ${
                    selectedEmployee?.id === employee.id 
                      ? 'bg-gradient-to-r from-[#82A33D]/10 via-[#82A33D]/5 to-transparent border-l-4 border-l-[#82A33D] shadow-sm' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{employee.employeeId}</div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-bold text-gray-900 group-hover:text-[#82A33D] transition-colors">{employee.name}</div>
                      <div className="text-xs font-medium text-gray-500">{getDepartmentName(employee.department)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-700">{employee.position}</div>
                  </td>
                  <td className="px-6 py-5 text-right whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">₱{payroll.basicPay.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-5 text-right whitespace-nowrap">
                    <div className="inline-flex items-center px-2 py-1 text-sm font-bold text-red-700 rounded-lg bg-red-50">
                      -₱{payroll.totalDeductions.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right whitespace-nowrap">
                    <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#82A33D]/10 text-[#82A33D] text-sm font-black">
                      ₱{payroll.netPay.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center whitespace-nowrap">
                    {employee.status === 'paid' ? (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 shadow-sm">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Paid
                      </span>
                    ) : employee.status === 'delayed' ? (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200 shadow-sm">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        Delayed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200 shadow-sm">
                        <svg className="w-3 h-3 mr-1 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            {/* Fill empty rows to always show 10 rows */}
            {Array.from({ length: Math.max(0, 10 - currentEmployees.length) }).map((_, index) => (
              <tr key={`empty-${index}`} style={{ height: '74px' }} className="border-gray-200 border-dashed bg-gray-50/30">
                <td className="px-6 py-5" colSpan={7}>
                  <div className="flex items-center justify-center text-sm font-medium text-gray-300 opacity-60">
                    <div className="w-2 h-2 mr-2 bg-gray-300 rounded-full opacity-40"></div>
                    Empty slot {index + 1}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredEmployees.length === 0 && (
        <div className="py-12 text-center">
          <div className="mb-4 text-5xl text-gray-400">🔍</div>
          <p className="font-medium text-gray-500">No employees found</p>
          <p className="mt-1 text-sm text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Pagination */}
      {(
        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else {
                    const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                    pageNum = start + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-md transition-colors ${
                        pageNum === currentPage ? 'bg-gradient-to-r from-heritage-green to-heritage-neutral text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
