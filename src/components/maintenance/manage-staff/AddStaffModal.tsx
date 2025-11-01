import React, { useState, useEffect, useRef } from 'react';
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
    if (isOpen) {
      if (editStaff) {
        // Edit mode: populate form with existing staff data
        setFormData({
          adminId: editStaff.adminId || '',
          fullName: editStaff.fullName,
          age: editStaff.age.toString(),
          gender: editStaff.gender,
          classification: editStaff.classification,
          email: editStaff.email,
          phoneNumber: editStaff.phoneNumber,
          rfid: editStaff.rfid || '',
        })
      } else {
        // Add mode: reset form
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
        // Focus RFID input when modal opens in add mode
        setTimeout(() => rfidInputRef.current?.focus(), 100)
      }
      setRfidExists(false)
      setShowDuplicateModal(false)
    }
  }, [isOpen, adminName, editStaff])

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

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <h2 className="text-gray-900 text-2xl font-bold">{isEditMode ? 'Edit Staff Member' : 'Add New Staff Member'}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-900 transition-colors" type="button">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Admin ID</label>
              <input
                type="text"
                value={formData.adminId}
                readOnly
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#889D65] focus:border-transparent text-gray-900 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Full name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#889D65] focus:border-transparent text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                required
                min="18"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#889D65] focus:border-transparent text-gray-900 bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as "Male" | "Female" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#889D65] focus:border-transparent text-gray-900 bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Classification</label>
                <select
                  value={formData.classification}
                  onChange={(e) => setFormData({ ...formData, classification: e.target.value as "Housekeeping" | "Maintenance" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#889D65] focus:border-transparent text-gray-900 bg-white"
                >
                  <option value="Maintenance">Maintenance</option>
                  <option value="Housekeeping">Housekeeping</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#889D65] focus:border-transparent text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#889D65] focus:border-transparent text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">RFID ID (Tap card to auto-fill)</label>
              <input
                ref={rfidInputRef}
                type="text"
                value={formData.rfid}
                onChange={handleRfidChange}
                placeholder="Tap RFID card here"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#889D65] focus:border-transparent text-gray-900 bg-white"
              />
              {rfidExists && (
                <p className="text-red-500 text-sm mt-1">RFID already exists.</p>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-[#889D65] to-[#adc28b] text-white py-3 px-4 rounded-lg hover:from-[#7a8f5a] hover:to-[#9bb075] transition-colors duration-200 disabled:opacity-50"
              >
                {isSubmitting ? (isEditMode ? "Updating..." : "Adding...") : (isEditMode ? "Update Staff" : "Add New Staff")}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-200"
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
    </>
  )
}

export default AddStaffModal;
