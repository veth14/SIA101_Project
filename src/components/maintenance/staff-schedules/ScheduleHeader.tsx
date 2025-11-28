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
  weeklySchedules?: ScheduledStaff[];
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
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <style>{`
        @keyframes slide-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-in-up {
          animation: slide-in-up 0.4s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-up:nth-child(1) {
          animation-delay: 0.1s;
        }

        .animate-fade-in-up:nth-child(2) {
          animation-delay: 0.2s;
        }

        .animate-fade-in-up:nth-child(3) {
          animation-delay: 0.3s;
        }

        .animate-fade-in-up:nth-child(4) {
          animation-delay: 0.4s;
        }

        .animate-fade-in-up:nth-child(5) {
          animation-delay: 0.5s;
        }

        .animate-fade-in-up:nth-child(n+6) {
          animation-delay: calc(0.1s * (var(--index, 1) + 5));
        }
      `}</style>

      <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 bg-black/40">
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-slide-in-up">
          
          {/* Header - matching elegant style */}
          <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-gray-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#82A33D]/10 rounded-xl">
                  <svg className="w-6 h-6 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900">{dayName}</h3>
                  <p className="mt-1 text-sm text-gray-600 flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 bg-[#82A33D]/10 text-[#82A33D] rounded-lg text-xs font-semibold">
                      Daily Schedule
                    </span>
                    <span className="text-gray-400">•</span>
                    <span>{formatDate(date)}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 transition-colors rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8 overflow-y-auto max-h-[calc(90vh-240px)] bg-gray-50">
            {staffList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="p-4 bg-gray-100 rounded-2xl mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-gray-600 text-lg font-semibold">No staff scheduled</p>
                <p className="text-gray-500 text-sm mt-2">There are no staff members assigned for this day</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Summary Card with Animation */}
                <div className="animate-fade-in-up p-5 rounded-2xl bg-white border border-gray-200/70 shadow-sm mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-5 h-5 text-[#82A33D]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <h4 className="text-sm font-bold tracking-wide uppercase text-gray-900">Staff Summary</h4>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="animate-fade-in-up p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs text-gray-600 font-medium">Total Staff</p>
                      <p className="text-2xl font-black text-blue-600 mt-2">{staffList.length}</p>
                    </div>
                    <div className="animate-fade-in-up p-3 bg-emerald-50 rounded-lg border border-emerald-200" style={{ animationDelay: '0.15s' }}>
                      <p className="text-xs text-gray-600 font-medium">Scheduled</p>
                      <p className="text-2xl font-black text-emerald-600 mt-2">{staffList.length}</p>
                    </div>
                    <div className="animate-fade-in-up p-3 bg-gradient-to-br from-[#82A33D]/10 to-green-100/10 rounded-lg border border-[#82A33D]/20" style={{ animationDelay: '0.25s' }}>
                      <p className="text-xs text-gray-600 font-medium">Coverage</p>
                      <p className="text-2xl font-black text-[#82A33D] mt-2">100%</p>
                    </div>
                  </div>
                </div>

                {/* Staff List */}
                <div className="animate-fade-in-up p-5 rounded-2xl bg-white border border-gray-200/70 shadow-sm" style={{ animationDelay: '0.35s' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-[#82A33D]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                    </svg>
                    <h4 className="text-sm font-bold tracking-wide uppercase text-gray-900">Staff Members</h4>
                  </div>

                  <div className="space-y-2">
                    {staffList.map((staff, index) => (
                      <div
                        key={staff.id}
                        className="animate-fade-in-up p-4 rounded-xl bg-white border border-gray-200 hover:border-[#82A33D]/50 hover:bg-gray-50 transition-all"
                        style={{ animationDelay: `${0.45 + index * 0.08}s` }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#82A33D] to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-sm font-bold text-gray-900 truncate">
                                {staff.name}
                              </h5>
                              <p className="text-xs text-gray-600 mt-0.5">
                                {staff.classification}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 ml-4">
                            <div className="text-right">
                              <p className="text-sm font-semibold text-gray-900">
                                {staff.shift}
                              </p>
                              <p className="text-xs text-gray-600 mt-0.5">
                                {staff.shiftTime}
                              </p>
                            </div>
                            <div className="px-3 py-1.5 bg-[#82A33D]/10 rounded-lg flex items-center justify-center min-w-fit">
                              <svg className="w-4 h-4 text-[#82A33D]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50">
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
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

  const getWeekDays = () => {
    const today = new Date();
    const currentDay = today.getDay();
    
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);
    
    const days = [];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    for (let i = 0; i < 5; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      day.setHours(0, 0, 0, 0);
      
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
      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-day-block {
          animation: fade-in-up 0.5s ease-out forwards;
          opacity: 0;
        }

        .animate-day-block:nth-child(1) {
          animation-delay: 0.1s;
        }

        .animate-day-block:nth-child(2) {
          animation-delay: 0.2s;
        }

        .animate-day-block:nth-child(3) {
          animation-delay: 0.3s;
        }

        .animate-day-block:nth-child(4) {
          animation-delay: 0.4s;
        }

        .animate-day-block:nth-child(5) {
          animation-delay: 0.5s;
        }
      `}</style>

      <div className="relative bg-gradient-to-br from-white via-green-50/20 to-green-500/5 rounded-3xl shadow-2xl border border-green-500/10 overflow-hidden mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-600/5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-green-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-green-100/15 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000"></div>
        
        <div className="relative p-8">
          <div className="grid grid-cols-5 gap-4">
            {weekDays.map((day) => {
              const staffCount = schedulesByDate[day.dateString]?.length || 0;
              
              return (
                <div
                  key={day.dateString}
                  className={`animate-day-block relative bg-white rounded-2xl p-5 shadow-lg border transition-all hover:shadow-2xl ${
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