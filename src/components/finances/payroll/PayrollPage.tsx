import React, { useState } from 'react';
import PayrollHeader from './PayrollHeader';
import PayrollList from './PayrollList';
import PayrollDetails from './PayrollDetails';
import type { Employee } from './PayrollList';

export const PayrollPage: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleCloseDetails = () => {
    setSelectedEmployee(null);
  };
  return (
    <div className="min-h-screen bg-heritage-light">
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
        {/* Header */}
        <PayrollHeader />
        
        <div className="max-w-7xl mx-auto">
          <PayrollList 
            onEmployeeSelect={handleEmployeeSelect}
            selectedEmployee={selectedEmployee}
          />
        </div>
      </div>

      {/* Employee Details Modal */}
      {selectedEmployee && (
        <PayrollDetails 
          employee={selectedEmployee}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
};

export default PayrollPage;
