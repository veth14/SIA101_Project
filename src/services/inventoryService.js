import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
const INVENTORY_COLLECTION = 'inventory';
export const addInventoryItem = async (item) => {
    const docRef = await addDoc(collection(db, INVENTORY_COLLECTION), item);
    return { id: docRef.id, ...item };
};
export const updateInventoryItem = async (id, updates) => {
    await updateDoc(doc(db, INVENTORY_COLLECTION, id), updates);
};
export const deleteInventoryItem = async (id) => {
    await deleteDoc(doc(db, INVENTORY_COLLECTION, id));
};
export const getInventoryItems = async () => {
    const querySnapshot = await getDocs(collection(db, INVENTORY_COLLECTION));
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};
export const getLowStockItems = async () => {
    const q = query(collection(db, INVENTORY_COLLECTION), where('quantity', '<=', 'minThreshold'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};
