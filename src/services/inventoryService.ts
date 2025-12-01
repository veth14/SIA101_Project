import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface InventoryItem {
  id?: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minThreshold: number;
  location: string;
  lastUpdated: Date;
}

const INVENTORY_COLLECTION = 'inventory';

export const addInventoryItem = async (item: Omit<InventoryItem, 'id'>) => {
  const docRef = await addDoc(collection(db, INVENTORY_COLLECTION), item);
  return { id: docRef.id, ...item };
};

export const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>) => {
  await updateDoc(doc(db, INVENTORY_COLLECTION, id), updates);
};

export const deleteInventoryItem = async (id: string) => {
  await deleteDoc(doc(db, INVENTORY_COLLECTION, id));
};

export const getInventoryItems = async () => {
  const querySnapshot = await getDocs(collection(db, INVENTORY_COLLECTION));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as InventoryItem[];
};

export const subscribeToInventoryItems = (
  onData: (items: InventoryItem[]) => void,
  onError?: (error: unknown) => void,
) => {
  const col = collection(db, INVENTORY_COLLECTION);
  const unsubscribe = onSnapshot(
    col,
    (snapshot) => {
      const items: InventoryItem[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));
      onData(items);
    },
    (error) => {
      console.error('Error listening to inventory items:', error);
      if (onError) onError(error);
    },
  );

  return unsubscribe;
};

export const getLowStockItems = async () => {
  const q = query(
    collection(db, INVENTORY_COLLECTION),
    where('quantity', '<=', 'minThreshold')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as InventoryItem[];
};
