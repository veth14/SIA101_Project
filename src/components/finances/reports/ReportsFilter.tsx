import React from 'react';
import { Search, Filter, Calendar, Plus } from 'lucide-react';

interface ReportsFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedYear: number;
  onYearChange: (year: number) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const ReportsFilter: React.FC<ReportsFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedYear,
  onYearChange,
  selectedCategory,
  onCategoryChange
}) => {
  const years = [2025, 2024, 2023, 2022, 2021];
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'income', label: 'Income Reports' },
    { value: 'expense', label: 'Expense Reports' },
    { value: 'payroll', label: 'Payroll Summaries' },
    { value: 'profit-loss', label: 'Profit & Loss' },
    { value: 'balance', label: 'Balance Sheets' },
    { value: 'custom', label: 'Custom Reports' }
  ];

  return (
    <div className="w-full bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg p-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left Side - Search and Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1 w-full">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green appearance-none bg-white cursor-pointer transition-all min-w-[200px]"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Year Filter */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            <select
              value={selectedYear}
              onChange={(e) => onYearChange(Number(e.target.value))}
              className="pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green appearance-none bg-white cursor-pointer transition-all min-w-[140px]"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-3">
          {/* Clear Filters */}
          {(searchQuery || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                onSearchChange('');
                onCategoryChange('all');
              }}
              className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
            >
              Clear Filters
            </button>
          )}

          {/* Generate Report Button */}
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-heritage-green to-heritage-neutral text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
            <Plus className="w-5 h-5" />
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsFilter;
