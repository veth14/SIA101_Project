import React from 'react';
import { Link } from 'react-router-dom';

const QuickActionsCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-full">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-heritage-green to-heritage-neutral rounded-xl flex items-center justify-center shadow-md">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
      </div>
      
      <div className="space-y-4">
        <Link
          to="/admin/frontdesk"
          className="group flex items-center p-4 bg-gradient-to-r from-heritage-green to-heritage-neutral text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
        >
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-4">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-semibold">Front Desk</p>
            <p className="text-sm opacity-90">Manage reservations</p>
          </div>
          <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </Link>
        
        <Link
          to="/admin/inventory"
          className="group flex items-center p-4 border-2 border-gray-200 hover:border-heritage-green rounded-xl hover:shadow-md transition-all duration-300"
        >
          <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center mr-4 group-hover:bg-yellow-100 transition-colors">
            <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Inventory</p>
            <p className="text-sm text-gray-500">Stock management</p>
          </div>
          <svg className="w-5 h-5 ml-2 text-gray-400 group-hover:text-heritage-green group-hover:translate-x-1 transition-all" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </Link>
        
        <Link
          to="/admin/analytics"
          className="group flex items-center p-4 border-2 border-gray-200 hover:border-heritage-green rounded-xl hover:shadow-md transition-all duration-300"
        >
          <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mr-4 group-hover:bg-purple-100 transition-colors">
            <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Analytics</p>
            <p className="text-sm text-gray-500">Reports & insights</p>
          </div>
          <svg className="w-5 h-5 ml-2 text-gray-400 group-hover:text-heritage-green group-hover:translate-x-1 transition-all" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default QuickActionsCard;
