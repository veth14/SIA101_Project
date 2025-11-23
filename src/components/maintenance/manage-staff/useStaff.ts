import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp, query, where, getDoc } from "firebase/firestore";
import { db } from '../../../config/firebase';
import { Staff, StaffFormData } from './types';

export function useStaff() {
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStaff = async () => {
    try {
      setLoading(true)
      const querySnapshot = await getDocs(collection(db, "staff"))
      const staffData: Staff[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
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
          createdAt: data.createdAt?.toDate() || new Date(),
        })
      })

      setStaff(staffData)
      setError(null)
    } catch (err) {
      console.error("Error fetching staff:", err)
      setError("Failed to fetch staff data")
    } finally {
      setLoading(false)
    }
  }

  const addStaff = async (staffData: StaffFormData) => {
    try {
      // Check if RFID already exists
      if (staffData.rfid.trim()) {
        const q = query(collection(db, "staff"), where("rfid", "==", staffData.rfid))
        const querySnapshot = await getDocs(q)
        if (!querySnapshot.empty) {
          // Update existing staff
          const existingDoc = querySnapshot.docs[0]
          const staffRef = doc(db, "staff", existingDoc.id)
          await updateDoc(staffRef, {
            ...staffData,
            age: Number.parseInt(staffData.age),
          })
          await fetchStaff()
          return { success: true }
        }
      }
      // Add new staff
      await addDoc(collection(db, "staff"), {
        ...staffData,
        age: Number.parseInt(staffData.age),
        createdAt: Timestamp.now(),
      })
      await fetchStaff()
      return { success: true }
    } catch (err) {
      console.error("Error adding/updating staff:", err)
      return { success: false, error: "Failed to add/update staff member" }
    }
  }

  const updateStaff = async (id: string, staffData: Partial<StaffFormData>) => {
    try {
      const staffRef = doc(db, "staff", id)
      const updateData: any = { ...staffData }
      if (staffData.age) {
        updateData.age = Number.parseInt(staffData.age)
      }
      await updateDoc(staffRef, updateData)
      await fetchStaff()
      return { success: true }
    } catch (err) {
      console.error("Error updating staff:", err)
      return { success: false, error: "Failed to update staff member" }
    }
  }

  const deleteStaff = async (id: string) => {
    try {
      await deleteDoc(doc(db, "staff", id))
      await fetchStaff()
      return { success: true }
    } catch (err) {
      console.error("Error deleting staff:", err)
      return { success: false, error: "Failed to delete staff member" }
    }
  }

  useEffect(() => {
    fetchStaff()
  }, [])

  const getStaffById = async (id: string): Promise<Staff | null> => {
    try {
      const docRef = doc(db, "staff", id);
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
          createdAt: data.createdAt?.toDate() || new Date(),
        };
      }
      return null;
    } catch (err) {
      console.error("Error fetching staff by ID:", err);
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
    refetch: fetchStaff,
    getStaffById,
  }
}
