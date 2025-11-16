import React, { useState } from 'react';
import ReportsFilter from './ReportsFilter';
import ReportFoldersGrid from './ReportFoldersGrid';
import FolderView from './FolderView';
import ArchiveSection from './ArchiveSection';
import GenerateReportModal from './GenerateReportModal';
import SearchResults from './SearchResults';

const FinancialReportsPage: React.FC = () => {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  // removed artificial loading/skeleton delay — render immediately

  const handleFolderClick = (categoryId: string) => {
    setSelectedFolder(categoryId);
  };

  const handleBackToFolders = () => {
    setSelectedFolder(null);
  };

  const handleCloseSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="relative min-h-screen bg-[#F9F6EE]">
      <style>{`@keyframes fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in { animation: fade-in 360ms ease-out; animation-fill-mode: both; }`}</style>
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

        {/* Filters */}
          <div className="animate-fade-in">
          <ReportsFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onGenerateClick={() => setIsModalOpen(true)}
        />
          </div>

        {/* Search Results */}
        {searchQuery && <SearchResults searchQuery={searchQuery} onClose={handleCloseSearch} />}

        {/* Main Content Area */}
        {selectedFolder ? (
          // Folder View (with months and reports) - Premium Container
          <div className="relative w-full overflow-hidden bg-gradient-to-br from-white via-white to-heritage-light/30 backdrop-blur-xl rounded-3xl border-2 border-white/60 shadow-2xl p-10 animate-fade-in">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-heritage-green/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-heritage-neutral/5 to-transparent rounded-full translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10">
              <FolderView categoryId={selectedFolder} onBack={handleBackToFolders} />
            </div>
          </div>
        ) : (
          // Main Folders Grid - Premium Container
          <div className="relative w-full overflow-hidden bg-gradient-to-br from-white via-white to-heritage-light/30 backdrop-blur-xl rounded-3xl border-2 border-white/60 shadow-2xl hover:shadow-3xl transition-all duration-500 p-10 animate-fade-in">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-heritage-green/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-heritage-neutral/5 to-transparent rounded-full translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10">
              <ReportFoldersGrid 
                onFolderClick={handleFolderClick}
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
              />
            </div>
          </div>
        )}

        {/* Archive Section - Always visible */}
        <ArchiveSection />

        {/* Report Management Tips - always render (skeleton removed) */}
  <div className="relative w-full overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 border-2 border-amber-200/50 rounded-3xl shadow-xl animate-fade-in">
          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-200/30 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-orange-200/30 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000"></div>
          
          {/* Content */}
          <div className="relative p-8">
            <div className="flex items-start gap-6">
              {/* Premium Icon Container */}
              <div className="relative group flex-shrink-0">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                  <span className="text-3xl filter drop-shadow-lg">💡</span>
                </div>
                {/* Glow Effect */}
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              </div>
              
              {/* Text Content */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-2xl font-black bg-gradient-to-r from-amber-900 to-orange-800 bg-clip-text text-transparent">
                    Report Management Tips
                  </h3>
                  <div className="px-3 py-1 bg-amber-500/20 backdrop-blur-sm border border-amber-500/30 rounded-full">
                    <span className="text-xs font-bold text-amber-800">Best Practices</span>
                  </div>
                </div>
                
                {/* Premium Tips Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-amber-200/50 hover:bg-white/80 hover:shadow-md transition-all duration-300">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-lg">📝</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">Automatic Naming</p>
                      <p className="text-xs text-gray-600 leading-relaxed">Reports use pattern: <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">Category-YYYY-MM-Type-vN</span></p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-amber-200/50 hover:bg-white/80 hover:shadow-md transition-all duration-300">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-lg">📅</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">Monthly Generation</p>
                      <p className="text-xs text-gray-600 leading-relaxed">Reports are auto-generated on the last day of each month</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-amber-200/50 hover:bg-white/80 hover:shadow-md transition-all duration-300">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-lg">📦</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">Smart Archiving</p>
                      <p className="text-xs text-gray-600 leading-relaxed">Archive reports older than 3 months for better organization</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-amber-200/50 hover:bg-white/80 hover:shadow-md transition-all duration-300">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-lg">🔒</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">Secure Storage</p>
                      <p className="text-xs text-gray-600 leading-relaxed">All reports are encrypted and accessible 24/7 with full audit trails</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Accent Line */}
          <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"></div>
        </div>
      </div>

      {/* Generate Report Modal */}
      <GenerateReportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default FinancialReportsPage;
