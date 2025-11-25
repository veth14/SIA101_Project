import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  showHeaderBar?: boolean;
  headerContent?: React.ReactNode;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-5xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  showHeaderBar = true,
  headerContent
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <>
      <style>{`
        @keyframes slideInUp {
          0% { opacity: 0; transform: translateY(20px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideOutDown {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(20px) scale(0.98); }
        }
        .animate-slideInUp { animation: slideInUp 0.3s ease-out; }
        .animate-slideOutDown { animation: slideOutDown 0.28s ease-in forwards; }
      `}</style>

      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={handleBackdropClick}>
        <div className={`bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden transform animate-slideInUp`}>
        {showHeaderBar && (
          <div className="h-2 bg-gradient-to-r from-heritage-green/5 via-heritage-neutral/10 to-heritage-green/5 rounded-t-2xl" />
        )}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-heritage-neutral/10 bg-gradient-to-r from-heritage-green/5 to-heritage-light/10 backdrop-blur-sm">
          {headerContent ? (
            headerContent
          ) : (
            <>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h3>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 transition-all duration-200 hover:text-gray-600 hover:bg-gray-100 rounded-xl"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(100vh-150px)]">
          {children}
        </div>
      </div>
      </div>
    </>,
    document.body
  );
};

export default Modal;
