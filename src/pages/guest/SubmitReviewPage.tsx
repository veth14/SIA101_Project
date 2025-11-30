import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { db, storage } from '../../config/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../contexts/AuthContext';
import { ReviewForm, ReviewData } from '../../components/reviews/ReviewForm';
import { LoadingOverlay } from '../../components/shared/LoadingSpinner';
import { CheckCircle } from 'lucide-react';
import { getTimeValue } from '../../lib/utils';

export const SubmitReviewPage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { userData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [existingReview, setExistingReview] = useState<any>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!userData?.uid || !bookingId) {
        setError('Invalid access');
        setLoading(false);
        return;
      }

      try {
        // Get booking from location state or fetch from Firebase
        const bookingData = location.state?.booking;
        
        if (bookingData) {
          setBooking(bookingData);
        } else {
          // Fetch from Firebase if not in state
          const bookingsQuery = query(
            collection(db, 'bookings'),
            where('bookingId', '==', bookingId),
            where('userId', '==', userData.uid)
          );
          const bookingsSnapshot = await getDocs(bookingsQuery);
          
          if (!bookingsSnapshot.empty) {
            setBooking({ id: bookingsSnapshot.docs[0].id, ...bookingsSnapshot.docs[0].data() });
          } else {
            // Fallback: try document id direct match (legacy deep link)
            try {
              const byIdRef = doc(db, 'bookings', bookingId);
              const byIdSnap = await getDoc(byIdRef);
              if (byIdSnap.exists()) {
                const data = byIdSnap.data();
                if (data.userId === userData.uid || data.userEmail === userData.email) {
                  setBooking({ id: byIdSnap.id, ...data });
                } else {
                  setError('Booking not found');
                }
              } else {
                setError('Booking not found');
              }
            } catch (e) {
              setError('Booking not found');
            }
          }
        }

        // Check if review already exists (userId OR guestEmail fallback)
        let foundReview: any | null = null;
        const reviewsQuery1 = query(
          collection(db, 'guestReview'),
          where('bookingId', '==', bookingId),
          where('userId', '==', userData.uid)
        );
        const reviewsSnapshot1 = await getDocs(reviewsQuery1);
        if (!reviewsSnapshot1.empty) {
          foundReview = reviewsSnapshot1.docs[0].data();
        } else if (userData.email) {
          const reviewsQuery2 = query(
            collection(db, 'guestReview'),
            where('bookingId', '==', bookingId),
            where('guestEmail', '==', userData.email)
          );
          const reviewsSnapshot2 = await getDocs(reviewsQuery2);
          if (!reviewsSnapshot2.empty) {
            foundReview = reviewsSnapshot2.docs[0].data();
          }
        }
        if (foundReview) setExistingReview(foundReview);

      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, userData, location.state]);

  const uploadPhotos = async (photos: File[]): Promise<string[]> => {
    if (!photos || photos.length === 0) return [];

    const uploadPromises = photos.map(async (photo, index) => {
      const timestamp = Date.now();
      const fileName = `reviews/${userData?.uid}/${bookingId}/${timestamp}_${index}.jpg`;
      const storageRef = ref(storage, fileName);
      
      await uploadBytes(storageRef, photo);
      return getDownloadURL(storageRef);
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (reviewData: ReviewData) => {
    if (!userData || !booking) return;

    setSubmitting(true);
    setError('');

    try {
      // Upload photos to Firebase Storage
      let photoUrls: string[] = [];
      if (reviewData.photos && reviewData.photos.length > 0) {
        photoUrls = await uploadPhotos(reviewData.photos);
      }

      // Create review document
      const reviewDoc = {
        reviewId: `REV${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
        userId: userData.uid,
        bookingId: booking.bookingId || booking.id,
        roomType: booking.roomType,
        roomName: booking.roomName,
        rating: reviewData.rating,
        category: reviewData.category,
        // Backwards-compat: older schema used `title` for category
        title: reviewData.category,
        review: reviewData.review,
        photos: photoUrls,
        guestName: userData.displayName || userData.email?.split('@')[0] || 'Guest',
        guestEmail: userData.email,
        stayDate: new Date(booking.checkOut).toLocaleDateString('en-US', { 
          month: 'long', 
          year: 'numeric' 
        }),
        checkInDate: booking.checkIn,
        checkOutDate: booking.checkOut,
        submittedAt: serverTimestamp(),
        status: 'new', // mark new submissions for moderation/review
        helpful: 0,
        verified: true // Verified because it's from actual booking
      };

      // Add to Firebase
      await addDoc(collection(db, 'guestReview'), reviewDoc);

      // Show success
      setSuccess(true);

      // Redirect after 3 seconds (route is /my-bookings)
      setTimeout(() => {
        navigate('/my-bookings');
      }, 3000);

    } catch (err) {
      console.error('Error submitting review:', err);
      const message = err instanceof Error ? err.message : String(err);
      setError(`Failed to submit review. ${message}`);
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingOverlay text="Loading booking details..." />;
  }

  if (error && !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-20 sm:pt-24">
        <div className="text-center p-6 sm:p-8 max-w-md">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{error}</h2>
          <button
            onClick={() => navigate('/my-bookings')}
            className="mt-4 px-6 py-3 bg-heritage-green text-white rounded-xl font-semibold hover:bg-heritage-green/90 transition-colors"
          >
            Back to My Bookings
          </button>
        </div>
      </div>
    );
  }

  if (existingReview) {
  // Show the submitted review and any response from staff
  const respMs = getTimeValue(existingReview.responseDate);
  const respDate = respMs ? new Date(respMs) : null;
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-20 sm:pt-24">
        <div className="w-full max-w-3xl p-6 sm:p-8">
          <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-xl sm:rounded-2xl shadow-lg border border-slate-200/50 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-heritage-green rounded-lg flex items-center justify-center text-white font-bold">{userData?.displayName?.charAt(0) || userData?.email?.charAt(0) || 'G'}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{userData?.displayName || userData?.email?.split('@')[0] || 'Guest'}</h3>
                    <div className="text-sm text-gray-500">{booking?.roomName || booking?.roomType}</div>
                  </div>
                    <div className="text-sm text-gray-500">{(() => {
                      const submittedMs = getTimeValue(existingReview.submittedAt);
                      return submittedMs ? new Date(submittedMs).toLocaleString() : (existingReview.submittedAt || '');
                    })()}</div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center gap-3">
                    <div className="font-medium">Category:</div>
                    <div className="text-sm text-gray-700">{existingReview.category || existingReview.title || 'General'}</div>
                  </div>

                  <div className="mt-3">
                    <div className="font-medium">Rating</div>
                    <div className="text-sm text-gray-700">{existingReview.rating}/5</div>
                  </div>

                  <div className="mt-4">
                    <div className="font-medium">Your review</div>
                    <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">{existingReview.review}</p>
                  </div>

                  {existingReview.photos && existingReview.photos.length > 0 && (
                    <div className="mt-4">
                      <div className="font-medium">Photos</div>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {existingReview.photos.map((p: string, i: number) => (
                          <img key={i} src={p} className="w-full h-24 object-cover rounded-lg" alt={`photo-${i}`} />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 border-t pt-4">
                    <div className="font-medium">Staff response</div>
                    {existingReview.response ? (
                      <div className="mt-2 text-sm text-gray-700">
                        <p className="whitespace-pre-line">{existingReview.response}</p>
                        <div className="mt-2 text-xs text-gray-500">Responded by: {existingReview.respondedBy || 'Staff'} {respDate ? `• ${respDate.toLocaleString()}` : ''}</div>
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-gray-500">No response yet. We will notify you when staff replies.</p>
                    )}
                  </div>

                    <div className="mt-6 flex justify-end">
                    <button onClick={() => navigate('/my-bookings')} className="px-5 py-2 bg-heritage-green text-white rounded-xl font-semibold hover:bg-heritage-green/90">Back to My Bookings</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-20 sm:pt-24">
        <div className="text-center p-6 sm:p-8 max-w-md">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Thank You!</h2>
          <p className="text-base sm:text-lg text-gray-600 mb-2">Your review has been submitted successfully.</p>
          <p className="text-sm text-gray-500">Redirecting to My Bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 pt-20 sm:pt-24">
      {/* Animated Background Elements - Matching My Bookings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute rounded-full -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-heritage-green/10 to-emerald-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute rounded-full -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute w-64 h-64 transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 bg-gradient-to-r from-purple-500/5 to-pink-500/5 blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 py-8 sm:py-12">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Hero Header Section - Matching My Bookings Style */}
          <div className="mb-8 sm:mb-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-6 sm:mb-8 transition-transform duration-300 transform shadow-2xl bg-gradient-to-br from-heritage-green to-emerald-600 rounded-2xl hover:scale-110">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-transparent bg-gradient-to-r from-slate-900 via-heritage-green to-emerald-600 bg-clip-text px-4">
                Share Your Experience
              </h1>
              <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed text-slate-600 px-4">
                Your feedback helps us improve and helps other guests make informed decisions
              </p>
            </div>
          </div>
      
          {/* Main Content */}
          <div className="max-w-4xl mx-auto">

        {/* Booking Info Card - Mobile Responsive */}
        {booking && (
          <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-xl sm:rounded-2xl shadow-lg border border-slate-200/50 p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base sm:text-lg text-gray-900 truncate">{booking.roomName}</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(booking.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="text-xs text-gray-500 font-mono truncate">ID: {booking.bookingId}</p>
              </div>
            </div>
          </div>
        )}

        {/* Review Form */}
        <ReviewForm
          bookingId={booking?.bookingId || ''}
          roomName={booking?.roomName || ''}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/my-bookings')}
        />

        {submitting && <LoadingOverlay text="Submitting your review..." />}
          </div>
        </div>
      </div>
    </div>
  );
};
