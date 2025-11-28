import { useState } from 'react';
import { auth } from '../../config/firebase';
import { sendEmailVerification, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useAuth } from '../../contexts/AuthContext';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  password?: string; // Optional password for resending
}

export const EmailVerificationModal = ({ isOpen, onClose, email, password }: EmailVerificationModalProps) => {
  const { setResendingVerification } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState('');

  const handleResendVerification = async () => {
    setIsResending(true);
    setResendError('');
    setResendSuccess(false);

    try {
      let user = auth.currentUser;
      
      // If no current user and we have password, temporarily sign in to resend
      if (!user && password) {
        try {
          // Set flag to prevent navigation during temporary sign-in
          setResendingVerification?.(true);
          
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          user = userCredential.user;
          
          // Send verification email
          if (user && !user.emailVerified) {
            await sendEmailVerification(user);
            setResendSuccess(true);
            // Don't auto-hide success message - let user see it
          }
          
          // Sign out again
          await signOut(auth);
          
          // Clear flag after sign out
          setResendingVerification?.(false);
        } catch (signInError: any) {
          console.error('Error signing in to resend:', signInError);
          setResendError('Could not resend email. Please try logging in again.');
          // Clear flag on error
          setResendingVerification?.(false);
        }
      } else if (user && !user.emailVerified) {
        // User is already signed in, just resend
        await sendEmailVerification(user);
        setResendSuccess(true);
        // Don't auto-hide success message - let user see it
      } else {
        setResendError('Unable to resend verification email. Please try logging in again.');
      }
    } catch (error) {
      console.error('Error resending verification email:', error);
      setResendError('Failed to resend verification email. Please try again later.');
    } finally {
      setIsResending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 py-6 overflow-y-auto sm:px-0 sm:py-0">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl mx-auto transform transition-all duration-300 scale-100 sm:max-w-md max-h-[90vh] overflow-y-auto">
        {/* Icon */}
        <div className="flex items-center justify-center pt-4 pb-2 sm:pt-6 sm:pb-3">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-amber-600" 
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
        </div>

        {/* Content */}
        <div className="px-4 pb-5 text-center sm:px-6 sm:pb-6">
          <h3 className="mb-2 text-lg font-bold text-gray-900 sm:text-xl sm:mb-3">
            🔒 Check your email
          </h3>
          
          <p className="mb-2 text-xs text-gray-600 sm:text-sm">
            A verification link has been sent to your email. Please open your inbox and click the link to activate your account.
          </p>
          <p className="mb-4 text-xs font-semibold break-all text-heritage-green sm:text-sm sm:mb-5">
            {email}
          </p>

          {/* Success Message - Simple */}
          {resendSuccess && (
            <div className="p-3 mb-4 border border-green-300 rounded-lg bg-green-50">
              <p className="flex items-center justify-center gap-2 text-xs font-medium text-green-800 sm:text-sm">
                <svg className="w-4 h-4 text-green-600 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verification email sent! Check your inbox.
              </p>
            </div>
          )}

          {/* Error Message - Simple */}
          {resendError && (
            <div className="p-3 mb-4 border border-red-300 rounded-lg bg-red-50">
              <p className="text-xs font-medium text-red-700 sm:text-sm">
                {resendError}
              </p>
            </div>
          )}

          <div className="space-y-3">
            {/* Resend Button */}
            <button
              onClick={handleResendVerification}
              disabled={isResending || resendSuccess}
              className="w-full px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 bg-heritage-green rounded-lg hover:bg-heritage-green/90 focus:outline-none focus:ring-2 focus:ring-heritage-green focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:text-base"
            >
              {isResending ? (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : resendSuccess ? (
                'Email Sent!'
              ) : (
                'Resend Verification Email'
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full px-4 py-3 text-sm font-semibold text-gray-700 transition-colors duration-200 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 sm:text-base"
            >
              Close
            </button>
          </div>

          {/* Simple Instructions */}
          <div className="pt-4 mt-5 border-t border-gray-200 sm:mt-6">
            <p className="mb-1 text-xs text-gray-500 sm:mb-2">
              <strong>Didn't receive the email?</strong>
            </p>
            <p className="text-xs text-gray-400">
              Check your spam folder or click "Resend" above
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
