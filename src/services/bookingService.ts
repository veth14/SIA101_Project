import { 
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface BookingData {
  id?: string;
  userId: string;
  checkIn: Date;
  checkOut: Date;
  roomType: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalAmount: number;
  createdAt: Date;
}

const BOOKINGS_COLLECTION = 'bookings';

export const createBooking = async (bookingData: Omit<BookingData, 'id'>) => {
  const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), bookingData);
  return { id: docRef.id, ...bookingData };
};

export const updateBooking = async (id: string, updates: Partial<BookingData>) => {
  await updateDoc(doc(db, BOOKINGS_COLLECTION, id), updates);
};

export const deleteBooking = async (id: string) => {
  await deleteDoc(doc(db, BOOKINGS_COLLECTION, id));
};

export const getUserBookings = async (userId: string) => {
  const q = query(
    collection(db, BOOKINGS_COLLECTION),
    where('userId', '==', userId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as BookingData[];
};
