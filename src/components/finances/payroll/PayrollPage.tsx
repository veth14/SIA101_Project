import React, { useState, useMemo } from 'react';
import { PayrollStats } from './PayrollStats';
import { PayrollTable, type EmployeePayroll } from './PayrollTable';
import PayrollDetailsPanel from './PayrollDetailsPanel';
import PayrollInsights from './PayrollInsights';
import { calculatePayroll, type PayrollBreakdown } from '../../../utils/philippineTaxCalculations';
import { employeePayrollData } from '../../../data/employeePayrollData';

// Convert imported data to EmployeePayroll type
const sampleEmployees: EmployeePayroll[] = employeePayrollData;

export const PayrollPage: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeePayroll[]>(sampleEmployees);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeePayroll | null>(null);

  // Calculate statistics
  const stats = useMemo(() => {
    let totalPayroll = 0;
    let totalDeductions = 0;
    let pendingCount = 0;

    employees.forEach(emp => {
      const payroll = calculatePayroll(emp.basicPay, emp.allowance, emp.overtime, emp.overtimeRate);
      totalPayroll += payroll.netPay;
      totalDeductions += payroll.governmentContributions;
      // Count both pending and delayed as "pending payrolls"
      if (emp.status === 'pending' || emp.status === 'delayed') pendingCount++;
    });

    return {
      totalEmployees: employees.length,
      totalPayroll: Math.round(totalPayroll),
      totalDeductions: Math.round(totalDeductions),
      pendingPayrolls: pendingCount
    };
  }, [employees]);

  const handleEmployeeSelect = (employee: EmployeePayroll) => {
    setSelectedEmployee(employee);
  };

  const handleSavePayroll = (updatedEmployee: EmployeePayroll, payroll: PayrollBreakdown) => {
    setEmployees(prev => 
      prev.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp)
    );
    setSelectedEmployee(updatedEmployee);
    
    // Here you would save to Firebase
    console.log('Saving payroll:', { employee: updatedEmployee, payroll });
  };

  const handleMarkAsPaid = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return;

    // Calculate payroll to validate
    const payroll = calculatePayroll(
      employee.basicPay,
      employee.allowance,
      employee.overtime,
      employee.overtimeRate
    );

    // Validation checks
    const validationErrors: string[] = [];

    if (!payroll.sss || payroll.sss <= 0) {
      validationErrors.push('SSS Contribution');
    }
    if (!payroll.philHealth || payroll.philHealth <= 0) {
      validationErrors.push('PhilHealth Contribution');
    }
    if (!payroll.pagIBIG || payroll.pagIBIG <= 0) {
      validationErrors.push('Pag-IBIG Contribution');
    }
    if (payroll.withholdingTax === undefined || payroll.withholdingTax < 0) {
      validationErrors.push('Withholding Tax');
    }
    if (!payroll.netPay || payroll.netPay <= 0) {
      validationErrors.push('Net Pay must be greater than zero');
    }
    if (!employee.payPeriod || employee.payPeriod.trim() === '') {
      validationErrors.push('Payroll Period');
    }

    // If validation fails, show error
    if (validationErrors.length > 0) {
      alert(`❌ Validation Failed!\n\nThe following fields are missing or invalid:\n• ${validationErrors.join('\n• ')}\n\nPlease ensure all deductions are properly computed before marking as paid.`);
      return;
    }

    // Show confirmation dialog
    const confirmed = window.confirm(
      `⚠️ Confirm Payment\n\nAre you sure you want to mark this payroll as PAID?\n\nEmployee: ${employee.name}\nNet Pay: ₱${payroll.netPay.toLocaleString()}\nPay Period: ${employee.payPeriod}\n\nThis action will update the payroll status.`
    );

    if (!confirmed) return;

    // Update status to paid
    setEmployees(prev =>
      prev.map(emp => emp.id === employeeId ? { ...emp, status: 'paid' as const } : emp)
    );
    if (selectedEmployee?.id === employeeId) {
      setSelectedEmployee({ ...selectedEmployee, status: 'paid' });
    }
    
    // Show success message
    alert(`✅ Success!\n\nPayroll for ${employee.name} has been marked as PAID.\nNet Pay: ₱${payroll.netPay.toLocaleString()}`);
    
    // Here you would update Firebase
    console.log('Marked as paid:', employeeId, payroll);
  };

  return (
    <div className="min-h-screen bg-[#F9F6EE]">
      {/* Light Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Subtle Light Orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 rounded-full blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl animate-pulse delay-1000 opacity-25"></div>
        <div className="absolute bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 rounded-full blur-3xl animate-pulse delay-2000 opacity-20"></div>
        
        {/* Light Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(134, 134, 134, 0.1) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">
        
        {/* Stats Cards */}
        <PayrollStats
          totalEmployees={stats.totalEmployees}
          totalPayroll={stats.totalPayroll}
          totalDeductions={stats.totalDeductions}
          pendingPayrolls={stats.pendingPayrolls}
        />
        
        {/* Payroll Insights - Top Paid Employees */}
        <PayrollInsights employees={employees} />

        {/* Two-Column Layout: Perfect Height Alignment */}
        <div className="flex flex-col lg:flex-row gap-6 h-full">
          {/* Left Column - Payroll Table (2/3 width) */}
          <div className="flex-1 lg:flex-[2] min-h-0">
            <PayrollTable
              employees={employees}
              onEmployeeSelect={handleEmployeeSelect}
              selectedEmployee={selectedEmployee}
            />
          </div>

          {/* Right Column - Payroll Details Panel (1/3 width) */}
          <div className="flex-1 lg:flex-[1] min-h-0">
            <PayrollDetailsPanel
              employee={selectedEmployee}
              onSavePayroll={handleSavePayroll}
              onMarkAsPaid={handleMarkAsPaid}
            />
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default PayrollPage;
