import React, { useState } from 'react';
import { ArrowLeft, Calendar, FolderOpen } from 'lucide-react';
import { reportCategories, months, type FinancialReport } from '../../../data/financialReportsData';
import MonthFolderCard from './MonthFolderCard';
import ReportList from './ReportList';

interface FolderViewProps {
  categoryId: string;
  onBack: () => void;
  // Optional live reports from Firestore; kept for future use
  reports?: FinancialReport[];
}

const FolderView: React.FC<FolderViewProps> = ({ categoryId, onBack, reports }) => {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const category = reportCategories.find(c => c.id === categoryId);
  const categoryReports: FinancialReport[] = (reports || []).filter(r => r.category === categoryId);
  const monthData = months.map((m) => ({
    month: m.month,
    name: m.name,
    reportCount: categoryReports.filter(r => r.month === m.month).length,
  }));
  
  if (!category) return null;

  const handleMonthClick = (month: number) => {
    setSelectedMonth(month);
  };

  const handleBackToMonths = () => {
    setSelectedMonth(null);
  };

  const handleViewReport = (report: FinancialReport) => {
    alert(`Viewing report: ${report.name}`);
    // In production: Open report viewer or download
  };

  const handleDownloadReport = (report: FinancialReport) => {
    alert(`Downloading report: ${report.name}`);
    // In production: Trigger file download
  };

  const handleDeleteReport = (report: FinancialReport) => {
    if (confirm(`Are you sure you want to delete ${report.name}?`)) {
      alert(`Report deleted: ${report.name}`);
      // In production: Call API to delete report
    }
  };

  // If viewing specific month's reports
  if (selectedMonth !== null) {
    const reportsForMonth = categoryReports.filter(r => r.month === selectedMonth);
    const monthName = monthData.find(m => m.month === selectedMonth)?.name || '';

    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <button
            onClick={onBack}
            className="hover:text-heritage-green transition-colors"
          >
            Financial Reports
          </button>
          <span>/</span>
          <button
            onClick={handleBackToMonths}
            className="hover:text-heritage-green transition-colors"
          >
            {category.name}
          </button>
          <span>/</span>
          <span className="text-gray-900 font-medium">{monthName} 2025</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={handleBackToMonths}
              className="flex items-center gap-2 mb-4 text-gray-600 hover:text-heritage-green transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Months
            </button>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{category.icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {monthName} {category.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {reportsForMonth.length} {reportsForMonth.length === 1 ? 'report' : 'reports'} in this month
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <ReportList
          reports={reportsForMonth}
          onView={handleViewReport}
          onDownload={handleDownloadReport}
          onDelete={handleDeleteReport}
        />
      </div>
    );
  }

  // Main folder view with months
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <button
          onClick={onBack}
          className="hover:text-heritage-green transition-colors"
        >
          Financial Reports
        </button>
        <span>/</span>
        <span className="text-gray-900 font-medium">{category.name}</span>
      </div>

      {/* Open Folder Header */}
      <div className={`relative bg-gradient-to-br ${category.color} ${category.borderColor} border-2 rounded-2xl shadow-lg overflow-hidden`}>
        {/* Folder Tab */}
        <div className="absolute top-0 left-0 w-32 h-10 bg-gradient-to-r from-amber-100 to-amber-50 rounded-br-3xl border-r-2 border-b-2 border-amber-200"></div>
        
        <div className="relative p-8 pt-14">
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 text-gray-600 hover:text-heritage-green transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Folders
          </button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 bg-white/80 backdrop-blur-sm rounded-xl shadow-md">
              <FolderOpen className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{category.icon}</span>
                <h2 className="text-3xl font-bold text-gray-900">{category.name}</h2>
              </div>
              <p className="text-gray-600">{category.description}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Year 2025</span>
                </div>
                <span>•</span>
                <span>Last updated: October 14, 2025</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mb-16"></div>
      </div>

      {/* Month Folders */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Monthly Reports</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-12 gap-4">
          {monthData.map((month) => (
            <MonthFolderCard
              key={month.month}
              monthData={month}
              categoryColor={category.color}
              onClick={() => handleMonthClick(month.month)}
            />
          ))}
        </div>
      </div>

      {/* Summary Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white/80 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-heritage-green">
            {monthData.reduce((acc, m) => acc + m.reportCount, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Reports</div>
        </div>
        <div className="p-4 bg-white/80 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-heritage-green">
            {monthData.filter(m => m.reportCount > 0).length}
          </div>
          <div className="text-sm text-gray-600">Active Months</div>
        </div>
        <div className="p-4 bg-white/80 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-heritage-green">2025</div>
          <div className="text-sm text-gray-600">Current Year</div>
        </div>
      </div>
    </div>
  );
};

export default FolderView;
