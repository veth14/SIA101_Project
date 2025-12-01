import { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  query,
  where,
  getDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { Staff, StaffFormData } from './types';

export function useStaff() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const parseCreatedAt = (value: unknown): Date => {
    if (!value) return new Date();

    // Firestore Timestamp (has toDate)
    if (typeof value === 'object' && value !== null && 'toDate' in value && typeof (value as any).toDate === 'function') {
      return (value as any).toDate();
    }

    // Already a Date
    if (value instanceof Date) {
      return value;
    }

    // Numeric timestamp (ms)
    if (typeof value === 'number') {
      return new Date(value);
    }

    // String date/ISO
    if (typeof value === 'string') {
      const d = new Date(value);
      return Number.isNaN(d.getTime()) ? new Date() : d;
    }

    return new Date();
  };

  useEffect(() => {
    let unsubscribeAttendance: (() => void) | null = null;

    const fetchStaffAndListenAttendance = async () => {
      try {
        setLoading(true);
        const staffSnapshot = await getDocs(collection(db, 'staff'));
        const staffData: Staff[] = [];
        staffSnapshot.forEach((doc) => {
          const data = doc.data();
          staffData.push({
            id: doc.id,
            adminId: data.adminId || '',
            fullName: data.fullName,
            age: data.age,
            gender: data.gender,
            classification: data.classification,
            email: data.email,
            phoneNumber: data.phoneNumber,
            rfid: data.rfid || '',
            createdAt: parseCreatedAt(data.createdAt),
            isActive: false,
          });
        });

        setStaff(staffData);
        setError(null);

        const today = new Date().toISOString().split('T')[0];
        const attendanceQuery = query(collection(db, 'attendance'), where('date', '==', today));

        unsubscribeAttendance = onSnapshot(attendanceQuery, (attendanceSnapshot) => {
          const attendanceMap = new Map<string, boolean>();
          attendanceSnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.staffId) {
              const isActive = !data.timeOut;
              const currentStatus = attendanceMap.get(data.staffId);
              attendanceMap.set(data.staffId, currentStatus || isActive);
            }
          });

          setStaff((prevStaff) =>
            prevStaff.map((s) => ({
              ...s,
              isActive: attendanceMap.get(s.id) || false,
            }))
          );
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching staff or subscribing attendance:', err);
        setError('Failed to fetch staff or subscribe to attendance');
        setLoading(false);
      }
    };

    fetchStaffAndListenAttendance();

    return () => {
      if (unsubscribeAttendance) {
        unsubscribeAttendance();
      }
    };
  }, []);

  const addStaff = async (staffData: StaffFormData) => {
    try {
      if (staffData.rfid.trim()) {
        const q = query(collection(db, 'staff'), where('rfid', '==', staffData.rfid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const existingDoc = querySnapshot.docs[0];
          const staffRef = doc(db, 'staff', existingDoc.id);
          await updateDoc(staffRef, {
            ...staffData,
            age: Number.parseInt(staffData.age),
          });
          return { success: true };
        }
      }
      await addDoc(collection(db, 'staff'), {
        ...staffData,
        age: Number.parseInt(staffData.age),
        createdAt: Timestamp.now(),
      });
      return { success: true };
    } catch (err) {
      console.error('Error adding/updating staff:', err);
      return { success: false, error: 'Failed to add/update staff member' };
    }
  };

  const updateStaff = async (id: string, staffData: Partial<StaffFormData>) => {
    try {
      const staffRef = doc(db, 'staff', id);
      const updateData: any = { ...staffData };
      if (staffData.age) {
        updateData.age = Number.parseInt(staffData.age);
      }
      await updateDoc(staffRef, updateData);
      // Update local state
      setStaff(prevStaff =>
        prevStaff.map(s =>
          s.id === id ? { ...s, ...staffData, age: staffData.age ? Number.parseInt(staffData.age) : s.age } : s
        )
      );
      return { success: true };
    } catch (err) {
      console.error('Error updating staff:', err);
      return { success: false, error: 'Failed to update staff member' };
    }
  };

  const deleteStaff = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'staff', id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting staff:', err);
      return { success: false, error: 'Failed to delete staff member' };
    }
  };

  const getStaffById = async (id: string): Promise<Staff | null> => {
    try {
      const docRef = doc(db, 'staff', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          adminId: data.adminId || '',
          fullName: data.fullName,
          age: data.age,
          gender: data.gender,
          classification: data.classification,
          email: data.email,
          phoneNumber: data.phoneNumber,
          rfid: data.rfid || '',
          createdAt: parseCreatedAt(data.createdAt),
        };
      }
      return null;
    } catch (err) {
      console.error('Error fetching staff by ID:', err);
      return null;
    }
  };

  return {
    staff,
    loading,
    error,
    addStaff,
    updateStaff,
    deleteStaff,
    getStaffById,
  };
}
