import React, { useState, useEffect, useMemo } from 'react';

// Interface for scheduled staff
interface ScheduledStaff {
  id: string;
  name: string;
  classification: string;
  shift: string;
  shiftTime: string;
  date: string;
}

interface DaySchedule {
  [date: string]: ScheduledStaff[];
}

interface ScheduleHeaderProps {
  weeklySchedules?: ScheduledStaff[]; // Pass all schedules for the week from parent
}

const DayScheduleModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  date: string;
  dayName: string;
  staffList: ScheduledStaff[];
}> = ({ isOpen, onClose, date, dayName, staffList }) => {
  if (!isOpen) return null;

  const formatDate = (dateStr: string) => {
    // Parse the date string correctly to avoid timezone issues
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-br from-[#82A33D] to-[#6d8a33] px-8 py-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold">{dayName}</h2>
              <p className="text-green-100 mt-1">{formatDate(date)}</p>
              <div className="mt-3 inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5">
                <span className="text-sm font-semibold">{staffList.length} Staff Scheduled</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-180px)] bg-gray-50">
          {staffList.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <p className="text-gray-500 text-lg font-medium">No staff scheduled for this day</p>
            </div>
          ) : (
            <div className="space-y-3">
              {staffList.map((staff) => (
                <div
                  key={staff.id}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#82A33D] to-[#6d8a33] rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{staff.name}</h3>
                        <p className="text-sm text-gray-500">{staff.classification}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="inline-block bg-[#82A33D]/10 rounded-lg px-4 py-2">
                        <p className="text-sm font-semibold text-[#82A33D]">{staff.shift}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{staff.shiftTime}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-white px-8 py-5 flex items-center justify-end gap-3 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#82A33D] text-white rounded-xl hover:bg-[#6d8a33] transition-colors font-medium shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({ weeklySchedules = [] }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<{ date: string; dayName: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Organize schedules by date (memoized to avoid recalculation)
  const schedulesByDate = useMemo(() => {
    const organized: DaySchedule = {};
    
    weeklySchedules.forEach(schedule => {
      if (!organized[schedule.date]) {
        organized[schedule.date] = [];
      }
      organized[schedule.date].push(schedule);
    });
    
    return organized;
  }, [weeklySchedules]);

  // Get Monday to Friday of current week
  const getWeekDays = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Calculate offset to get to Monday
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0); // Reset time to avoid timezone issues
    
    const days = [];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    for (let i = 0; i < 5; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      day.setHours(0, 0, 0, 0); // Ensure consistent time
      
      // Format date as YYYY-MM-DD in local timezone
      const year = day.getFullYear();
      const month = String(day.getMonth() + 1).padStart(2, '0');
      const date = String(day.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${date}`;
      
      days.push({
        name: dayNames[i],
        date: day,
        dateString: dateString,
        dayNumber: day.getDate(),
        month: day.toLocaleDateString('en-US', { month: 'short' }),
        isToday: day.toDateString() === today.toDateString()
      });
    }
    
    return days;
  };

  const weekDays = getWeekDays();

  const handleViewDay = (dateString: string, dayName: string) => {
    setSelectedDay({ date: dateString, dayName });
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="relative bg-gradient-to-br from-white via-green-50/20 to-green-500/5 rounded-3xl shadow-2xl border border-green-500/10 overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-600/5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-green-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-green-100/15 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000"></div>
        
        <div className="relative p-8">
          {/* Day Blocks */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            {weekDays.map((day) => {
              const staffCount = schedulesByDate[day.dateString]?.length || 0;
              
              return (
                <div
                  key={day.dateString}
                  className={`relative bg-white rounded-2xl p-5 shadow-lg border transition-all hover:shadow-2xl ${
                    day.isToday
                      ? 'border-[#82A33D] ring-2 ring-[#82A33D]/20 shadow-xl'
                      : 'border-gray-200 hover:border-[#82A33D]/50'
                  }`}
                >
                  {day.isToday && (
                    <div className="absolute -top-2 -right-2 bg-[#82A33D] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      Today
                    </div>
                  )}
                  
                  <div className="text-center space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        {day.name}
                      </p>
                      <div className="mt-2">
                        <p className="text-3xl font-black text-[#82A33D]">
                          {day.dayNumber}
                        </p>
                        <p className="text-sm text-gray-600 font-medium">
                          {day.month}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-center space-x-2 mb-3">
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        <p className="text-sm font-semibold text-gray-700">
                          {staffCount} Staff
                        </p>
                      </div>
                      
                      <button
                        onClick={() => handleViewDay(day.dateString, day.name)}
                        className="w-full bg-[#82A33D]/10 hover:bg-[#82A33D] text-[#82A33D] hover:text-white rounded-lg px-4 py-2 text-sm font-semibold transition-all"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Date and Time - Bottom Right */}
          <div className="flex justify-end">
            <div className="relative group">
              <div className="bg-gradient-to-br from-white/90 to-green-500/5 backdrop-blur-xl rounded-2xl px-6 py-4 border border-green-500/20 shadow-lg group-hover:scale-105 transition-all duration-500">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#82A33D] to-green-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-2xl font-black bg-gradient-to-r from-[#82A33D] to-green-600 bg-clip-text text-transparent">
                      {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </p>
                    <p className="text-xs text-gray-600 font-semibold mt-0.5">
                      {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <div className="w-1.5 h-1.5 bg-[#82A33D] rounded-full animate-ping"></div>
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-ping delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping delay-150"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Day Schedule Modal */}
      {selectedDay && (
        <DayScheduleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          date={selectedDay.date}
          dayName={selectedDay.dayName}
          staffList={schedulesByDate[selectedDay.date] || []}
        />
      )}
    </>
  );
};

export default ScheduleHeader;