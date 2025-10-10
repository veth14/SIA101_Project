import React, { useState, useEffect } from 'react';
import { Skeleton } from '../../universalLoader/SkeletonLoader';

interface ProfitAnalysisTabsProps {
  activeTimeframe: 'monthly' | 'yearly';
  setActiveTimeframe: (timeframe: 'monthly' | 'yearly') => void;
}

export const ProfitAnalysisTabs: React.FC<ProfitAnalysisTabsProps> = ({
  activeTimeframe,
  setActiveTimeframe
}) => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading - synchronized with all components
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg p-2">
          <div className="flex space-x-2">
            <Skeleton className="h-12 w-40 rounded-xl" />
            <Skeleton className="h-12 w-40 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center animate-fade-in" style={{ animationDelay: '200ms' }}>
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg p-2">
        <div className="flex space-x-2">
          {/* Monthly Tab */}
          <button 
            className={`px-8 py-4 text-base font-semibold rounded-xl transition-all duration-300 min-w-[160px] ${
              activeTimeframe === 'monthly' 
                ? 'bg-[#82A33D] text-white shadow-md hover:bg-[#82A33D]/90' 
                : 'text-gray-600 hover:text-[#82A33D] hover:bg-gray-50/80'
            }`}
            onClick={() => setActiveTimeframe('monthly')}
          >
            Monthly Analysis
          </button>
          
          {/* Yearly Tab */}
          <button 
            className={`px-8 py-4 text-base font-semibold rounded-xl transition-all duration-300 min-w-[160px] ${
              activeTimeframe === 'yearly' 
                ? 'bg-[#82A33D] text-white shadow-md hover:bg-[#82A33D]/90' 
                : 'text-gray-600 hover:text-[#82A33D] hover:bg-gray-50/80'
            }`}
            onClick={() => setActiveTimeframe('yearly')}
          >
            Yearly Analysis
          </button>
        </div>
      </div>
    </div>
  );
};
