import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs, DocumentData, QuerySnapshot } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingOverlay } from '../../components/shared/LoadingSpinner';
import { getTimeValue } from '../../lib/utils';

export const SubmitReviewIndexPage: React.FC = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [eligibleBookings, setEligibleBookings] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchEligible = async () => {
      if (!userData?.uid && !userData?.email) {
        setError('Please sign in to submit a review.');
        setLoading(false);
        return;
      }

      try {
        const now = Date.now();

        // Fetch by userId and userEmail then merge to handle legacy bookings
        const queries: Promise<QuerySnapshot<DocumentData>>[] = [];
        if (userData?.uid) {
          const byUid = query(collection(db, 'bookings'), where('userId', '==', userData.uid));
          queries.push(getDocs(byUid));
        }
        if (userData?.email) {
          const byEmail = query(collection(db, 'bookings'), where('userEmail', '==', userData.email));
          queries.push(getDocs(byEmail));
        }

        const snaps = await Promise.all(queries);
        const mergedByKey = new Map<string, any>();

        for (const snap of snaps) {
          for (const d of snap.docs) {
            const data = d.data();
            const booking = { id: d.id, ...data } as any;
            const key = booking.bookingId || d.id; // prefer business id
            if (!mergedByKey.has(key)) mergedByKey.set(key, booking);
          }
        }

        const allBookings = Array.from(mergedByKey.values());

        // Filter to past bookings (checkout before now)
        const pastBookings = allBookings.filter((b) => {
          const checkOutTime = getTimeValue(b.checkOut);
          return checkOutTime !== null && checkOutTime < now;
        });

        // Batch review lookup using 'in' queries (chunks of 10)
        const bookingIds: string[] = pastBookings
          .map((b) => b.bookingId)
          .filter((id): id is string => Boolean(id));

        const chunk = <T,>(arr: T[], size: number) => {
          const res: T[][] = [];
          for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size));
          return res;
        };

        const reviewMap = new Map<string, any>();

        if (userData?.uid && bookingIds.length) {
          const idChunks = chunk(bookingIds, 10);
          for (const ch of idChunks) {
            const q1 = query(
              collection(db, 'guestReview'),
              where('userId', '==', userData.uid),
              where('bookingId', 'in', ch)
            );
            const s1 = await getDocs(q1);
            s1.forEach((doc) => {
              const d = doc.data();
              if (d.bookingId && !reviewMap.has(d.bookingId)) reviewMap.set(d.bookingId, { id: doc.id, ...d });
            });
          }
        }

        // Fallback by guestEmail for any bookingIds still missing
        if (userData?.email && bookingIds.length) {
          const missing = bookingIds.filter((id) => !reviewMap.has(id));
          const idChunks = chunk(missing, 10);
          for (const ch of idChunks) {
            if (!ch.length) continue;
            const q2 = query(
              collection(db, 'guestReview'),
              where('guestEmail', '==', userData.email),
              where('bookingId', 'in', ch)
            );
            const s2 = await getDocs(q2);
            s2.forEach((doc) => {
              const d = doc.data();
              if (d.bookingId && !reviewMap.has(d.bookingId)) reviewMap.set(d.bookingId, { id: doc.id, ...d });
            });
          }
        }

        // Attach userReview if present
        pastBookings.forEach((b) => {
          if (b.bookingId && reviewMap.has(b.bookingId)) {
            b.userReview = reviewMap.get(b.bookingId);
          }
        });

        setEligibleBookings(pastBookings);
      } catch (err) {
        console.error('Error fetching bookings for review:', err);
        setError('Failed to load bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEligible();
  }, [userData]);

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [eligibleBookings.length]);

  if (loading) return <LoadingOverlay text="Loading eligible bookings..." />;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 pt-20 sm:pt-24">
      {/* Animated Background Elements - Match SubmitReviewPage */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute rounded-full -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-heritage-green/10 to-emerald-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute rounded-full -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute w-64 h-64 transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 bg-gradient-to-r from-purple-500/5 to-pink-500/5 blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 py-8 sm:py-12">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Hero Header - Match SubmitReviewPage */}
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
                Select a past booking to share your experience.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto">

            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">{error}</div>
            )}

                {eligibleBookings.length === 0 ? (
                  <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-xl sm:rounded-2xl shadow-lg border border-slate-200/50 p-6 text-center">
                    <p className="text-gray-700 mb-4">No past bookings found for review.</p>
                    <button
                      onClick={() => navigate('/my-bookings')}
                      className="mt-2 px-6 py-3 bg-heritage-green text-white rounded-xl font-semibold hover:bg-heritage-green/90 transition-colors"
                    >
                      View My Bookings
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(() => {
                      const totalPages = Math.ceil(eligibleBookings.length / itemsPerPage);
                      const startIndex = (currentPage - 1) * itemsPerPage;
                      const endIndex = startIndex + itemsPerPage;
                      const currentItems = eligibleBookings.slice(startIndex, endIndex);
                      return currentItems;
                    })().map((b) => (
                      <div key={b.bookingId || b.id} className="bg-gradient-to-br from-white to-slate-50/50 rounded-xl sm:rounded-2xl shadow-lg border border-slate-200/50 p-4 sm:p-6 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-base sm:text-lg text-gray-900">{b.roomName || b.roomType || 'Room'}</div>
                          <div className="text-sm text-gray-600">{new Date(b.checkIn).toLocaleDateString()} - {new Date(b.checkOut).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-500 mt-1">ID: {b.bookingId}</div>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          {b.userReview ? (
                            <button
                              onClick={() => navigate(`/submit-review/${b.bookingId || b.id}` as string, { state: { booking: b } })}
                              className="inline-flex items-center px-4 py-2 bg-white text-heritage-green border border-heritage-green rounded-lg font-semibold hover:bg-heritage-green/5 transition-all"
                            >
                              View Your Review
                            </button>
                          ) : (
                            <button
                              onClick={() => navigate(`/submit-review/${b.bookingId || b.id}` as string, { state: { booking: b } })}
                              className="inline-flex items-center px-4 py-2 bg-heritage-green text-white rounded-lg font-semibold hover:bg-heritage-green/90 transition-all"
                            >
                              Write Review
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Pagination */}
                    {eligibleBookings.length > itemsPerPage && (
                      <div className="px-4 sm:px-6 py-4 mt-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white rounded-xl">
                        {(() => {
                          const totalPages = Math.ceil(eligibleBookings.length / itemsPerPage);
                          return (
                            <div className="flex items-center justify-between gap-2">
                              <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                                  currentPage === 1
                                    ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                                    : 'text-gray-700 hover:bg-heritage-green hover:text-white shadow-sm bg-white border border-gray-200'
                                }`}
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Previous
                              </button>

                              <div className="flex space-x-1 sm:space-x-2">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                  let pageNum;
                                  if (totalPages <= 5) {
                                    pageNum = i + 1;
                                  } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                  } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                  } else {
                                    pageNum = currentPage - 2 + i;
                                  }

                                  return (
                                    <button
                                      key={pageNum}
                                      onClick={() => setCurrentPage(pageNum as number)}
                                      className={`w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm font-bold rounded-lg transition-all duration-150 ${
                                        currentPage === pageNum
                                          ? 'bg-heritage-green text-white shadow-md transform scale-105'
                                          : 'text-gray-700 hover:bg-heritage-green hover:text-white bg-white border border-gray-200 shadow-sm'
                                      }`}
                                    >
                                      {pageNum}
                                    </button>
                                  );
                                })}
                              </div>

                              <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-150 ${
                                  currentPage === totalPages
                                    ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                                    : 'text-gray-700 hover:bg-heritage-green hover:text-white shadow-sm bg-white border border-gray-200'
                                }`}
                              >
                                Next
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitReviewIndexPage;
