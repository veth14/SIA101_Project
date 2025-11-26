import { useState } from 'react';
import { collection, getDocs, addDoc, query, where, Timestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Staff } from '../components/maintenance/manage-staff/types';

export interface AttendanceRecord {
  id?: string;
  staffId: string;
  rfid: string;
  fullName: string;
  timeIn: Date;
  timeOut?: Date;
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
        createdAt: staffData.createdAt?.toDate() || new Date(),
      };

      const now = new Date();
      const today = now.toDateString();

      // Check for existing attendance record for today
      const attendanceQuery = query(
        collection(db, 'attendance'),
        where('staffId', '==', staff.id),
        where('date', '==', today)
      );
      const attendanceSnapshot = await getDocs(attendanceQuery);

      if (attendanceSnapshot.empty) {
        // Clock in
        await addDoc(collection(db, 'attendance'), {
          staffId: staff.id,
          rfid: rfid,
          fullName: staff.fullName,
          timeIn: Timestamp.fromDate(now),
          date: today,
        });
        return { success: true, message: 'Clocked in successfully', staff };
      } else {
        // Clock out
        const attendanceDoc = attendanceSnapshot.docs[0];
        const attendanceRef = doc(db, 'attendance', attendanceDoc.id);
        await updateDoc(attendanceRef, {
          timeOut: Timestamp.fromDate(now),
        });
        return { success: true, message: 'Clocked out successfully', staff };
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
