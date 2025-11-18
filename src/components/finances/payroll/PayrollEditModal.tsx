import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { EmployeePayroll } from './PayrollTable';
import { calculatePayroll } from '../../../utils/philippineTaxCalculations';

export type PayrollFormData = {
  basicPay: number;
  allowance: number;
  overtime: number;
  overtimeRate: number;
};

const getDepartmentName = (department: EmployeePayroll['department']) => {
  const names: Record<EmployeePayroll['department'], string> = {
    front_desk: 'Front Desk',
    housekeeping: 'Housekeeping',
    food_beverage: 'Food & Beverage',
    management: 'Management',
    maintenance: 'Maintenance',
    security: 'Security',
  };
  return names[department] ?? department;
};

interface PayrollEditModalProps {
  employee: EmployeePayroll;
  formData: PayrollFormData;
  onFieldChange: (field: keyof PayrollFormData, value: number) => void;
  onClose: () => void;
  onSave: () => void;
}

const PayrollEditModal: React.FC<PayrollEditModalProps> = ({
  employee,
  formData,
  onFieldChange,
  onClose,
  onSave,
}) => {
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  const payroll = calculatePayroll(
    formData.basicPay,
    formData.allowance,
    formData.overtime,
    formData.overtimeRate
  );

  const statusStyles = (() => {
    switch (employee.status) {
      case 'paid':
        return {
          banner: 'bg-emerald-50 border border-emerald-200',
          text: 'text-emerald-700',
          accent: 'text-emerald-600',
          icon: '✅',
          title: 'Payroll marked as Paid',
          message: 'This payroll has been processed for this period.',
        };
      case 'delayed':
        return {
          banner: 'bg-red-50 border border-red-200',
          text: 'text-red-700',
          accent: 'text-red-600',
          icon: '⚠️',
          title: 'Payroll is Delayed',
          message: 'Review and update this payroll before releasing payment.',
        };
      case 'pending':
      default:
        return {
          banner: 'bg-amber-50 border border-amber-200',
          text: 'text-amber-700',
          accent: 'text-amber-600',
          icon: '⏳',
          title: 'Payroll is Pending',
          message: 'Adjust the values below before final approval.',
        };
    }
  })();

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center" role="dialog" aria-modal="true">
      {/* Overlay */}
      <div
        className="fixed inset-0 transition-opacity duration-200 bg-black/45 backdrop-blur-lg"
        onClick={onClose}
        aria-label="Close overlay"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-white/95 shadow-2xl ring-1 ring-black/5">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-5 bg-white border-b border-gray-100 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 text-white rounded-full shadow-sm bg-emerald-600">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M9 2h6l4 4v12a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2z" />
                  <path d="M9 11h6M9 15h4" stroke="rgba(255,255,255,0.9)" strokeWidth="1" fill="none" />
                </svg>
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-emerald-700 md:text-2xl">Edit Payroll</h2>
                <p className="mt-1 text-sm text-gray-500">
                  {employee.name} • {employee.employeeId}
                </p>
              </div>
            </div>
            <div aria-hidden />
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute flex items-center justify-center rounded-md top-4 right-4 w-9 h-9 text-emerald-700 bg-emerald-50 ring-1 ring-emerald-100"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)] space-y-6">
          <div className={`p-4 rounded-xl ${statusStyles.banner} ring-1 ring-black/5`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`text-2xl ${statusStyles.accent}`}>{statusStyles.icon}</div>
                <div>
                  <h3 className={`text-base font-semibold ${statusStyles.text}`}>{statusStyles.title}</h3>
                  {statusStyles.message && (
                    <p className={`text-sm ${statusStyles.accent}`}>{statusStyles.message}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-gray-500">Current Net Pay</p>
                <p className="text-2xl font-bold text-gray-900">₱{payroll.netPay.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="p-5 bg-white rounded-2xl ring-1 ring-black/5">
              <h4 className="mb-3 text-lg font-semibold text-gray-900">Employee Information</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p><span className="font-medium text-gray-600">Name:</span> {employee.name}</p>
                <p><span className="font-medium text-gray-600">Employee ID:</span> {employee.employeeId}</p>
                <p><span className="font-medium text-gray-600">Position:</span> {employee.position}</p>
                <p><span className="font-medium text-gray-600">Department:</span> {getDepartmentName(employee.department)}</p>
              </div>
            </div>
            <div className="p-5 bg-white rounded-2xl ring-1 ring-black/5">
              <h4 className="mb-3 text-lg font-semibold text-gray-900">Payroll Details</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p><span className="font-medium text-gray-600">Pay Period:</span> {employee.payPeriod}</p>
                <p>
                  <span className="font-medium text-gray-600">Status:</span>{' '}
                  <span className="capitalize">{employee.status}</span>
                </p>
                <p><span className="font-medium text-gray-600">Basic Pay (current):</span> ₱{formData.basicPay.toLocaleString()}</p>
                <p><span className="font-medium text-gray-600">Allowance (current):</span> ₱{formData.allowance.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Editable fields */}
            <div className="p-5 bg-white rounded-2xl ring-1 ring-black/5">
              <h4 className="mb-3 text-lg font-semibold text-gray-900">Adjust Payroll Values</h4>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Basic Pay</label>
                  <input
                    type="number"
                    value={formData.basicPay}
                    onChange={(e) => onFieldChange('basicPay', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm font-semibold text-right border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/50 focus:border-[#82A33D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Allowance</label>
                  <input
                    type="number"
                    value={formData.allowance}
                    onChange={(e) => onFieldChange('allowance', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm font-semibold text-right border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/50 focus:border-[#82A33D]"
                  />
                </div>

                <div className="grid items-end grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Overtime Hours</label>
                    <input
                      type="number"
                      value={formData.overtime}
                      onChange={(e) => onFieldChange('overtime', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-sm font-semibold text-right border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/50 focus:border-[#82A33D]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Overtime Rate</label>
                    <input
                      type="number"
                      value={formData.overtimeRate}
                      onChange={(e) => onFieldChange('overtimeRate', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-sm font-semibold text-right border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/50 focus:border-[#82A33D]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Live payroll preview */}
            <div className="p-5 bg-white rounded-2xl ring-1 ring-black/5">
              <h4 className="mb-3 text-lg font-semibold text-gray-900">Updated Payroll Breakdown</h4>
              <div className="mb-4 text-sm text-gray-600">
                <p>
                  You are editing the payroll for <span className="font-semibold">{employee.name}</span> in{' '}
                  <span className="font-semibold">{getDepartmentName(employee.department)}</span> for the period{' '}
                  <span className="font-semibold">{employee.payPeriod}</span>.
                </p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Basic Pay</span>
                  <span className="font-semibold text-gray-900">₱{payroll.basicPay.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Allowance</span>
                  <span className="font-semibold text-gray-900">₱{payroll.allowance.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Overtime Pay</span>
                  <span className="font-semibold text-gray-900">₱{payroll.overtimePay.toLocaleString()}</span>
                </div>
                <div className="pt-2 mt-2 border-t border-gray-200" />
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Gross Pay</span>
                  <span className="font-semibold text-gray-900">₱{payroll.grossPay.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Deductions</span>
                  <span className="font-semibold text-red-700">-₱{payroll.totalDeductions.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Net Pay</span>
                  <span className="px-3 py-1 text-sm font-extrabold text-[#82A33D] bg-[#82A33D]/10 rounded-lg">
                    ₱{payroll.netPay.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 text-xs text-gray-500 bg-white rounded-2xl ring-1 ring-black/5">
            Changes made here will update this employee's payroll breakdown once you click <span className="font-semibold">Save Changes</span>.
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-lg shadow-md bg-gradient-to-r from-[#82A33D] to-emerald-600 hover:from-[#6d8735] hover:to-emerald-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save Changes
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PayrollEditModal;
