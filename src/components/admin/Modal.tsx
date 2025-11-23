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
  subtitle?: React.ReactNode;
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
  headerContent,
  subtitle
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

      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/45 backdrop-blur-lg overflow-y-auto" onClick={handleBackdropClick}>
        <div className={`relative z-10 w-full ${size === 'xl' ? 'max-w-5xl' : size === 'lg' ? 'max-w-2xl' : size === 'sm' ? 'max-w-md' : 'max-w-4xl'} rounded-3xl bg-white/95 shadow-2xl ring-1 ring-black/5 transform transition-all duration-300 animate-slideInUp`}>

          {/* Header */}
          <div className="relative px-6 pt-6 pb-5 bg-white border-b border-gray-100 rounded-t-3xl">
            <div className="flex items-center justify-between">
              {headerContent ? (
                headerContent
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 text-white rounded-full shadow-sm bg-heritage-green">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-heritage-green md:text-2xl">{title}</h3>
                    {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
                  </div>
                </div>
              )}

              {showCloseButton && (
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="absolute flex items-center justify-center rounded-md top-4 right-4 w-9 h-9 text-heritage-green bg-heritage-green/10 ring-1 ring-heritage-green/20"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
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
