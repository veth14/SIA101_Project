import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const ExpenseModal = ({ isOpen, onClose, children }: ExpenseModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      
      // Blur the entire app except the modal
      const root = document.getElementById('root');
      if (root) {
        // Apply blur and transition to root
        root.style.filter = 'blur(8px)';
        root.style.transition = 'filter 0.3s ease-in-out';
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
      
      // Remove blur from root
      const root = document.getElementById('root');
      if (root) {
        root.style.filter = 'none';
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Render modal outside of root using portal
  return createPortal(
    // Modal portal - renders directly in body, outside of root
    <div className="fixed inset-0 z-[9999]">
      {/* Dark backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/70 transition-all duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal container - NOT affected by root blur */}
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 py-8">
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl transform transition-all animate-in fade-in zoom-in-95 duration-200 z-10">
            {/* Decorative header bar */}
            <div className="h-2 bg-gradient-to-r from-heritage-green via-heritage-neutral to-heritage-green rounded-t-3xl" />
            
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Expense Details
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 py-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body // Render directly to body, bypassing root
  );
};
