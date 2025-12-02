import React, { useEffect, useRef } from 'react';
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
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const titleIdRef = useRef<string>(`modal-title-${Math.random().toString(36).slice(2,9)}`);
  const prevIsOpenRef = useRef<boolean>(false);
  const onCloseRef = useRef(onClose);

  // Keep a stable reference to onClose for event handlers
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current?.();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const container = dialogRef.current;
      if (!container) return;
      const focusable = Array.from(container.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )).filter(el => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length));
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    };

    // Only react when open state actually changes
    if (isOpen && !prevIsOpenRef.current) {
      prevIsOpenRef.current = true;
      // Save previously focused element to restore on close
      previousActiveElement.current = document.activeElement as HTMLElement | null;
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('keydown', handleKeyDown);

      // Move focus into the dialog once on open (prefer inputs over close button)
      requestAnimationFrame(() => {
        const container = dialogRef.current;
        if (container) {
          const allFocusable = Array.from(container.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
            .filter(el => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length));
          const closeBtn = container.querySelector<HTMLElement>('button[aria-label="Close"]');
          // Prefer element marked with data-autofocus, then first input/select/textarea, then first focusable not the close button
          const preferred = container.querySelector<HTMLElement>('[data-autofocus="true"]')
            || allFocusable.find(el => ['INPUT','SELECT','TEXTAREA'].includes(el.tagName))
            || allFocusable.find(el => el !== closeBtn)
            || allFocusable[0];
          if (preferred) preferred.focus();
          else container.focus();
        }
      });
    } else if (!isOpen && prevIsOpenRef.current) {
      // Clean up when closing
      prevIsOpenRef.current = false;
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
      // Restore focus to the previously focused element
      try {
        previousActiveElement.current?.focus();
      } catch (e) {
        // ignore
      }
    }
  }, [isOpen]);

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
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleIdRef.current}
          tabIndex={-1}
          className={`relative z-10 w-full ${size === 'xl' ? 'max-w-5xl' : size === 'lg' ? 'max-w-2xl' : size === 'sm' ? 'max-w-md' : 'max-w-4xl'} rounded-3xl bg-white/95 shadow-2xl ring-1 ring-black/5 transform transition-all duration-300 animate-slideInUp`}
        >

          {/* Header */}
          <div className="relative px-6 pt-6 pb-5 bg-white border-b border-gray-100 rounded-t-3xl">
            <div className="flex items-center justify-between">
              {headerContent ? (
                headerContent
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 text-white rounded-full shadow-sm bg-[#82A33D]">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <h3 id={titleIdRef.current} className="text-lg font-semibold text-[#82A33D] md:text-2xl">{title}</h3>
                    {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
                  </div>
                </div>
              )}

              {showCloseButton && (
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="absolute flex items-center justify-center top-4 right-4 w-9 h-9 text-[#82A33D] bg-[#82A33D]/10 rounded-2xl shadow-sm ring-1 ring-[#82A33D]/20 hover:shadow-md transition transform hover:-translate-y-0.5"
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
