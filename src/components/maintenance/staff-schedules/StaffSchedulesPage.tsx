// StaffSchedulesPage.tsx - UPDATED WITH MERGED SCHEDULE TABLE
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '../../../config/firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  serverTimestamp, 
  doc, 
  DocumentReference,
  query,
  where
} from 'firebase/firestore';

// Import types
import { Staff, Schedule, WeeklySchedule, LeaveRequest } from './types';

// Import utilities
import {
  getDayFromDate,
  formatDateForDisplay,
  getWeekNumber,
  getWeekDateRange,
  getDepartment,
  getShiftTime
} from './utils';

// Import existing components
import ScheduleHeader from './ScheduleHeader';
import ScheduleTable from './ScheduleTable'; // ✅ Now includes filters
import CreateScheduleModal from './CreateScheduleModal';

// ✅ Import Leave Request Page
import LeaveRequestsPage from './LeaveRequestPage';

const StaffSchedulesPage: React.FC = () => {
  // ✅ Tab state
  const [activeTab, setActiveTab] = useState<"schedule" | "leave">("schedule");

  // ---------------- Existing States ----------------
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [selectedShift, setSelectedShift] = useState<string>('7am-3pm');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedClassification, setSelectedClassification] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [currentWeekOffset, setCurrentWeekOffset] = useState<number>(0);


  // ✅ NEW: State for leave requests
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);

  // ✅ OPTIMIZATION: Memoize computed values
  const currentWeekRange = useMemo(() => getWeekDateRange(currentWeekOffset), [currentWeekOffset]);
  
  const uniqueClassifications = useMemo(() => 
    Array.from(
      new Set(staffList.map(staff => staff.classification).filter((c): c is string => Boolean(c)))
    ).sort(),
    [staffList]
  );

  // ✅ OPTIMIZATION: Filter schedules by current week (memoized)
  const weeklySchedules = useMemo(() => {
    return schedules.filter(schedule => {
      if (!schedule.date) return false;
      const scheduleDate = new Date(schedule.date);
      return scheduleDate >= currentWeekRange.start && scheduleDate <= currentWeekRange.end;
    });
  }, [schedules, currentWeekRange]);

  // ✅ OPTIMIZATION: Organize weekly schedule (memoized)
  const weeklySchedule = useMemo(() => {
    const organized: WeeklySchedule = {};

    weeklySchedules.forEach(schedule => {
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

    return organized;
  }, [weeklySchedules]);

  // ✅ OPTIMIZATION: Filter by department and classification (memoized)
  const filteredWeeklySchedule = useMemo(() => {
    return Object.fromEntries(
      Object.entries(weeklySchedule).filter(([_, data]) => {
        if (selectedDepartment !== 'all') {
          const staffDepartment = getDepartment(data.classification);
          if (staffDepartment !== selectedDepartment) return false;
        }
        if (selectedClassification !== 'all') {
          if (data.classification !== selectedClassification) return false;
        }
        return true;
      })
    );
  }, [weeklySchedule, selectedDepartment, selectedClassification]);

  // ✅ OPTIMIZATION: Prepare schedules for header (memoized)
  const headerSchedules = useMemo(() => {
    return weeklySchedules.map(schedule => ({
      id: schedule.id,
      name: schedule.staffName,
      classification: schedule.classification,
      shift: schedule.shift,
      shiftTime: schedule.shiftTime,
      date: schedule.date || ''
    }));
  }, [weeklySchedules]);

  // ---------------- Fetching Logic ----------------

  /**
   * ✅ NEW: Fetch leave requests
   */
  const fetchLeaveRequests = useCallback(async (): Promise<void> => {
    try {
      const leaveCollection = collection(db, 'leave_requests');
      const leaveSnapshot = await getDocs(leaveCollection);
      
      const leaveData: LeaveRequest[] = leaveSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as LeaveRequest));

      setLeaveRequests(leaveData);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      // Don't alert, just log - leave requests are optional
    }
  }, []);

  /**
   * ✅ OPTIMIZATION: Only fetch staff when modal opens AND list is empty
   * This prevents unnecessary reads on every render
   */
  const fetchStaff = useCallback(async (): Promise<void> => {
    // Skip if we already have staff data
    if (staffList.length > 0) return;
    
    setLoading(true);
    try {
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
    } finally {
      setLoading(false);
    }
  }, [staffList.length]);

  /**
   * ✅ OPTIMIZATION: Fetch schedules with date range query
   * This dramatically reduces reads by only fetching schedules within the week
   * IMPORTANT: Requires Firestore composite index on 'date' field
   */
  const fetchSchedules = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const schedulesCollection = collection(db, 'staff_schedules');
      
      // Convert dates to ISO strings for Firestore comparison
      const startDate = currentWeekRange.start.toISOString().split('T')[0];
      const endDate = currentWeekRange.end.toISOString().split('T')[0];
      
      // ✅ Query only schedules within the current week range
      const q = query(
        schedulesCollection,
        where('date', '>=', startDate),
        where('date', '<=', endDate)
      );
      
      const schedulesSnapshot = await getDocs(q);
      
      const schedulesData: Schedule[] = schedulesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Schedule));

      setSchedules(schedulesData);
      
      console.log(`✅ Optimized query: Fetched ${schedulesData.length} schedules for week ${startDate} to ${endDate}`);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      
      // If the error is about missing index, provide helpful message
      if (error instanceof Error && error.message.includes('index')) {
        console.error('📌 You need to create a Firestore index on the "date" field.');
        console.error('📌 Check the browser console for a link to create the index automatically.');
      }
      
      alert('Error loading schedules. Please check your Firebase configuration and ensure the required index exists.');
    } finally {
      setLoading(false);
    }
  }, [currentWeekRange]);

  // ✅ Fetch schedules when week changes
  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  // ✅ Lazy load staff and leave requests only when modal opens
  useEffect(() => {
    if (isModalOpen) {
      fetchStaff();
      fetchLeaveRequests();
    }
  }, [isModalOpen, fetchStaff, fetchLeaveRequests]);

  // ---------------- Event Handlers ----------------

  const handleStaffToggle = (staffId: string): void => {
    setSelectedStaff(prev =>
      prev.includes(staffId)
        ? prev.filter(id => id !== staffId)
        : [...prev, staffId]
    );
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      console.log("Submitting schedule...");

      if (!selectedDate) {
        alert('Please select a date for the schedule.');
        return;
      }

      if (selectedStaff.length === 0) {
        alert('Please select at least one staff member.');
        return;
      }

      // ✅ NEW: Check if any selected staff has approved leave on this date
      const scheduleDate = new Date(selectedDate);
      const staffOnLeave = selectedStaff.filter(staffId => {
        return leaveRequests.some(request => {
          if (request.staffId !== staffId || request.status !== 'approved') {
            return false;
          }
          
          const leaveStart = new Date(request.startDate);
          const leaveEnd = new Date(request.endDate);
          
          return scheduleDate >= leaveStart && scheduleDate <= leaveEnd;
        });
      });

      if (staffOnLeave.length > 0) {
        const staffNames = staffOnLeave
          .map(id => staffList.find(s => s.id === id)?.fullName || 'Unknown')
          .join(', ');
        
        alert(`Cannot schedule the following staff members as they have approved leave on this date:\n${staffNames}`);
        return;
      }

      const scheduleCollection = collection(db, 'staff_schedules');
      
      const selectedDateObj = new Date(selectedDate);
      const dayName = getDayFromDate(selectedDate);
      
      // ✅ Batch write all schedules at once
      const schedulePromises = selectedStaff.map(staffId => {
        const staffMember = staffList.find(s => s.id === staffId);
        const staffRef: DocumentReference = doc(db, 'staff', staffId);
        
        return addDoc(scheduleCollection, {
          staffRef: staffRef,
          staffId: staffId,
          staffName: staffMember?.fullName || '',
          classification: staffMember?.classification || '',
          email: staffMember?.email || '',
          phoneNumber: staffMember?.phoneNumber || '',
          date: selectedDate, // ✅ Store as ISO string for querying
          day: dayName,
          shift: selectedShift,
          shiftTime: getShiftTime(selectedShift),
          createdAt: serverTimestamp(),
          status: 'scheduled',
          week: getWeekNumber(selectedDateObj),
          year: selectedDateObj.getFullYear(),
          month: selectedDateObj.getMonth() + 1
        });
      });

      await Promise.all(schedulePromises);
      
      // Reset modal state
      setIsModalOpen(false);
      setSelectedStaff([]);
      setSelectedShift('7am-3pm');
      setSelectedDate('');
      
      alert(`Successfully scheduled ${selectedStaff.length} staff member(s) for ${formatDateForDisplay(selectedDate)}!`);
      
      // Refresh schedules
      fetchSchedules();
    } catch (error) {
      console.error('Error creating schedule:', error);
      alert('Failed to create schedule. Please check your Firebase configuration and try again.');
    }
  };

  // ---------------- RENDER ----------------
  return (
    <div className="min-h-screen bg-[#F9F6EE] pb-12">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 rounded-full blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl animate-pulse delay-1000 opacity-25"></div>
        <div className="absolute bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 rounded-full blur-3xl animate-pulse delay-2000 opacity-20"></div>
        
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(134, 134, 134, 0.1) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 w-full">
        {/* ✅ Pass optimized header schedules as prop */}
        <ScheduleHeader weeklySchedules={headerSchedules} />

        {/* ✅ TAB NAVIGATION - After header, before filters */}
{/* ===================== TAB NAVIGATION WITH REAL-TIME CLOCK ===================== */}
<div className="w-full flex justify-center mb-8">
  <div className="flex w-[600px] bg-gradient-to-br from-[#f6fff6] to-[#e8f6e8] p-2 rounded-3xl shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
    
    {/* Staff Scheduling Tab */}
    <button
      onClick={() => setActiveTab("schedule")}
      className={`flex-1 py-3 rounded-2xl font-semibold transition-all duration-300
        ${activeTab === "schedule"
          ? "bg-white shadow-md text-[#2F6D2F]"
          : "text-[#338833] opacity-70 hover:opacity-100"
        }`}
    >
      Staff Scheduling
    </button>

    {/* Leave Requests Tab */}
    <button
      onClick={() => setActiveTab("leave")}
      className={`flex-1 py-3 rounded-2xl font-semibold transition-all duration-300
        ${activeTab === "leave"
          ? "bg-white shadow-md text-[#2F6D2F]"
          : "text-[#338833] opacity-70 hover:opacity-100"
        }`}
    >
      Leave Requests
    </button>

</div>
</div>


        {/* ✅ Conditional Page Rendering */}
        {activeTab === "leave" ? (
          <LeaveRequestsPage />
        ) : (
          <div className="space-y-6">
            {/* ✅ UPDATED: ScheduleTable now includes filters */}
            <ScheduleTable
              weeklySchedule={filteredWeeklySchedule}
              selectedDepartment={selectedDepartment}
              setSelectedDepartment={setSelectedDepartment}
              selectedClassification={selectedClassification}
              setSelectedClassification={setSelectedClassification}
              uniqueClassifications={uniqueClassifications}
              currentWeekOffset={currentWeekOffset}
              setCurrentWeekOffset={setCurrentWeekOffset}
              currentWeekRange={currentWeekRange}
              onCreateSchedule={() => setIsModalOpen(true)}
            />

            <CreateScheduleModal 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)} 
              selectedDate={selectedDate} 
              setSelectedDate={setSelectedDate} 
              selectedShift={selectedShift} 
              setSelectedShift={setSelectedShift} 
              selectedStaff={selectedStaff} 
              handleStaffToggle={handleStaffToggle} 
              staffList={staffList} 
              loading={loading} 
              onSubmit={handleSubmit}
              leaveRequests={leaveRequests} // ✅ NEW: Pass leave requests
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffSchedulesPage;