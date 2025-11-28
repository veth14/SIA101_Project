import { useEffect } from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
}

export const SuccessModal = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  buttonText = "Continue" 
}: SuccessModalProps) => {
  // Disable escape key for this critical modal - users must read it
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        // Prevent closing - this is a critical verification notice
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 py-6 overflow-y-auto sm:px-0 sm:py-0">
      {/* Backdrop - Don't close on click */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl mx-auto transform transition-all duration-300 scale-100 sm:max-w-md max-h-[90vh] overflow-y-auto">
        {/* Email Icon with Animation */}
        <div className="flex items-center justify-center pt-6 pb-3 sm:pt-8 sm:pb-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center animate-pulse sm:w-20 sm:h-20">
              <svg 
                className="w-8 h-8 text-blue-600 sm:w-10 sm:h-10" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                />
              </svg>
            </div>
            {/* Notification Badge */}
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-bounce sm:w-6 sm:h-6">
              <span className="text-xs font-bold text-white">1</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 pb-6 text-center sm:px-8 sm:pb-8">
          <h3 className="mb-3 text-xl font-bold text-gray-900 sm:text-2xl">
            📧 Check Your Email!
          </h3>
          
          {/* Main Message */}
          <div className="mb-5">
            <p className="mb-2 text-sm font-medium leading-relaxed text-gray-700 sm:text-base">
              {message}
            </p>
          </div>

          {/* Important Warning Box */}
          <div className="p-3 mb-5 border-2 border-amber-200 rounded-lg bg-amber-50 sm:p-4 sm:mb-6">
            <div className="flex items-start space-x-3">
              <svg className="flex-shrink-0 w-5 h-5 mt-0.5 text-amber-600 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="text-left">
                <p className="mb-1 text-xs font-bold text-amber-900 sm:text-sm">⚠️ IMPORTANT - Action Required!</p>
                <p className="text-xs text-amber-800 sm:text-sm">
                  You <strong>CANNOT log in</strong> until you verify your email. Please check your inbox now.
                </p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="p-3 mb-5 text-left bg-gray-50 rounded-lg sm:p-4 sm:mb-6">
            <p className="mb-2 text-sm font-semibold text-gray-700 sm:mb-3">📋 What to do next:</p>
            <ol className="space-y-2 text-xs text-gray-600 sm:text-sm">
              <li className="flex items-start">
                <span className="font-bold text-heritage-green mr-2">1.</span>
                <span>Open your <strong>Gmail inbox</strong></span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-heritage-green mr-2">2.</span>
                <span>Look for email from <strong>Firebase/Balay Ginhawa</strong></span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-heritage-green mr-2">3.</span>
                <span><strong>Check your Spam/Junk folder</strong> if not in inbox</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-heritage-green mr-2">4.</span>
                <span>Click the <strong>verification link</strong> in the email</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-heritage-green mr-2">5.</span>
                <span>Return here and <strong>log in</strong> with your credentials</span>
              </li>
            </ol>
          </div>

          {/* Helpful Tips */}
          <div className="py-2 pl-3 mb-5 text-xs text-gray-500 text-left border-l-4 border-blue-400 bg-blue-50 sm:mb-6">
            <p className="font-semibold text-gray-700 mb-1">💡 Tips:</p>
            <ul className="space-y-1">
              <li>• Email may take 1-2 minutes to arrive</li>
              <li>• Check Promotions tab in Gmail</li>
              <li>• If you can't find it, use "Resend" when you try to log in</li>
            </ul>
          </div>
          
          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full px-4 py-3 text-sm font-semibold text-white transition-all duration-200 bg-heritage-green rounded-lg shadow-lg hover:bg-heritage-green/90 focus:outline-none focus:ring-2 focus:ring-heritage-green focus:ring-offset-2 hover:shadow-xl sm:text-base"
          >
            ✓ I Understand - Go to Login
          </button>
          
          <p className="mt-3 text-xs text-gray-400">
            You'll be able to log in after verifying your email
          </p>
        </div>
      </div>
    </div>
  );
};
