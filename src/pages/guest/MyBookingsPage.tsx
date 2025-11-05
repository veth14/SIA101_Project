import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface Booking {
  id: string;
  bookingId: string;
  roomType: string;
  roomName?: string;
  roomNumber?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  basePrice: number;
  baseGuests: number;
  additionalGuestPrice: number;
  roomPricePerNight: number;
  subtotal: number;
  tax: number;
  taxRate: number;
  totalAmount: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  paymentStatus: string;
  userId: string;
  userEmail: string;
  userName: string;
  createdAt?: any;
  updatedAt?: any;
  bookingDate?: string;
  guestName?: string;
  guestEmail?: string;
  specialRequests?: string;
}

const getRoomDisplayName = (roomType: string) => {
  const roomNames: { [key: string]: string } = {
    'standard': 'Silid Payapa - Standard Room',
    'deluxe': 'Silid Marahuyo - Deluxe Room',
    'suite': 'Silid Ginhawa - Suite Room',
    'family': 'Silid Haraya - Premium Family Suite'
  };
  return roomNames[roomType] || roomType;
};

export const MyBookingsPage: React.FC = () => {
  const { userData } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('all');
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    if (userData?.email) {
      fetchBookings();
    }
  }, [userData]);

  const fetchBookings = async () => {
    if (!userData?.email) return;
    
    try {
      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('userEmail', '==', userData.email)
      );
      
      const querySnapshot = await getDocs(bookingsQuery);
      const bookingsData: Booking[] = [];
      
      querySnapshot.forEach((doc) => {
        bookingsData.push({
          id: doc.id,
          ...doc.data()
        } as Booking);
      });
      
      bookingsData.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime();
        }
        return new Date(b.bookingDate || '').getTime() - new Date(a.bookingDate || '').getTime();
      });
      
      setBookings(bookingsData);
      setError('');
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredBookings = () => {
    const now = new Date();
    // Set time to start of day for more accurate comparison
    now.setHours(0, 0, 0, 0);
    
    return bookings.filter(booking => {
      const checkInDate = new Date(booking.checkIn);
      const checkOutDate = new Date(booking.checkOut);
      checkInDate.setHours(0, 0, 0, 0);
      checkOutDate.setHours(0, 0, 0, 0);
      
      // Debug logging for upcoming filter
      if (filter === 'upcoming') {
        console.log('Booking:', booking.bookingId, {
          checkIn: booking.checkIn,
          checkInDate: checkInDate,
          now: now,
          isCheckInFuture: checkInDate >= now,
          status: booking.status,
          isNotCancelled: booking.status !== 'cancelled',
          willShow: checkInDate >= now && booking.status !== 'cancelled'
        });
      }
      
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' || 
        (booking.bookingId && booking.bookingId.toLowerCase().includes(searchLower)) ||
        (booking.roomName && booking.roomName.toLowerCase().includes(searchLower)) ||
        (booking.roomType && booking.roomType.toLowerCase().includes(searchLower)) ||
        (booking.status && booking.status.toLowerCase().includes(searchLower));
      
      if (!matchesSearch) return false;
      
      // Status filter
      switch (filter) {
        case 'upcoming':
          // Changed from > to >= to include today's bookings
          return checkInDate >= now && booking.status !== 'cancelled';
        case 'past':
          return checkOutDate < now || booking.status === 'completed';
        case 'cancelled':
          return booking.status === 'cancelled';
        default:
          return true;
      }
    });
  };

  // Pagination
  const filteredBookings = getFilteredBookings();
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredBookings.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filter]);

  const getFilterCounts = () => {
    const now = new Date();
    // Set time to start of day for consistent comparison
    now.setHours(0, 0, 0, 0);
    
    const counts = {
      all: bookings.length,
      upcoming: 0,
      past: 0,
      cancelled: 0
    };

    bookings.forEach(booking => {
      const checkInDate = new Date(booking.checkIn);
      const checkOutDate = new Date(booking.checkOut);
      checkInDate.setHours(0, 0, 0, 0);
      checkOutDate.setHours(0, 0, 0, 0);
      
      if (booking.status === 'cancelled') {
        counts.cancelled++;
      } else if (checkInDate >= now) { // Changed from > to >= to match filter logic
        counts.upcoming++;
      } else if (checkOutDate < now || booking.status === 'completed') {
        counts.past++;
      }
    });

    return counts;
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 pt-32 bg-gradient-to-br from-heritage-light/30 via-white to-heritage-neutral/20">
        <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 rounded-full animate-spin border-heritage-light"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 rounded-full animate-spin border-heritage-green border-t-transparent"></div>
            </div>
            <p className="mt-4 font-medium text-heritage-green">Loading your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 pt-20 sm:pt-24">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute rounded-full -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-heritage-green/10 to-emerald-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute rounded-full -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute w-64 h-64 transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 bg-gradient-to-r from-purple-500/5 to-pink-500/5 blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 py-8 sm:py-12">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Hero Header Section - MOBILE RESPONSIVE */}
          <div className="mb-8 sm:mb-12 md:mb-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-6 sm:mb-8 transition-transform duration-300 transform shadow-2xl bg-gradient-to-br from-heritage-green to-emerald-600 rounded-2xl hover:scale-110">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-transparent bg-gradient-to-r from-slate-900 via-heritage-green to-emerald-600 bg-clip-text px-4">
                My Reservations
              </h1>
              <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed text-slate-600 px-4">
                Manage and track your luxury stays at <span className="font-semibold text-heritage-green">Balay Ginhawa</span>
              </p>
            </div>

            {/* Status Indicators - MOBILE RESPONSIVE */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-8 mt-6 sm:mt-8 px-4">
              <div className="flex items-center px-3 sm:px-4 py-2 space-x-2 border rounded-full shadow-lg bg-white/80 backdrop-blur-sm border-white/20">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></div>
                <span className="text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap">Live Sync</span>
              </div>
              <div className="flex items-center px-3 sm:px-4 py-2 space-x-2 border rounded-full shadow-lg bg-white/80 backdrop-blur-sm border-white/20">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse flex-shrink-0" style={{ animationDelay: '1s' }}></div>
                <span className="text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap">Real-time Updates</span>
              </div>
              <div className="flex items-center px-3 sm:px-4 py-2 space-x-2 border rounded-full shadow-lg bg-white/80 backdrop-blur-sm border-white/20">
                <svg className="w-4 h-4 text-heritage-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap">Secure</span>
              </div>
            </div>
          </div>

        {error && (
          <div className="p-3 mb-4 border border-red-200 rounded-lg bg-red-50">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

          {/* Streamlined Controls Panel - MOBILE RESPONSIVE */}
          <div className="mb-6 sm:mb-8 overflow-hidden border shadow-xl bg-white/95 backdrop-blur-xl rounded-2xl border-white/50">
            <div className="px-4 sm:px-6 py-4 sm:py-5">
              <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
                {/* Compact Search - MOBILE RESPONSIVE */}
                <div className="w-full lg:flex-1 lg:max-w-md">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search bookings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full py-2.5 sm:py-3 pl-10 pr-4 text-sm font-medium transition-all duration-200 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-heritage-green/50 focus:border-heritage-green placeholder-slate-400"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Enhanced Filter Tabs - MOBILE RESPONSIVE */}
                <div className="w-full lg:w-auto">
                  <div className="grid grid-cols-2 lg:flex gap-2 p-2 shadow-inner bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl">
                    {(() => {
                    const counts = getFilterCounts();
                    return [
                      { 
                        key: 'all', 
                        label: 'All', 
                        count: counts.all, 
                        activeClass: 'bg-gradient-to-r from-heritage-green to-heritage-neutral text-white shadow-lg',
                        hoverClass: 'hover:bg-gradient-to-r hover:from-heritage-green/80 hover:to-heritage-neutral/80 hover:text-white'
                      },
                      { 
                        key: 'upcoming', 
                        label: 'Upcoming', 
                        count: counts.upcoming, 
                        activeClass: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg',
                        hoverClass: 'hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-500 hover:text-white'
                      },
                      { 
                        key: 'past', 
                        label: 'Past', 
                        count: counts.past, 
                        activeClass: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg',
                        hoverClass: 'hover:bg-gradient-to-r hover:from-emerald-400 hover:to-emerald-500 hover:text-white'
                      },
                      { 
                        key: 'cancelled', 
                        label: 'Cancelled', 
                        count: counts.cancelled, 
                        activeClass: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg',
                        hoverClass: 'hover:bg-gradient-to-r hover:from-red-400 hover:to-red-500 hover:text-white'
                      }
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key as any)}
                        className={`relative px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 ${
                          filter === tab.key
                            ? `${tab.activeClass} scale-105 ring-2 ring-white/30`
                            : `text-slate-600 bg-white/70 backdrop-blur-sm border border-slate-200/50 ${tab.hoverClass} hover:shadow-md hover:border-transparent`
                        }`}
                      >
                        {filter === tab.key && (
                          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-xl"></div>
                        )}
                        
                        <div className="relative flex items-center space-x-1 sm:space-x-2">
                          <span className="whitespace-nowrap">{tab.label}</span>
                          {tab.count > 0 && (
                            <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-black ${
                              filter === tab.key 
                                ? 'bg-white/25 text-white backdrop-blur-sm' 
                                : 'bg-slate-100 text-slate-600 group-hover:bg-white/20 group-hover:text-white'
                            }`}>
                              {tab.count}
                            </span>
                          )}
                        </div>
                      </button>
                    ));
                  })()}
                  </div>
                </div>
              </div>

              {/* Results Info - MOBILE RESPONSIVE */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-4 text-xs sm:text-sm text-slate-500">
                <div>
                  Showing <span className="font-semibold text-slate-700">{startIndex + 1}–{Math.min(endIndex, filteredBookings.length)}</span> of <span className="font-semibold text-slate-700">{filteredBookings.length}</span> bookings
                </div>
                {searchTerm && (
                  <div className="flex items-center space-x-1 text-heritage-green">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="font-medium">"{searchTerm}"</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Modern Card-Based Layout */}
          <div className="overflow-hidden border shadow-2xl bg-white/95 backdrop-blur-xl rounded-3xl border-white/50">
            {filteredBookings.length === 0 ? (
              <div className="py-16 sm:py-20 md:py-24 text-center px-4">
                <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 shadow-xl bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="mb-2 sm:mb-3 text-xl sm:text-2xl font-bold text-slate-900">
                  {filter === 'upcoming' ? 'No upcoming reservations' : 
                   filter === 'past' ? 'No past reservations' :
                   filter === 'cancelled' ? 'No cancelled reservations' :
                   'No reservations found'}
                </h3>
                <p className="text-base sm:text-lg text-slate-500 px-4">
                  {filter === 'upcoming' ? 'You don\'t have any upcoming bookings. Book a new stay to see future reservations here.' :
                   filter === 'past' ? 'You don\'t have any completed or past bookings yet.' :
                   filter === 'cancelled' ? 'You don\'t have any cancelled bookings.' :
                   'Try adjusting your search criteria or create a new booking.'}
                </p>
                <button className="px-5 sm:px-6 py-2.5 sm:py-3 mt-4 sm:mt-6 text-sm sm:text-base font-semibold text-white transition-all duration-300 transform bg-gradient-to-r from-heritage-green to-emerald-600 rounded-xl sm:rounded-2xl hover:shadow-xl hover:scale-105">
                  Book New Stay
                </button>
              </div>
            ) : (
              <div className="p-4 sm:p-6 md:p-8">
                {/* Compact Header - MOBILE RESPONSIVE */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 pb-4 mb-6 sm:mb-8 border-b border-slate-200">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-heritage-green to-emerald-600 flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">Your Reservations</h3>
                      <p className="text-xs sm:text-sm text-slate-500">{filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''} found</p>
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500">
                    Page {currentPage} of {totalPages}
                  </div>
                </div>

                {/* Responsive Card Grid */}
                <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
                  {currentItems.map((booking, index) => (
                    <div 
                      key={booking.id} 
                      className="relative p-4 sm:p-6 transition-all duration-300 border group bg-gradient-to-br from-white to-slate-50/50 rounded-xl sm:rounded-2xl border-slate-200/50 hover:shadow-xl hover:-translate-y-1"
                    >
                      {/* Status Strip */}
                      <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${
                        booking.status === 'confirmed' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
                        booking.status === 'pending' ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
                        booking.status === 'cancelled' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                        'bg-gradient-to-r from-slate-400 to-slate-500'
                      }`}></div>

                      {/* Header Row - MOBILE RESPONSIVE */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 transition-transform duration-300 bg-gradient-to-br from-heritage-green/10 to-emerald-500/10 rounded-xl group-hover:scale-110 flex-shrink-0">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-base sm:text-lg font-bold leading-tight text-slate-900 truncate">
                              {booking.roomName || getRoomDisplayName(booking.roomType)}
                            </h4>
                            <p className="font-mono text-xs sm:text-sm text-slate-500 truncate">
                              ID: {booking.bookingId || booking.id.slice(-8)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right flex-shrink-0">
                          <div className="text-lg sm:text-xl md:text-2xl font-black text-heritage-green">
                            ₱{booking.totalAmount.toLocaleString()}
                          </div>
                          {booking.nights && (
                            <div className="text-xs text-slate-500">{booking.nights} night{booking.nights > 1 ? 's' : ''}</div>
                          )}
                        </div>
                      </div>

                      {/* Info Grid - MOBILE RESPONSIVE */}
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center mb-1 space-x-2">
                              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V7a2 2 0 012-2h4a2 2 0 012 2v0M8 7v10a2 2 0 002 2h4a2 2 0 002-2V7" />
                              </svg>
                              <span className="text-xs font-semibold tracking-wide uppercase text-slate-600">Check-in</span>
                            </div>
                            <div className="text-sm font-bold text-slate-900">
                              {new Date(booking.checkIn).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                            <div className="text-xs text-slate-500">
                              {new Date(booking.checkIn).toLocaleDateString('en-US', { weekday: 'long' })}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center mb-1 space-x-2">
                              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                              <span className="text-xs font-semibold tracking-wide uppercase text-slate-600">Check-out</span>
                            </div>
                            <div className="text-sm font-bold text-slate-900">
                              {new Date(booking.checkOut).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                            <div className="text-xs text-slate-500">
                              {new Date(booking.checkOut).toLocaleDateString('en-US', { weekday: 'long' })}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row - MOBILE RESPONSIVE */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 pt-4 border-t border-slate-200">
                        <div className="flex items-center flex-wrap gap-2 sm:gap-4">
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                            <span className="text-xs sm:text-sm font-semibold text-slate-600">{booking.guests} guest{booking.guests > 1 ? 's' : ''}</span>
                          </div>
                          
                          <span className={`inline-flex items-center px-2 sm:px-3 py-1 text-xs font-bold rounded-full ${
                            booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                            booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                              booking.status === 'confirmed' ? 'bg-emerald-500' :
                              booking.status === 'pending' ? 'bg-amber-500' :
                              booking.status === 'cancelled' ? 'bg-red-500' : 'bg-slate-500'
                            }`}></div>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>

                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="w-full sm:w-auto inline-flex items-center justify-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-white transition-all duration-200 transform bg-gradient-to-r from-heritage-green to-emerald-600 rounded-lg sm:rounded-xl hover:shadow-lg active:scale-95 sm:hover:scale-105"
                        >
                          <svg className="w-4 h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Enhanced Pagination - MOBILE RESPONSIVE */}
                {totalPages > 1 && (
                  <div className="px-4 sm:px-6 py-4 mt-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                          currentPage === 1
                            ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                            : 'text-gray-700 hover:bg-heritage-green hover:text-white shadow-sm bg-white border border-gray-200'
                        }`}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
                      </button>

                      <div className="flex space-x-1 sm:space-x-2">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm font-bold rounded-lg transition-all duration-150 ${
                                currentPage === pageNum
                                  ? 'bg-heritage-green text-white shadow-md transform scale-105'
                                  : 'text-gray-700 hover:bg-heritage-green hover:text-white bg-white border border-gray-200 shadow-sm'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-150 ${
                          currentPage === totalPages
                            ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                            : 'text-gray-700 hover:bg-heritage-green hover:text-white shadow-sm bg-white border border-gray-200'
                        }`}
                      >
                        Next
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};