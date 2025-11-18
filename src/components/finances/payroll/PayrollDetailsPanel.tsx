import React, { useState, useEffect } from 'react';
import { calculatePayroll, PayrollBreakdown } from '../../../utils/philippineTaxCalculations';
import jsPDF from 'jspdf';
import type { EmployeePayroll } from './PayrollTable';
import PayrollEditModal, { PayrollFormData } from './PayrollEditModal';

interface PayrollDetailsPanelProps {
  employee: EmployeePayroll | null;
  onSavePayroll?: (employee: EmployeePayroll, payroll: PayrollBreakdown) => void;
  onMarkAsPaid?: (employeeId: string) => void;
}

const PayrollDetailsPanel: React.FC<PayrollDetailsPanelProps> = ({ 
  employee, 
  onSavePayroll,
  onMarkAsPaid 
}) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<PayrollFormData>({
    basicPay: 0,
    allowance: 0,
    overtime: 0,
    overtimeRate: 0
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        basicPay: employee.basicPay,
        allowance: employee.allowance,
        overtime: employee.overtime,
        overtimeRate: employee.overtimeRate
      });
      setEditMode(false);
    }
  }, [employee]);

  if (!employee) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-200/70 h-full flex flex-col">
        <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-[#82A33D]/10 rounded-xl">
                  <svg className="w-6 h-6 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                Payroll Details
              </h3>
              <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-1 bg-[#82A33D]/10 text-[#82A33D] rounded-lg text-xs font-semibold">
                  Employee Information
                </span>
                <span className="text-gray-400">•</span>
                <span>Detailed Breakdown</span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center flex-1 p-12">
          <div className="text-center max-w-sm">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Employee Selected</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Select an employee from the payroll table to view their detailed payroll breakdown, earnings, and deductions.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
              <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse"></div>
              <span>Ready to display payroll details</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const payroll = calculatePayroll(
    formData.basicPay,
    formData.allowance,
    formData.overtime,
    formData.overtimeRate
  );

  const handleSave = () => {
    const updatedEmployee = { ...employee, ...formData };
    onSavePayroll?.(updatedEmployee, payroll);
    setEditMode(false);
  };

  const handleGeneratePayslip = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(130, 163, 61); // Heritage green
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('BALAY GINHAWA HOTEL', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Official Payslip', 105, 30, { align: 'center' });
    
    // Employee Information
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('EMPLOYEE INFORMATION', 20, 55);
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Employee ID: ${employee.employeeId}`, 20, 65);
    doc.text(`Name: ${employee.name}`, 20, 72);
    doc.text(`Position: ${employee.position}`, 20, 79);
    doc.text(`Pay Period: ${employee.payPeriod}`, 20, 86);
    
    // Earnings Section
    doc.setFont('helvetica', 'bold');
    doc.text('EARNINGS', 20, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('Basic Pay', 20, 110);
    doc.text(`₱${payroll.basicPay.toLocaleString()}`, 150, 110, { align: 'right' });
    doc.text('Allowance', 20, 117);
    doc.text(`₱${payroll.allowance.toLocaleString()}`, 150, 117, { align: 'right' });
    doc.text('Overtime Pay', 20, 124);
    doc.text(`₱${payroll.overtimePay.toLocaleString()}`, 150, 124, { align: 'right' });
    
    doc.line(20, 128, 190, 128);
    doc.setFont('helvetica', 'bold');
    doc.text('GROSS PAY', 20, 135);
    doc.text(`₱${payroll.grossPay.toLocaleString()}`, 150, 135, { align: 'right' });
    
    // Deductions Section
    doc.setFont('helvetica', 'bold');
    doc.text('DEDUCTIONS', 20, 150);
    doc.setFont('helvetica', 'normal');
    doc.text('SSS Contribution', 20, 160);
    doc.text(`₱${payroll.sss.toLocaleString()}`, 150, 160, { align: 'right' });
    doc.text('PhilHealth Contribution', 20, 167);
    doc.text(`₱${payroll.philHealth.toLocaleString()}`, 150, 167, { align: 'right' });
    doc.text('Pag-IBIG Contribution', 20, 174);
    doc.text(`₱${payroll.pagIBIG.toLocaleString()}`, 150, 174, { align: 'right' });
    doc.text('Withholding Tax', 20, 181);
    doc.text(`₱${payroll.withholdingTax.toLocaleString()}`, 150, 181, { align: 'right' });
    
    doc.line(20, 185, 190, 185);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL DEDUCTIONS', 20, 192);
    doc.text(`₱${payroll.totalDeductions.toLocaleString()}`, 150, 192, { align: 'right' });
    
    // Net Pay
    doc.setFillColor(240, 255, 240);
    doc.rect(15, 200, 180, 15, 'F');
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('NET PAY', 20, 210);
    doc.text(`₱${payroll.netPay.toLocaleString()}`, 150, 210, { align: 'right' });
    
    // Footer
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('This is a computer-generated payslip and does not require a signature.', 105, 280, { align: 'center' });
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-PH')}`, 105, 285, { align: 'center' });
    
    // Save PDF
    doc.save(`Payslip_${employee.employeeId}_${employee.name.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200/70 h-full flex flex-col">
      {/* Header - Matching Table Style */}
      <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-gray-50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-[#82A33D]/10 rounded-xl">
                <svg className="w-6 h-6 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              Payroll Details
            </h3>
            <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-1 bg-[#82A33D]/10 text-[#82A33D] rounded-lg text-xs font-semibold">
                {employee.name}
              </span>
              <span className="text-gray-400">•</span>
              <span>{employee.employeeId}</span>
            </p>
          </div>
          <button
            onClick={() => setEditMode(true)}
            className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Payroll
          </button>
        </div>
      </div>

      <div className="p-6 space-y-4 flex-1 overflow-hidden">
        {/* Employee Info Card */}
        <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-lg p-3 border border-blue-100/50">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-600 font-semibold text-xs uppercase tracking-wide">Position</p>
              <p className="text-gray-900 font-bold text-base mt-1">{employee.position}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold text-xs uppercase tracking-wide">Status</p>
              <div className="mt-1">
                {employee.status === 'paid' ? (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Paid
                  </span>
                ) : employee.status === 'delayed' ? (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Delayed
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200">
                    <svg className="w-3 h-3 mr-1 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Pending
                  </span>
                )}
              </div>
            </div>
            <div className="col-span-2">
              <p className="text-gray-600 font-semibold text-xs uppercase tracking-wide">Pay Period</p>
              <p className="text-gray-900 font-bold text-base mt-1">{employee.payPeriod}</p>
            </div>
          </div>
        </div>

        {/* Earnings Section */}
        <div className="space-y-2">
          <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <div className="p-1 bg-[#82A33D]/10 rounded">
              <svg className="w-3 h-3 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            Earnings
          </h4>
          
          <div className="space-y-2 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg p-3 border border-gray-200/50">
            {/* Basic Pay */}
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">Basic Pay</label>
              {editMode ? (
                <input
                  type="number"
                  value={formData.basicPay}
                  onChange={(e) => setFormData({ ...formData, basicPay: parseFloat(e.target.value) || 0 })}
                  className="w-32 px-3 py-1.5 text-right border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D] text-sm font-semibold"
                />
              ) : (
                <span className="text-sm font-semibold text-gray-900">₱{payroll.basicPay.toLocaleString()}</span>
              )}
            </div>

            {/* Allowance */}
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">Allowance</label>
              {editMode ? (
                <input
                  type="number"
                  value={formData.allowance}
                  onChange={(e) => setFormData({ ...formData, allowance: parseFloat(e.target.value) || 0 })}
                  className="w-32 px-3 py-1.5 text-right border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D] text-sm font-semibold"
                />
              ) : (
                <span className="text-sm font-semibold text-gray-900">₱{payroll.allowance.toLocaleString()}</span>
              )}
            </div>

            {/* Overtime */}
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">
                Overtime ({formData.overtime}h × ₱{formData.overtimeRate})
              </label>
              {editMode ? (
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Hours"
                    value={formData.overtime}
                    onChange={(e) => setFormData({ ...formData, overtime: parseFloat(e.target.value) || 0 })}
                    className="w-16 px-2 py-1.5 text-right border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D] text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Rate"
                    value={formData.overtimeRate}
                    onChange={(e) => setFormData({ ...formData, overtimeRate: parseFloat(e.target.value) || 0 })}
                    className="w-16 px-2 py-1.5 text-right border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D] text-sm"
                  />
                </div>
              ) : (
                <span className="text-sm font-semibold text-gray-900">₱{payroll.overtimePay.toLocaleString()}</span>
              )}
            </div>

            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-900">Gross Pay</span>
                <span className="text-base font-bold text-[#82A33D]">₱{payroll.grossPay.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Deductions Section */}
        <div className="space-y-2">
          <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <div className="p-1 bg-red-500/10 rounded">
              <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </div>
            Deductions
          </h4>
          
          <div className="space-y-2 bg-gradient-to-br from-red-50/30 to-rose-50/30 rounded-lg p-3 border border-red-100/50">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">SSS Contribution</span>
              <span className="text-sm font-semibold text-red-700">-₱{payroll.sss.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">PhilHealth (5% ÷ 2)</span>
              <span className="text-sm font-semibold text-red-700">-₱{payroll.philHealth.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Pag-IBIG</span>
              <span className="text-sm font-semibold text-red-700">-₱{payroll.pagIBIG.toLocaleString()}</span>
            </div>
            <div className="border-t border-red-200 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-600">Government Contributions</span>
                <span className="text-sm font-bold text-red-700">-₱{payroll.governmentContributions.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tax Section */}
        <div className="space-y-2">
          <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <div className="p-1 bg-orange-500/10 rounded">
              <svg className="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
              </svg>
            </div>
            Tax
          </h4>
          
          <div className="bg-gradient-to-br from-orange-50/30 to-amber-50/30 rounded-lg p-3 border border-orange-100/50">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Taxable Income</span>
                <span className="font-semibold text-gray-900">₱{payroll.taxableIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 font-medium">Withholding Tax</span>
                <span className="text-sm font-semibold text-orange-700">-₱{payroll.withholdingTax.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="space-y-3">
          {/* Total Deductions */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-3 border border-red-200/50">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-900">Total Deductions</span>
              <span className="text-base font-bold text-red-600">-₱{payroll.totalDeductions.toLocaleString()}</span>
            </div>
          </div>

          {/* Net Pay */}
          <div className="bg-gradient-to-br from-[#82A33D] to-emerald-600 rounded-lg p-4 text-white shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-medium text-green-100 mb-1">Net Pay (Take Home)</p>
                <p className="text-2xl font-black">₱{payroll.netPay.toLocaleString()}</p>
              </div>
              <div className="text-3xl opacity-20">💰</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50">
        <div className="flex gap-3">
          <button
            onClick={handleGeneratePayslip}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF
          </button>
          {(employee.status === 'pending' || employee.status === 'delayed') && (
            <button
              onClick={() => onMarkAsPaid?.(employee.id)}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#82A33D] to-emerald-600 text-white text-sm font-bold rounded-lg hover:from-[#6d8735] hover:to-emerald-700 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Mark Paid
            </button>
          )}
        </div>
      </div>

      {editMode && (
        <PayrollEditModal
          employee={employee}
          formData={formData}
          onFieldChange={(field, value) =>
            setFormData((prev) => ({
              ...prev,
              [field]: value,
            }))
          }
          onClose={() => setEditMode(false)}
          onSave={() => {
            handleSave();
            setEditMode(false);
          }}
        />
      )}
    </div>
  );
};

export default PayrollDetailsPanel;
