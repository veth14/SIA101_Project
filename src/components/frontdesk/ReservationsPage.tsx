import { useState } from 'react';
import { CheckInModal } from './CheckInModal';
import { WalkInModal } from './WalkInModal';
import { ReservationDetailsModal } from './ReservationDetailsModal';
import { EditReservationModal } from './EditReservationModal';
import { ConfirmDialog } from '../admin/ConfirmDialog';
import { sampleReservations } from '../../data/sampleReservations';
import FrontDeskStatsCard from './FrontDeskStatsCard';
import QuickActionsPanel from './QuickActionsPanel';
import FiltersPanel from './FiltersPanel';
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
  const [reservations, setReservations] = useState<Reservation[]>(sampleReservations);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>(sampleReservations);
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

  const handleCheckOut = (reservation: Reservation) => {
    setReservations(prev =>
      prev.map(r =>
        r.id === reservation.id
          ? { ...r, status: 'checked-out' as const }
          : r
      )
    );
    filterReservations(searchQuery, statusFilter, dateRange);
  };

  const handleWalkInBooking = (newBooking: any) => {
    const updatedReservations = [...reservations, newBooking];
    setReservations(updatedReservations);
    filterReservations(searchQuery, statusFilter, dateRange);
  };

  const handleEditReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowEditModal(true);
  };

  const handleSaveReservation = (updatedReservation: Reservation) => {
    setReservations(prev =>
      prev.map(r =>
        r.id === updatedReservation.id ? updatedReservation : r
      )
    );
    filterReservations(searchQuery, statusFilter, dateRange);
    setShowEditModal(false);
    setSelectedReservation(null);
  };

  const handleCancelReservation = (reservationId: string) => {
    setReservationToCancel(reservationId);
    setShowCancelDialog(true);
  };

  const confirmCancelReservation = () => {
    if (reservationToCancel) {
      setReservations(prev =>
        prev.map(r =>
          r.id === reservationToCancel
            ? { ...r, status: 'cancelled' as const }
            : r
        )
      );
      filterReservations(searchQuery, statusFilter, dateRange);
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
        {/* Light Premium Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-white via-heritage-green/5 to-heritage-light/10 rounded-3xl shadow-xl border border-heritage-green/20">
          {/* Light Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/5 via-transparent to-heritage-neutral/5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-heritage-green/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-heritage-light/15 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 right-1/3 w-40 h-40 bg-heritage-green/5 rounded-full animate-spin opacity-30" style={{animationDuration: '25s'}}></div>
          <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-heritage-green/10 rounded-full animate-bounce opacity-40" style={{animationDuration: '3s'}}></div>
          
          <div className="relative p-10">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <div className="w-16 h-16 bg-gradient-to-br from-heritage-green to-heritage-neutral rounded-2xl flex items-center justify-center shadow-xl border border-heritage-green/30 group-hover:scale-110 transition-all duration-500">
                    <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-heritage-green to-heritage-light rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                </div>
                <div className="space-y-2">
                  <h1 className="text-5xl font-black text-heritage-green drop-shadow-sm">
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
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="relative group">
                <div className="bg-gradient-to-br from-white/90 to-heritage-green/5 backdrop-blur-xl rounded-3xl p-8 border border-heritage-green/20 shadow-xl group-hover:scale-105 transition-all duration-500">
                  <div className="absolute -inset-1 bg-gradient-to-r from-heritage-green to-heritage-light rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                  <div className="relative">
                    <p className="text-4xl font-black bg-gradient-to-r from-heritage-green to-heritage-neutral bg-clip-text text-transparent drop-shadow-sm">
                      {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-gray-700 mt-2 font-semibold tracking-wide">Current Time</p>
                    <div className="mt-3 flex items-center justify-center space-x-2">
                      <div className="w-1 h-1 bg-heritage-green rounded-full animate-ping"></div>
                      <div className="w-1 h-1 bg-heritage-neutral rounded-full animate-ping delay-75"></div>
                      <div className="w-1 h-1 bg-heritage-light rounded-full animate-ping delay-150"></div>
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
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Quick Actions Panel */}
          <div className="xl:col-span-1">
            <QuickActionsPanel
              onWalkInBooking={() => setShowWalkInModal(true)}
              onQuickCheckIn={() => {
                // Find first confirmed reservation for quick check-in
                const confirmedReservation = reservations.find(r => r.status === 'confirmed');
                if (confirmedReservation) {
                  handleCheckIn(confirmedReservation);
                }
              }}
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
          <div className="xl:col-span-3">
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

        {/* Check-in Modal */}
      {showCheckInModal && selectedReservation && (
        <CheckInModal
          isOpen={showCheckInModal}
          onClose={() => {
            setShowCheckInModal(false);
            setSelectedReservation(null);
          }}
          reservation={selectedReservation}
          onCheckIn={(updatedReservation) => {
            setReservations(prev =>
              prev.map(r =>
                r.id === updatedReservation.id ? updatedReservation : r
              )
            );
            filterReservations(searchQuery, statusFilter, dateRange);
            setShowCheckInModal(false);
            setSelectedReservation(null);
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
