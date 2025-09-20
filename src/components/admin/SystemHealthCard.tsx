import React from 'react';

const SystemHealthCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-full min-h-[400px]">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900">System Health</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-4 animate-pulse shadow-sm"></div>
            <div>
              <span className="text-sm font-semibold text-green-900">All Systems</span>
              <p className="text-xs text-green-700 mt-1">Running smoothly</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
            <span className="text-sm font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">Operational</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl border border-blue-200/50">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-4 animate-pulse shadow-sm"></div>
            <div>
              <span className="text-sm font-semibold text-blue-900">Active Staff</span>
              <p className="text-xs text-blue-700 mt-1">On duty now</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-blue-600">12</span>
            <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">online</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200/50">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-500 rounded-full mr-4 animate-pulse shadow-sm"></div>
            <div>
              <span className="text-sm font-semibold text-purple-900">Room Availability</span>
              <p className="text-xs text-purple-700 mt-1">Ready for guests</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-purple-600">3/10</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200/50">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-500 rounded-full mr-4 animate-pulse shadow-sm"></div>
            <div>
              <span className="text-sm font-semibold text-orange-900">Inventory Alert</span>
              <p className="text-xs text-orange-700 mt-1">Items need restocking</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">3 Items low</span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-heritage-light/30 to-heritage-green/10 rounded-xl border border-heritage-green/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-heritage-green">Overall Performance</span>
            <span className="text-lg font-bold text-heritage-green">98%</span>
          </div>
          <div className="w-full bg-heritage-green/20 rounded-full h-2">
            <div className="bg-gradient-to-r from-heritage-green to-heritage-neutral h-2 rounded-full w-[98%] transition-all duration-1000"></div>
          </div>
          <p className="text-xs text-heritage-green/80 mt-2">Excellent system performance</p>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthCard;
