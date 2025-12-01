import React, { useState, useMemo, useRef, useEffect } from 'react';
import { WalkInModal } from './WalkInModal';
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

// --- UPDATED: Status Dropdown ---
const StatusDropdown: React.FC<{
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}> = ({ selectedStatus, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const statusOptions = [
    { value: 'All Status', label: 'All Status', color: 'bg-gray-300' },
    { value: 'Confirmed', label: 'Confirmed', color: 'bg-amber-400' },
    { value: 'Checked In', label: 'Checked In', color: 'bg-emerald-400' },
    { value: 'Checked Out', label: 'Checked Out', color: 'bg-blue-400' },
    { value: 'Cancelled', label: 'Cancelled', color: 'bg-red-400' }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    onStatusChange(val);
    setIsOpen(false);
  };

  const currentOption = statusOptions.find(opt => opt.value === selectedStatus) || statusOptions[0];

  return (
    <div className="relative z-[100000]" ref={dropdownRef}>
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-[#82A33D]/20 to-emerald-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center justify-between px-6 py-3 w-52 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#82A33D]/50 focus:border-[#82A33D]/50 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300 cursor-pointer hover:bg-white/90"
        >
          <div className="flex items-center space-x-3">
            <div className={`w-2 h-2 rounded-full ${currentOption.color}`}></div>
            <span className="text-gray-800 truncate">{currentOption.label}</span>
          </div>
          <svg 
            className={`w-4 h-4 text-[#82A33D] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[99999]">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full flex items-center justify-between px-6 py-3 text-left text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-[#82A33D]/10 hover:to-emerald-500/10 ${
                selectedStatus === option.value 
                  ? 'bg-gradient-to-r from-[#82A33D]/20 to-emerald-500/20 text-[#82A33D] border-l-4 border-[#82A33D]' 
                  : 'text-gray-700 hover:text-[#82A33D]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full transition-all duration-200 ${option.color}`}></div>
                <span className="flex-1">{option.label}</span>
              </div>
              
              {selectedStatus === option.value && (
                <svg className="w-4 h-4 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
      
      {isOpen && (
        <div 
          className="fixed inset-0 z-[99998]" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter & Sort Logic
  const filteredReservations = useMemo(() => {
    if (!reservations || reservations.length === 0) return [];
    
    const getStatusPriority = (status: string) => {
      if (status === 'checked-in' || status === 'confirmed') return 1;
      return 2;
    };

    const getCreatedAtMs = (value: unknown): number => {
      if (!value) return 0;

      // Firestore Timestamp (has toMillis)
      if (typeof value === 'object' && value !== null && 'toMillis' in value && typeof (value as any).toMillis === 'function') {
        return (value as any).toMillis();
      }

      // JS Date instance
      if (value instanceof Date) {
        return value.getTime();
      }

      // Plain number (assume ms since epoch)
      if (typeof value === 'number') {
        return value;
      }

      // ISO/string date
      if (typeof value === 'string') {
        const ms = new Date(value).getTime();
        return Number.isNaN(ms) ? 0 : ms;
      }

      return 0;
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
        if (priorityA !== priorityB) return priorityA - priorityB; 
        const timeA = getCreatedAtMs(a.createdAt as unknown);
        const timeB = getCreatedAtMs(b.createdAt as unknown);
        return timeB - timeA; 
      });
  }, [reservations, searchTerm, selectedStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedReservations = filteredReservations.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus]);

  // --- Helpers for Badges (Matching Inventory Style) ---
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200', dot: 'bg-yellow-500', label: 'Confirmed' },
      'checked-in': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', dot: 'bg-green-500', label: 'Checked In' },
      'checked-out': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', dot: 'bg-blue-500', label: 'Checked Out' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', dot: 'bg-red-500', label: 'Cancelled' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.confirmed;
    
    return (
      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border ${config.bg} ${config.text} ${config.border}`}>
        <span className={`w-1.5 h-1.5 mr-2 rounded-full ${config.dot} animate-pulse`} />
        {config.label}
      </span>
    );
  };

  const getPaymentBadge = (status: string) => {
    const paymentConfig = {
      paid: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Paid' },
      pending: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', label: 'Pending' },
      refunded: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', label: 'Refunded' }
    };
    const config = paymentConfig[status as keyof typeof paymentConfig] || paymentConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
        {config.label}
      </span>
    );
  };

  // --- Action Buttons ---
  const getActionButtons = (reservation: BookingData) => (
    <div className="flex items-center justify-center gap-2">
      {/* Primary Action */}
      {reservation.status === 'confirmed' && (
        <button 
          onClick={(e) => { e.stopPropagation(); onCheckIn(reservation); }} 
          className="px-3 py-1.5 text-xs font-semibold rounded-full text-white bg-[#82A33D] hover:bg-[#82A33D]/90 transition-colors shadow-sm"
        >
          Check In
        </button>
      )}
      {reservation.status === 'checked-in' && (
        <button 
          onClick={(e) => { e.stopPropagation(); onCheckOut(reservation); }} 
          className="px-3 py-1.5 text-xs font-semibold rounded-full text-white bg-blue-600 hover:bg-indigo-600 transition-colors shadow-sm"
        >
          Check Out
        </button>
      )}

      {/* Secondary Action */}
      {reservation.status !== 'cancelled' && reservation.status !== 'checked-out' && (
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit(reservation); }} 
          className="px-3 py-1.5 text-xs font-medium rounded-full border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          Edit
        </button>
      )}
      
      {/* Destructive Action */}
      {reservation.status === 'confirmed' && (
        <button 
          onClick={(e) => { e.stopPropagation(); onCancel(reservation); }} 
          className="px-3 py-1.5 text-xs font-medium rounded-full border border-red-100 text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
        >
          Cancel
        </button>
      )}
      
      {/* View Only */}
      {(reservation.status === 'checked-out' || reservation.status === 'cancelled') && (
        <button 
          onClick={(e) => { e.stopPropagation(); onRowClick(reservation); }} 
          className="px-3 py-1.5 text-xs font-medium rounded-full border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          View Details
        </button>
      )}
    </div>
  );

  return (
    // ADDED: min-h-[750px] to keep table fixed height
    <div className="flex flex-col bg-white border shadow-md rounded-xl border-gray-200/70 overflow-hidden min-h-[750px]">
      
      {/* --- HEADER & FILTERS --- */}
      <div className="p-5 border-b border-gray-200/70 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Left: Title & Stats */}
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-[#82A33D]/10 rounded-xl">
               <svg className="w-6 h-6 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </div>
            <div>
              <h3 className="flex items-center gap-3 text-2xl font-black text-gray-900">
                Reservations
              </h3>
              <p className="flex items-center gap-2 mt-2 text-sm text-gray-600 font-medium">
                <span className="inline-flex items-center px-2 py-1 bg-[#82A33D]/10 text-[#82A33D] rounded-lg text-xs font-semibold">
                  {reservations.length > 0
                    ? `${filteredReservations.length > 0 ? startIndex + 1 : 0}-${Math.min(endIndex, filteredReservations.length)} of ${filteredReservations.length}`
                    : '0 results'}
                </span>
                <span className="text-gray-400">•</span>
                <span>Paginated view</span>
              </p>
            </div>
          </div>

          {/* Right: Search, Filter, Add Button */}
          <div className="flex flex-wrap items-center gap-3 justify-end flex-1">
            <div className="relative flex-1 min-w-[260px] max-w-xl group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400 group-focus-within:text-[#82A33D] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search guests, rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium placeholder:text-gray-400 hover:border-gray-300"
              />
            </div>

            <StatusDropdown 
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
            />
            
            <button 
              onClick={() => setIsWalkInModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-[#82A33D] transition-all bg-white border-2 border-[#82A33D]/20 rounded-xl hover:bg-[#82A33D] hover:text-white hover:border-[#82A33D] shadow-sm hover:shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Reservation</span>
            </button>
          </div>
        </div>
      </div>
      
      <WalkInModal 
        isOpen={isWalkInModalOpen}
        onClose={() => setIsWalkInModalOpen(false)}
        onBooking={(booking) => {
          if (onAddReservation) onAddReservation(booking);
          setIsWalkInModalOpen(false);
        }}
      />
      
      {/* --- TABLE --- */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full table-fixed">
          <thead className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase w-[25%]">Guest</th>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase w-[15%]">Room</th>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase w-[15%]">Dates</th>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase w-[10%]">Status</th>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase w-[10%]">Payment</th>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-right text-gray-700 uppercase w-[10%]">Amount</th>
              <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase w-[15%]">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedReservations.length > 0 ? (
              paginatedReservations.map((reservation, index) => (
                <tr
                  key={reservation.bookingId}
                  onClick={() => onRowClick(reservation)}
                  className="group transition-all duration-300 hover:shadow-sm hover:bg-gray-50 cursor-pointer h-20"
                >
                  {/* Guest Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-[#82A33D]/10 flex items-center justify-center">
                        <span className="text-[#82A33D] font-bold text-sm">
                          {reservation.userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900 group-hover:text-[#82A33D] transition-colors">
                          {reservation.userName}
                        </div>
                        <div className="text-xs font-medium text-gray-500">{reservation.userEmail}</div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Room Info */}
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-bold text-gray-900">{reservation.roomName}</div>
                      {reservation.roomNumber && (
                        <div className="text-xs font-medium text-gray-500 uppercase">Room {reservation.roomNumber}</div>
                      )}
                    </div>
                  </td>

                  {/* Dates */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-gray-900">
                        {(() => {
                          try {
                            if (!reservation.checkIn || !reservation.checkOut) return 'Invalid Date';
                            const checkInDate = new Date(reservation.checkIn);
                            const checkOutDate = new Date(reservation.checkOut);
                            if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) return 'Invalid Date';
                            const formatDate = (date: Date) => {
                              const month = date.toLocaleDateString('en-US', { month: 'short' });
                              const day = date.getDate().toString().padStart(2, '0');
                              return `${month} ${day}`;
                            };
                            return `${formatDate(checkInDate)} - ${formatDate(checkOutDate)}`;
                          } catch (error) { return 'Invalid Date'; }
                        })()}
                      </div>
                      <div className="text-xs font-medium text-gray-500">
                        {reservation.nights} night{reservation.nights !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-center">
                    {getStatusBadge(reservation.status)}
                  </td>

                  {/* Payment */}
                  <td className="px-6 py-4 text-center">
                    {getPaymentBadge(reservation.paymentStatus)}
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm font-bold text-gray-900">
                      ₱{reservation.totalAmount.toLocaleString()}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-center">
                    {getActionButtons(reservation)}
                  </td>
                </tr>
              ))
            ) : (
              // ADDED: Empty state handling inside tbody so the table structure remains valid
              reservations.length > 0 && (
                <tr>
                  <td colSpan={7} className="h-96 text-center align-middle">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <p className="text-lg font-medium">No reservations found</p>
                      <p className="text-sm">Try adjusting your search or status filter.</p>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
      
      {/* --- PAGINATION --- */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-100 bg-white/50 mt-auto">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                <span className="ml-1">Previous</span>
              </button>

              <div className="flex items-center space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(currentPage - p) <= 1)
                  .map((page, i, arr) => {
                    const isGap = i > 0 && page - arr[i - 1] > 1;
                    return (
                      <React.Fragment key={page}>
                        {isGap && <span className="text-gray-400 px-1">...</span>}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`inline-flex items-center justify-center min-w-[38px] h-10 px-3 text-sm font-medium rounded-md transition-all ${
                            currentPage === page
                              ? 'bg-gradient-to-r from-[#82A33D] to-[#6d8a33] text-white shadow-sm'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="mr-1">Next</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Completely Empty State (No reservations at all) */}
      {reservations.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-500">Reservations will appear here when available</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default ModernReservationsTable;