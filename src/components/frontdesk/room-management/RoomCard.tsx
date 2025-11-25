import React from 'react';

interface GuestInfo {
  name: string;
  checkIn: string;
  checkOut: string;
}

interface RoomCardProps {
  roomNumber: string;
  roomName?: string; // Added: Display name priority
  roomType: string;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  price: number;
  guest?: GuestInfo | string;
  checkIn?: string;
  checkOut?: string;
  features: string[];
  maxFeatures?: number;
  onViewDetails?: () => void;
  onEdit?: () => void;
}

const RoomCard: React.FC<RoomCardProps> = ({
  roomNumber,
  roomName,
  roomType,
  status,
  price,
  guest,
  checkIn,
  checkOut,
  features,
  maxFeatures = 3,
  onViewDetails = () => {},
  onEdit = () => {}
}) => {
  // Helper function to get guest information
  const getGuestInfo = () => {
    if (!guest) return null;
    if (typeof guest === 'string') {
      return { name: guest, checkIn: checkIn || '', checkOut: checkOut || '' };
    } else {
      return guest;
    }
  };

  // Helper function to truncate text if needed
  const truncateText = (text: string, maxLength: number = 20) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
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

  // Helper to render the correct content based on status
  const renderStatusContent = () => {
    // 1. OCCUPIED STATUS (Orange)
    if (status === 'occupied') {
      return (
        <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <div>
              {/* Display Guest Name if available, otherwise just "Booked" */}
              <span className="text-sm font-bold text-orange-900">
                {guestInfo ? guestInfo.name : 'Booked'}
              </span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-orange-700 font-medium">Currently Occupied</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 2. MAINTENANCE STATUS (Red)
    if (status === 'maintenance') {
      return (
        <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-rose-500 rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <span className="text-sm font-semibold text-red-700">Under Maintenance</span>
          </div>
        </div>
      );
    }

    // 3. CLEANING STATUS (Blue)
    if (status === 'cleaning') {
      return (
        <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-sky-500 rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            <span className="text-sm font-semibold text-blue-700">Cleaning in Progress</span>
          </div>
        </div>
      );
    }

    // 4. AVAILABLE STATUS (Green - Default)
    return (
      <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-md">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-emerald-800">Ready for Occupancy</span>
            <span className="text-xs text-emerald-600 font-medium">Vacant</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="group relative bg-white/95 backdrop-blur-sm rounded-3xl border border-white/60 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden h-full flex flex-col">
      {/* Gradient Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/50 to-heritage-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Animated Status Banner */}
      <div className={`h-3 relative overflow-hidden ${statusStyle.banner} shadow-lg`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 animate-pulse"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700">
        <div className="absolute top-8 right-8 w-4 h-4 bg-heritage-green/30 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="absolute top-16 right-16 w-2 h-2 bg-emerald-400/40 rounded-full animate-bounce" style={{ animationDelay: '0.6s' }}></div>
        <div className="absolute bottom-12 left-12 w-3 h-3 bg-heritage-green/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
      </div>
      
      {/* Header */}
      <div className="relative z-10 p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            {/* Room Number Badge */}
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-heritage-green via-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <span className="text-white font-black text-xl tracking-wide">{roomNumber}</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
            </div>
            
            <div className="space-y-1">
              {/* Room Title - Priortize Name, fallback to Type */}
              <h3 className="font-black text-gray-900 text-xl leading-tight group-hover:text-heritage-green transition-colors duration-300">
                {truncateText(roomName || roomType)}
              </h3>
              
              {/* Show Type as subtitle if Name exists */}
              {roomName && (
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  {roomType}
                </p>
              )}

              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-heritage-green">₱{price.toLocaleString()}</span>
                <span className="text-sm text-gray-500 font-medium">/night</span>
              </div>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className="relative">
            <span className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold shadow-lg ${statusStyle.bg} ${statusStyle.text} group-hover:scale-105 transition-transform duration-300`}>
              {statusStyle.label}
            </span>
          </div>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Dynamic Status Content */}
        <div className="relative z-10 px-6 pb-4">
          <div className="h-20 flex items-center">
            {renderStatusContent()}
          </div>
        </div>

        {/* Features */}
        <div className="relative z-10 px-6 pb-4 flex-1">
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-4 rounded-2xl h-full border border-gray-100 shadow-sm">
            <div className="flex flex-wrap gap-2">
              {displayFeatures.map((feature, index) => (
                <span key={index} className="text-xs bg-white text-gray-700 px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm font-medium">
                  {feature}
                </span>
              ))}
              {hasMore && (
                <span className="text-xs bg-gradient-to-r from-heritage-green to-emerald-600 text-white px-3 py-1.5 rounded-xl shadow-md font-bold">
                  +{remainingCount} More
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Actions */}
      <div className="relative z-10 p-6 pt-4 bg-gradient-to-r from-gray-50 to-slate-50 border-t border-gray-200 mt-auto">
        <div className="flex space-x-3">
          {/* Primary Action Button (View Details) */}
          <button 
            onClick={onViewDetails}
            className="flex-1 px-5 py-3.5 bg-gradient-to-r from-heritage-green via-emerald-500 to-emerald-600 text-white text-sm font-bold rounded-2xl hover:from-heritage-green/90 hover:via-emerald-500/90 hover:to-emerald-600/90 transform hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 shadow-xl hover:shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <div className="relative flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>View Details</span>
            </div>
          </button>
          
          {/* Secondary Action Button (Edit) */}
          <button 
            onClick={onEdit}
            className="px-5 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold rounded-2xl hover:from-blue-600 hover:to-blue-700 transform hover:scale-110 hover:-translate-y-0.5 transition-all duration-300 shadow-xl hover:shadow-2xl relative overflow-hidden group"
            title="Edit Room Details"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <div className="relative flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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