import { useState } from 'react';
// We need the type, which you exported
import { BookingData } from './ReservationsPage'; // Adjust this import path
// Import your new generic Modal wrapper
import { Modal } from '../../admin/Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reservation: BookingData;
  onConfirmCheckOut: (reservation: BookingData) => Promise<void>;
}

export const ConfirmCheckOutModal = ({ isOpen, onClose, reservation, onConfirmCheckOut }: Props) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleConfirm = async () => {
    setIsCheckingOut(true);
    try {
      await onConfirmCheckOut(reservation);
    } catch (error) {
      console.error("Check-out failed:", error);
    } finally {
      // The parent's finally block (which calls onClose)
      // will be triggered, so we just need to reset local state.
      setIsCheckingOut(false);
    }
  };

  // The 'if (!isOpen)' check is no longer needed here,
  // as the <Modal> component handles it internally.

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Check-Out"
      size="md" // 'md' matches the 'max-w-md' from your old modal
    >
      {/* This content is passed as 'children' to the Modal component.
        The Modal component provides the 'p-6' padding.
      */}
      <>
        {/* Modal Content */}
        <div>
          <p className="text-sm text-gray-500">
            Are you sure you want to check out the reservation for{' '}
            <strong className="text-gray-700">{reservation.userName}</strong>
            {reservation.roomNumber && (
              <> from Room <strong className="text-gray-700">{reservation.roomNumber}</strong></>
            )}?
          </p>
          <p className="mt-2 text-sm text-gray-500">
            This will mark the booking as 'checked-out' and set the room status to 'cleaning'. This action cannot be undone.
          </p>
        </div>

        {/* Modal Actions/Buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={onClose}
            disabled={isCheckingOut}
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
            onClick={handleConfirm}
            disabled={isCheckingOut}
          >
            {isCheckingOut ? 'Checking Out...' : 'Confirm Check-Out'}
          </button>
        </div>
      </>
    </Modal>
  );
};