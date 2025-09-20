import React from 'react';

interface QuickActionsPanelProps {
  onWalkInBooking: () => void;
  onQuickCheckIn: () => void;
  onRoomStatus: () => void;
  onGuestServices: () => void;
}

const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({
  onWalkInBooking,
  onQuickCheckIn,
  onRoomStatus,
  onGuestServices
}) => {
  const actions = [
    {
      id: 'walkin',
      title: 'Walk-in Booking',
      description: 'Create new reservation',
      icon: '🚶‍♂️',
      color: 'from-heritage-green to-emerald-600',
      onClick: onWalkInBooking
    },
    {
      id: 'checkin',
      title: 'Quick Check-in',
      description: 'Process guest arrival',
      icon: '🏨',
      color: 'from-blue-500 to-blue-600',
      onClick: onQuickCheckIn
    },
    {
      id: 'rooms',
      title: 'Room Status',
      description: 'View room availability',
      icon: '🛏️',
      color: 'from-purple-500 to-violet-600',
      onClick: onRoomStatus
    },
    {
      id: 'services',
      title: 'Guest Services',
      description: 'Handle special requests',
      icon: '🛎️',
      color: 'from-orange-500 to-red-500',
      onClick: onGuestServices
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-heritage-green to-heritage-neutral rounded-xl flex items-center justify-center shadow-md">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className="group relative p-4 bg-gradient-to-r hover:from-gray-50 hover:to-white rounded-xl border-2 border-gray-200 hover:border-heritage-green transition-all duration-300 text-left overflow-hidden"
          >
            {/* Hover Background Effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl`}></div>
            
            <div className="relative flex items-center space-x-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-white text-xl">{action.icon}</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 group-hover:text-heritage-green transition-colors">
                  {action.title}
                </h4>
                <p className="text-sm text-gray-500 mt-1">{action.description}</p>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-heritage-green group-hover:translate-x-1 transition-all" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsPanel;
