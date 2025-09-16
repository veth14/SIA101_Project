import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { db } from './firebaseConfig';

export interface StaffMember {
  id?: string;
  userId: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  contactNumber: string;
  email: string;
  status: 'active' | 'inactive';
  startDate: Date;
  schedule: {
    [key: string]: {
      start: string;
      end: string;
    };
  };
}

const STAFF_COLLECTION = 'staff';

export const addStaffMember = async (staffData: Omit<StaffMember, 'id'>) => {
  const docRef = await addDoc(collection(db, STAFF_COLLECTION), staffData);
  return { id: docRef.id, ...staffData };
};

export const updateStaffMember = async (id: string, updates: Partial<StaffMember>) => {
  await updateDoc(doc(db, STAFF_COLLECTION, id), updates);
};

export const deleteStaffMember = async (id: string) => {
  await deleteDoc(doc(db, STAFF_COLLECTION, id));
};

export const getAllStaff = async () => {
  const querySnapshot = await getDocs(collection(db, STAFF_COLLECTION));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as StaffMember[];
};

export const getStaffByDepartment = async (department: string) => {
  const q = query(
    collection(db, STAFF_COLLECTION),
    where('department', '==', department)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as StaffMember[];
};
