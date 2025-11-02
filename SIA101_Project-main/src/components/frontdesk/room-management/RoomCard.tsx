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
    <div className="group relative bg-white/95 backdrop-blur-sm rounded-3xl border border-white/60 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden h-full flex flex-col">
      {/* Gradient Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/50 to-heritage-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Animated Status Banner with Glow Effect */}
      <div className={`h-3 relative overflow-hidden ${statusStyle.banner} shadow-lg`}>
        {/* Animated Shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        {/* Pulse Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 animate-pulse"></div>
      </div>
      
      {/* Enhanced Floating Elements */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700">
        <div className="absolute top-8 right-8 w-4 h-4 bg-heritage-green/30 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="absolute top-16 right-16 w-2 h-2 bg-emerald-400/40 rounded-full animate-bounce" style={{ animationDelay: '0.6s' }}></div>
        <div className="absolute bottom-12 left-12 w-3 h-3 bg-heritage-green/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-4 w-1 h-1 bg-emerald-300/50 rounded-full animate-ping" style={{ animationDelay: '1.4s' }}></div>
      </div>
      
      {/* Enhanced Header with Room Number and Status */}
      <div className="relative z-10 p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            {/* Enhanced Room Number Badge */}
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-heritage-green via-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <span className="text-white font-black text-xl tracking-wide">{roomNumber}</span>
              </div>
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
            </div>
            
            <div className="space-y-1">
              <h3 
                className="font-black text-gray-900 text-xl leading-tight group-hover:text-heritage-green transition-colors duration-300"
                title={roomType.length > 20 ? roomType : undefined}
              >
                {getTruncatedRoomType(roomType)}
              </h3>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-heritage-green" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-lg font-bold text-heritage-green">₱{price.toLocaleString()}</span>
                </div>
                <span className="text-sm text-gray-500 font-medium">/night</span>
              </div>
            </div>
          </div>
          
          {/* Enhanced Status Badge */}
          <div className="relative">
            <span className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold shadow-lg ${statusStyle.bg} ${statusStyle.text} group-hover:scale-105 transition-transform duration-300`}>
              {statusStyle.label}
            </span>
            {/* Badge Glow */}
            <div className={`absolute inset-0 rounded-2xl blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300 ${statusStyle.banner}`}></div>
          </div>
        </div>
      </div>
      
      {/* Content Area - Flexible */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Guest Information Section */}
        <div className="relative z-10 px-6 pb-4">
          <div className="h-20 flex items-center">
            {status === 'occupied' && guestInfo ? (
              <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center shadow-md">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-bold text-orange-900">{guestInfo.name}</span>
                    <div className="flex items-center space-x-1 mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-orange-700 font-medium">Currently Checked In</span>
                    </div>
                  </div>
                </div>
                {guestInfo.checkIn && guestInfo.checkOut && (
                  <div className="text-xs text-orange-600 ml-11 space-x-3">
                    <span className="bg-white/60 px-2 py-1 rounded-lg">📅 In: {guestInfo.checkIn}</span>
                    <span className="bg-white/60 px-2 py-1 rounded-lg">📤 Out: {guestInfo.checkOut}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-gray-600">Room Available</span>
                    <div className="flex items-center space-x-1 mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-500 font-medium">Ready for booking</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Room Features Section */}
        <div className="relative z-10 px-6 pb-4 flex-1">
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-4 rounded-2xl h-full border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-6 h-6 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-lg flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-sm font-bold text-gray-800">Room Amenities</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {displayFeatures.map((feature, index) => (
                <span 
                  key={index} 
                  className="text-xs bg-white text-gray-700 px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 font-medium"
                >
                  {feature}
                </span>
              ))}
              {hasMore && (
                <span 
                  className="text-xs bg-gradient-to-r from-heritage-green to-emerald-600 text-white px-3 py-1.5 rounded-xl shadow-md cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 font-bold"
                  title={`Additional features: ${features.slice(maxFeatures).join(', ')}`}
                >
                  +{remainingCount} More
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Action Buttons - Fixed at Bottom */}
      <div className="relative z-10 p-6 pt-4 bg-gradient-to-r from-gray-50 to-slate-50 border-t border-gray-200 mt-auto">
        <div className="flex space-x-3">
          {/* Primary Action Button */}
          <button 
            onClick={status === 'available' ? onBook : onViewDetails}
            className="flex-1 px-5 py-3.5 bg-gradient-to-r from-heritage-green via-emerald-500 to-emerald-600 text-white text-sm font-bold rounded-2xl hover:from-heritage-green/90 hover:via-emerald-500/90 hover:to-emerald-600/90 focus:outline-none focus:ring-4 focus:ring-heritage-green/30 transform hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 shadow-xl hover:shadow-2xl relative overflow-hidden"
            aria-label={status === 'available' ? `Book room ${roomNumber}` : `View details for room ${roomNumber}`}
          >
            {/* Button Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <div className="relative flex items-center justify-center space-x-2">
              {status === 'available' ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Book Now</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>View Details</span>
                </>
              )}
            </div>
          </button>
          
          {/* Secondary Action Button */}
          <button 
            onClick={onEdit}
            className="px-5 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold rounded-2xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transform hover:scale-110 hover:-translate-y-0.5 transition-all duration-300 shadow-xl hover:shadow-2xl relative overflow-hidden group"
            aria-label={`Edit room ${roomNumber}`}
            title="Edit Room Details"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <div className="relative flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span>Edit</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
