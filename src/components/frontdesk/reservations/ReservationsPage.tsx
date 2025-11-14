import { useState, useEffect } from 'react';
import {
  collection, getDocs, doc, updateDoc, addDoc,
  serverTimestamp, setDoc, query, where, Timestamp, onSnapshot, orderBy, limit
} from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useAuth } from '../../../contexts/AuthContext';
import { ROOMS_DATA } from '../../../data/roomsData';
import { CheckInModal } from './CheckInModal';
// import { WalkInModal } from './WalkInModal'; // Not used in this file's JSX
import { ReservationDetailsModal } from './ReservationDetailsModal';
import { EditReservationModal } from './EditReservationModal';
// --- NEW ---
// Import the new modals
import { ConfirmCheckOutModal } from './ConfirmCheckOutModal';
import { ConfirmCancelModal } from './ConfirmCancelModal';
// --- END NEW ---
import FrontDeskStatsCard from '../shared/FrontDeskStatsCard';
import ModernReservationsTable from './ModernReservationsTable';
import { updateBookingCount, updateRevenue, updateArrivals, updateCurrentGuests } from '../../../lib/statsHelpers';

// --- UPDATED ---
// Export the interface so other files (like your modals) can use it
export interface BookingData {
  additionalGuestPrice: number;
  baseGuests: number;
  basePrice: number;
  bookingId: string;
  checkIn: string;
  checkOut: string;
  createdAt: Timestamp;
  guests: number;
  nights: number;
  paymentDetails: {
    cardLast4: string | null;
    cardholderName: string | null;
    gcashName: string | null;
    gcashNumber: string | null;
    paidAt: Timestamp | null;
    paymentMethod: string;
    paymentStatus: 'paid' | 'pending' | 'refunded';
  };
  roomName: string;
  roomNumber: string | null;
  roomPricePerNight: number;
  roomType: string;
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  subtotal: number;
  tax: number;
  taxRate: number;
  totalAmount: number;
  updatedAt: Timestamp;
  userEmail: string;
  userId: string;
  userName: string;
}
// --- END UPDATED ---


