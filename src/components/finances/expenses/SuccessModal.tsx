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
      <div className="space-y-6 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 text-white rounded-full shadow-sm bg-emerald-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-emerald-700">{title}</h3>
              <p className="mt-1 text-sm text-gray-600">{message}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex items-center justify-center w-8 h-8 text-emerald-700 bg-emerald-50 rounded-md ring-1 ring-emerald-100"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Footer / Actions */}
        <div className="flex items-center justify-center gap-3 pt-4 border-t border-gray-100">
          {cta ? (
            <button
              type="button"
              onClick={() => {
                cta.onClick();
                onClose();
              }}
              className="px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-md bg-gradient-to-r from-[#82A33D] to-emerald-600 hover:from-[#6d8735] hover:to-emerald-700"
            >
              {cta.label}
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </ExpenseModal>
  );
};

export default SuccessModal;
