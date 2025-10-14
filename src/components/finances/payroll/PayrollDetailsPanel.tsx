import React, { useState, useEffect } from 'react';
import { calculatePayroll, PayrollBreakdown } from '../../../utils/philippineTaxCalculations';
import jsPDF from 'jspdf';
import type { EmployeePayroll } from './PayrollTable';

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
  const [formData, setFormData] = useState({
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
        <div className="p-6 border-b border-gray-200/70 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <div className="p-2 bg-[#82A33D]/10 rounded-xl">
              <svg className="w-5 h-5 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            Payroll Details
          </h3>
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
      {/* Header */}
      <div className="p-6 border-b border-gray-200/70 bg-gradient-to-r from-[#82A33D]/10 to-emerald-50/50">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">💼 Payroll Details</h3>
            <p className="text-sm text-gray-600">{employee.name} • {employee.employeeId}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEditMode(!editMode)}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {editMode ? '❌ Cancel' : '✏️ Edit'}
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4 flex-1 overflow-hidden">
        {/* Employee Info Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-600 font-medium">Position</p>
              <p className="text-gray-900 font-semibold">{employee.position}</p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Status</p>
              <p className="text-gray-900 font-semibold capitalize">
                {employee.status === 'paid' ? '✅ Paid' : employee.status === 'delayed' ? '⚠️ Delayed' : '⏳ Pending'}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-600 font-medium">Pay Period</p>
              <p className="text-gray-900 font-semibold">{employee.payPeriod}</p>
            </div>
          </div>
        </div>

        {/* Earnings Section */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
            <span className="w-1 h-3 bg-[#82A33D] rounded-full"></span>
            💵 Earnings
          </h4>
          
          <div className="space-y-2 bg-gray-50 rounded-xl p-3">
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

            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-900">Gross Pay</span>
                <span className="text-lg font-bold text-[#82A33D]">₱{payroll.grossPay.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Deductions Section */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
            <span className="w-1 h-3 bg-red-500 rounded-full"></span>
            📋 Deductions
          </h4>
          
          <div className="space-y-2 bg-red-50/30 rounded-xl p-3 border border-red-100">
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
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
            <span className="w-1 h-3 bg-orange-500 rounded-full"></span>
            🏛️ Tax
          </h4>
          
          <div className="bg-orange-50/30 rounded-xl p-3 border border-orange-100">
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
        <div className="space-y-2">
          {/* Total Deductions */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-3 border border-red-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-900">Total Deductions</span>
              <span className="text-lg font-bold text-red-600">-₱{payroll.totalDeductions.toLocaleString()}</span>
            </div>
          </div>

          {/* Net Pay */}
          <div className="bg-gradient-to-br from-[#82A33D] to-emerald-600 rounded-xl p-4 text-white shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-medium text-green-100 mb-1">Net Pay (Take Home)</p>
                <p className="text-2xl font-black">₱{payroll.netPay.toLocaleString()}</p>
              </div>
              <div className="text-4xl opacity-20">💰</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 border-t border-gray-200/70 bg-gray-50/50">
        <div className="flex gap-3">
          {editMode ? (
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2.5 bg-[#82A33D] text-white text-sm font-semibold rounded-xl hover:bg-[#6d8735] transition-colors shadow-md"
            >
              💾 Save Payroll
            </button>
          ) : (
            <>
              <button
                onClick={handleGeneratePayslip}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-md"
              >
                📄 Generate Payslip
              </button>
              {(employee.status === 'pending' || employee.status === 'delayed') && (
                <button
                  onClick={() => onMarkAsPaid?.(employee.id)}
                  className="flex-1 px-4 py-2.5 bg-[#82A33D] text-white text-sm font-semibold rounded-xl hover:bg-[#6d8735] transition-colors shadow-md"
                >
                  ✅ Mark as Paid
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayrollDetailsPanel;
