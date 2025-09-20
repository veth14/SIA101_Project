import React from 'react';
import { DataTable } from '../admin/DataTable';

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

interface ReservationsTableProps {
  reservations: Reservation[];
  onRowClick: (reservation: Reservation) => void;
  onCheckIn: (reservation: Reservation) => void;
  onCheckOut: (reservation: Reservation) => void;
  onEdit: (reservation: Reservation) => void;
  onCancel: (reservation: Reservation) => void;
}

const ReservationsTable: React.FC<ReservationsTableProps> = ({
  reservations,
  onRowClick,
  onCheckIn,
  onCheckOut,
  onEdit,
  onCancel
}) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Confirmed' },
      'checked-in': { bg: 'bg-green-100', text: 'text-green-800', label: 'Checked In' },
      'checked-out': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Checked Out' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.confirmed;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getPaymentBadge = (status: string) => {
    const paymentConfig = {
      paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Paid' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      refunded: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Refunded' }
    };
    
    const config = paymentConfig[status as keyof typeof paymentConfig] || paymentConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getActions = (reservation: Reservation) => (
    <div className="flex space-x-2">
      {reservation.status === 'confirmed' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCheckIn(reservation);
          }}
          className="text-green-600 hover:text-green-900 text-sm font-medium px-2 py-1 rounded hover:bg-green-50"
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
          className="text-blue-600 hover:text-blue-900 text-sm font-medium px-2 py-1 rounded hover:bg-blue-50"
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
          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium px-2 py-1 rounded hover:bg-indigo-50"
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
          className="text-red-600 hover:text-red-900 text-sm font-medium px-2 py-1 rounded hover:bg-red-50"
        >
          Cancel
        </button>
      )}
    </div>
  );

  const columns = [
    {
      key: 'id',
      label: 'Booking ID',
      sortable: true,
      render: (value: string) => (
        <span className="font-mono text-sm text-gray-600">#{value.slice(-6)}</span>
      )
    },
    {
      key: 'guestName',
      label: 'Guest Name',
      sortable: true,
      render: (value: string, row: Reservation) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.email}</div>
        </div>
      )
    },
    {
      key: 'roomType',
      label: 'Room Details',
      render: (value: string, row: Reservation) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          {row.roomNumber && (
            <div className="text-sm text-gray-500">Room {row.roomNumber}</div>
          )}
        </div>
      )
    },
    {
      key: 'checkIn',
      label: 'Check-in',
      sortable: true,
      render: (value: string) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">
            {new Date(value).toLocaleDateString()}
          </div>
          <div className="text-gray-500">
            {new Date(value).toLocaleDateString('en-US', { weekday: 'short' })}
          </div>
        </div>
      )
    },
    {
      key: 'checkOut',
      label: 'Check-out',
      sortable: true,
      render: (value: string) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">
            {new Date(value).toLocaleDateString()}
          </div>
          <div className="text-gray-500">
            {new Date(value).toLocaleDateString('en-US', { weekday: 'short' })}
          </div>
        </div>
      )
    },
    {
      key: 'guests',
      label: 'Guests',
      render: (value: number) => (
        <div className="flex items-center">
          <svg className="w-4 h-4 text-gray-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          <span className="text-sm font-medium text-gray-900">{value}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => getStatusBadge(value)
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      render: (value: string) => getPaymentBadge(value)
    },
    {
      key: 'totalAmount',
      label: 'Amount',
      sortable: true,
      render: (value: number) => (
        <div className="text-sm font-medium text-gray-900">
          ₱{value.toLocaleString()}
        </div>
      )
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Reservations</h3>
            <p className="text-sm text-gray-500">{reservations.length} total reservations</p>
          </div>
        </div>
      </div>
      
      <DataTable
        columns={columns}
        data={reservations}
        actions={getActions}
        onRowClick={onRowClick}
      />
    </div>
  );
};

export default ReservationsTable;
