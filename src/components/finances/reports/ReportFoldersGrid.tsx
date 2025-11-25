import React from 'react';
import { FolderOpen } from 'lucide-react';
import { reportCategories } from '../../../data/financialReportsData';

interface ReportFoldersGridProps {
  onFolderClick: (categoryId: string) => void;
  selectedCategory?: string;
  searchQuery?: string;
  isLoading?: boolean;
}

const ReportFoldersGrid: React.FC<ReportFoldersGridProps> = ({ 
  onFolderClick,
  selectedCategory = 'all',
  searchQuery = '',
  isLoading = false
}) => {
  // Filter categories based on selected category and search query
  const filteredCategories = reportCategories.filter(folder => {
    const matchesCategory = selectedCategory === 'all' || folder.id === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      folder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      folder.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="mb-8">
      {isLoading ? (
        // Header Skeleton
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
            <div>
              <div className="h-5 w-40 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-56 bg-gray-100 rounded"></div>
            </div>
          </div>
          <div className="hidden md:flex h-8 w-32 bg-gray-100 rounded-full"></div>
        </div>
      ) : (
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 bg-[#82A33D]/10 rounded-xl">
              <svg className="w-6 h-6 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="flex flex-col items-start text-left">
              <h2 className="text-2xl font-black text-slate-800">
                Financial Reports
              </h2>
              <p className="mt-1 text-sm text-slate-500">Choose a category to explore financial reports</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <p className="text-xs font-semibold text-slate-600">
              {filteredCategories.length} categories
            </p>
          </div>
        </div>
      )}
      
      {isLoading ? (
        // Skeleton Loader
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="relative bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-3xl shadow-lg overflow-hidden animate-pulse">
              <div className="absolute top-0 left-0 w-28 h-10 bg-gray-300 rounded-br-3xl"></div>
              <div className="relative p-7 pt-14">
                <div className="w-20 h-20 mb-5 bg-gray-300 rounded-2xl"></div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
                    <div className="flex-1">
                      <div className="h-6 w-3/4 bg-gray-300 rounded mb-2"></div>
                    </div>
                  </div>
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
                    <div className="h-6 w-16 bg-gray-300 rounded-lg"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="col-span-full text-center py-16">
          <div className="flex flex-col items-center justify-center">
            <FolderOpen className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No folders found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
          {filteredCategories.map((folder) => (
          <button
            key={folder.id}
            onClick={() => onFolderClick(folder.id)}
            className={`group relative bg-gradient-to-br ${folder.color} ${folder.borderColor} border-2 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-105 ${folder.hoverColor} text-left overflow-hidden`}
          >
            {/* Premium Folder Tab with Gradient */}
            <div className="absolute top-0 left-0 w-28 h-10 bg-gradient-to-r from-amber-200 via-amber-100 to-amber-50 rounded-br-3xl border-r-2 border-b-2 border-amber-300/50 shadow-md">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent"></div>
            </div>
            
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Main Content */}
            <div className="relative p-7 pt-14">
              {/* Premium Folder Icon Container */}
              <div className="flex items-center justify-center w-20 h-20 mb-5 bg-gradient-to-br from-white via-white/95 to-white/90 backdrop-blur-xl rounded-2xl shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500 border border-white/60">
                <FolderOpen className="w-10 h-10 text-amber-600 group-hover:text-amber-700 drop-shadow-md transition-colors duration-300" />
                {/* Icon Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              {/* Folder Info */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{folder.icon}</span>
                  <h3 className="text-xl font-black text-gray-900 group-hover:text-[#82A33D] leading-tight transition-colors duration-300">
                    {folder.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
                  {folder.description}
                </p>
                
                {/* Enhanced Meta Info */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200/70">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="px-2.5 py-1 bg-heritage-green/10 text-heritage-green font-bold rounded-lg">
                      2025
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    <span className="text-gray-400">Updated:</span> <span className="font-bold text-gray-700">Oct 14</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Multiple Decorative Elements */}
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-white/30 to-transparent rounded-full -mr-12 -mb-12 group-hover:scale-125 transition-transform duration-500"></div>
            <div className="absolute top-1/2 right-0 w-16 h-16 bg-gradient-to-l from-white/20 to-transparent rounded-full -mr-8 group-hover:scale-110 transition-transform duration-500"></div>
            
            {/* Shine Effect on Hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
          </button>
        ))}
        </div>
      )}
    </div>
  );
};

export default ReportFoldersGrid;
