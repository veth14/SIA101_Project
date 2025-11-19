// @/components/admin/reservations/ConfirmCancelModal.tsx
// (Adjust path as needed)

import { useState } from 'react';
// We need the type, which you exported
import { BookingData } from './ReservationsPage'; // Adjust this import path
// Import your new generic Modal wrapper
import { Modal } from '../../admin/Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reservation: BookingData;
  onConfirmCancel: (reservation: BookingData) => Promise<void>;
}

export const ConfirmCancelModal = ({ isOpen, onClose, reservation, onConfirmCancel }: Props) => {
  const [isCancelling, setIsCancelling] = useState(false);

  const handleConfirm = async () => {
    setIsCancelling(true);
    try {
      await onConfirmCancel(reservation);
    } catch (error) {
      console.error("Cancellation failed:", error);
    } finally {
      // Parent's finally block will close the modal
      setIsCancelling(false);
    }
  };
  
  // The 'if (!isOpen)' check is no longer needed here,
  // as the <Modal> component handles it internally.

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Cancellation"
      size="md" // 'md' matches the 'max-w-md' from your old modal
    >
      {/* This content is passed as 'children' to the Modal component.
        The Modal component provides the 'p-6' padding.
      */}
      <>
        {/* Modal Content */}
        <div>
          <p className="text-sm text-gray-500">
            Are you sure you want to cancel the reservation for{' '}
            <strong className="text-gray-700">{reservation.userName}</strong>?
          </p>
          <p className="mt-2 text-sm text-gray-500">
            This will mark the booking as 'cancelled' and free up any assigned room. This action cannot be undone.
          </p>
        </div>

        {/* Modal Actions/Buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={onClose}
            disabled={isCancelling}
          >
            Keep Reservation
          </button>
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
            onClick={handleConfirm}
            disabled={isCancelling}
          >
            {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
          </button>
        </div>
      </>
    </Modal>
  );
};