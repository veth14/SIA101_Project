/**
 * LostFoundCard Component
 * 
 * Displays individual lost and found item information in a card format.
 * Includes item details, status badge, category icon, and action buttons.
 */

import React from 'react';
import type { ItemCardProps, LostFoundItem } from './types';

/**
 * Gets the appropriate status badge for an item
 */
const getStatusBadge = (status: LostFoundItem['status']) => {
  const statusConfig = {
    unclaimed: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Unclaimed' },
    claimed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Claimed' },
    disposed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Disposed' }
  };
  
  const config = statusConfig[status] || statusConfig.unclaimed;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};


/**
 * Individual item card component for Lost & Found items
 * 
 * @param item - Lost and found item data
 * @param onViewDetails - Function to handle viewing item details
 * @param onMarkClaimed - Function to handle marking item as claimed
 */
const LostFoundCard: React.FC<ItemCardProps> = ({ item, onViewDetails, onMarkClaimed }) => {
  return (
    <div className="group bg-white rounded-3xl border border-gray-200 shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 overflow-hidden relative">
      {/* Animated Status Banner */}
      <div className={`h-2 relative overflow-hidden ${
        item.status === 'unclaimed' ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500' :
        item.status === 'claimed' ? 'bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500' :
        'bg-gradient-to-r from-red-400 via-rose-400 to-red-500'
      }`}>
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
      </div>
      
      {/* Floating Background Elements */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-6 right-6 w-3 h-3 bg-heritage-green/20 rounded-full animate-pulse"></div>
        <div className="absolute top-12 right-12 w-2 h-2 bg-heritage-green/15 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-8 left-8 w-2.5 h-2.5 bg-heritage-green/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      {/* Header with Icon and Status */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-heritage-green transition-colors">
              {item.itemName}
            </h3>
            <p className="text-sm text-gray-500 font-medium">#{item.id}</p>
          </div>
          {getStatusBadge(item.status)}
        </div>
        
        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
          {item.description}
        </p>
      </div>
      
      {/* Details Section */}
      <div className="px-6 pb-4 space-y-3">
        {/* Location */}
        <div className="flex items-center space-x-3 p-2 rounded-lg bg-blue-50 border border-blue-100">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-blue-800">{item.location}</span>
        </div>
        
        {/* Found By */}
        <div className="flex items-center space-x-3 p-2 rounded-lg bg-purple-50 border border-purple-100">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-purple-800">{item.foundBy}</span>
        </div>
        
        {/* Date Found */}
        <div className="flex items-center space-x-3 p-2 rounded-lg bg-indigo-50 border border-indigo-100">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-indigo-800">
            {new Date(item.dateFound).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </span>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="p-6 pt-4 bg-gray-50 border-t border-gray-100">
        <div className="flex space-x-3">
          <button 
            onClick={() => onViewDetails(item)}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-heritage-green to-green-600 text-white text-sm font-semibold rounded-xl hover:from-heritage-green/90 hover:to-green-600/90 focus:outline-none focus:ring-4 focus:ring-heritage-green/20 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>View Details</span>
            </div>
          </button>
          <button 
            onClick={() => item.status === 'unclaimed' ? onMarkClaimed(item) : undefined}
            disabled={item.status !== 'unclaimed'}
            className={`flex-1 px-4 py-3 text-sm font-semibold rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 ${
              item.status === 'unclaimed'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500/20 transform hover:scale-105 shadow-lg hover:shadow-xl'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              {item.status === 'unclaimed' ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Mark Claimed</span>
                </>
              ) : (
                <span>{item.status === 'claimed' ? 'Already Claimed' : 'Disposed'}</span>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LostFoundCard;
