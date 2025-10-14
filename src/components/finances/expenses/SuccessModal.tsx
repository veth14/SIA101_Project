import React from 'react';
import { ExpenseModal } from './ExpenseModal';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  cta?: { label: string; onClick: () => void } | null;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, title = 'Success', message = 'Operation completed successfully.', cta = null }) => {
  return (
    <ExpenseModal isOpen={isOpen} onClose={onClose}>
      <div className="max-w-md mx-auto text-center p-6">
        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-50">
          <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-600">{message}</p>

        <div className="mt-5 flex items-center justify-center gap-3">
          {cta ? (
            <button onClick={() => { cta.onClick(); onClose(); }} className="px-4 py-2 rounded-lg bg-heritage-green text-white font-semibold">{cta.label}</button>
          ) : null}
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-white border">Close</button>
        </div>
      </div>
    </ExpenseModal>
  );
};

export default SuccessModal;
