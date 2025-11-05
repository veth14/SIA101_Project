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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        {/* Icon */}
        <div className="flex items-center justify-center pt-8 pb-4">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
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
        <div className="px-8 pb-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            🔒 Email Verification Required
          </h3>
          
          <p className="text-gray-600 mb-2 text-sm">
            Please verify your email to access your account
          </p>
          <p className="text-heritage-green font-semibold mb-6 break-all">
            {email}
          </p>

          {/* Success Message - Simple */}
          {resendSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-300 rounded-lg">
              <p className="text-sm text-green-800 font-medium flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verification email sent! Check your inbox.
              </p>
            </div>
          )}

          {/* Error Message - Simple */}
          {resendError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg">
              <p className="text-sm text-red-700 font-medium">
                {resendError}
              </p>
            </div>
          )}

          <div className="space-y-3">
            {/* Resend Button */}
            <button
              onClick={handleResendVerification}
              disabled={isResending || resendSuccess}
              className="w-full bg-heritage-green text-white py-3 px-6 rounded-lg font-semibold hover:bg-heritage-green/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-heritage-green focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              Close
            </button>
          </div>

          {/* Simple Instructions */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">
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
