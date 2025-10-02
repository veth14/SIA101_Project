import React, { useState } from 'react';
import { GuestServicesHeader } from './GuestServicesHeader';
import { GuestServicesStats } from './GuestServicesStats';
import { GuestServicesNavigation } from './GuestServicesNavigation';
import { GuestFeedback } from './GuestFeedback';
import { LoyaltyProgram } from './LoyaltyProgram';
import { GuestAssistance } from './GuestAssistance';

export const GuestServices: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'feedback' | 'loyalty' | 'assistance'>('feedback');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-amber-50/20 to-yellow-50/30">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-orange-100/10 to-amber-100/15 rounded-full blur-3xl animate-pulse opacity-20"></div>
        <div className="absolute top-32 right-16 w-80 h-80 bg-gradient-to-r from-yellow-100/15 to-orange-100/10 rounded-full blur-3xl animate-pulse delay-1000 opacity-15"></div>
        <div className="absolute bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-amber-100/10 to-yellow-100/10 rounded-full blur-3xl animate-pulse delay-2000 opacity-10"></div>
      </div>

      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">
        {/* Header */}
        <GuestServicesHeader />

        {/* Stats */}
        <GuestServicesStats />

        {/* Modern Navigation */}
        <GuestServicesNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        {/* Tab Content */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          {activeTab === 'feedback' && <GuestFeedback />}
          {activeTab === 'loyalty' && <LoyaltyProgram />}
          {activeTab === 'assistance' && <GuestAssistance />}
        </div>
      </div>
    </div>
  );
};