export const ReservationsPage = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<BookingData[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<BookingData[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<BookingData | null>(null);

  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // --- NEW ---
  // State for the new confirmation modals
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  // --- END NEW ---

  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<{
    totalBookings?: number;
    monthlyCount?: number;
  } | null>(null);

  // Fetch reservations (untouched)
  useEffect(() => {
    if (user) {
      fetchReservations();
    } else {
      console.log('No user authenticated, skipping fetch');
      setLoading(false);
    }
  }, [user]);

  // Subscribe to stats (untouched)
  useEffect(() => {
    if (!user) return;
    try {
      const statsRef = doc(db, 'stats', 'dashboard');
      const unsub = onSnapshot(statsRef, (snap) => {
        const data = snap.data() ?? {};
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const monthKey = `${yyyy}-${mm}`;
        const monthlyMap = data.monthly ?? {};
        const monthlyCount = typeof monthlyMap[monthKey] === 'number' ? Number(monthlyMap[monthKey]) : undefined;
        setDashboardStats({
          totalBookings: typeof data.totalBookings === 'number' ? Number(data.totalBookings) : undefined,
          monthlyCount,
        });
      }, (err) => {
        console.warn('Failed to subscribe to stats/dashboard:', err);
        setDashboardStats(null);
      });
      return () => unsub();
    } catch (err) {
      console.warn('Error setting up stats/dashboard listener', err);
    }
  }, [user]);

  // Auto Checkout (untouched)
  useEffect(() => {
    let mounted = true;
    const autoCheckoutAndCleanRooms = async () => {
      const lastRun = sessionStorage.getItem('autoCheckoutLastRun');
      const now = Date.now();
      const FIVE_MINUTES = 5 * 60 * 1000;

      if (lastRun && (now - parseInt(lastRun)) < FIVE_MINUTES) {
        console.log('⏭️ Skipping auto-checkout (ran recently)');
        return;
      }

      try {
        const bookingsCol = collection(db, 'bookings');
        const q = query(bookingsCol, where('status', 'in', ['confirmed', 'checked-in']));
        const snap = await getDocs(q);
        const today = new Date();
        today.setHours(0,0,0,0);

        sessionStorage.setItem('autoCheckoutLastRun', now.toString());

        for (const d of snap.docs) {
          const data: any = d.data();
          let checkOutVal = data.checkOut;
          let checkOutDate: Date | null = null;

          if (checkOutVal && typeof checkOutVal === 'string') {
            const parsed = new Date(checkOutVal);
            if (!isNaN(parsed.getTime())) checkOutDate = parsed;
          }
          else if (checkOutVal?.toDate) {
            checkOutDate = checkOutVal.toDate();
          }

          if (!checkOutDate) continue;

          const co = new Date(checkOutDate);
          co.setHours(0,0,0,0);

          if (co < today) {
            try {
              await updateDoc(doc(db, 'bookings', d.id), {
                status: 'checked-out',
                updatedAt: serverTimestamp()
              });

              if (mounted) {
                setReservations(prev => prev.map(r => r.bookingId === d.id ? { ...r, status: 'checked-out' as const } : r));
              }

              const roomNumber = data.roomNumber;
              if (roomNumber) {
                try {
                  const roomRef = doc(db, 'rooms', roomNumber);
                  await updateDoc(roomRef, {
                    status: 'cleaning',
                    isActive: false, 
                    currentReservation: null,
                    updatedAt: serverTimestamp()
                  });
                } catch (e) {
                  try {
                    await setDoc(doc(db, 'rooms', roomNumber), {
                      roomNumber,
                      status: 'cleaning',
                      isActive: false, 
                      currentReservation: null
                    }, { merge: true });
                  } catch (err) {
                    console.warn('Failed to mark room cleaning for', roomNumber, err);
                  }
                }
              }
            } catch (err) {
              console.warn('Auto-checkout update failed for booking', d.id, err);
            }
          }
        }
      } catch (err) {
        console.warn('Auto-checkout job failed', err);
      }
    };

    if (user) {
      autoCheckoutAndCleanRooms();
      return () => { mounted = false; };
    }
    return () => { mounted = false; };
  }, [user]);

  // fetchReservations (untouched)
  const fetchReservations = async () => {
    try {
      setLoading(true);
      const bookingsQuery = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'), limit(20));
      const bookingsSnapshot = await getDocs(bookingsQuery);

      const bookingsData = bookingsSnapshot.docs.map(doc => {
        const data = doc.data();
        const parseDate = (dateField: any): string => {
          if (!dateField) return '';
          if (dateField.toDate) {
            return dateField.toDate().toISOString().split('T')[0];
          }
          if (typeof dateField === 'string') {
            return dateField;
          }
          return '';
        };

        return {
          bookingId: doc.id,
          userId: data.userId || `U-UNKNOWN-${doc.id}`,
          userName: data.userName || 'Unknown Guest',
          userEmail: data.userEmail || 'no-email@provided.com',
          checkIn: parseDate(data.checkIn),
          checkOut: parseDate(data.checkOut),
          guests: data.guests || 1,
          nights: data.nights || 1,
          status: data.status || 'confirmed',
          roomName: data.roomName || 'Unknown Room',
          roomType: data.roomType || 'standard',
          roomNumber: data.roomNumber || null,
          basePrice: data.basePrice || 0,
          baseGuests: data.baseGuests || 2,
          additionalGuestPrice: data.additionalGuestPrice || 0,
          roomPricePerNight: data.roomPricePerNight || 0,
          subtotal: data.subtotal || 0,
          tax: data.tax || 0,
          taxRate: data.taxRate || 0.12,
          totalAmount: data.totalAmount || 0,
          paymentDetails: {
            paymentStatus: data.paymentDetails?.paymentStatus || data.paymentStatus || 'pending',
            paymentMethod: data.paymentDetails?.paymentMethod || data.paymentMethod || 'cash',
            paidAt: data.paymentDetails?.paidAt || data.paidAt || null,
            gcashName: data.paymentDetails?.gcashName || data.gcashName || null,
            gcashNumber: data.paymentDetails?.gcashNumber || data.gcashNumber || null,
            cardholderName: data.paymentDetails?.cardholderName || data.cardholderName || null,
            cardLast4: data.paymentDetails?.cardLast4 || data.cardLast4 || null,
          },
          createdAt: data.createdAt || Timestamp.now(),
          updatedAt: data.updatedAt || Timestamp.now(),
        } as BookingData;
      });

      setReservations(bookingsData);
      setFilteredReservations(bookingsData);
    } catch (error: any) {
      console.error('Error fetching reservations:', error);
      if (error?.code === 'permission-denied') {
        alert(`Permission denied. Current user: ${user?.email || 'Not logged in'}\n\nPlease log in as: balayginhawaAdmin123@gmail.com`);
      } else {
        alert('Failed to load reservations. Please try again.');
      }
      setReservations([]);
      setFilteredReservations([]);
    } finally {
      setLoading(false);
    }
  };

  // ensureRooms (untouched)
  useEffect(() => {
    let mounted = true;
    const ensureRooms = async () => {
      try {
        const roomsSnap = await getDocs(collection(db, 'rooms'));
        if (mounted && roomsSnap.empty) {
          for (const r of ROOMS_DATA) {
            try {
              await setDoc(doc(db, 'rooms', r.roomNumber), {
                roomNumber: r.roomNumber,
                roomName: r.roomName,
                type: r.roomType ? r.roomType.toLowerCase().replace(/\s+/g, '-') : 'standard',
                status: r.status || 'available',
                currentReservation: null
              });
            } catch (e) {
              console.warn('Failed to populate room', r.roomNumber, e);
            }
          }
        }
      } catch (err) {
        console.warn('Error ensuring rooms collection populated:', err);
      }
    };
    if (user) ensureRooms();
    return () => { mounted = false; };
  }, [user]);

  // filter useEffect (untouched)
  useEffect(() => {
    setFilteredReservations(reservations);
  }, [reservations]);


  // --- HANDLER FUNCTIONS (MODIFIED) ---

  // Check In handler (untouched)
  const handleCheckIn = (reservation: BookingData) => {
    setSelectedReservation(reservation);
    setShowCheckInModal(true);
  };

  // handleWalkInBooking (untouched)
  const handleWalkInBooking = async (newBooking: BookingData) => {
    try {
      const docRef = await addDoc(collection(db, 'bookings'), {
        ...newBooking,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      const bookingWithId: BookingData = {
        ...newBooking,
        bookingId: docRef.id,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      setReservations(prev => [...prev, bookingWithId]);

      await updateBookingCount(1, newBooking.checkIn);
      await updateRevenue(newBooking.totalAmount);
      await updateArrivals(1, newBooking.checkIn);
      if (newBooking.status === 'checked-in') {
        await updateCurrentGuests(1);
      }

      if (newBooking.roomNumber) {
        try {
          await setDoc(doc(db, 'rooms', newBooking.roomNumber), {
            roomNumber: newBooking.roomNumber,
            status: 'occupied',
            isActive: false, 
            currentReservation: docRef.id,
          }, { merge: true });
        } catch (err) {
          console.warn('Failed to mark room occupied after walk-in booking:', err);
        }
      }
    } catch (error) {
      console.error('Error adding walk-in booking:', error);
      alert('Failed to create walk-in booking. Please try again.');
    }
  };

  // Edit handler (untouched)
  const handleEditReservation = (reservation: BookingData) => {
    setSelectedReservation(reservation);
    setShowEditModal(true);
  };

  // Save handler (untouched)
  const handleSaveReservation = async (updatedReservation: BookingData) => {
    try {
      await updateDoc(doc(db, 'bookings', updatedReservation.bookingId), {
        ...updatedReservation,
        updatedAt: serverTimestamp()
      });

      setReservations(prev =>
        prev.map(r =>
          r.bookingId === updatedReservation.bookingId ? updatedReservation : r
        )
      );
      setShowEditModal(false);
      setSelectedReservation(null);
    } catch (error) {
      console.error('Error updating reservation:', error);
      alert('Failed to update reservation. Please try again.');
    }
  };

  // --- NEW ---
  // Handlers to open the confirmation modals
  const handleOpenCheckOutModal = (reservation: BookingData) => {
    setSelectedReservation(reservation);
    setShowCheckOutModal(true);
  };

  const handleOpenCancelModal = (reservation: BookingData) => {
    setSelectedReservation(reservation);
    setShowCancelModal(true);
  };

  // Logic for checking out (called by ConfirmCheckOutModal)
  const handleConfirmCheckOut = async (reservation: BookingData) => {
    if (!reservation.bookingId) {
      alert("Error: Reservation ID is missing.");
      return;
    }
    const wasCheckedIn = reservation.status === 'checked-in';
    try {
      await updateDoc(doc(db, 'bookings', reservation.bookingId), {
        status: 'checked-out',
        updatedAt: serverTimestamp()
      });
      setReservations(prev => prev.map(r =>
        r.bookingId === reservation.bookingId ? { ...r, status: 'checked-out' as const } : r
      ));
      if (reservation.roomNumber) {
        await setDoc(doc(db, 'rooms', reservation.roomNumber), {
          status: 'cleaning',
          isActive: false,
          currentReservation: null,
          updatedAt: serverTimestamp()
        }, { merge: true });
      }
      if (wasCheckedIn) {
        await updateCurrentGuests(-1);
      }
    } catch (error) {
      console.error('Error during manual check-out:', error);
      alert('Failed to check out reservation. Please try again.');
    } finally {
      setShowCheckOutModal(false);
      setSelectedReservation(null);
    }
  };

  // Logic for cancelling (called by ConfirmCancelModal)
  const handleConfirmCancel = async (reservation: BookingData) => {
    if (!reservation.bookingId) {
      alert("Error: Reservation ID is missing.");
      return;
    }
    const wasCheckedIn = reservation.status === 'checked-in';
    try {
      await updateDoc(doc(db, 'bookings', reservation.bookingId), {
        status: 'cancelled',
        updatedAt: serverTimestamp()
      });
      setReservations(prev => prev.map(r =>
        r.bookingId === reservation.bookingId ? { ...r, status: 'cancelled' as const } : r
      ));
      if (reservation.roomNumber) {
        await setDoc(doc(db, 'rooms', reservation.roomNumber), {
          status: 'available',
          isActive: true,
          currentReservation: null,
          updatedAt: serverTimestamp()
        }, { merge: true });
      }
      if (wasCheckedIn) {
        await updateCurrentGuests(-1);
      }
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      alert('Failed to cancel reservation. Please try again.');
    } finally {
      setShowCancelModal(false);
      setSelectedReservation(null);
    }
  };
  // --- END NEW ---


  // Stats cards logic (untouched)
  const statusCounts = {
    all: dashboardStats?.monthlyCount ?? reservations.length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    'checked-in': reservations.filter(r => r.status === 'checked-in').length,
    'checked-out': reservations.filter(r => r.status === 'checked-out').length,
  };

  // --- JSX (Modified) ---
  return (
    <div className="min-h-screen bg-[#F9F6EE]">
      {/* Background Elements (no change) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 rounded-full blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl animate-pulse delay-1000 opacity-25"></div>
        <div className="absolute bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 rounded-full blur-3xl animate-pulse delay-2000 opacity-20"></div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(134, 134, 134, 0.1) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">


        {/* Stats Cards Grid (THIS IS THE SECTION YOU ASKED ABOUT) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <FrontDeskStatsCard
            title="Total Reservations"
            value={statusCounts.all}
            icon="📋"
            color="blue"
          />
          <FrontDeskStatsCard
            title="Pending Check-in"
            value={statusCounts.confirmed}
            icon="⏳"
            color="yellow"
          />
          <FrontDeskStatsCard
            title="Checked In"
            value={statusCounts['checked-in']}
            icon="🏨"
            color="green"
          />
          <FrontDeskStatsCard
            title="Checked Out"
            value={statusCounts['checked-out']}
            icon="✅"
            color="gray"
          />
        </div>

        {/* --- UPDATED ---
         * Pass the new handlers to the table
         */}
        {!user ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            {/* ... Not logged in UI ... */}
          </div>
        ) : loading ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            {/* ... Loading UI ... */}
          </div>
        ) : (
          <ModernReservationsTable
            reservations={filteredReservations}
            onRowClick={(reservation: BookingData) => {
              setSelectedReservation(reservation);
              setShowDetailsModal(true);
            }}
            onCheckIn={handleCheckIn}
            onCheckOut={handleOpenCheckOutModal} // <-- UPDATED
            onEdit={handleEditReservation}
            onCancel={handleOpenCancelModal} // <-- UPDATED
            onAddReservation={handleWalkInBooking}
          />
        )}
      </div>

      {/* Check-in Modal (untouched) */}
      {showCheckInModal && selectedReservation && (
        <CheckInModal
          isOpen={showCheckInModal}
          onClose={() => {
            setShowCheckInModal(false);
            setSelectedReservation(null);
          }}
          reservation={selectedReservation}
          onCheckIn={async (updatedReservation) => {
            try {
              const wasStatus = reservations.find(r => r.bookingId === updatedReservation.bookingId)?.status;
              await updateDoc(doc(db, 'bookings', updatedReservation.bookingId), {
                ...updatedReservation,
                updatedAt: serverTimestamp()
              });
              setReservations(prev =>
                prev.map(r =>
                  r.bookingId === updatedReservation.bookingId ? updatedReservation : r
                )
              );
              if (wasStatus !== 'checked-in' && updatedReservation.status === 'checked-in') {
                await updateCurrentGuests(1);
              }
              try {
                const prevRoom = reservations.find(r => r.bookingId === updatedReservation.bookingId)?.roomNumber;
                const newRoom = updatedReservation.roomNumber;
                if (newRoom) {
                  await setDoc(doc(db, 'rooms', newRoom), {
                    roomNumber: newRoom,
                    status: 'occupied',
                    isActive: false,
                    currentReservation: updatedReservation.bookingId
                  }, { merge: true });
                }
                if (prevRoom && prevRoom !== newRoom) {
                  await setDoc(doc(db, 'rooms', prevRoom), {
                    roomNumber: prevRoom,
                    status: 'available',
                    isActive: true,
                    currentReservation: null
                  }, { merge: true });
                }
              } catch (err) {
                console.warn('Failed to update rooms documents on check-in:', err);
              }
              setShowCheckInModal(false);
              setSelectedReservation(null);
            } catch (error) {
              console.error('Error checking in reservation:', error);
              alert('Failed to check in reservation. Please try again.');
            }
          }}
        />
      )}

      {/* --- UPDATED ---
       * Pass the new handlers to the details modal
       */}
      {showDetailsModal && selectedReservation && (
        <ReservationDetailsModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);

          }}
          reservation={selectedReservation}
          onEdit={handleEditReservation}
          onCheckIn={handleCheckIn}
          onCheckOut={handleOpenCheckOutModal} 
          onCancel={handleOpenCancelModal}   
        />
      )}

      {/* Edit Reservation Modal (untouched) */}
      {showEditModal && selectedReservation && (
        <EditReservationModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedReservation(null);
          }}
          reservation={selectedReservation}
          onSave={handleSaveReservation}
        />
      )}

      {/* --- NEW ---
       * Render the new confirmation modals
       */}
      {showCheckOutModal && selectedReservation && (
        <ConfirmCheckOutModal
          isOpen={showCheckOutModal}
          onClose={() => {
            setShowCheckOutModal(false);
          }}
          reservation={selectedReservation}
          onConfirmCheckOut={handleConfirmCheckOut}
        />
      )}

      {showCancelModal && selectedReservation && (
        <ConfirmCancelModal
          isOpen={showCancelModal}
          onClose={() => {
            setShowCancelModal(false);
          }}
          reservation={selectedReservation}
          onConfirmCancel={handleConfirmCancel}
        />
      )}
      {/* --- END NEW --- */}
    </div>
  );
};