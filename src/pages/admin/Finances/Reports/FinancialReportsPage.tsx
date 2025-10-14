import React, { useState } from 'react';
import { ReportsHeader } from '../../../../components/finances/reports/ReportsHeader';
import ReportsFilter from '../../../../components/finances/reports/ReportsFilter';
import ReportFoldersGrid from '../../../../components/finances/reports/ReportFoldersGrid';
import FolderView from '../../../../components/finances/reports/FolderView';
import ArchiveSection from '../../../../components/finances/reports/ArchiveSection';

const FinancialReportsPage: React.FC = () => {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleFolderClick = (categoryId: string) => {
    setSelectedFolder(categoryId);
  };

  const handleBackToFolders = () => {
    setSelectedFolder(null);
  };

  return (
    <div className="min-h-screen bg-heritage-light">
      {/* Light Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Subtle Light Orbs */}
        <div className="absolute rounded-full top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute delay-1000 rounded-full opacity-25 top-32 right-16 w-80 h-80 bg-gradient-to-r from-amber-100/20 to-orange-100/20 blur-3xl animate-pulse"></div>
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
        <ReportsHeader />

        {/* Filters */}
        <ReportsFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Main Content Area */}
        {selectedFolder ? (
          // Folder View (with months and reports)
          <div className="w-full bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg p-8">
            <FolderView categoryId={selectedFolder} onBack={handleBackToFolders} />
          </div>
        ) : (
          <>
            {/* Main Folders Grid */}
            <div className="w-full bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg p-8">
              <ReportFoldersGrid 
                onFolderClick={handleFolderClick}
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
              />
            </div>

            {/* Archive Section */}
            <ArchiveSection />

            {/* Info Banner */}
            <div className="w-full p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💡</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Report Management Tips</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Reports are automatically named using the pattern: Category-YYYY-MM-Type-vN</li>
                    <li>• Monthly reports are generated on the last day of each month</li>
                    <li>• Archive reports older than 3 months to keep the system organized</li>
                    <li>• All reports are securely stored and can be accessed anytime</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FinancialReportsPage;
