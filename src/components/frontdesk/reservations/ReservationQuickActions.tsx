import React from 'react';

interface ReservationQuickActionsProps {
  onWalkInBooking?: () => void;
  onNewReservation?: () => void;
  onBulkCheckIn?: () => void;
  onRoomAssignment?: () => void;
}

const ReservationQuickActions: React.FC<ReservationQuickActionsProps> = ({
  onWalkInBooking,
  onNewReservation,
  onBulkCheckIn,
  onRoomAssignment
}) => {
  return (
    <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 p-8 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-heritage-green to-emerald-400 rounded-2xl blur opacity-30"></div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900">Quick Actions</h3>
            <p className="text-sm text-gray-500 font-medium">Manage reservations and guest services efficiently</p>
          </div>
        </div>
        
        {/* Today's Summary */}
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="text-2xl font-black text-heritage-green">8</div>
            <div className="text-xs text-gray-600 font-medium">Check-ins Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-blue-600">5</div>
            <div className="text-xs text-gray-600 font-medium">Check-outs Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-purple-600">12</div>
            <div className="text-xs text-gray-600 font-medium">Available Rooms</div>
          </div>
        </div>
      </div>

      {/* Action Buttons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Walk-in Guest */}
        <button
          onClick={onWalkInBooking}
          className="group relative bg-gradient-to-br from-heritage-green to-emerald-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-500 overflow-hidden"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
          
          <div className="relative">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold mb-2">Walk-in Guest</h4>
            <p className="text-sm text-white/80">Register new walk-in customer instantly</p>
            <div className="mt-3 text-xs text-white/60">Quick Registration</div>
          </div>
        </button>

        {/* New Reservation */}
        <button
          onClick={onNewReservation}
          className="group relative bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-500 overflow-hidden"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
          
          <div className="relative">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h4 className="text-lg font-bold mb-2">New Reservation</h4>
            <p className="text-sm text-white/80">Create advance booking for guests</p>
            <div className="mt-3 text-xs text-white/60">Future Booking</div>
          </div>
        </button>

        {/* Bulk Check-in */}
        <button
          onClick={onBulkCheckIn}
          className="group relative bg-gradient-to-br from-purple-500 to-violet-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-500 overflow-hidden"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
          
          <div className="relative">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold mb-2">Bulk Check-in</h4>
            <p className="text-sm text-white/80">Process multiple check-ins at once</p>
            <div className="mt-3 text-xs text-white/60">Mass Processing</div>
          </div>
        </button>

        {/* Room Assignment */}
        <button
          onClick={onRoomAssignment}
          className="group relative bg-gradient-to-br from-amber-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-500 overflow-hidden"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
          
          <div className="relative">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h4 className="text-lg font-bold mb-2">Room Assignment</h4>
            <p className="text-sm text-white/80">Assign rooms to confirmed bookings</p>
            <div className="mt-3 text-xs text-white/60">Room Management</div>
          </div>
        </button>
      </div>

      {/* Bottom Insights */}
      <div className="mt-6 pt-6 border-t border-gray-200/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-heritage-green/10 to-emerald-100/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-black text-heritage-green">92%</div>
            <div className="text-xs text-gray-600 font-medium">Occupancy Rate</div>
            <div className="text-xs text-heritage-green mt-1">+5% from yesterday</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500/10 to-indigo-100/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-black text-blue-600">4.8</div>
            <div className="text-xs text-gray-600 font-medium">Avg Rating</div>
            <div className="text-xs text-blue-600 mt-1">Excellent service</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-violet-100/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-black text-purple-600">₱45K</div>
            <div className="text-xs text-gray-600 font-medium">Today's Revenue</div>
            <div className="text-xs text-purple-600 mt-1">+12% target</div>
          </div>
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-100/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-black text-amber-600">2.3</div>
            <div className="text-xs text-gray-600 font-medium">Avg Stay (days)</div>
            <div className="text-xs text-amber-600 mt-1">Normal duration</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationQuickActions;
