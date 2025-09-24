import { useState, useEffect } from 'react';
import { ExpenseSummary } from './ExpenseSummary';
import { ExpenseBreakdown } from './ExpenseBreakdown';
import { ExpenseTable } from './ExpenseTable';

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
}

export const ExpensePage = () => {
  const [chartData, setChartData] = useState<MonthlyData[]>([]);

  useEffect(() => {
    // TODO: Fetch from Firestore
    // For now, using dummy data
    setChartData([
      { month: 'Jan', income: 165000, expenses: 45000 },
      { month: 'Feb', income: 180000, expenses: 52000 },
      { month: 'Mar', income: 175000, expenses: 48000 },
      { month: 'Apr', income: 190000, expenses: 55000 },
      { month: 'May', income: 185000, expenses: 50000 },
      { month: 'Jun', income: 200000, expenses: 58000 },
      { month: 'Jul', income: 195000, expenses: 53000 },
      { month: 'Aug', income: 210000, expenses: 60000 },
      { month: 'Sep', income: 205000, expenses: 57000 },
      { month: 'Oct', income: 220000, expenses: 62000 },
      { month: 'Nov', income: 215000, expenses: 59000 },
      { month: 'Dec', income: 230000, expenses: 65000 },
    ]);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const maxValue = Math.max(...chartData.flatMap(item => [item.income, item.expenses]));
  return (
    <div className="min-h-screen bg-[#FBF0E4] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-white via-green-50/20 to-green-500/5 rounded-3xl shadow-2xl border border-green-500/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-600/5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-green-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-green-100/15 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 right-1/3 w-40 h-40 bg-green-500/5 rounded-full animate-spin opacity-30" style={{animationDuration: '25s'}}></div>
          <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-green-500/10 rounded-full animate-bounce opacity-40" style={{animationDuration: '3s'}}></div>
          
          <div className="relative p-10">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="relative group">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#82A33D] to-[#6d8a33] rounded-2xl flex items-center justify-center shadow-xl border border-[#82A33D]/30 group-hover:scale-110 transition-all duration-500">
                      <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#82A33D] to-green-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-5xl font-black text-[#82A33D] drop-shadow-sm">
                      Expense Management
                    </h1>
                    <p className="text-xl text-gray-700 font-medium tracking-wide">
                      Monitor and track hotel operating costs
                    </p>
                    <div className="flex items-center space-x-4 mt-4">
                      <div className="flex items-center space-x-2 bg-emerald-50 backdrop-blur-sm rounded-full px-4 py-2 border border-emerald-200">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-semibold text-emerald-700">All systems operational</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-blue-50 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-200">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium text-blue-700">
                          Tuesday, Sep 24
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="relative group">
                  <div className="bg-gradient-to-br from-white/90 to-green-500/5 backdrop-blur-xl rounded-3xl p-8 border border-green-500/20 shadow-xl group-hover:scale-105 transition-all duration-500">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#82A33D] to-green-400 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                    <div className="relative">
                      <p className="text-4xl font-black bg-gradient-to-r from-[#82A33D] to-green-600 bg-clip-text text-transparent drop-shadow-sm">
                        {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-gray-700 mt-2 font-semibold tracking-wide">Current Time</p>
                      <div className="mt-3 flex items-center justify-center space-x-2">
                        <div className="w-1 h-1 bg-[#82A33D] rounded-full animate-ping"></div>
                        <div className="w-1 h-1 bg-green-600 rounded-full animate-ping delay-75"></div>
                        <div className="w-1 h-1 bg-green-400 rounded-full animate-ping delay-150"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <ExpenseSummary />

        {/* Charts Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Earnings Chart - Takes 2 columns */}
            <div className="xl:col-span-2">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900">Earnings</h3>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#82A33D] rounded-full"></div>
                    <span className="text-sm font-medium text-gray-600">Income</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#ABAD8A] rounded-full"></div>
                    <span className="text-sm font-medium text-gray-600">Expense</span>
                  </div>
                </div>
              </div>
              
              {/* Bar Chart */}
              <div className="h-64 flex items-end justify-between gap-1 px-3 py-4 bg-gradient-to-t from-gray-50 to-white rounded-xl border border-gray-100 mb-4">
                {chartData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center gap-1 flex-1">
                    <div className="flex items-end gap-0.5 h-48">
                      <div 
                        className="bg-gradient-to-t from-[#82A33D] to-[#9bb347] rounded-t-lg w-3 transition-all duration-500 hover:opacity-80 relative group shadow-sm"
                        style={{ height: `${(item.income / maxValue) * 100}%` }}
                      >
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          Income: {formatCurrency(item.income)}
                        </div>
                      </div>
                      <div 
                        className="bg-gradient-to-t from-[#ABAD8A] to-[#c4c19a] rounded-t-lg w-3 transition-all duration-500 hover:opacity-80 relative group shadow-sm"
                        style={{ height: `${(item.expenses / maxValue) * 100}%` }}
                      >
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          Expenses: {formatCurrency(item.expenses)}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 font-medium">{item.month}</span>
                  </div>
                ))}
              </div>
              
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center py-3 px-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                  <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Avg Monthly Income</p>
                  <p className="text-lg font-bold text-[#82A33D]">
                    {formatCurrency(chartData.reduce((sum, item) => sum + item.income, 0) / chartData.length || 0)}
                  </p>
                </div>
                <div className="text-center py-3 px-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
                  <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Avg Monthly Expenses</p>
                  <p className="text-lg font-bold text-[#DC2626]">
                    {formatCurrency(chartData.reduce((sum, item) => sum + item.expenses, 0) / chartData.length || 0)}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Expense Breakdown - Takes 1 column */}
            <div className="xl:col-span-1">
              <ExpenseBreakdown />
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <ExpenseTable />

        {/* Quick Actions Footer */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
              <p className="text-sm text-gray-500">Manage your expenses efficiently</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="inline-flex items-center px-4 py-2 bg-[#82A33D] text-white text-sm font-medium rounded-xl hover:bg-[#6d8a33] transition-colors shadow-sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Expense
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-[#ABAD8A] text-white text-sm font-medium rounded-xl hover:bg-[#9ba082] transition-colors shadow-sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Generate Report
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
