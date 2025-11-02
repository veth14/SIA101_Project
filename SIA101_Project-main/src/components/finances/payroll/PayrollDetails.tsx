import React from 'react';
import type { Employee } from './PayrollList';

interface PayrollDetailsProps {
  employee: Employee | null;
  onClose: () => void;
}

const PayrollDetails: React.FC<PayrollDetailsProps> = ({ employee, onClose }) => {
  if (!employee) return null;

  const totalDeductions = employee.deductions.tax + employee.deductions.insurance + employee.deductions.other;
  const grossPay = employee.baseSalary + employee.bonuses + (employee.overtime * 30); // Assuming $30/hour overtime

  const getDepartmentIcon = (department: string) => {
    switch (department) {
      case 'front_desk':
        return '🏨';
      case 'housekeeping':
        return '🧹';
      case 'food_beverage':
        return '🍽️';
      case 'management':
        return '👔';
      case 'maintenance':
        return '🔧';
      case 'security':
        return '🛡️';
      default:
        return '👤';
    }
  };

  const getDepartmentName = (department: string) => {
    switch (department) {
      case 'front_desk':
        return 'Front Desk Operations';
      case 'housekeeping':
        return 'Housekeeping Services';
      case 'food_beverage':
        return 'Food & Beverage';
      case 'management':
        return 'Management';
      case 'maintenance':
        return 'Maintenance & Engineering';
      case 'security':
        return 'Security Services';
      default:
        return 'Unknown Department';
    }
  };

  const getEmploymentTypeInfo = (type: string) => {
    switch (type) {
      case 'full_time':
        return { name: 'Full-time Employee', color: 'text-blue-600 bg-blue-50' };
      case 'part_time':
        return { name: 'Part-time Employee', color: 'text-orange-600 bg-orange-50' };
      case 'contract':
        return { name: 'Contract Worker', color: 'text-purple-600 bg-purple-50' };
      default:
        return { name: 'Unknown', color: 'text-gray-600 bg-gray-50' };
    }
  };

  const handleProcessPayment = () => {
    alert('Process payment functionality would be implemented here');
  };

  const handleGeneratePayslip = () => {
    alert('Generate payslip functionality would be implemented here');
  };

  const handleEditEmployee = () => {
    alert('Edit employee functionality would be implemented here');
  };

  const employmentInfo = getEmploymentTypeInfo(employee.employmentType);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#82A33D] to-[#6d8735]">
          <div className="text-white">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{getDepartmentIcon(employee.department)}</span>
              <div>
                <h2 className="text-2xl font-bold">{employee.name}</h2>
                <p className="text-green-100">{employee.position}</p>
              </div>
            </div>
            <p className="text-green-200 text-sm">Employee ID: {employee.employeeId}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-green-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Employee Status Banner */}
          <div className={`p-4 rounded-xl mb-6 ${employmentInfo.color} border`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">
                  {employee.status === 'active' ? '✅' : employee.status === 'inactive' ? '⏸️' : '❌'}
                </div>
                <div>
                  <h3 className="text-lg font-semibold capitalize">{employee.status} {employmentInfo.name}</h3>
                  <p className="text-sm">{getDepartmentName(employee.department)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">${employee.netPay.toLocaleString()}</p>
                <p className="text-sm">Net Pay</p>
              </div>
            </div>
          </div>

          {/* Employee Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Personal Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h4>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900">{employee.name}</p>
                  <p className="text-sm text-gray-600">Full Name</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{employee.employeeId}</p>
                  <p className="text-sm text-gray-600">Employee ID</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{employee.position}</p>
                  <p className="text-sm text-gray-600">Position</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{getDepartmentName(employee.department)}</p>
                  <p className="text-sm text-gray-600">Department</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{employee.joinDate}</p>
                  <p className="text-sm text-gray-600">Join Date</p>
                </div>
                {employee.bankAccount && (
                  <div>
                    <p className="font-medium text-gray-900">{employee.bankAccount}</p>
                    <p className="text-sm text-gray-600">Bank Account</p>
                  </div>
                )}
              </div>
            </div>

            {/* Employment Details */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Employment Details</h4>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900 capitalize">{employee.employmentType.replace('_', '-')}</p>
                  <p className="text-sm text-gray-600">Employment Type</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 capitalize">{employee.status}</p>
                  <p className="text-sm text-gray-600">Status</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">${employee.baseSalary.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Base Salary</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{employee.hoursWorked} hours</p>
                  <p className="text-sm text-gray-600">Regular Hours</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{employee.overtime} hours</p>
                  <p className="text-sm text-gray-600">Overtime Hours</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{employee.payPeriod}</p>
                  <p className="text-sm text-gray-600">Pay Period</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payroll Breakdown */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-6">Payroll Breakdown</h4>
            
            {/* Earnings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-lg p-4 border">
                <h5 className="font-semibold text-gray-900 mb-3">Earnings</h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Salary</span>
                    <span className="font-medium">${employee.baseSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Overtime ({employee.overtime}h)</span>
                    <span className="font-medium">${(employee.overtime * 30).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bonuses</span>
                    <span className="font-medium">${employee.bonuses.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Gross Pay</span>
                    <span>${grossPay.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border">
                <h5 className="font-semibold text-gray-900 mb-3">Deductions</h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Income Tax</span>
                    <span className="font-medium text-red-600">-${employee.deductions.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Insurance</span>
                    <span className="font-medium text-red-600">-${employee.deductions.insurance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Other</span>
                    <span className="font-medium text-red-600">-${employee.deductions.other.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2 text-red-600">
                    <span>Total Deductions</span>
                    <span>-${totalDeductions.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#82A33D] to-[#6d8735] rounded-lg p-4 text-white">
                <h5 className="font-semibold mb-3">Net Payment</h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-green-100">
                    <span>Gross Pay</span>
                    <span>${grossPay.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-100">
                    <span>Total Deductions</span>
                    <span>-${totalDeductions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-xl border-t border-white/20 pt-2">
                    <span>Net Pay</span>
                    <span>${employee.netPay.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Timeline</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-[#82A33D] rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Payroll Calculated</p>
                  <p className="text-sm text-gray-600">System calculated salary for pay period {employee.payPeriod}</p>
                </div>
                <div className="text-sm text-gray-500">2 days ago</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Pending Approval</p>
                  <p className="text-sm text-gray-600">Awaiting manager approval for payment processing</p>
                </div>
                <div className="text-sm text-gray-500">Current</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleEditEmployee}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Employee
            </button>
            <button
              onClick={handleGeneratePayslip}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Generate Payslip
            </button>
            <button
              onClick={handleProcessPayment}
              className="px-4 py-2 text-sm font-medium text-white bg-[#82A33D] hover:bg-[#6d8735] rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Process Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollDetails;