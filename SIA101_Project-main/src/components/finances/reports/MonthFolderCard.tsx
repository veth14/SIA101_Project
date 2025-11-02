import React from 'react';
import { Folder, FileText } from 'lucide-react';
import { MonthData } from '../../../data/financialReportsData';

interface MonthFolderCardProps {
  monthData: MonthData;
  categoryColor: string;
  onClick: () => void;
}

const MonthFolderCard: React.FC<MonthFolderCardProps> = ({ monthData, categoryColor, onClick }) => {
  const hasReports = monthData.reportCount > 0;

  return (
    <button
      onClick={onClick}
      disabled={!hasReports}
      className={`group relative bg-gradient-to-br ${categoryColor} border-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-left overflow-hidden ${
        hasReports 
          ? 'hover:-translate-y-1 cursor-pointer' 
          : 'opacity-50 cursor-not-allowed'
      }`}
    >
      {/* Small Folder Tab */}
      <div className="absolute top-0 left-0 w-16 h-6 bg-gradient-to-r from-amber-100 to-amber-50 rounded-br-xl border-r border-b border-amber-200"></div>
      
      {/* Content */}
      <div className="relative p-4 pt-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {hasReports ? (
                <Folder className="w-5 h-5 text-amber-600" />
              ) : (
                <Folder className="w-5 h-5 text-gray-400" />
              )}
              <h4 className={`font-bold text-sm ${hasReports ? 'text-gray-900' : 'text-gray-500'}`}>
                {monthData.name}
              </h4>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <FileText className="w-3 h-3" />
              <span className="font-medium">
                {monthData.reportCount} {monthData.reportCount === 1 ? 'report' : 'reports'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Status Badge */}
      {hasReports && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
      )}
    </button>
  );
};

export default MonthFolderCard;
