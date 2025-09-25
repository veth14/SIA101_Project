import React from 'react';

interface RoomCardProps {
  roomNumber: string;
  roomType: string;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  price: number;
  guest?: string;
  checkIn?: string;
  checkOut?: string;
  features: string[];
  colorScheme: 'green' | 'orange' | 'red' | 'blue';
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
  colorScheme
}) => {
  const colorConfig = {
    green: {
      gradient: 'from-emerald-500 to-green-500',
      bg: 'bg-emerald-100',
      text: 'text-emerald-800',
      border: 'border-emerald-200/50'
    },
    orange: {
      gradient: 'from-orange-500 to-amber-500',
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      border: 'border-orange-200/50'
    },
    red: {
      gradient: 'from-red-500 to-rose-500',
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200/50'
    },
    blue: {
      gradient: 'from-blue-500 to-indigo-500',
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-200/50'
    }
  };

  const statusConfig = {
    available: { bg: 'bg-green-100', text: 'text-green-800', label: 'Available', dot: 'bg-green-500' },
    occupied: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Occupied', dot: 'bg-orange-500' },
    maintenance: { bg: 'bg-red-100', text: 'text-red-800', label: 'Maintenance', dot: 'bg-red-500' },
    cleaning: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Cleaning', dot: 'bg-blue-500' }
  };

  const colors = colorConfig[colorScheme];
  const statusStyle = statusConfig[status];

  return (
    <div className="group relative">
      <div className={`absolute -inset-1 bg-gradient-to-r ${colors.gradient} rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500`}></div>
      <div className={`relative bg-gradient-to-br from-white/95 to-gray-50/50 backdrop-blur-xl rounded-2xl ${colors.border} border shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 p-6`}>
        
        {/* Header with Room Number and Status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${colors.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <span className="text-white font-bold text-lg">{roomNumber}</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-700 transition-colors">{roomType}</h3>
              <p className="text-sm text-gray-600 font-medium">₱{price.toLocaleString()}/night</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${statusStyle.bg} ${statusStyle.text}`}>
              <div className={`w-1.5 h-1.5 ${statusStyle.dot} rounded-full mr-1 animate-pulse`}></div>
              {statusStyle.label}
            </span>
          </div>
        </div>

        {/* Guest Information (if occupied) */}
        {status === 'occupied' && guest && (
          <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm font-semibold text-orange-800">{guest}</span>
            </div>
            {checkIn && checkOut && (
              <div className="text-xs text-orange-600">
                <span>Check-in: {checkIn}</span> • <span>Check-out: {checkOut}</span>
              </div>
            )}
          </div>
        )}

        {/* Room Features */}
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Features:</p>
          <div className="flex flex-wrap gap-1">
            {features.map((feature, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="flex-1 px-3 py-2 bg-gradient-to-r from-heritage-green to-heritage-neutral text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold text-sm">
            {status === 'available' ? 'Book Room' : 'View Details'}
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200" title="Edit">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button className="p-2 hover:bg-red-50 rounded-lg transition-colors duration-200" title="Delete">
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
