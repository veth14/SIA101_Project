import React from 'react';
import SegmentedTabs from '../../shared/ui/SegmentedTabs';

interface GuestServicesNavigationProps {
  activeTab: 'feedback' | 'loyalty' | 'assistance';
  onTabChange: (tab: 'feedback' | 'loyalty' | 'assistance') => void;
}

export const GuestServicesNavigation: React.FC<GuestServicesNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  const tabs = [
    { id: 'feedback' as const, label: 'Feedback' },
    { id: 'loyalty' as const, label: 'Loyalty' },
    { id: 'assistance' as const, label: 'Assistance' }
  ];

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Light Theme Header - Matching Website Style */}
      <div className="relative bg-gradient-to-br from-white via-green-50/20 to-green-500/5 border-b border-green-500/10">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-green-500/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-green-100/10 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000"></div>
        
        <div className="relative p-8">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="w-14 h-14 bg-gradient-to-br from-[#82A33D] to-[#6d8a33] rounded-2xl flex items-center justify-center shadow-xl border border-[#82A33D]/30 group-hover:scale-110 transition-all duration-500">
                <svg className="w-7 h-7 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-[#82A33D] to-green-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#82A33D] mb-1">Guest Experience Management</h2>
              <p className="text-gray-600 font-medium">Comprehensive guest service operations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Clean Tab Navigation – matches Financial Reports segmented control */}
      <div className="p-6 flex justify-center">
        <SegmentedTabs
          tabs={tabs}
          activeId={activeTab}
          onChange={(id) => onTabChange(id as typeof activeTab)}
          ariaLabel="Guest services tabs"
        />
      </div>
    </div>
  );
};
