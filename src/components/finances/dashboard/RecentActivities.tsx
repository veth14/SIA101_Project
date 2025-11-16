import React from 'react';
import { Calendar, CreditCard, ArrowLeft, Bell, Clock, User } from 'lucide-react';

// Sample activity data with hotel-specific activities
const activityData = [
  {
    id: 'act-001',
    title: 'New Booking Confirmed',
    description: 'John Smith booked Deluxe Suite for 3 nights',
    timestamp: '2025-10-10T14:32:00',
    type: 'booking',
    amount: '₱11,400',
    room: 'Room 205',
    user: {
      name: 'John Smith',
      avatar: null
    }
  },
  {
    id: 'act-002',
    title: 'Payment Received',
    description: 'Sarah Johnson completed payment for reservation',
    timestamp: '2025-10-10T12:15:00',
    type: 'payment',
    amount: '₱8,507',
    room: 'Room 312',
    user: {
      name: 'Sarah Johnson',
      avatar: null
    }
  },
  {
    id: 'act-003',
    title: 'Check-in Completed',
    description: 'Michael Brown checked into Standard Room',
    timestamp: '2025-10-10T10:45:00',
    type: 'checkin',
    amount: '₱7,500',
    room: 'Room 108',
    user: {
      name: 'Michael Brown',
      avatar: null
    }
  },
  {
    id: 'act-004',
    title: 'Refund Processed',
    description: 'Emma Wilson received cancellation refund',
    timestamp: '2025-10-09T16:20:00',
    type: 'refund',
    amount: '₱4,502',
    room: 'Room 201',
    user: {
      name: 'Emma Wilson',
      avatar: null
    }
  },
  {
    id: 'act-005',
    title: 'Room Service Order',
    description: 'David Lee ordered premium dining service',
    timestamp: '2025-10-09T09:30:00',
    type: 'service',
    amount: '₱2,850',
    room: 'Room 405',
    user: {
      name: 'David Lee',
      avatar: null
    }
  }
];

const RecentActivities: React.FC = () => {
  return (
    <div className="overflow-hidden relative bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60 shadow-2xl animate-fade-in">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/8 via-heritage-light/30 to-heritage-green/5 rounded-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="px-8 py-7 border-b bg-gradient-to-r from-white via-slate-50/80 to-white border-gray-200/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5">
              <div className="relative group">
                <div className="flex items-center justify-center w-12 h-12 shadow-2xl bg-gradient-to-br from-heritage-green via-heritage-green to-heritage-neutral rounded-2xl transition-all duration-300 group-hover:scale-105">
                  <Bell className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-heritage-green/20 to-heritage-neutral/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div>
                <h3 className="text-2xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Recent Activities
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm font-semibold text-gray-600">Latest hotel activities</p>
                  <div className="w-1 h-1 bg-heritage-green rounded-full"></div>
                  <span className="text-sm font-bold text-heritage-green">5 activities today</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activities List */}
        <div className="px-8 py-6">
          <div className="space-y-4">
            {activityData.map((activity) => (
              <div 
                key={activity.id} 
                className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Activity Type Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      activity.type === 'booking' ? 'bg-green-100' :
                      activity.type === 'payment' ? 'bg-blue-100' :
                      activity.type === 'checkin' ? 'bg-purple-100' :
                      activity.type === 'refund' ? 'bg-red-100' :
                      'bg-orange-100'
                    }`}>
                      {activity.type === 'booking' && <Calendar className="w-6 h-6 text-green-600" />}
                      {activity.type === 'payment' && <CreditCard className="w-6 h-6 text-blue-600" />}
                      {activity.type === 'checkin' && <User className="w-6 h-6 text-purple-600" />}
                      {activity.type === 'refund' && <ArrowLeft className="w-6 h-6 text-red-600" />}
                      {activity.type === 'service' && <Bell className="w-6 h-6 text-orange-600" />}
                    </div>
                    
                    {/* Activity Details */}
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm font-medium text-heritage-green">{activity.room}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>{activity.description}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(activity.timestamp).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Amount and User */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        activity.type === 'refund' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {activity.type === 'refund' ? '-' : '+'}{activity.amount}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(activity.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    
                    {/* User Avatar */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-sm text-gray-700 font-medium">
                        {activity.user.name.charAt(0)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* View All Button */}
          <div className="mt-6 text-center">
            <button className="px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-heritage-green to-heritage-neutral rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              View All Activities
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivities;