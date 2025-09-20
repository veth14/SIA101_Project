import { useState } from 'react';
import { DataTable } from '../admin/DataTable';
import { SearchInput } from '../admin/SearchInput';
import { DateRangePicker } from '../admin/DateRangePicker';
import { CheckInModal } from './CheckInModal';
import { WalkInModal } from './WalkInModal';
import { ReservationDetailsModal } from './ReservationDetailsModal';
import { EditReservationModal } from './EditReservationModal';
import { ConfirmDialog } from '../admin/ConfirmDialog';
import { sampleReservations } from '../../data/sampleReservations';

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

  const handleCheckOut = (reservationId: string) => {
    setReservations(prev =>
      prev.map(r =>
        r.id === reservationId
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

  const columns = [
    {
      key: 'id',
      label: 'Booking ID',
      sortable: true,
    },
    {
      key: 'guestName',
      label: 'Guest Name',
      sortable: true,
    },
    {
      key: 'roomType',
      label: 'Room Type',
      render: (value: string, row: Reservation) => (
        <div>
          <div className="font-medium">{value}</div>
          {row.roomNumber && (
            <div className="text-sm text-gray-500">Room {row.roomNumber}</div>
          )}
        </div>
      ),
    },
    {
      key: 'checkIn',
      label: 'Check-in',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'checkOut',
      label: 'Check-out',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'guests',
      label: 'Guests',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const statusColors = {
          confirmed: 'bg-blue-100 text-blue-800',
          'checked-in': 'bg-green-100 text-green-800',
          'checked-out': 'bg-gray-100 text-gray-800',
          cancelled: 'bg-red-100 text-red-800',
        };
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[value as keyof typeof statusColors]}`}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        );
      },
    },
    {
      key: 'totalAmount',
      label: 'Amount',
      render: (value: number) => `₱${value.toLocaleString()}`,
    },
  ];

  const getActions = (reservation: Reservation) => (
    <div className="flex space-x-2">
      {reservation.status === 'confirmed' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCheckIn(reservation);
          }}
          className="text-green-600 hover:text-green-900 text-sm font-medium"
        >
          Check In
        </button>
      )}
      {reservation.status === 'checked-in' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCheckOut(reservation.id);
          }}
          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
        >
          Check Out
        </button>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleEditReservation(reservation);
        }}
        className="text-heritage-green hover:text-heritage-green/80 text-sm font-medium"
      >
        Edit
      </button>
      {reservation.status === 'confirmed' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCancelReservation(reservation.id);
          }}
          className="text-red-600 hover:text-red-900 text-sm font-medium"
        >
          Cancel
        </button>
      )}
    </div>
  );

  const statusCounts = {
    all: reservations.length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    'checked-in': reservations.filter(r => r.status === 'checked-in').length,
    'checked-out': reservations.filter(r => r.status === 'checked-out').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Front Desk</h1>
          <p className="text-gray-600">Manage reservations and guest check-ins</p>
        </div>
        <button
          onClick={() => setShowWalkInModal(true)}
          className="bg-heritage-green text-white px-4 py-2 rounded-md hover:bg-heritage-green/90 transition-colors"
        >
          Walk-in Booking
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600 text-xl">📋</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Reservations</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.all}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-yellow-600 text-xl">⏳</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pending Check-in</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.confirmed}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-green-600 text-xl">🏨</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Checked In</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts['checked-in']}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <span className="text-gray-600 text-xl">✅</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Checked Out</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts['checked-out']}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <SearchInput
              placeholder="Search by guest name, email, or booking ID..."
              onSearch={handleSearch}
            />
          </div>
          <div className="flex space-x-4">
            <DateRangePicker
              value={dateRange}
              onChange={(range) => {
                setDateRange(range);
                filterReservations(searchQuery, statusFilter, range);
              }}
            />
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked-in">Checked In</option>
              <option value="checked-out">Checked Out</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reservations Table */}
      <DataTable
        columns={columns}
        data={filteredReservations}
        actions={getActions}
        onRowClick={(reservation) => {
          setSelectedReservation(reservation);
          setShowDetailsModal(true);
        }}
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
          onCheckOut={handleCheckOut}
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
  );
};
