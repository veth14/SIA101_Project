import React from 'react';

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

interface ModernReservationsTableProps {
  reservations: Reservation[];
  onRowClick: (reservation: Reservation) => void;
  onCheckIn: (reservation: Reservation) => void;
  onCheckOut: (reservation: Reservation) => void;
  onEdit: (reservation: Reservation) => void;
  onCancel: (reservation: Reservation) => void;
}

const ModernReservationsTable: React.FC<ModernReservationsTableProps> = ({
  reservations,
  onRowClick,
  onCheckIn,
  onCheckOut,
  onEdit,
  onCancel
}) => {
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

  const getActionButtons = (reservation: Reservation) => (
    <div className="flex items-center space-x-2">
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
    </div>
  );

  return (
    <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 bg-gradient-to-r from-slate-50 to-white border-b border-gray-200/50">
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
            <p className="text-sm text-gray-500 font-medium">{reservations.length} total reservations</p>
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200/50">
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Guest</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Room</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Dates</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Payment</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/50">
            {reservations.map((reservation, index) => (
              <tr
                key={reservation.id}
                onClick={() => onRowClick(reservation)}
                className="group hover:bg-gradient-to-r hover:from-heritage-green/5 hover:to-emerald-50/50 cursor-pointer transition-all duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-sm">
                        {reservation.guestName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-heritage-green transition-colors">
                        {reservation.guestName}
                      </div>
                      <div className="text-sm text-gray-500">{reservation.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-semibold text-gray-900">{reservation.roomType}</div>
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
                      {new Date(reservation.checkIn).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })} - {new Date(reservation.checkOut).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.ceil((new Date(reservation.checkOut).getTime() - new Date(reservation.checkIn).getTime()) / (1000 * 3600 * 24))} nights
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(reservation.status)}
                </td>
                <td className="px-6 py-4">
                  {getPaymentBadge(reservation.paymentStatus)}
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900 text-lg">
                    ₱{reservation.totalAmount.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getActionButtons(reservation)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {reservations.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">No reservations found</h4>
          <p className="text-gray-500">Reservations will appear here when available</p>
        </div>
      )}
    </div>
  );
};

export default ModernReservationsTable;
