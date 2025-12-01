import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config/firebase';
import { useAuth } from '../../../hooks/useAuth';
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
  const { userData } = useAuth();
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

  // Sync form when editing
  useEffect(() => {
    if (editStaff) {
      setFormData({
        adminId: editStaff.adminId || "",
        fullName: editStaff.fullName || "",
        age: editStaff.age ? String(editStaff.age) : "",
        gender: editStaff.gender || "Male",
        classification: editStaff.classification || "Maintenance",
        email: editStaff.email || "",
        phoneNumber: editStaff.phoneNumber || "",
        rfid: editStaff.rfid || "",

      });
    } else {
      setFormData({
        adminId: "",
        fullName: "",
        age: "",
        gender: "Male",
        classification: "Maintenance",
        email: "",
        phoneNumber: "",
        rfid: "",

      });
    }
  }, [editStaff]);

  // Set admin ID on open for add mode
  useEffect(() => {
    if (isOpen && !isEditMode && userData?.email) {
      setFormData(prev => ({
        ...prev,
        adminId: `Admin: ${userData.email}`
      }));
    }
  }, [isOpen, isEditMode, userData]);

  // RFID scanner auto-fill
  useEffect(() => {
    if (!isOpen) return;

    let buffer = "";
    let lastKeyTime = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      const now = Date.now();
      const timeDiff = now - lastKeyTime;

      if (timeDiff > 100) buffer = "";
      lastKeyTime = now;

      if (e.key === "Enter") {
        if (buffer.length > 0) {
          setFormData(prev => ({ ...prev, rfid: buffer }));
          checkDuplicateRFID(buffer);
          buffer = "";
        }
      } else if (/^[a-zA-Z0-9]$/.test(e.key)) {
        buffer += e.key;
      }

      if (document.activeElement === rfidInputRef.current) {
        e.preventDefault();
      }
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

  const handleDuplicateConfirm = () => {
    setShowDuplicateModal(false);
    if (userData?.email) {
      setFormData({
        adminId: `Admin: ${userData.email}`,
        fullName: "",
        age: "",
        gender: "Male",
        classification: "Maintenance",
        email: "",
        phoneNumber: "",
        rfid: "",
       
      });
    }
    setRfidExists(false);
  };

  const handleCancel = () => {
    setFormData(prev => ({
      ...prev,
      fullName: "",
      age: "",
      gender: "Male",
      classification: "Maintenance",
      email: "",
      phoneNumber: "",
      rfid: "",
      baseSalaryPerDay: "",
    }));
    setRfidExists(false);
    onClose();
  };

  const onCloseWrapper = () => {
    setRfidExists(false);
    setFormData(prev => ({
      ...prev,
      fullName: "",
      age: "",
      gender: "Male",
      classification: "Maintenance",
      email: "",
      phoneNumber: "",
      rfid: "",
      baseSalaryPerDay: "",
    }));
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let result;

      if (isEditMode && editStaff && onUpdate) {
        result = await onUpdate(editStaff.id, formData);
      } else {
        result = await onSubmit(formData);
      }

      if (!result.success) {
        throw new Error(result.error || `Failed to ${isEditMode ? 'update' : 'add'} staff`);
      }

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
        
        });
      }

      onClose();
    } catch (error) {
      console.error(error);
      alert(`Failed to ${isEditMode ? 'update' : 'add'} staff member. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" role="dialog" aria-modal="true">
        <div
          className="fixed inset-0 transition-opacity duration-200 bg-black/45 backdrop-blur-lg"
          onClick={onCloseWrapper}
          aria-label="Close overlay"
        />

        <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-white/95 shadow-2xl ring-1 ring-black/5">
          <div className="relative px-6 pt-6 pb-5 bg-white border-b border-gray-100 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 text-white rounded-2xl shadow-sm bg-[#82A33D]">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <h2 className="text-lg font-semibold text-[#82A33D] md:text-2xl">
                    {isEditMode ? 'Edit Staff Member' : 'Add New Staff Member'}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Capture staff details and assign RFID for access control. This is a
                    draft-only form for now.
                  </p>
                </div>
              </div>

              <div aria-hidden />

            </div>

            <button
              onClick={onCloseWrapper}
              aria-label="Close"
              className="absolute flex items-center justify-center rounded-md top-4 right-4 w-9 h-9 text-[#82A33D] bg-[#82A33D]/10 ring-1 ring-[#82A33D]/20"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* FORM START */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
            <form id="staff-form" onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label className="block text-gray-900 text-lg font-medium mb-3">Admin ID</label>
                <input
                  type="text"
                  value={formData.adminId}
                  readOnly
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#889D65] focus:border-transparent text-gray-900 bg-gray-100 cursor-not-allowed text-lg"
                />
              </div>

              <div>
                <label className="block text-gray-900 text-lg font-medium mb-3">Full name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#889D65] focus:border-transparent text-gray-900 bg-white text-lg"
                />
              </div>

              <div>
                <label className="block text-gray-900 text-lg font-medium mb-3">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  required
                  min="18"
                  max="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#889D65] focus:border-transparent text-gray-900 bg-white text-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-900 text-lg font-medium mb-3">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as "Male" | "Female" })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#889D65] focus:border-transparent text-gray-900 bg-white text-lg"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-900 text-lg font-medium mb-3">Classification</label>
                  <select
                    value={formData.classification}
                    onChange={(e) => setFormData({ ...formData, classification: e.target.value as "Housekeeping" | "Maintenance" | "Maintenance Supervisor" | "Housekeeping Supervisor" | "Front Office Associate" | "Front Desk Supervisor" | "Accounting Staff" | "Accounting Supervisor" | "Inventory Clerk" | "Inventory Manager" })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#889D65] focus:border-transparent text-gray-900 bg-white text-lg"
                  >
                    <option value="Maintenance">Maintenance</option>
                    <option value="Housekeeping">Housekeeping</option>
                    <option value="Maintenance Supervisor">Maintenance Supervisor</option>
                    <option value="Housekeeping Supervisor">Housekeeping Supervisor</option>
                    <option value="Front Office Associate">Front Office Associate</option>
                    <option value="Front Desk Supervisor">Front Desk Supervisor</option>
                    <option value="Accounting Staff">Accounting Staff</option>
                    <option value="Accounting Supervisor">Accounting Supervisor</option>
                    <option value="Inventory Clerk">Inventory Clerk</option>
                    <option value="Inventory Manager">Inventory Manager</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-900 text-lg font-medium mb-3">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#889D65] focus:border-transparent text-gray-900 bg-white text-lg"
                />
              </div>

              <div>
                <label className="block text-gray-900 text-lg font-medium mb-3">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#889D65] focus:border-transparent text-gray-900 bg-white text-lg"
                />
              </div>

            

              <div>
                <label className="block text-gray-900 text-lg font-medium mb-3">RFID ID (Tap card to auto-fill)</label>
                <input
                  ref={rfidInputRef}
                  type="text"
                  value={formData.rfid}
                  readOnly={true}
                  placeholder="Tap RFID card here"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#889D65] focus:border-transparent text-gray-900 bg-white text-lg"
                />
                {rfidExists && (
                  <p className="text-red-500 text-lg mt-2">RFID already exists.</p>
                )}
              </div>

            </form>
          </div>
          {/* FORM END */}

          {/* Footer */}
          <div className="p-6 bg-white border-t border-gray-100">
            <div className="flex flex-col justify-end gap-3 sm:flex-row sm:items-center">

              <div className="flex items-center order-2 gap-2 sm:order-1"></div>

              <div className="order-1 sm:order-2">
                <div className="flex gap-3">

                  <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-2xl shadow-sm hover:bg-gray-50 transition transform hover:-translate-y-0.5"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    form="staff-form"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-3 px-7 py-3.5 text-base font-semibold text-white rounded-3xl bg-gradient-to-br from-[#82A33D] to-[#6d8a33] shadow-lg hover:scale-[1.02] transform transition-all ring-1 ring-black/5"
                  >
                    {isSubmitting ? (isEditMode ? "Updating..." : "Adding...") : (isEditMode ? "Update Staff" : "Add New Staff")}
                  </button>

                </div>
              </div>

            </div>
          </div>

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
