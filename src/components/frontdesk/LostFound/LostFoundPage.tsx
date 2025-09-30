/**
 * LostFoundPage Component
 * 
 * Main page component for the Lost & Found management system.
 * Orchestrates all the modular components and manages the overall state.
 */

import React from 'react';
import LostFoundHeader from './LostFoundHeader';
import LostFoundStats from './LostFoundStats';
import LostFoundGrid from './LostFoundGrid';
import type { LostFoundItem, LostFoundStats as StatsType } from './types';
import { sampleLostFoundItems } from './sampleData';

const LostFoundPage: React.FC = () => {
  // Use sample data from external file
  const lostFoundItems: LostFoundItem[] = sampleLostFoundItems;

  // Calculate statistics
  const statusCounts: StatsType = {
    all: lostFoundItems.length,
    unclaimed: lostFoundItems.filter(item => item.status === 'unclaimed').length,
    claimed: lostFoundItems.filter(item => item.status === 'claimed').length,
    disposed: lostFoundItems.filter(item => item.status === 'disposed').length,
  };

  // Handler functions
  const handleViewDetails = (item: LostFoundItem) => {
    console.log('View details for:', item);
    // TODO: Implement view details modal
  };

  const handleMarkClaimed = (item: LostFoundItem) => {
    console.log('Mark as claimed:', item);
    // TODO: Implement mark as claimed functionality
  };


  return (
    <div className="min-h-screen bg-heritage-light">
      {/* Light Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Subtle Light Orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 rounded-full blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl animate-pulse delay-1000 opacity-25"></div>
        <div className="absolute bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 rounded-full blur-3xl animate-pulse delay-2000 opacity-20"></div>
        
        {/* Light Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(134, 134, 134, 0.1) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">
        {/* Header */}
        <LostFoundHeader />

        {/* Stats Cards Grid */}
        <LostFoundStats stats={statusCounts} />

        {/* Items Grid */}
        <LostFoundGrid
          items={lostFoundItems}
          onViewDetails={handleViewDetails}
          onMarkClaimed={handleMarkClaimed}
        />
      </div>
    </div>
  );
};

export default LostFoundPage;
