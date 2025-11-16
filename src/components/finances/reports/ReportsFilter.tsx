import React, { useState } from 'react';
import { Search, Filter, Calendar, Plus, ChevronDown, X, FileText, Clock, User, TrendingUp } from 'lucide-react';

interface ReportsFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedYear: number;
  onYearChange: (year: number) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedMonth?: number;
  onMonthChange?: (month: number) => void;
  selectedStatus?: string;
  onStatusChange?: (status: string) => void;
  selectedFileType?: string;
  onFileTypeChange?: (fileType: string) => void;
  selectedPreparedBy?: string;
  onPreparedByChange?: (preparedBy: string) => void;
  sortBy?: string;
  onSortChange?: (sortBy: string) => void;
  onGenerateClick?: () => void;
  isLoading?: boolean;
}

const ReportsFilter: React.FC<ReportsFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedYear,
  onYearChange,
  selectedCategory,
  onCategoryChange,
  selectedMonth = 0,
  onMonthChange = () => {},
  selectedStatus = 'all',
  onStatusChange = () => {},
  selectedFileType = 'all',
  onFileTypeChange = () => {},
  selectedPreparedBy = 'all',
  onPreparedByChange = () => {},
  sortBy = 'date-desc',
  onSortChange = () => {},
  onGenerateClick = () => {},
  isLoading = false
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg p-6 animate-pulse">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
            <div className="flex-1 h-14 bg-gray-200 rounded-xl"></div>
            <div className="min-w-[220px] h-14 bg-gray-200 rounded-xl"></div>
            <div className="min-w-[150px] h-14 bg-gray-200 rounded-xl"></div>
            <div className="min-w-[160px] h-14 bg-gray-200 rounded-xl"></div>
            <div className="min-w-[180px] h-14 bg-gray-300 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  const years = [2025, 2024, 2023, 2022, 2021];
  
  const categories = [
    { value: 'all', label: 'All Categories', icon: '📁' },
    { value: 'income', label: 'Income Reports', icon: '💰' },
    { value: 'expense', label: 'Expense Reports', icon: '📊' },
    { value: 'payroll', label: 'Payroll Summaries', icon: '👥' },
    { value: 'profit-loss', label: 'Profit & Loss', icon: '📈' },
    { value: 'balance', label: 'Balance Sheets', icon: '⚖️' },
    { value: 'custom', label: 'Custom Reports', icon: '📋' }
  ];

  const months = [
    { value: 0, label: 'All Months' },
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  const statuses = [
    { value: 'all', label: 'All Status', color: 'gray' },
    { value: 'active', label: 'Active', color: 'green' },
    { value: 'archived', label: 'Archived', color: 'gray' },
    { value: 'draft', label: 'Draft', color: 'yellow' },
    { value: 'pending', label: 'Pending Review', color: 'orange' }
  ];

  const fileTypes = [
    { value: 'all', label: 'All Types', icon: '📄' },
    { value: 'PDF', label: 'PDF', icon: '📕' },
    { value: 'Excel', label: 'Excel', icon: '📊' },
    { value: 'CSV', label: 'CSV', icon: '📈' },
    { value: 'Word', label: 'Word', icon: '📘' }
  ];

  const preparedByOptions = [
    { value: 'all', label: 'All Staff' },
    { value: 'finance', label: 'Finance Team' },
    { value: 'accounting', label: 'Accounting Dept' },
    { value: 'hr', label: 'HR Department' },
    { value: 'management', label: 'Management' },
    { value: 'audit', label: 'Audit Team' }
  ];

  const sortOptions = [
    { value: 'date-desc', label: 'Newest First', icon: '↓' },
    { value: 'date-asc', label: 'Oldest First', icon: '↑' },
    { value: 'name-asc', label: 'Name (A-Z)', icon: '🔤' },
    { value: 'name-desc', label: 'Name (Z-A)', icon: '🔡' },
    { value: 'size-desc', label: 'Largest First', icon: '📦' },
    { value: 'size-asc', label: 'Smallest First', icon: '📪' }
  ];

  const activeFiltersCount = () => {
    let count = 0;
    if (searchQuery) count++;
    if (selectedCategory !== 'all') count++;
    if (selectedMonth !== 0) count++;
    if (selectedStatus !== 'all') count++;
    if (selectedFileType !== 'all') count++;
    if (selectedPreparedBy !== 'all') count++;
    if (dateRange.from || dateRange.to) count++;
    return count;
  };

  const clearAllFilters = () => {
    onSearchChange('');
    onCategoryChange('all');
    onMonthChange(0);
    onStatusChange('all');
    onFileTypeChange('all');
    onPreparedByChange('all');
    setDateRange({ from: '', to: '' });
  };

  return (
    <div className="w-full space-y-4">
      {/* Main Filter Bar */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg p-6">
        <div className="flex flex-col gap-4">
          {/* Top Row - Search and Primary Filters */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by report name, ID, or description..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green transition-all text-sm font-medium placeholder:text-gray-400"
              />
            </div>

            {/* Category Filter */}
            <div className="relative min-w-[220px]">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none z-10" />
              <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green appearance-none bg-white cursor-pointer transition-all text-sm font-medium"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Year Filter */}
            <div className="relative min-w-[150px]">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none z-10" />
              <select
                value={selectedYear}
                onChange={(e) => onYearChange(Number(e.target.value))}
                className="w-full pl-12 pr-10 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-heritage-green appearance-none bg-white cursor-pointer transition-all text-sm font-medium"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 min-w-[160px] justify-center ${
                showAdvancedFilters 
                  ? 'bg-heritage-green text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-5 h-5" />
              Advanced
              {activeFiltersCount() > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                  {activeFiltersCount()}
                </span>
              )}
            </button>

            {/* Generate Report Button */}
            <button 
              onClick={onGenerateClick}
              className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-heritage-green to-heritage-neutral text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 min-w-[180px] justify-center"
            >
              <Plus className="w-5 h-5" />
              Generate Report
            </button>
          </div>

          {/* Active Filters Pills */}
          {activeFiltersCount() > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-gray-100">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Active Filters:</span>
              
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                  <Search className="w-3 h-3" />
                  Search: "{searchQuery}"
                  <button onClick={() => onSearchChange('')} className="hover:bg-blue-100 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">
                  <Filter className="w-3 h-3" />
                  {categories.find(c => c.value === selectedCategory)?.label}
                  <button onClick={() => onCategoryChange('all')} className="hover:bg-purple-100 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              
              {selectedMonth !== 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium">
                  <Calendar className="w-3 h-3" />
                  {months.find(m => m.value === selectedMonth)?.label}
                  <button onClick={() => onMonthChange(0)} className="hover:bg-emerald-100 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              
              {selectedStatus !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium">
                  <Clock className="w-3 h-3" />
                  {statuses.find(s => s.value === selectedStatus)?.label}
                  <button onClick={() => onStatusChange('all')} className="hover:bg-amber-100 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              
              {selectedFileType !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-xs font-medium">
                  <FileText className="w-3 h-3" />
                  {fileTypes.find(f => f.value === selectedFileType)?.label}
                  <button onClick={() => onFileTypeChange('all')} className="hover:bg-rose-100 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              
              {selectedPreparedBy !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium">
                  <User className="w-3 h-3" />
                  {preparedByOptions.find(p => p.value === selectedPreparedBy)?.label}
                  <button onClick={() => onPreparedByChange('all')} className="hover:bg-indigo-100 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              
              <button
                onClick={clearAllFilters}
                className="ml-auto px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <X className="w-3 h-3" />
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-heritage-green/10 rounded-lg">
                <Filter className="w-5 h-5 text-heritage-green" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Advanced Filters</h3>
                <p className="text-sm text-gray-500">Refine your search with detailed criteria</p>
              </div>
            </div>
            <button
              onClick={() => setShowAdvancedFilters(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Month Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Calendar className="w-4 h-4 text-heritage-green" />
                Month
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => onMonthChange(Number(e.target.value))}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green appearance-none bg-white cursor-pointer transition-all text-sm"
              >
                {months.map(month => (
                  <option key={month.value} value={month.value}>{month.label}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Clock className="w-4 h-4 text-heritage-green" />
                Report Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => onStatusChange(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green appearance-none bg-white cursor-pointer transition-all text-sm"
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>

            {/* File Type Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FileText className="w-4 h-4 text-heritage-green" />
                File Type
              </label>
              <select
                value={selectedFileType}
                onChange={(e) => onFileTypeChange(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green appearance-none bg-white cursor-pointer transition-all text-sm"
              >
                {fileTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.icon} {type.label}</option>
                ))}
              </select>
            </div>

            {/* Prepared By Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <User className="w-4 h-4 text-heritage-green" />
                Prepared By
              </label>
              <select
                value={selectedPreparedBy}
                onChange={(e) => onPreparedByChange(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green appearance-none bg-white cursor-pointer transition-all text-sm"
              >
                {preparedByOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Date Range From */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Calendar className="w-4 h-4 text-heritage-green" />
                Date From
              </label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green transition-all text-sm"
              />
            </div>

            {/* Date Range To */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Calendar className="w-4 h-4 text-heritage-green" />
                Date To
              </label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green transition-all text-sm"
              />
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <TrendingUp className="w-4 h-4 text-heritage-green" />
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green appearance-none bg-white cursor-pointer transition-all text-sm"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.icon} {option.label}</option>
                ))}
              </select>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Quick Actions</label>
              <div className="flex gap-2">
                <button
                  onClick={clearAllFilters}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm"
                >
                  Reset All
                </button>
                <button
                  onClick={() => setShowAdvancedFilters(false)}
                  className="flex-1 px-4 py-2.5 bg-heritage-green hover:bg-heritage-green/90 text-white font-medium rounded-lg transition-colors text-sm"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsFilter;
