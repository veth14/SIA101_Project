import React from 'react';
import { FolderOpen } from 'lucide-react';
import { reportCategories } from '../../../data/financialReportsData';

interface ReportFoldersGridProps {
  onFolderClick: (categoryId: string) => void;
  selectedCategory?: string;
  searchQuery?: string;
}

const ReportFoldersGrid: React.FC<ReportFoldersGridProps> = ({ 
  onFolderClick,
  selectedCategory = 'all',
  searchQuery = ''
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Report Categories</h2>
        <p className="text-sm text-gray-500">Click a folder to view reports</p>
      </div>
      
      {filteredCategories.length === 0 ? (
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
            className={`group relative bg-gradient-to-br ${folder.color} ${folder.borderColor} border-2 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${folder.hoverColor} text-left overflow-hidden`}
          >
            {/* Folder Tab Effect */}
            <div className="absolute top-0 left-0 w-24 h-8 bg-gradient-to-r from-amber-100 to-amber-50 rounded-br-2xl border-r border-b border-amber-200"></div>
            
            {/* Main Content */}
            <div className="relative p-6 pt-12">
              {/* Folder Icon */}
              <div className="flex items-center justify-center w-16 h-16 mb-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
                <FolderOpen className="w-8 h-8 text-amber-600 group-hover:text-amber-700" />
              </div>
              
              {/* Folder Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{folder.icon}</span>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-800">
                    {folder.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{folder.description}</p>
                
                {/* Meta Info */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200/50">
                  <div className="text-xs text-gray-500">
                    <span className="font-semibold">2025</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Last updated: <span className="font-semibold">Oct 14</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative Corner */}
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/20 rounded-full -mr-10 -mb-10"></div>
          </button>
        ))}
        </div>
      )}
    </div>
  );
};

export default ReportFoldersGrid;
