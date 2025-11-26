import React, { useState, useMemo, useRef, useEffect } from 'react';
import { WalkInModal } from './WalkInModal';

// --- UPDATED IMPORT ---
import { BookingData } from './ReservationsContext';

interface ModernReservationsTableProps {
  reservations: BookingData[];
  onRowClick: (reservation: BookingData) => void;
  onCheckIn: (reservation: BookingData) => void;
  onCheckOut: (reservation: BookingData) => void;
  onEdit: (reservation: BookingData) => void;
  onCancel: (reservation: BookingData) => void;
  onAddReservation?: (booking: any) => void;
}

const ModernReservationsTable: React.FC<ModernReservationsTableProps> = ({
  reservations,
  onRowClick,
  onCheckIn,
  onCheckOut,
  onEdit,
  onCancel,
  onAddReservation,
}) => {
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter & Sort Logic
  const filteredReservations = useMemo(() => {
    if (!reservations || reservations.length === 0) {
      return [];
    }
    const getStatusPriority = (status: string) => {
      if (status === 'checked-in' || status === 'confirmed') {
        return 1;
      }
      return 2;
    };
    return reservations
      .filter(reservation => {
        const searchLower = (searchTerm || '').toLowerCase().trim();
        const matchesSearch = searchLower === '' || 
          (reservation.userName && reservation.userName.toLowerCase().includes(searchLower)) ||
          (reservation.userEmail && reservation.userEmail.toLowerCase().includes(searchLower)) ||
          (reservation.roomName && reservation.roomName.toLowerCase().includes(searchLower)) ||
          (reservation.roomNumber && reservation.roomNumber.toLowerCase().includes(searchLower)) ||
          (reservation.bookingId && reservation.bookingId.toLowerCase().includes(searchLower));
        
        const matchesStatus = !selectedStatus || 
          selectedStatus === 'All Status' || 
          (selectedStatus === 'Confirmed' && reservation.status === 'confirmed') ||
          (selectedStatus === 'Checked In' && reservation.status === 'checked-in') ||
          (selectedStatus === 'Checked Out' && reservation.status === 'checked-out') ||
          (selectedStatus === 'Cancelled' && reservation.status === 'cancelled');
        
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const priorityA = getStatusPriority(a.status);
        const priorityB = getStatusPriority(b.status);
        
        if (priorityA !== priorityB) {
          return priorityA - priorityB; 
        }

        const timeA = a.createdAt?.toMillis() || 0;
        const timeB = b.createdAt?.toMillis() || 0;
        
        return timeB - timeA; 
      });
  }, [reservations, searchTerm, selectedStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedReservations = filteredReservations.slice(startIndex, endIndex);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus]);

  // Helper: Status Badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { 
        bg: 'bg-gradient-to-r from-amber-100 to-yellow-100', 
        text: 'text-amber-800', 
        dot: 'bg-amber-400',
        label: 'Confirmed' 
      },
      'checked-in': { 
        bg: 'bg-gradient-to-r from-emerald-100 to-green-100', 
        text: 'text-emerald-800', 
        dot: 'bg-emerald-400',
        label: 'Checked In' 
      },
      'checked-out': { 
        bg: 'bg-gradient-to-r from-blue-100 to-indigo-100', 
        text: 'text-blue-800', 
        dot: 'bg-blue-400',
        label: 'Checked Out' 
      },
      cancelled: { 
        bg: 'bg-gradient-to-r from-red-100 to-rose-100', 
        text: 'text-red-800', 
        dot: 'bg-red-400',
        label: 'Cancelled' 
      }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.confirmed;
    return (
      <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text} border border-white/50 shadow-sm`}>
        <div className={`w-2 h-2 ${config.dot} rounded-full animate-pulse`}></div>
        <span>{config.label}</span>
      </div>
    );
  };

  // Helper: Payment Badge
  const getPaymentBadge = (status: string) => {
    const paymentConfig = {
      paid: { bg: 'bg-gradient-to-r from-green-100 to-emerald-100', text: 'text-green-800', icon: '✓', label: 'Paid' },
      pending: { bg: 'bg-gradient-to-r from-orange-100 to-amber-100', text: 'text-orange-800', icon: '⏳', label: 'Pending' },
      refunded: { bg: 'bg-gradient-to-r from-gray-100 to-slate-100', text: 'text-gray-800', icon: '↩', label: 'Refunded' }
    };
    const config = paymentConfig[status as keyof typeof paymentConfig] || paymentConfig.pending;
    return (
      <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text} border border-white/50 shadow-sm`}>
        <span>{config.icon}</span>
        <span>{config.label}</span>
      </div>
    );
  };

  // Helper: Action Buttons
  const getActionButtons = (reservation: BookingData) => (
    <div className="flex items-center justify-center space-x-2">
      {reservation.status === 'confirmed' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCheckIn(reservation);
          }}
          className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
        >
          Check In
        </button>
      )}
      
      {reservation.status === 'checked-in' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCheckOut(reservation); 
          }}
          className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
        >
          Check Out
        </button>
      )}

      {reservation.status !== 'cancelled' && reservation.status !== 'checked-out' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(reservation);
          }}
          className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
        >
          Edit
        </button>
      )}

      {reservation.status === 'confirmed' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCancel(reservation); 
          }}
          className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
        >
          Cancel
        </button>
      )}
      
      {(reservation.status === 'checked-out' || reservation.status === 'cancelled') && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRowClick(reservation);
          }}
          className="px-3 py-1.5 bg-gradient-to-r from-gray-400 to-gray-500 text-white text-xs font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
        >
          View
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 bg-gradient-to-r from-slate-50 to-white border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-heritage-green to-emerald-400 rounded-2xl blur opacity-30"></div>
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">Reservations</h3>
              <p className="text-sm text-gray-500 font-medium">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredReservations.length)} of {filteredReservations.length} reservations
                {searchTerm && <span className="ml-2 text-heritage-green">• Searching: "{searchTerm}"</span>}
                {selectedStatus !== 'All Status' && <span className="ml-2 text-blue-600">• Status: {selectedStatus}</span>}
              </p>
            </div>
          </div>
          <div className="flex space-x-4">
            {/* Search Bar */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-heritage-green/20 to-emerald-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-heritage-green z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search guests, rooms, or reservations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-6 py-3 w-80 border border-white/40 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-heritage-green/50 focus:border-heritage-green/50 bg-white/70 backdrop-blur-sm shadow-lg placeholder-gray-500 transition-all duration-300"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="relative group" ref={dropdownRef}>
              <div className="absolute inset-0 bg-gradient-to-r from-heritage-green/20 to-emerald-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-between px-6 py-3 w-48 border border-white/40 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-heritage-green/50 focus:border-heritage-green/50 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300 cursor-pointer hover:bg-white/90"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-heritage-green to-emerald-500 rounded-full"></div>
                    <span className="text-gray-800">{selectedStatus}</span>
                  </div>
                  <svg 
                    className={`w-4 h-4 text-heritage-green transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-[9999]" 
                      onClick={() => setIsDropdownOpen(false)}
                    ></div>
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[10000]">
                      {['All Status', 'Confirmed', 'Checked In', 'Checked Out', 'Cancelled'].map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setSelectedStatus(status);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full flex items-center space-x-3 px-6 py-3 text-left text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-heritage-green/10 hover:to-emerald-500/10 ${
                            selectedStatus === status 
                              ? 'bg-gradient-to-r from-heritage-green/20 to-emerald-500/20 text-heritage-green border-l-4 border-heritage-green' 
                              : 'text-gray-700 hover:text-heritage-green'
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full transition-all duration-200 ${
                            selectedStatus === status 
                              ? 'bg-gradient-to-r from-heritage-green to-emerald-500' 
                              : 'bg-gray-300'
                          }`}></div>
                          <span className="flex-1">{status}</span>
                          {selectedStatus === status && (
                            <svg className="w-4 h-4 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Add Button */}
            <button 
              onClick={() => setIsWalkInModalOpen(true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-heritage-green to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:from-heritage-green/90 hover:to-emerald-600/90 hover:shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Reservation
            </button>
          </div>
        </div>
      </div>
      
      <WalkInModal 
        isOpen={isWalkInModalOpen}
        onClose={() => setIsWalkInModalOpen(false)}
        onBooking={(booking) => {
          if (onAddReservation) {
            onAddReservation(booking);
          }
          setIsWalkInModalOpen(false);
        }}
      />
      
      {/* Table */}
      <div className="overflow-x-auto h-[580px]">
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200/50">
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-[25%]">Guest</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-[15%]">Room</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-[10%]">Dates</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-[10%]">Status</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-[10%]">Payment</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider w-[10%]">Amount</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-[20%]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/50">
            {paginatedReservations.map((reservation, index) => (
              <tr
                key={reservation.bookingId}
                onClick={() => onRowClick(reservation)}
                className="group h-20 hover:bg-gradient-to-r hover:from-heritage-green/5 hover:to-emerald-50/50 cursor-pointer transition-all duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-sm">
                        {reservation.userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-heritage-green transition-colors">
                        {reservation.userName}
                      </div>
                      <div className="text-sm text-gray-500">{reservation.userEmail}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-semibold text-gray-900">{reservation.roomName}</div>
                    {reservation.roomNumber && (
                      <div className="text-sm text-gray-500">Room {reservation.roomNumber}</div>
                    )}
                    <div className="flex items-center mt-1 text-xs text-gray-400">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      {reservation.guests} guests
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-gray-900">
                      {(() => {
                        try {
                          if (!reservation.checkIn || !reservation.checkOut) return 'Invalid Date';
                          const checkInDate = new Date(reservation.checkIn);
                          const checkOutDate = new Date(reservation.checkOut);
                          if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
                            return 'Invalid Date';
                          }
                          const formatDate = (date: Date) => {
                            const month = date.toLocaleDateString('en-US', { month: 'short' });
                            const day = date.getDate().toString().padStart(2, '0');
                            return `${month} ${day}`;
                          };
                          return `${formatDate(checkInDate)} - ${formatDate(checkOutDate)}`;
                        } catch (error) {
                          return 'Invalid Date';
                        }
                      })()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {reservation.nights} night{reservation.nights !== 1 ? 's' : ''}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  {getStatusBadge(reservation.status)}
                </td>
                <td className="px-6 py-4 text-center">
                  {getPaymentBadge(reservation.paymentStatus)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="font-bold text-gray-900 text-lg">
                    ₱{reservation.totalAmount.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  {getActionButtons(reservation)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-6 pb-6 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              Previous
            </button>

            {/* Simple Pagination Logic */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(currentPage - p) <= 1)
              .map((page, i, arr) => {
                const isGap = i > 0 && page - arr[i - 1] > 1;
                return (
                  <React.Fragment key={page}>
                    {isGap && <span className="text-gray-400">...</span>}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-md transition-colors ${
                        currentPage === page
                          ? 'bg-heritage-green text-white'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                );
              })}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-heritage-green hover:text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {reservations.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-gray-500">Reservations will appear here when available</p>
        </div>
      )}

    </div>
  );
};

export default ModernReservationsTable;