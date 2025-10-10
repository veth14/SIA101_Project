import React from 'react';
import { ArrowLeft, Home, BarChart3 } from 'lucide-react';

interface ProfitAnalysisNavigationProps {
  navigate: (path: string) => void;
}

export const ProfitAnalysisNavigation: React.FC<ProfitAnalysisNavigationProps> = ({
  navigate
}) => {
  return (
    <div className="bg-white/95 backdrop-blur-2xl rounded-2xl border-white/60 shadow-xl p-4 animate-fade-in">
      <div className="flex items-center justify-between">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-sm">
          <button 
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center space-x-1 text-gray-500 hover:text-[#82A33D] transition-colors duration-200"
          >
            <Home className="w-4 h-4" />
            <span>Admin</span>
          </button>
          <span className="text-gray-300">/</span>
          <button 
            onClick={() => navigate('/admin/finances/dashboard')}
            className="flex items-center space-x-1 text-gray-500 hover:text-[#82A33D] transition-colors duration-200"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Finances</span>
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-[#82A33D] font-medium">Profit Analysis</span>
        </div>

        {/* Back Button */}
        <button 
          onClick={() => navigate('/admin/finances/dashboard')}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gradient-to-r from-gray-50 to-white hover:from-[#82A33D]/10 hover:to-green-50 rounded-lg border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span>Back to Dashboard</span>
        </button>
      </div>
    </div>
  );
};
