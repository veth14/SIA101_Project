import React from 'react';

export const ItemsEmptyState: React.FC = () => {
  return (
    <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-12 text-center hover:shadow-3xl transition-all duration-700 group overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/5 via-blue-50/30 to-purple-50/20 rounded-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-700"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-heritage-green/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
      
      <div className="relative">
        <div className="text-8xl mb-6 animate-bounce">📦</div>
        <h3 className="text-2xl font-bold text-heritage-green mb-3 drop-shadow-sm">No items found</h3>
        <p className="text-gray-600 text-lg mb-6">Try adjusting your search criteria or filters.</p>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Clear filters to see all inventory items</span>
        </div>
      </div>
    </div>
  );
};
