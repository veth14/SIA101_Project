// StaffSchedulesPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../../../config/firebase';
import { collection, getDocs, addDoc, serverTimestamp, doc, DocumentReference } from 'firebase/firestore';

// Import types
import { Staff, Schedule, WeeklySchedule } from './types';

// Import utilities
import {
  getDayFromDate,
  formatDateForDisplay,
  getWeekNumber,
  getWeekDateRange,
  filterSchedulesByWeek,
  getDepartment,
  getShiftTime
} from './utils';

// Import components
import ScheduleHeader from './ScheduleHeader';
import ScheduleFilters from './ScheduleFilters';
import ScheduleTable from './ScheduleTable';
import CreateScheduleModal from './CreateScheduleModal';

const StaffSchedulesPage: React.FC = () => {
  // State management
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [selectedShift, setSelectedShift] = useState<string>('7am-3pm');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedClassification, setSelectedClassification] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [currentWeekOffset, setCurrentWeekOffset] = useState<number>(0);

  // Computed values
  const currentWeekRange = getWeekDateRange(currentWeekOffset);
  
  const uniqueClassifications = Array.from(
    new Set(staffList.map(staff => staff.classification).filter((c): c is string => Boolean(c)))
  ).sort();

  const filteredWeeklySchedule = Object.fromEntries(
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

  // Fetch staff from Firestore
  const fetchStaff = useCallback(async (): Promise<void> => {
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
      setStaffList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Organize schedules by staff and day
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

  // Fetch schedules from Firestore
const fetchSchedules = useCallback(async (): Promise<void> => {
  try {
    const schedulesCollection = collection(db, 'staff_schedules');
    const schedulesSnapshot = await getDocs(schedulesCollection);
    
    const schedulesData: Schedule[] = schedulesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Schedule));

    setSchedules(schedulesData);
    
    // Use the state variable in a useEffect instead
  } catch (error) {
    console.error('Error fetching schedules:', error);
  }
}, []);

// Add new useEffect to organize schedules when they change
useEffect(() => {
  const weekFiltered = filterSchedulesByWeek(
    schedules, 
    currentWeekRange.start, 
    currentWeekRange.end
  );
  organizeWeeklySchedule(weekFiltered);
}, [schedules, currentWeekRange, organizeWeeklySchedule]);

  // Effects
  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules, currentWeekOffset]);

  useEffect(() => {
    if (isModalOpen) {
      fetchStaff();
    }
  }, [isModalOpen, fetchStaff]);

  // Event handlers
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

      const scheduleCollection = collection(db, 'staff_schedules');
      
      const selectedDateObj = new Date(selectedDate);
      const dayName = getDayFromDate(selectedDate);
      
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
          date: selectedDate,
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
      
      setIsModalOpen(false);
      setSelectedStaff([]);
      setSelectedShift('7am-3pm');
      setSelectedDate('');
      
      alert(`Successfully scheduled ${selectedStaff.length} staff member(s) for ${formatDateForDisplay(selectedDate)}!`);
      
      fetchSchedules();
    } catch (error) {
      console.error('Error creating schedule:', error);
      alert('Failed to create schedule. Please check your Firebase configuration and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F6EE]">
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
      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">
        <ScheduleHeader />
        
        <ScheduleFilters
          onCreateSchedule={() => setIsModalOpen(true)}
          currentWeekOffset={currentWeekOffset}
          setCurrentWeekOffset={setCurrentWeekOffset}
          currentWeekRange={currentWeekRange}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          selectedClassification={selectedClassification}
          setSelectedClassification={setSelectedClassification}
          uniqueClassifications={uniqueClassifications}
        />

        <ScheduleTable
          weeklySchedule={filteredWeeklySchedule}
          selectedDepartment={selectedDepartment}
          selectedClassification={selectedClassification}
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
        />
      </div>
    </div>
  );
};

export default StaffSchedulesPage;