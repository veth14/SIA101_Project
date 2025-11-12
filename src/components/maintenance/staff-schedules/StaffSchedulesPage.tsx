in the create schedule modal, can you add a fuction where the names is can be seperated through their classification, also add a fade in and fade out of the modal, and also fix the filtering of classification for the table, and i want to know your suggestion abourt seeing the schedule for nnext week of for next month


import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../../../config/firebase';
import { collection, getDocs, addDoc, serverTimestamp, doc, DocumentReference } from 'firebase/firestore';

interface Staff {
  id: string;
  fullName?: string;
  classification?: string;
  email?: string;
  phoneNumber?: string;
  age?: number;
  gender?: string;
  rfid?: string;
  adminId?: string;
  createdAt?: any;
}

interface Schedule {
  id: string;
  staffId: string;
  staffName: string;
  classification: string;
  day: string;
  shift: string;
  shiftTime: string;
  status: string;
  createdAt?: any;
}

interface WeeklySchedule {
  [staffId: string]: {
    staffName: string;
    classification: string;
    schedule: {
      [day: string]: {
        shift: string;
        shiftTime: string;
      };
    };
  };
}

const StaffSchedulesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [selectedShift, setSelectedShift] = useState<string>('7am-3pm');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>({});
  const [loading, setLoading] = useState<boolean>(false);

  // Shifts configuration
  const shifts = [
    { value: '7am-3pm', label: '7:00 AM - 3:00 PM' },
    { value: '3pm-11pm', label: '3:00 PM - 11:00 PM' },
    { value: '11pm-7am', label: '11:00 PM - 7:00 AM' },
  ];

  const days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Helper function to get day name from date
  const getDayFromDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  // Helper function to format date for display
  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const fetchStaff = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      // Fetch staff from Firestore
      const staffCollection = collection(db, 'staff');
      const staffSnapshot = await getDocs(staffCollection);
      
      const staffData: Staff[] = staffSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Staff));

      setStaffList(staffData);
    } catch (error) {
      console.error('Error fetching staff:', error);
      alert('Error loading staff. Please check your Firebase configuration.');
      // Fallback to sample data if Firebase fetch fails
      setStaffList([
        { id: '1', fullName: 'John Smith', classification: 'HVAC Technician' },
        { id: '2', fullName: 'Mike Johnson', classification: 'Electrician' },
        { id: '3', fullName: 'Sarah Williams', classification: 'Plumber' },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  const organizeWeeklySchedule = useCallback((schedulesData: Schedule[]): void => {
    const organized: WeeklySchedule = {};

    schedulesData.forEach(schedule => {
      if (!organized[schedule.staffId]) {
        organized[schedule.staffId] = {
          staffName: schedule.staffName,
          classification: schedule.classification,
          schedule: {}
        };
      }

      organized[schedule.staffId].schedule[schedule.day] = {
        shift: schedule.shift,
        shiftTime: schedule.shiftTime
      };
    });

    setWeeklySchedule(organized);
  }, []);

  const fetchSchedules = useCallback(async (): Promise<void> => {
    try {
      // Fetch schedules from Firestore
      const schedulesCollection = collection(db, 'staff_schedules');
      const schedulesSnapshot = await getDocs(schedulesCollection);
      
      const schedulesData: Schedule[] = schedulesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Schedule));

      setSchedules(schedulesData);
      organizeWeeklySchedule(schedulesData);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  }, [organizeWeeklySchedule]);

  // Fetch schedules on component mount
  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  // Fetch staff from Firebase when modal opens
  useEffect(() => {
    if (isModalOpen) {
      fetchStaff();
    }
  }, [isModalOpen, fetchStaff]);

  const handleStaffToggle = (staffId: string): void => {
    setSelectedStaff(prev =>
      prev.includes(staffId)
        ? prev.filter(id => id !== staffId)
        : [...prev, staffId]
    );
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      if (!selectedDate) {
        alert('Please select a date for the schedule.');
        return;
      }

      // Create schedule document for each selected staff
      const scheduleCollection = collection(db, 'staff_schedules');
      
      const selectedDateObj = new Date(selectedDate);
      const dayName = getDayFromDate(selectedDate);
      
      const schedulePromises = selectedStaff.map(staffId => {
        const staffMember = staffList.find(s => s.id === staffId);
        
        // Create a reference to the staff document
        const staffRef: DocumentReference = doc(db, 'staff', staffId);
        
        return addDoc(scheduleCollection, {
          staffRef: staffRef, // Reference to staff document
          staffId: staffId, // Keep ID for easy queries
          staffName: staffMember?.fullName || '',
          classification: staffMember?.classification || '',
          email: staffMember?.email || '',
          phoneNumber: staffMember?.phoneNumber || '',
          date: selectedDate, // Full date (YYYY-MM-DD)
          day: dayName, // Day name (Monday, Tuesday, etc.)
          shift: selectedShift,
          shiftTime: selectedShift === '7am-3pm' ? '07:00-15:00' : 
                     selectedShift === '3pm-11pm' ? '15:00-23:00' : '23:00-07:00',
          createdAt: serverTimestamp(),
          status: 'scheduled',
          week: getWeekNumber(selectedDateObj),
          year: selectedDateObj.getFullYear(),
          month: selectedDateObj.getMonth() + 1
        });
      });

      await Promise.all(schedulePromises);
      
      console.log('Schedule created successfully:', {
        staff: selectedStaff,
        shift: selectedShift,
        date: selectedDate,
        day: dayName,
      });

      // Reset form and close modal
      setIsModalOpen(false);
      setSelectedStaff([]);
      setSelectedShift('7am-3pm');
      setSelectedDate('');
      
      alert(`Successfully scheduled ${selectedStaff.length} staff member(s) for ${formatDateForDisplay(selectedDate)}!`);
      
      // Refresh the schedule table
      fetchSchedules();
    } catch (error) {
      console.error('Error creating schedule:', error);
      alert('Failed to create schedule. Please check your Firebase configuration and try again.');
    }
  };

  // Helper function to get week number
  const getWeekNumber = (date: Date): number => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  return (
    <div className="min-h-screen bg-[#F9F6EE]">
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
      {/* Enhanced Header */}
      <div className="relative bg-gradient-to-br from-white via-green-50/20 to-green-500/5 rounded-3xl shadow-2xl border border-green-500/10 overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-600/5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-green-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-green-100/15 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000"></div>
        
        <div className="relative p-10">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#82A33D] to-[#6d8a33] rounded-2xl flex items-center justify-center shadow-xl border border-[#82A33D]/30 group-hover:scale-110 transition-all duration-500">
                    <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#82A33D] to-green-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                </div>
                <div className="space-y-2">
                  <h1 className="text-5xl font-black text-[#82A33D] drop-shadow-sm">
                    Staff Schedules
                  </h1>
                  <p className="text-xl text-gray-700 font-medium tracking-wide">
                    Schedule and manage staff shifts
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

      {/* Schedule Controls */}
      <div className="mb-6 flex flex-wrap gap-4">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-heritage-green text-white px-4 py-2 rounded-lg hover:bg-heritage-green/90 transition-colors"
        >
          Create Schedule
        </button>
        <select className="border border-gray-300 rounded-lg px-3 py-2">
          <option>This Week</option>
          <option>Next Week</option>
          <option>This Month</option>
        </select>
        <select className="border border-gray-300 rounded-lg px-3 py-2">
          <option>All Departments</option>
          <option>HVAC</option>
          <option>Electrical</option>
          <option>Plumbing</option>
        </select>
      </div>

      {/* Schedule Calendar */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Weekly Schedule</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff
                </th>
                {days.map(day => (
                  <th key={day} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.keys(weeklySchedule).length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No schedules created yet. Click "Create Schedule" to add staff schedules.
                  </td>
                </tr>
              ) : (
                Object.entries(weeklySchedule).map(([staffId, data]) => (
                  <tr key={staffId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{data.staffName}</div>
                      <div className="text-sm text-gray-500">{data.classification}</div>
                    </td>
                    {days.map(day => (
                      <td key={day} className="px-6 py-4 text-center">
                        {data.schedule[day] ? (
                          <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                            {data.schedule[day].shiftTime}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">Off</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-white px-8 py-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#9CB347] rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#9CB347]">Create New Schedule</h2>
                    <p className="text-sm text-gray-500 mt-1">Assign staff members to their shifts</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-220px)] bg-gray-50">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9CB347]"></div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Schedule Details Section */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <svg className="w-5 h-5 text-[#9CB347]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
                        </svg>
                        <h3 className="text-lg font-bold text-[#9CB347]">Schedule Details</h3>
                      </div>

                      {/* Select Day */}
                      <div className="mb-5">
                        <label className="block text-sm font-semibold text-gray-600 mb-2">
                          Schedule Date
                        </label>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#9CB347] focus:border-transparent bg-white"
                        />
                        {selectedDate && (
                          <p className="mt-2 text-xs text-gray-600">
                            Selected: <span className="font-semibold text-[#9CB347]">{formatDateForDisplay(selectedDate)}</span>
                          </p>
                        )}
                      </div>

                      {/* Select Shift */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">
                          Shift Time
                        </label>
                        <div className="space-y-2">
                          {shifts.map(shift => (
                            <label
                              key={shift.value}
                              className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-white hover:border-[#9CB347]/30 cursor-pointer transition-all bg-white"
                            >
                              <input
                                type="radio"
                                name="shift"
                                value={shift.value}
                                checked={selectedShift === shift.value}
                                onChange={(e) => setSelectedShift(e.target.value)}
                                className="w-4 h-4 text-[#9CB347] focus:ring-[#9CB347] border-gray-300"
                              />
                              <span className="ml-3 text-sm font-medium text-gray-700">
                                {shift.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    {/* Staff Selection Section */}
                    <div className="flex items-center gap-2 mb-4">
                      <svg className="w-5 h-5 text-[#9CB347]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      <h3 className="text-lg font-bold text-[#9CB347]">Staff Members</h3>
                    </div>

                    {/* Select Staff */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">
                        Select Staff Members
                      </label>
                      <div className="space-y-2 max-h-[400px] overflow-y-auto border border-gray-200 rounded-xl p-4 bg-white">
                        {staffList.length === 0 ? (
                          <p className="text-center text-gray-500 py-4">No staff members found</p>
                        ) : (
                          staffList.map(staff => (
                            <label
                              key={staff.id}
                              className="flex items-start p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={selectedStaff.includes(staff.id)}
                                onChange={() => handleStaffToggle(staff.id)}
                                className="w-4 h-4 text-[#9CB347] rounded focus:ring-[#9CB347] border-gray-300 mt-0.5"
                              />
                              <div className="ml-3">
                                <div className="text-sm font-semibold text-gray-900">
                                  {staff.fullName || 'Unnamed Staff'}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {staff.classification || 'No classification'}
                                </div>
                              </div>
                            </label>
                          ))
                        )}
                      </div>
                      {selectedStaff.length > 0 && (
                        <div className="mt-3 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-sm text-green-700 font-medium">
                            {selectedStaff.length} staff member{selectedStaff.length !== 1 ? 's' : ''} selected
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-white px-8 py-5 flex items-center justify-end gap-3 border-t border-gray-100">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={selectedStaff.length === 0 || loading || !selectedDate}
                className="px-6 py-2.5 bg-[#9CB347] text-white rounded-xl hover:bg-[#8a9f3d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
              >
                Create Schedule
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default StaffSchedulesPage;