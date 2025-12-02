import React from 'react';
import type { Room } from './Room-backendLogic/roomService';

interface RoomGridProps {
  rooms: Room[];
  loading: boolean;
  error: string | null;
  onView: (room: Room) => void;
  onEdit: (room: Room) => void;
  // New props for lifted state
  currentPage: number;
  onPageChange: (page: number) => void;
}

const RoomGrid: React.FC<RoomGridProps> = ({
  rooms,
  loading,
  error,
  onView,
  onEdit,
  currentPage,
  onPageChange
}) => {
  const itemsPerPage = 6;

  // Pagination Calculation
  const totalPages = Math.ceil(rooms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRooms = rooms.slice(startIndex, endIndex);

  // Helper: Format Currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Helper: Get Status Styling
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'available':
        return {
          classes: 'bg-green-100 text-green-800 border-green-200',
          label: 'Available',
          dot: 'bg-green-500'
        };
      case 'occupied':
        return {
          classes: 'bg-orange-100 text-orange-800 border-orange-200',
          label: 'Occupied',
          dot: 'bg-orange-500'
        };
      case 'maintenance':
        return {
          classes: 'bg-red-100 text-red-800 border-red-200',
          label: 'Maintenance',
          dot: 'bg-red-500'
        };
      case 'cleaning':
        return {
          classes: 'bg-blue-100 text-blue-800 border-blue-200',
          label: 'Cleaning',
          dot: 'bg-blue-500'
        };
      default:
        return {
          classes: 'bg-gray-100 text-gray-800 border-gray-200',
          label: status,
          dot: 'bg-gray-500'
        };
    }
  };

  // ---------------- Loading State ----------------
  if (loading) {
    return (
      <div className="bg-white/50 backdrop-blur-sm">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-heritage-green mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading rooms...</h3>
          <p className="text-gray-600">Fetching room data from database</p>
        </div>
      </div>
    );
  }

  // ---------------- Error State ----------------
  if (error) {
    return (
      <div className="bg-white/50 backdrop-blur-sm">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-red-600 mb-2">Error Loading Rooms</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-heritage-green text-white px-6 py-2 rounded-xl hover:bg-heritage-green/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ---------------- No Results State ----------------
  if (rooms.length === 0 && !loading) {
    return (
      <div className="bg-white/50 backdrop-blur-sm">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🏨</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No rooms found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
        </div>
      </div>
    );
  }

  // ---------------- Main Table Render ----------------
  return (
    <div className="flex flex-col h-full">
      {/* Table Container */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase">
                Room No.
              </th>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase">
                Details
              </th>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">
                Status
              </th>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-right text-gray-700 uppercase">
                Price
              </th>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">
                Occupancy
              </th>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">
                Features
              </th>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Filler Row Logic to maintain height */}
            {Array.from({ length: itemsPerPage }).map((_, index) => {
              const room = currentRooms[index];

              if (room) {
                const statusStyle = getStatusConfig(room.status);

                return (
                  <tr
                    key={room.id}
                    className="group transition-all duration-300 hover:shadow-sm hover:bg-gray-50"
                    style={{ height: '74px' }}
                  >
                    {/* Column 1: Room Number */}
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-heritage-green/10">
                          <svg className="w-4 h-4 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900 transition-colors group-hover:text-heritage-green">
                            {room.roomNumber}
                          </div>
                          <div className="text-xs font-medium text-gray-500">
                             Floor {room.floor}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Name & Type */}
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-bold text-gray-900 transition-colors group-hover:text-heritage-green">
                          {room.roomName || room.roomType}
                        </div>
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          {room.roomType}
                        </div>
                      </div>
                    </td>

                    {/* Column 3: Status Badge */}
                    <td className="px-6 py-5 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border ${statusStyle.classes}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 mr-2 rounded-full ${statusStyle.dot} animate-pulse`}
                        />
                        {statusStyle.label}
                      </span>
                    </td>

                    {/* Column 4: Price */}
                    <td className="px-6 py-5 text-right whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        {formatCurrency(room.basePrice)}
                      </div>
                      <div className="text-xs font-medium text-gray-500">
                        /night
                      </div>
                    </td>

                    {/* Column 5: Guest Info */}
                    <td className="px-6 py-5 text-center whitespace-nowrap">
                      {room.status === 'occupied' ? (
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-semibold text-gray-900">
                             {/* Safe Access for Guest Name */}
                             {typeof room.guest === 'string' ? room.guest : ((room.guest as any)?.name || 'Guest')}
                          </span>
                          <span className="text-xs text-gray-500">
                             Current Guest
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          Vacant
                        </span>
                      )}
                    </td>

                    {/* Column 6: Stats (Size/Capacity) */}
                    <td className="px-6 py-5 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-2 text-xs text-gray-600">
                         <span title="Max Guests" className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            {room.maxGuests}
                         </span>
                         {room.roomSize && (
                             <span title="Room Size" className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                                {room.roomSize}
                             </span>
                         )}
                      </div>
                    </td>

                    {/* Column 7: Actions */}
                    <td className="px-6 py-5 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onView(room);
                          }}
                          className="px-3 py-1.5 text-xs font-medium rounded-full border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(room);
                          }}
                          className="px-3 py-1.5 text-xs font-semibold rounded-full text-white bg-heritage-green hover:bg-heritage-green/90 transition-colors shadow-sm"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }

              // Empty Row Filler
              return (
                <tr key={`empty-${index}`} style={{ height: '74px' }}>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-300">-</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-300">-</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-300 text-center">-</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-300 text-right">-</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-300 text-center">-</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-300 text-center">-</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-300 text-center">-</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-100 bg-white/50">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="ml-1">Previous</span>
              </button>

              <div className="flex items-center space-x-2">
                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  let pageNum: number;

                  if (totalPages <= 7) {
                    pageNum = i + 1;
                  } else {
                    const start = Math.max(1, Math.min(currentPage - 3, totalPages - 6));
                    pageNum = start + i;
                  }

                  const isActive = pageNum === currentPage;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`inline-flex items-center justify-center min-w-[38px] h-10 px-3 text-sm font-medium rounded-md transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-heritage-green to-heritage-neutral text-white shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="mr-1">Next</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomGrid;