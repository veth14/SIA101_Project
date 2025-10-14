import React, { useState } from 'react';
import ExpensesHeader from '@/components/finances/expenses/ExpensesHeader';
import ExpenseList from '@/components/finances/expenses/ExpenseList';
import type { Expense } from '@/components/finances/expenses/ExpenseList';
import ExpenseDetailsPanel from '@/components/finances/expenses/ExpenseDetailsPanel';
import ExpensesStats from '@/components/finances/expenses/ExpensesStats';
import ExpensesAnalytics from '@/components/finances/expenses/ExpensesAnalytics';

export const ExpensesPage: React.FC = () => {
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const handleExpenseSelect = (expense: Expense) => {
    setSelectedExpense(expense);
  };
  

  return (
    <div className="min-h-screen bg-heritage-light">
      {/* Light Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Subtle Light Orbs */}
        <div className="absolute rounded-full top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute delay-1000 rounded-full opacity-25 top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 blur-3xl animate-pulse"></div>
        <div className="absolute rounded-full bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 blur-3xl animate-pulse delay-2000 opacity-20"></div>
        
        {/* Light Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(134, 134, 134, 0.1) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full px-2 py-4 space-y-6 sm:px-4 lg:px-6">
        {/* Header */}
        <ExpensesHeader />
        
        {/* Stats Section */}
        <ExpensesStats />

        {/* Category Breakdown Analytics */}
        <ExpensesAnalytics />

        {/* Two-column layout */}
        <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-4 xl:grid-cols-5">
          {/* Left: main list */}
          <div className="lg:col-span-3 xl:col-span-3">
            <ExpenseList 
              onExpenseSelect={handleExpenseSelect}
              selectedExpense={selectedExpense}
            />
          </div>
          {/* Right: details / analytics */}
          <div className="lg:col-span-1 xl:col-span-2">
            <ExpenseDetailsPanel expense={selectedExpense} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensesPage;