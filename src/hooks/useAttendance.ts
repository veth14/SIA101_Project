
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

      // Normalize createdAt safely (can be Firestore Timestamp, Date, or string)
      const normalizeCreatedAt = (value: any): Date => {
        if (!value) return new Date();
        if (typeof value === 'object' && typeof value.toDate === 'function') {
          return value.toDate();
        }
        if (value instanceof Date) {
          return value;
        }
        if (typeof value === 'string') {
          const parsed = new Date(value);
          return isNaN(parsed.getTime()) ? new Date() : parsed;
        }
        return new Date();
      };

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
        createdAt: normalizeCreatedAt(staffData.createdAt),
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
          if (!data.timeOut && data.timeIn.toDate() > latestTime) {
            latestRecordId = doc.id;
            latestTime = data.timeIn.toDate();
          }
        });

        if (latestRecordId) {
          // Has timeIn but no timeOut, clock out
          const attendanceRef = doc(db, 'attendance', latestRecordId);
          const attendanceData = attendanceSnapshot.docs.find(doc => doc.id === latestRecordId)?.data();

          await updateDoc(attendanceRef, {
            timeOut: Timestamp.fromDate(now),
            classification: staff.classification,
          });

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
