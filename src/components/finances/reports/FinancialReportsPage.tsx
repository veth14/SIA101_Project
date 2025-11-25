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
  const [activeTab, setActiveTab] = useState<'reports' | 'archive'>('reports');
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

  const handleOpenReport = (report: any) => {
  };

  return (
    <div className="relative min-h-screen bg-[#F9F6EE]">
      <style>{`@keyframes fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in { animation: fade-in 360ms ease-out; animation-fill-mode: both; }`}</style>
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

        {/* Tabs - segmented control matching analytics pages */}
        <div className="relative flex justify-center mb-4 mt-1">
          <div className="w-full max-w-3xl p-2 border shadow-lg rounded-3xl bg-gradient-to-br from-white via-emerald-50/30 to-green-100/20 border-emerald-200/40 backdrop-blur-sm">
            <div className="relative flex items-center justify-center px-3 py-3 overflow-hidden rounded-2xl bg-gradient-to-b from-white/50 to-emerald-50/30">
              {/* Sliding indicator */}
              <div
                aria-hidden
                className={`absolute top-1.5 bottom-1.5 w-1/2 rounded-2xl shadow-lg transition-all duration-300 ease-in-out ${
                  activeTab === 'reports' ? 'translate-x-0' : 'translate-x-full'
                }`}
                style={{
                  left: 6,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(240,253,244,0.95) 100%)',
                  boxShadow:
                    '0 4px 12px rgba(16, 185, 129, 0.15), 0 2px 4px rgba(0, 0, 0, 0.08), inset 0 1px 2px rgba(255,255,255,0.5)'
                }}
              />

              <div
                role="tablist"
                aria-label="Reports tabs"
                className="relative z-10 flex items-center justify-center w-full gap-3"
              >
                <button
                  role="tab"
                  aria-selected={activeTab === 'reports'}
                  tabIndex={0}
                  onClick={() => setActiveTab('reports')}
                  className={`group z-20 flex items-center justify-center flex-1 text-center px-6 py-2.5 text-[13px] font-bold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-300/50 leading-tight ${
                    activeTab === 'reports'
                      ? 'text-emerald-900 scale-[1.02]'
                      : 'text-emerald-700/80 hover:text-emerald-800 hover:scale-[1.01]'
                  }`}
                >
                  <span className="font-extrabold tracking-wide">Reports</span>
                </button>

                <button
                  role="tab"
                  aria-selected={activeTab === 'archive'}
                  tabIndex={0}
                  onClick={() => setActiveTab('archive')}
                  className={`group z-20 flex items-center justify-center flex-1 text-center px-6 py-2.5 text-[13px] font-bold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-300/50 leading-tight ${
                    activeTab === 'archive'
                      ? 'text-emerald-900 scale-[1.02]'
                      : 'text-emerald-700/80 hover:text-emerald-800 hover:scale-[1.01]'
                  }`}
                >
                  <span className="font-extrabold tracking-wide">Archive</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        {activeTab === 'reports' ? (
          selectedFolder ? (
            // Folder View (with months and reports) - Card shell matching other finances panels
            <div className="relative overflow-hidden border shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60 p-6 lg:p-8 animate-fade-in">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-heritage-green/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-heritage-neutral/5 to-transparent rounded-full translate-y-1/2 -translate-x-1/2"></div>
              
              <div className="relative z-10 space-y-6">
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

                <FolderView categoryId={selectedFolder} onBack={handleBackToFolders} />
              </div>
            </div>
          ) : (
            // Main Folders / Search Results card - matches other finances panels
            <div className="relative overflow-hidden border shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60 p-6 lg:p-8 animate-fade-in">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-heritage-green/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-heritage-neutral/5 to-transparent rounded-full translate-y-1/2 -translate-x-1/2"></div>
              
              <div className="relative z-10 space-y-6">
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

                {searchQuery.trim() ? (
                  <SearchResults
                    searchQuery={searchQuery}
                    onClose={handleCloseSearch}
                    onOpenReport={handleOpenReport}
                  />
                ) : (
                  <ReportFoldersGrid 
                    onFolderClick={handleFolderClick}
                    selectedCategory={selectedCategory}
                    searchQuery={searchQuery}
                  />
                )}
              </div>
            </div>
          )
        ) : (
          <div className="relative overflow-hidden border shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60 p-6 lg:p-8 animate-fade-in">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-heritage-green/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-heritage-neutral/5 to-transparent rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10 space-y-6">
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

              <ArchiveSection searchQuery={searchQuery} />
            </div>
          </div>
        )}
      </div>

      {/* Generate Report Modal */}
      <GenerateReportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default FinancialReportsPage;
