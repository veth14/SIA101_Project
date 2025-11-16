import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config/firebase';
import { Staff, StaffFormData } from './types';
import DuplicateRFIDModal from './DuplicateRFIDModal';

interface AddStaffModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: StaffFormData) => Promise<{ success: boolean; error?: string }>
  editStaff?: Staff | null
  onUpdate?: (id: string, data: Partial<StaffFormData>) => Promise<{ success: boolean; error?: string }>
  adminName?: string
}

function AddStaffModal({ isOpen, onClose, onSubmit, editStaff, onUpdate, adminName = "Administrator" }: AddStaffModalProps) {
  const rfidInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState<StaffFormData>({
    adminId: "",
    fullName: "",
    age: "",
    gender: "Male",
    classification: "Maintenance",
    email: "",
    phoneNumber: "",
    rfid: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)
  const [rfidExists, setRfidExists] = useState(false)
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const isEditMode = !!editStaff

useEffect(() => {
  if (!isOpen) return;

  let buffer = "";
  let lastKeyTime = 0;

  const handleKeyDown = (e: KeyboardEvent) => {
    const now = Date.now();
    const timeDiff = now - lastKeyTime;

    // If typing is slow (>100ms between keys), reset (human typing)
    if (timeDiff > 100) buffer = "";

    lastKeyTime = now;

    if (e.key === "Enter") {
      if (buffer.length > 0) {
        // Update form data with the scanned RFID
        setFormData(prev => ({ ...prev, rfid: buffer }));

        // Trigger duplicate check manually (like handleRfidChange)
        checkDuplicateRFID(buffer);

        buffer = "";
      }
    } else if (/^[a-zA-Z0-9]$/.test(e.key)) {
      buffer += e.key;
    }

    // Prevent any manual typing
    e.preventDefault();
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [isOpen]);
const checkDuplicateRFID = async (value: string) => {
  if (!value.trim() || isEditMode) return;

  try {
    const q = query(collection(db, "staff"), where("rfid", "==", value));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      setRfidExists(true);
      setShowDuplicateModal(true);
    } else {
      setRfidExists(false);
    }
  } catch (error) {
    console.error("Error querying RFID:", error);
    setRfidExists(false);
  }
};


  const handleRfidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, rfid: value }))

    // Clear previous timer
    if (debounceTimer) clearTimeout(debounceTimer)

    // Set new timer to query after 500ms
    const timer = setTimeout(async () => {
      if (value.trim() && !isEditMode) {
        try {
          const q = query(collection(db, "staff"), where("rfid", "==", value))
          const querySnapshot = await getDocs(q)
          if (!querySnapshot.empty) {
            setRfidExists(true)
            setShowDuplicateModal(true)
          } else {
            setRfidExists(false)
          }
        } catch (error) {
          console.error("Error querying RFID:", error)
          setRfidExists(false)
        }
      } else {
        setRfidExists(false)
      }
    }, 500)

    setDebounceTimer(timer)
  }

  const handleDuplicateConfirm = () => {
    setShowDuplicateModal(false)
    // Clear the form and stay in add mode
    setFormData({
      adminId: `Admin: ${adminName}`,
      fullName: "",
      age: "",
      gender: "Male",
      classification: "Maintenance",
      email: "",
      phoneNumber: "",
      rfid: "",
    })
    setRfidExists(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      let result;
      if (isEditMode && editStaff && onUpdate) {
        result = await onUpdate(editStaff.id, formData)
      } else {
        result = await onSubmit(formData)
      }
      if (!result.success) {
        throw new Error(result.error || `Failed to ${isEditMode ? 'update' : 'add'} staff member`)
      }
      // Reset form only in add mode
      if (!isEditMode) {
        setFormData({
          adminId: "",
          fullName: "",
          age: "",
          gender: "Male",
          classification: "Maintenance",
          email: "",
          phoneNumber: "",
          rfid: "",
        })
      }
      onClose()
    } catch (error) {
      console.error("Error submitting form:", error)
      alert(`Failed to ${isEditMode ? 'update' : 'add'} staff member. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur">

        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
          <div className="sticky top-0 bg-white px-8 py-6 flex items-center justify-between rounded-t-2xl border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-[#82A33D]">{isEditMode ? 'Edit Staff Member' : 'Add New Staff Member'}</h2>
              <p className="text-base text-[#82A33D]">Staff Management System</p>
            </div>
            <button onClick={onClose} className="p-3 transition-colors hover:bg-gray-100 rounded-xl" type="button">
              <svg className="w-7 h-7 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label className="block text-[#82A33D] text-base font-medium mb-3">Admin ID</label>
              <input
                type="text"
                value={formData.adminId}
                readOnly
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#889D65] focus:border-transparent text-gray-900 bg-gray-100 cursor-not-allowed text-base"
              />
            </div>

            <div>
              <label className="block text-[#82A33D] text-base font-medium mb-3">Full name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#889D65] focus:border-transparent text-gray-900 bg-white text-base"
              />
            </div>

            <div>
              <label className="block text-[#82A33D] text-base font-medium mb-3">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                required
                min="18"
                max="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#889D65] focus:border-transparent text-gray-900 bg-white text-base"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[#82A33D] text-base font-medium mb-3">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as "Male" | "Female" })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#889D65] focus:border-transparent text-gray-900 bg-white text-base"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-[#82A33D] text-base font-medium mb-3">Classification</label>
                <select
                  value={formData.classification}
                  onChange={(e) => setFormData({ ...formData, classification: e.target.value as "Housekeeping" | "Maintenance" })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#889D65] focus:border-transparent text-gray-900 bg-white text-base"
                >
                  <option value="Maintenance">Maintenance</option>
                  <option value="Housekeeping">Housekeeping</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[#82A33D] text-base font-medium mb-3">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#889D65] focus:border-transparent text-gray-900 bg-white text-base"
              />
            </div>

            <div>
              <label className="block text-[#82A33D] text-base font-medium mb-3">Phone Number</label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#889D65] focus:border-transparent text-gray-900 bg-white text-base"
              />
            </div>

            <div>
              <label className="block text-[#82A33D] text-base font-medium mb-3">RFID ID (Tap card to auto-fill)</label>
              <input
                ref={rfidInputRef}
                type="text"
                value={formData.rfid}
                readOnly={true}
                placeholder="Tap RFID card here"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#889D65] focus:border-transparent text-gray-900 bg-white text-base"
              />
              {rfidExists && (
                <p className="text-red-500 text-base mt-2">RFID already exists.</p>
              )}
            </div>

            <div className="flex gap-6 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#82A33D] text-white py-4 px-6 rounded-lg hover:bg-[#6d8a33] transition-colors duration-200 disabled:opacity-50 text-lg font-medium"
              >
                {isSubmitting ? (isEditMode ? "Updating..." : "Adding...") : (isEditMode ? "Update Staff" : "Add New Staff")}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 py-4 px-6 rounded-lg hover:bg-gray-400 transition-colors duration-200 text-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <DuplicateRFIDModal
        isOpen={showDuplicateModal}
        onClose={() => setShowDuplicateModal(false)}
        onConfirm={handleDuplicateConfirm}
      />
    </>,
    document.body
  );
}

export default AddStaffModal;
