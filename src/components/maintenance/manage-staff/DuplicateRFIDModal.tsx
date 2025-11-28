import React from 'react';

interface DuplicateRFIDModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

function DuplicateRFIDModal({ isOpen, onClose, onConfirm }: DuplicateRFIDModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Duplicate RFID Detected</h3>
          <p className="text-gray-600 mb-6">
            This RFID is already associated with an existing staff member. Would you like to update their information instead?
          </p>
          <div className="flex gap-3">
            <button
              onClick={onConfirm}
              className="flex-1 bg-[#889D65] text-white py-2 px-4 rounded-lg hover:bg-[#7a8f5a] transition-colors"
            >
              Update Existing
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DuplicateRFIDModal;
