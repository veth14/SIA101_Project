/**
 * RoomCard Component
 * 
 * Premium modern room card with beautiful gradients and animations.
 * Displays room information, status, guest details, and action buttons.
 */

import React from 'react';

interface GuestInfo {
  name: string;
  checkIn: string;
  checkOut: string;
}

interface RoomCardProps {
  roomNumber: string;
  roomType: string;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  price: number;
  guest?: GuestInfo | string; // Support both old and new format
  checkIn?: string; // Deprecated - use guest.checkIn
  checkOut?: string; // Deprecated - use guest.checkOut
  features: string[];
  maxFeatures?: number; // Default: 3
  onViewDetails?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onBook?: () => void;
}

const RoomCard: React.FC<RoomCardProps> = ({
  roomNumber,
  roomType,
  status,
  price,
  guest,
  checkIn,
  checkOut,
  features,
  maxFeatures = 3,
  onViewDetails = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onBook = () => {}
}) => {
  // Helper function to get guest information
  const getGuestInfo = () => {
    if (!guest) return null;
    
    if (typeof guest === 'string') {
      // Legacy format - guest is just a name string
      return {
        name: guest,
        checkIn: checkIn || '',
        checkOut: checkOut || ''
      };
    } else {
      // New format - guest is an object
      return guest;
    }
  };

  // Helper function to truncate room type with tooltip
  const getTruncatedRoomType = (roomType: string, maxLength: number = 20) => {
    if (roomType.length <= maxLength) return roomType;
    return roomType.substring(0, maxLength) + '...';
  };

  // Helper function to manage features display
  const getDisplayFeatures = () => {
    const displayFeatures = features.slice(0, maxFeatures);
    const remainingCount = features.length - maxFeatures;
    return {
      displayFeatures,
      remainingCount: remainingCount > 0 ? remainingCount : 0,
      hasMore: remainingCount > 0
    };
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: { bg: 'bg-green-100', text: 'text-green-800', label: '✅ Available', banner: 'bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500' },
      occupied: { bg: 'bg-orange-100', text: 'text-orange-800', label: '👥 Occupied', banner: 'bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500' },
      maintenance: { bg: 'bg-red-100', text: 'text-red-800', label: '🔧 Maintenance', banner: 'bg-gradient-to-r from-red-400 via-rose-400 to-red-500' },
      cleaning: { bg: 'bg-blue-100', text: 'text-blue-800', label: '🧹 Cleaning', banner: 'bg-gradient-to-r from-blue-400 via-sky-400 to-blue-500' }
    };
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.available;
  };

  const statusStyle = getStatusBadge(status);
  const guestInfo = getGuestInfo();
  const { displayFeatures, remainingCount, hasMore } = getDisplayFeatures();

  return (
    <div className="group bg-white rounded-3xl border border-gray-200 shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 overflow-hidden relative h-full flex flex-col">
      {/* Animated Status Banner */}
      <div className={`h-2 relative overflow-hidden ${statusStyle.banner}`}>
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
      </div>
      
      {/* Floating Background Elements */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-6 right-6 w-3 h-3 bg-heritage-green/20 rounded-full animate-pulse"></div>
        <div className="absolute top-12 right-12 w-2 h-2 bg-heritage-green/15 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-8 left-8 w-2.5 h-2.5 bg-heritage-green/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      {/* Header with Room Number and Status */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-xl">{roomNumber}</span>
            </div>
            <div>
              <h3 
                className="font-bold text-gray-900 text-lg leading-tight group-hover:text-heritage-green transition-colors"
                title={roomType.length > 20 ? roomType : undefined}
              >
                {getTruncatedRoomType(roomType)}
              </h3>
              <p className="text-sm text-gray-500 font-medium">₱{price.toLocaleString()}/night</p>
            </div>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
            {statusStyle.label}
          </span>
        </div>
      </div>
      
      {/* Content Area - Flexible */}
      <div className="flex-1 flex flex-col">
        {/* Guest Information Section - Always Fixed Height */}
        <div className="px-6 pb-4">
          <div className="h-16 flex items-center">
            {status === 'occupied' && guestInfo ? (
              <div className="w-full p-3 rounded-lg bg-orange-50 border border-orange-100">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-orange-800">{guestInfo.name}</span>
                </div>
                {guestInfo.checkIn && guestInfo.checkOut && (
                  <div className="text-xs text-orange-600 ml-8">
                    <span>Check-in: {guestInfo.checkIn}</span> • <span>Check-out: {guestInfo.checkOut}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full p-3 rounded-lg bg-gray-50 border border-gray-100 opacity-50">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-400 italic">No guest assigned</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Room Features - Flexible */}
        <div className="px-6 pb-4 flex-1">
          <div className="bg-gray-50 p-3 rounded-lg h-full">
            <p className="text-sm font-semibold text-gray-700 mb-2">🏠 Room Features:</p>
            <div className="flex flex-wrap gap-1">
              {displayFeatures.map((feature, index) => (
                <span key={index} className="text-xs bg-white text-gray-700 px-2 py-1 rounded-full border border-gray-200 shadow-sm">
                  {feature}
                </span>
              ))}
              {hasMore && (
                <span 
                  className="text-xs bg-heritage-green text-white px-2 py-1 rounded-full border border-heritage-green shadow-sm cursor-pointer hover:bg-heritage-green/90 transition-colors"
                  title={`Additional features: ${features.slice(maxFeatures).join(', ')}`}
                >
                  +{remainingCount} More
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons - Fixed at Bottom */}
      <div className="p-6 pt-4 bg-gray-50 border-t border-gray-100 mt-auto">
        <div className="flex space-x-3">
          <button 
            onClick={status === 'available' ? onBook : onViewDetails}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-heritage-green to-emerald-600 text-white text-sm font-semibold rounded-xl hover:from-heritage-green/90 hover:to-emerald-600/90 focus:outline-none focus:ring-4 focus:ring-heritage-green/20 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            aria-label={status === 'available' ? `Book room ${roomNumber}` : `View details for room ${roomNumber}`}
          >
            <div className="flex items-center justify-center space-x-2">
              {status === 'available' ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Book Room</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>View Details</span>
                </>
              )}
            </div>
          </button>
          <button 
            onClick={onEdit}
            className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            aria-label={`Edit room ${roomNumber}`}
            title="Edit Room"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button 
            onClick={onDelete}
            className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold rounded-xl hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/20 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            aria-label={`Delete room ${roomNumber}`}
            title="Delete Room"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
