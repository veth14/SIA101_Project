import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useAuth } from '../../../contexts/AuthContext';
import { CheckInModal } from './CheckInModal';
import { WalkInModal } from './WalkInModal';
import { ReservationDetailsModal } from './ReservationDetailsModal';
import { EditReservationModal } from './EditReservationModal';
import { ConfirmDialog } from '../../admin/ConfirmDialog';
import FrontDeskStatsCard from '../shared/FrontDeskStatsCard';
import QuickActionsPanel from '../shared/QuickActionsPanel';
import FiltersPanel from '../shared/FiltersPanel';
import ModernReservationsTable from './ModernReservationsTable';

interface Reservation {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  roomType: string;
  roomNumber?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
}

export const ReservationsPage = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch reservations from Firebase
  useEffect(() => {
    if (user) {
      fetchReservations();
    } else {
      console.log('No user authenticated, skipping fetch');
      setLoading(false);
    }
  }, [user]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      console.log('Fetching bookings from Firebase...');
      console.log('Current user:', user?.email, 'Role:', user?.role);
      const bookingsSnapshot = await getDocs(collection(db, 'bookings'));
      console.log('✅ Bookings snapshot received:', bookingsSnapshot.size, 'documents');
      
      const bookingsData = bookingsSnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Processing booking document:', doc.id);
        console.log('📋 All fields in this booking:', Object.keys(data));
        console.log('📋 Full booking data:', data);
        
        // Helper function to parse dates properly
        const parseDate = (dateField: any, fieldName: string) => {
          console.log(`🔍 Parsing ${fieldName}:`, dateField, 'Type:', typeof dateField);
          
          try {
            if (!dateField) {
              console.log(`❌ ${fieldName} is empty/null`);
              return '';
            }
            
            // Handle Firestore Timestamp
            if (dateField?.toDate) {
              const result = dateField.toDate().toISOString().split('T')[0];
              console.log(`✅ ${fieldName} parsed from Timestamp:`, result);
              return result;
            }
            
            // Handle string dates in various formats
            if (typeof dateField === 'string') {
              // Try different date formats
              const formats = [
                dateField, // Original format
                dateField.replace(/\//g, '-'), // Replace / with -
                dateField.replace(/\./g, '-'), // Replace . with -
              ];
              
              for (const format of formats) {
                const date = new Date(format);
                if (!isNaN(date.getTime())) {
                  const result = date.toISOString().split('T')[0];
                  console.log(`✅ ${fieldName} parsed from string "${format}":`, result);
                  return result;
                }
              }
              
              console.log(`❌ ${fieldName} string could not be parsed:`, dateField);
            }
            
            // Handle Date objects
            if (dateField instanceof Date && !isNaN(dateField.getTime())) {
              const result = dateField.toISOString().split('T')[0];
              console.log(`✅ ${fieldName} parsed from Date object:`, result);
              return result;
            }
            
            // Handle numbers (timestamps)
            if (typeof dateField === 'number') {
              const date = new Date(dateField);
              if (!isNaN(date.getTime())) {
                const result = date.toISOString().split('T')[0];
                console.log(`✅ ${fieldName} parsed from timestamp:`, result);
                return result;
              }
            }
            
            console.log(`❌ ${fieldName} could not be parsed, unknown format:`, dateField);
            return '';
          } catch (error) {
            console.log(`❌ ${fieldName} parsing error:`, error);
            return '';
          }
        };

        // Helper function to format room type properly
        const formatRoomType = (roomType: string) => {
          if (!roomType) return 'Standard Room';
          
          // Convert room type to proper format
          const roomTypeMap: { [key: string]: string } = {
            'deluxe': 'Deluxe Room',
            'standard': 'Standard Room', 
            'family': 'Family Room',
            'suite': 'Suite Room',
            'presidential': 'Presidential Suite',
            'executive': 'Executive Room'
          };
          
          const lowerType = roomType.toLowerCase();
          return roomTypeMap[lowerType] || roomType;
        };

        return {
          id: doc.id,
          guestName: data.guestName || data.userName || 'Unknown Guest',
          email: data.email || data.userEmail || '',
          phone: data.phone || data.userPhone || '',
          roomType: formatRoomType(data.roomType || 'standard'),
          roomNumber: data.roomNumber || `Room ${Math.floor(Math.random() * 300) + 101}`,
          checkIn: parseDate(
            data.checkInDate || data.checkIn || data.check_in || data.checkin || data.startDate || data.arrival,
            'checkInDate'
          ),
          checkOut: parseDate(
            data.checkOutDate || data.checkOut || data.check_out || data.checkout || data.endDate || data.departure,
            'checkOutDate'
          ),
          guests: data.guests || 1,
          status: data.status === 'confirmed' ? 'confirmed' : 
                 data.status === 'checked-in' ? 'checked-in' :
                 data.status === 'checked-out' ? 'checked-out' :
                 data.status === 'cancelled' ? 'cancelled' : 'confirmed',
          totalAmount: data.totalAmount || 0,
          paymentStatus: data.paymentStatus === 'paid' ? 'paid' : 
                        data.paymentStatus === 'refunded' ? 'refunded' : 'pending'
        } as Reservation;
      });
      
      console.log('Processed bookings data:', bookingsData);
      setReservations(bookingsData);
      setFilteredReservations(bookingsData);
    } catch (error: any) {
      console.error('Error fetching reservations:', error);
      
      // More detailed error logging
      if (error?.code === 'permission-denied') {
        console.error('Permission denied - check Firestore security rules');
        console.error('Current user email:', user?.email);
        console.error('Current user role:', user?.role);
        console.error('Suggestion: Make sure you are logged in as: balayginhawaAdmin123@gmail.com');
        alert(`Permission denied. Current user: ${user?.email || 'Not logged in'}\n\nPlease log in as: balayginhawaAdmin123@gmail.com`);
      } else if (error?.code === 'unavailable') {
        console.error('Firestore is unavailable');
        alert('Database is currently unavailable. Please try again later.');
      } else {
        console.error('Unknown error:', error?.message || error);
        alert('Failed to load reservations. Please try again.');
      }
      
      // Keep empty arrays on error
      setReservations([]);
      setFilteredReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterReservations(query, statusFilter, dateRange);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    filterReservations(searchQuery, status, dateRange);
  };

  const filterReservations = (query: string, status: string, range: any) => {
    let filtered = reservations;

    // Search filter
    if (query) {
      filtered = filtered.filter(
        (reservation) =>
          reservation.guestName.toLowerCase().includes(query.toLowerCase()) ||
          reservation.email.toLowerCase().includes(query.toLowerCase()) ||
          reservation.roomType.toLowerCase().includes(query.toLowerCase()) ||
          reservation.id.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Status filter
    if (status !== 'all') {
      filtered = filtered.filter((reservation) => reservation.status === status);
    }

    // Date range filter
    if (range.startDate && range.endDate) {
      filtered = filtered.filter((reservation) => {
        const checkIn = new Date(reservation.checkIn);
        const start = new Date(range.startDate);
        const end = new Date(range.endDate);
        return checkIn >= start && checkIn <= end;
      });
    }

    setFilteredReservations(filtered);
  };

  const handleCheckIn = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowCheckInModal(true);
  };

  const handleCheckOut = async (reservation: Reservation) => {
    try {
      // Update in Firebase
      await updateDoc(doc(db, 'bookings', reservation.id), {
        status: 'checked-out',
        updatedAt: serverTimestamp()
      });

      // Update local state
      setReservations(prev =>
        prev.map(r =>
          r.id === reservation.id
            ? { ...r, status: 'checked-out' as const }
            : r
        )
      );
      filterReservations(searchQuery, statusFilter, dateRange);
    } catch (error) {
      console.error('Error checking out reservation:', error);
      alert('Failed to check out reservation. Please try again.');
    }
  };

  const handleWalkInBooking = async (newBooking: any) => {
    try {
      // Add to Firebase
      const docRef = await addDoc(collection(db, 'bookings'), {
        ...newBooking,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Add to local state with the new ID
      const bookingWithId = { ...newBooking, id: docRef.id };
      const updatedReservations = [...reservations, bookingWithId];
      setReservations(updatedReservations);
      filterReservations(searchQuery, statusFilter, dateRange);
    } catch (error) {
      console.error('Error adding walk-in booking:', error);
      alert('Failed to create walk-in booking. Please try again.');
    }
  };

  const handleEditReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowEditModal(true);
  };

  const handleSaveReservation = async (updatedReservation: Reservation) => {
    try {
      // Update in Firebase
      await updateDoc(doc(db, 'bookings', updatedReservation.id), {
        guestName: updatedReservation.guestName,
        email: updatedReservation.email,
        phone: updatedReservation.phone,
        roomType: updatedReservation.roomType,
        roomNumber: updatedReservation.roomNumber,
        checkInDate: updatedReservation.checkIn,
        checkOutDate: updatedReservation.checkOut,
        guests: updatedReservation.guests,
        status: updatedReservation.status,
        totalAmount: updatedReservation.totalAmount,
        paymentStatus: updatedReservation.paymentStatus,
        updatedAt: serverTimestamp()
      });

      // Update local state
      setReservations(prev =>
        prev.map(r =>
          r.id === updatedReservation.id ? updatedReservation : r
        )
      );
      filterReservations(searchQuery, statusFilter, dateRange);
      setShowEditModal(false);
      setSelectedReservation(null);
    } catch (error) {
      console.error('Error updating reservation:', error);
      alert('Failed to update reservation. Please try again.');
    }
  };

  const handleCancelReservation = (reservationId: string) => {
    setReservationToCancel(reservationId);
    setShowCancelDialog(true);
  };

  const confirmCancelReservation = async () => {
    if (reservationToCancel) {
      try {
        // Update in Firebase
        await updateDoc(doc(db, 'bookings', reservationToCancel), {
          status: 'cancelled',
          updatedAt: serverTimestamp()
        });

        // Update local state
        setReservations(prev =>
          prev.map(r =>
            r.id === reservationToCancel
              ? { ...r, status: 'cancelled' as const }
              : r
          )
        );
        filterReservations(searchQuery, statusFilter, dateRange);
      } catch (error) {
        console.error('Error cancelling reservation:', error);
        alert('Failed to cancel reservation. Please try again.');
      }
    }
    setShowCancelDialog(false);
    setReservationToCancel(null);
  };


  const statusCounts = {
    all: reservations.length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    'checked-in': reservations.filter(r => r.status === 'checked-in').length,
    'checked-out': reservations.filter(r => r.status === 'checked-out').length,
  };

  return (
    <div className="min-h-screen bg-heritage-light">
      {/* Light Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Subtle Light Orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 rounded-full blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl animate-pulse delay-1000 opacity-25"></div>
        <div className="absolute bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 rounded-full blur-3xl animate-pulse delay-2000 opacity-20"></div>
        
        {/* Light Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(134, 134, 134, 0.1) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-white via-green-50/20 to-green-500/5 rounded-3xl shadow-2xl border border-green-500/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-600/5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-green-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-green-100/15 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 right-1/3 w-40 h-40 bg-green-500/5 rounded-full animate-spin opacity-30" style={{animationDuration: '25s'}}></div>
          <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-green-500/10 rounded-full animate-bounce opacity-40" style={{animationDuration: '3s'}}></div>
          
          <div className="relative p-10">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#82A33D] to-[#6d8a33] rounded-2xl flex items-center justify-center shadow-xl border border-[#82A33D]/30 group-hover:scale-110 transition-all duration-500">
                    <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#82A33D] to-green-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                </div>
                <div className="space-y-2">
                  <h1 className="text-5xl font-black text-[#82A33D] drop-shadow-sm">
                    Front Desk Operations
                  </h1>
                  <p className="text-xl text-gray-700 font-medium tracking-wide">
                    Manage reservations and guest services
                  </p>
                  <div className="flex items-center space-x-4 mt-4">
                    <div className="flex items-center space-x-2 bg-emerald-50 backdrop-blur-sm rounded-full px-4 py-2 border border-emerald-200">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-emerald-700">All systems operational</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-blue-50 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-200">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-blue-700">
                        Tuesday, Sep 24
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="relative group">
                <div className="bg-gradient-to-br from-white/90 to-green-500/5 backdrop-blur-xl rounded-3xl p-8 border border-green-500/20 shadow-xl group-hover:scale-105 transition-all duration-500">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#82A33D] to-green-400 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                  <div className="relative">
                    <p className="text-4xl font-black bg-gradient-to-r from-[#82A33D] to-green-600 bg-clip-text text-transparent drop-shadow-sm">
                      {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-gray-700 mt-2 font-semibold tracking-wide">Current Time</p>
                    <div className="mt-3 flex items-center justify-center space-x-2">
                      <div className="w-1 h-1 bg-[#82A33D] rounded-full animate-ping"></div>
                      <div className="w-1 h-1 bg-green-600 rounded-full animate-ping delay-75"></div>
                      <div className="w-1 h-1 bg-green-400 rounded-full animate-ping delay-150"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <FrontDeskStatsCard
            title="Total Reservations"
            value={statusCounts.all}
            icon="📋"
            color="blue"
            trend={{ value: 12, isPositive: true }}
          />
          <FrontDeskStatsCard
            title="Pending Check-in"
            value={statusCounts.confirmed}
            icon="⏳"
            color="yellow"
          />
          <FrontDeskStatsCard
            title="Checked In"
            value={statusCounts['checked-in']}
            icon="🏨"
            color="green"
            trend={{ value: 8, isPositive: true }}
          />
          <FrontDeskStatsCard
            title="Checked Out"
            value={statusCounts['checked-out']}
            icon="✅"
            color="gray"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Quick Actions Panel */}
          <div className="lg:col-span-4 xl:col-span-3">
            <QuickActionsPanel
              onWalkInBooking={() => setShowWalkInModal(true)}
              onRoomStatus={() => {
                // TODO: Implement room status view
                console.log('Room status view');
              }}
              onGuestServices={() => {
                // TODO: Implement guest services
                console.log('Guest services');
              }}
            />
          </div>

          {/* Filters Panel */}
          <div className="lg:col-span-8 xl:col-span-9">
            <FiltersPanel
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              dateRange={dateRange}
              onSearch={handleSearch}
              onStatusFilter={handleStatusFilter}
              onDateRangeChange={(range) => {
                setDateRange(range);
                filterReservations(searchQuery, statusFilter, range);
              }}
              statusCounts={{
                ...statusCounts,
                cancelled: reservations.filter(r => r.status === 'cancelled').length
              }}
            />
          </div>
        </div>

        {/* Modern Reservations Table */}
        {!user ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentication Required</h3>
              <p className="text-gray-600 mb-4">Please log in as an admin to access reservations.</p>
              <button 
                onClick={() => window.location.href = '/login'} 
                className="bg-heritage-green text-white px-6 py-2 rounded-lg hover:bg-heritage-green/90 transition-colors"
              >
                Go to Login
              </button>
            </div>
          </div>
        ) : loading ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-heritage-green"></div>
              <p className="text-gray-600 font-medium">Loading reservations...</p>
            </div>
          </div>
        ) : (
          <ModernReservationsTable
            reservations={filteredReservations}
            onRowClick={(reservation: Reservation) => {
              setSelectedReservation(reservation);
              setShowDetailsModal(true);
            }}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            onEdit={handleEditReservation}
            onCancel={(reservation: Reservation) => handleCancelReservation(reservation.id)}
          />
        )}

        {/* Check-in Modal */}
      {showCheckInModal && selectedReservation && (
        <CheckInModal
          isOpen={showCheckInModal}
          onClose={() => {
            setShowCheckInModal(false);
            setSelectedReservation(null);
          }}
          reservation={selectedReservation}
          onCheckIn={async (updatedReservation) => {
            try {
              // Update in Firebase
              await updateDoc(doc(db, 'bookings', updatedReservation.id), {
                status: 'checked-in',
                roomNumber: updatedReservation.roomNumber,
                updatedAt: serverTimestamp()
              });

              // Update local state
              setReservations(prev =>
                prev.map(r =>
                  r.id === updatedReservation.id ? updatedReservation : r
                )
              );
              filterReservations(searchQuery, statusFilter, dateRange);
              setShowCheckInModal(false);
              setSelectedReservation(null);
            } catch (error) {
              console.error('Error checking in reservation:', error);
              alert('Failed to check in reservation. Please try again.');
            }
          }}
        />
      )}

      {/* Walk-in Modal */}
      {showWalkInModal && (
        <WalkInModal
          isOpen={showWalkInModal}
          onClose={() => setShowWalkInModal(false)}
          onBooking={handleWalkInBooking}
        />
      )}

      {/* Reservation Details Modal */}
      {showDetailsModal && selectedReservation && (
        <ReservationDetailsModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedReservation(null);
          }}
          reservation={selectedReservation}
          onEdit={handleEditReservation}
          onCheckIn={handleCheckIn}
          onCheckOut={(reservationId) => {
            const reservation = reservations.find(r => r.id === reservationId);
            if (reservation) handleCheckOut(reservation);
          }}
          onCancel={handleCancelReservation}
        />
      )}

      {/* Edit Reservation Modal */}
      {showEditModal && selectedReservation && (
        <EditReservationModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedReservation(null);
          }}
          reservation={selectedReservation}
          onSave={handleSaveReservation}
        />
      )}

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <ConfirmDialog
          isOpen={showCancelDialog}
          onClose={() => {
            setShowCancelDialog(false);
            setReservationToCancel(null);
          }}
          onConfirm={confirmCancelReservation}
          title="Cancel Reservation"
          message="Are you sure you want to cancel this reservation? This action cannot be undone."
          confirmText="Cancel Reservation"
        />
      )}
      </div>
    </div>
  );
};
