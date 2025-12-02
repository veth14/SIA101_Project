
import { useState } from 'react';
import { collection, getDocs, addDoc, query, where, Timestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Staff } from '../components/maintenance/manage-staff/types';




export interface AttendanceRecord {
  id?: string;
  staffId: string;
  rfid: string;
  staffName: string;
  timeIn: Date;
  timeOut?: Date;
  date: string;
}

export interface StaffWithAttendance extends Staff {
  timeIn: Timestamp;
  timeOut: Timestamp;
  date: string;
}



export function useAttendance() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRFIDScan = async (rfid: string) => {
    setLoading(true);
    setError(null);

    try {
      // Query staff by RFID
      const q = query(collection(db, 'staff'), where('rfid', '==', rfid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('RFID not found. Please register first.');
        return { success: false, message: 'RFID not found. Please register first.' };
      }

      const staffDoc = querySnapshot.docs[0];
      const staffData = staffDoc.data();
      
      // Handle different createdAt formats (Firestore Timestamp, Date, or plain object)
      let createdAtDate = new Date();
      if (staffData.createdAt) {
        if (typeof staffData.createdAt.toDate === 'function') {
          // Firestore Timestamp
          createdAtDate = staffData.createdAt.toDate();
        } else if (staffData.createdAt instanceof Date) {
          // Already a Date object
          createdAtDate = staffData.createdAt;
        } else if (typeof staffData.createdAt === 'object' && staffData.createdAt.seconds) {
          // Firestore Timestamp plain object format { seconds, nanoseconds }
          createdAtDate = new Date(staffData.createdAt.seconds * 1000);
        } else if (typeof staffData.createdAt === 'string') {
          // ISO string or other date string
          createdAtDate = new Date(staffData.createdAt);
        }
      }
      
      const staff: Staff = {
        id: staffDoc.id,
        adminId: staffData.adminId || '',
        fullName: staffData.fullName,
        age: staffData.age,
        gender: staffData.gender,
        classification: staffData.classification,
        email: staffData.email,
        phoneNumber: staffData.phoneNumber,
        rfid: staffData.rfid || '',
        createdAt: createdAtDate,
      };

      const now = new Date();
      const today = now.toISOString().split('T')[0];

      // Check for existing attendance record for today
      const attendanceQuery = query(
        collection(db, 'attendance'),
        where('staffId', '==', staff.id),
        where('date', '==', today)
      );
      const attendanceSnapshot = await getDocs(attendanceQuery);

      if (attendanceSnapshot.empty) {
        // No record exists, clock in
        await addDoc(collection(db, 'attendance'), {
          staffId: staff.id,
          rfid: rfid,
          fullName: staff.fullName,
           classification: staff.classification,
          timeIn: Timestamp.fromDate(now),
          date: today,
        });
        return { success: true, message: 'Clocked in successfully', staff };
      } else {
        // Find the most recent record without timeOut
        let latestRecordId: string | null = null;
        let latestTime = new Date(0);

        attendanceSnapshot.docs.forEach(doc => {
          const data = doc.data();
          if (!data.timeOut) {
            // Safely handle different timestamp formats
            let timeInDate = new Date(0);
            if (data.timeIn) {
              if (typeof data.timeIn.toDate === 'function') {
                timeInDate = data.timeIn.toDate();
              } else if (data.timeIn instanceof Date) {
                timeInDate = data.timeIn;
              } else if (typeof data.timeIn === 'object' && data.timeIn.seconds) {
                timeInDate = new Date(data.timeIn.seconds * 1000);
              } else {
                timeInDate = new Date(data.timeIn);
              }
            }
            if (timeInDate > latestTime) {
              latestRecordId = doc.id;
              latestTime = timeInDate;
            }
          }
        });

        if (latestRecordId) {
          // Has timeIn but no timeOut, clock out
          const attendanceRef = doc(db, 'attendance', latestRecordId);
          const latestRecord = attendanceSnapshot.docs.find(doc => doc.id === latestRecordId);
          const attendanceData = latestRecord?.data();

          await updateDoc(attendanceRef, {
            timeOut: Timestamp.fromDate(now),
            classification: staff.classification,
          });

          // Safely handle timeIn timestamp for display
          let timeInDate = new Date();
          if (attendanceData?.timeIn) {
            if (typeof attendanceData.timeIn.toDate === 'function') {
              timeInDate = attendanceData.timeIn.toDate();
            } else if (attendanceData.timeIn instanceof Date) {
              timeInDate = attendanceData.timeIn;
            } else if (typeof attendanceData.timeIn === 'object' && attendanceData.timeIn.seconds) {
              timeInDate = new Date(attendanceData.timeIn.seconds * 1000);
            } else {
              timeInDate = new Date(attendanceData.timeIn);
            }
          }

          // Return staff with attendance data for display
          const staffWithAttendance: StaffWithAttendance = {
            ...staff,
            timeIn: attendanceData?.timeIn,
            timeOut: Timestamp.fromDate(now),
            date: attendanceData?.date,
          };

          return { success: true, message: 'Clocked out successfully', staff: staffWithAttendance };
        } else {
          // All records have timeOut, allow new clock in
          await addDoc(collection(db, 'attendance'), {
            staffId: staff.id,
            rfid: rfid,
            staffName: staff.fullName,
            classification: staff.classification,
            timeIn: Timestamp.fromDate(now),
            date: today,
          });
          return { success: true, message: 'Clocked in successfully', staff };
        }
      }
    } catch (err) {
      console.error('Error handling RFID scan:', err);
      setError('Failed to process RFID scan');
      return { success: false, message: 'Failed to process RFID scan' };
    } finally {
      setLoading(false);
    }
  };


  
  return {
    loading,
    error,
    handleRFIDScan,
  };
}
