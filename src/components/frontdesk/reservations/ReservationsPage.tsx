import { useState, useEffect } from 'react';
// --- UPDATED ---
// Timestamp is needed for the new data structure
import { 
  collection, getDocs, doc, updateDoc, addDoc, deleteDoc, 
  serverTimestamp, setDoc, query, where, Timestamp, onSnapshot, orderBy, limit
} from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useAuth } from '../../../contexts/AuthContext';
import { ROOMS_DATA } from '../../../data/roomsData';
import { CheckInModal } from './CheckInModal';
import { WalkInModal } from './WalkInModal';
import { ReservationDetailsModal } from './ReservationDetailsModal';
import { EditReservationModal } from './EditReservationModal';
import { ConfirmDialog } from '../../admin/ConfirmDialog';
import FrontDeskStatsCard from '../shared/FrontDeskStatsCard';
import ModernReservationsTable from './ModernReservationsTable';
import { updateBookingCount, updateRevenue, updateArrivals, updateCurrentGuests } from '../../../lib/statsHelpers';

// --- UPDATED ---
// This is our new "source of truth" interface.
// The old 'Reservation' interface is removed.
interface BookingData {
  additionalGuestPrice: number;
  baseGuests: number;
  basePrice: number;
  bookingId: string; // This will be the document ID
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
  // --- UPDATED ---
  // All state now uses the new BookingData interface
  const [reservations, setReservations] = useState<BookingData[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<BookingData[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<BookingData | null>(null);
  // --- END UPDATED ---
  
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // Subscribe to aggregated stats to avoid client-side scans for counts
  const [dashboardStats, setDashboardStats] = useState<{
    totalBookings?: number;
    monthlyCount?: number;
  } | null>(null);

  // Fetch reservations from Firebase
  useEffect(() => {
    if (user) {
      fetchReservations();
    } else {
      console.log('No user authenticated, skipping fetch');
      setLoading(false);
    }
  }, [user]);

  // Subscribe to stats/dashboard for aggregated numbers (lightweight single doc)
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

// --- UPDATED ---
  // Auto-checkout: Now also sets isActive: false
  // OPTIMIZED: Only run once per session to reduce Firestore reads
  useEffect(() => {
    let mounted = true;
    const autoCheckoutAndCleanRooms = async () => {
      // Check if auto-checkout already ran in this session
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
                  // --- FIX ---
                  await updateDoc(roomRef, { 
                    status: 'cleaning', 
                    isActive: false, // Add this
                    currentReservation: null, 
                    updatedAt: serverTimestamp() 
                  });
                } catch (e) {
                  try {
                    // --- FIX ---
                    await setDoc(doc(db, 'rooms', roomNumber), { 
                      roomNumber, 
                      status: 'cleaning', 
                      isActive: false, // Add this
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
      // Run auto-checkout once on page load only (removed 5-minute interval to save Firebase reads)
      autoCheckoutAndCleanRooms();
      return () => { mounted = false; };
    }
    return () => { mounted = false; };
  }, [user]);
  // --- END UPDATED ---

  // --- UPDATED ---
  // This is the most important fix.
  // The fetchReservations function now correctly reads the new data structure.
  const fetchReservations = async () => {
    try {
      setLoading(true);
      // Limit initial fetch to 20 documents to avoid scanning entire collection
      const bookingsQuery = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'), limit(20));
      const bookingsSnapshot = await getDocs(bookingsQuery);
      
      const bookingsData = bookingsSnapshot.docs.map(doc => {
        const data = doc.data();
        
        // Helper to parse dates ("YYYY-MM-DD" string or Timestamp)
        const parseDate = (dateField: any): string => {
          if (!dateField) return '';
          if (dateField.toDate) { // Handle Firestore Timestamp
            return dateField.toDate().toISOString().split('T')[0];
          }
          if (typeof dateField === 'string') { // Handle "YYYY-MM-DD"
            return dateField;
          }
          return ''; // Fallback
        };

        // This maps the Firestore document to our strict BookingData interface.
        // It provides defaults for any fields that might be missing from old records.
        return {
          // IDs
          bookingId: doc.id, // Use the document ID as the bookingId
          userId: data.userId || `U-UNKNOWN-${doc.id}`,
          
          // Guest Details
          userName: data.userName || 'Unknown Guest',
          userEmail: data.userEmail || 'no-email@provided.com',
          
          // Stay Details
          checkIn: parseDate(data.checkIn),
          checkOut: parseDate(data.checkOut),
          guests: data.guests || 1,
          nights: data.nights || 1,
          status: data.status || 'confirmed',

          // Room Details
          roomName: data.roomName || 'Unknown Room',
          roomType: data.roomType || 'standard',
          roomNumber: data.roomNumber || null,

          // Pricing Details
          basePrice: data.basePrice || 0,
          baseGuests: data.baseGuests || 2,
          additionalGuestPrice: data.additionalGuestPrice || 0,
          roomPricePerNight: data.roomPricePerNight || 0,
          subtotal: data.subtotal || 0,
          tax: data.tax || 0,
          taxRate: data.taxRate || 0.12,
          totalAmount: data.totalAmount || 0,

          // --- THIS FIXES THE BUG ---
          // Read from the nested paymentDetails map
          paymentDetails: {
            paymentStatus: data.paymentDetails?.paymentStatus || 'pending',
            paymentMethod: data.paymentDetails?.paymentMethod || 'cash',
            paidAt: data.paymentDetails?.paidAt || null,
            gcashName: data.paymentDetails?.gcashName || null,
            gcashNumber: data.paymentDetails?.gcashNumber || null,
            cardholderName: data.paymentDetails?.cardholderName || null,
            cardLast4: data.paymentDetails?.cardLast4 || null,
          },
          // --- END BUG FIX ---

          // Timestamps
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
  // --- END UPDATED ---

  // ensureRooms (useEffect remains the same)
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

  // useEffect for filters (remains the same)
  useEffect(() => {
    setFilteredReservations(reservations);
  }, [reservations]);

  // --- UPDATED ---
  // All handlers now use BookingData
  const handleCheckIn = (reservation: BookingData) => {
    setSelectedReservation(reservation);
    setShowCheckInModal(true);
  };

  const handleCheckOut = async (reservation: BookingData) => {
    try {
      await updateDoc(doc(db, 'bookings', reservation.bookingId), { // Use bookingId
        status: 'checked-out',
        updatedAt: serverTimestamp()
      });

      setReservations(prev =>
        prev.map(r =>
          r.bookingId === reservation.bookingId // Use bookingId
            ? { ...r, status: 'checked-out' as const }
            : r
        )
      );

      // Update aggregated stats: decrement currentGuests if was checked-in
      if (reservation.status === 'checked-in') {
        await updateCurrentGuests(-1);
      }
    } catch (error) {
      console.error('Error checking out reservation:', error);
      alert('Failed to check out reservation. Please try again.');
    }
  };

// --- UPDATED ---
  // handleWalkInBooking now sets isActive: false
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

      // Update aggregated stats
      await updateBookingCount(1, newBooking.checkIn);
      await updateRevenue(newBooking.totalAmount);
      await updateArrivals(1, newBooking.checkIn);
      if (newBooking.status === 'checked-in') {
        await updateCurrentGuests(1);
      }

      if (newBooking.roomNumber) {
        try {
          // --- FIX ---
          await setDoc(doc(db, 'rooms', newBooking.roomNumber), {
            roomNumber: newBooking.roomNumber,
            status: 'occupied',
            isActive: false, // Add this
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


  const handleEditReservation = (reservation: BookingData) => {
    setSelectedReservation(reservation);
    setShowEditModal(true);
  };

  // --- UPDATED ---
  // handleSaveReservation now saves the full BookingData object
  // Note: This assumes EditReservationModal will ALSO be refactored.
  const handleSaveReservation = async (updatedReservation: BookingData) => {
    try {
      // Update in Firebase using the *entire* updated object
      // This ensures the nested paymentDetails are saved correctly
      await updateDoc(doc(db, 'bookings', updatedReservation.bookingId), {
        ...updatedReservation,
        updatedAt: serverTimestamp() // Set the update timestamp
      });

      // Update local state
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

  const handleCancelReservation = (reservationId: string) => {
    setReservationToCancel(reservationId);
    setShowCancelDialog(true);
  };

  const confirmCancelReservation = async () => {
    if (reservationToCancel) {
      try {
        await updateDoc(doc(db, 'bookings', reservationToCancel), {
          status: 'cancelled',
          updatedAt: serverTimestamp()
        });

        setReservations(prev =>
          prev.map(r =>
            r.bookingId === reservationToCancel // Use bookingId
              ? { ...r, status: 'cancelled' as const }
              : r
          )
        );
      } catch (error) {
        console.error('Error cancelling reservation:', error);
        alert('Failed to cancel reservation. Please try again.');
      }
    }
    setShowCancelDialog(false);
    setReservationToCancel(null);
  };

  // --- ADD THESE TWO FUNCTIONS ---

  const handleDeleteReservation = (reservationId: string) => {
    setReservationToDelete(reservationId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteReservation = async () => {
    if (reservationToDelete) {
      try {
        const reservation = reservations.find(r => r.bookingId === reservationToDelete);
        
        // Delete from Firebase
        await deleteDoc(doc(db, 'bookings', reservationToDelete));

        // Update aggregated stats
        if (reservation) {
          await updateBookingCount(-1, reservation.checkIn);
          await updateRevenue(-reservation.totalAmount);
          await updateArrivals(-1, reservation.checkIn);
          if (reservation.status === 'checked-in') {
            await updateCurrentGuests(-1);
          }
        }

        // Update local state
        setReservations(prev =>
          prev.filter(r => r.bookingId !== reservationToDelete)
        );
        
      } catch (error) {
        console.error('Error deleting reservation:', error);
        alert('Failed to delete reservation. Please try again.');
      }
    }
    setShowDeleteDialog(false);
    setReservationToDelete(null);
  };
  // --- END ADD ---

  // --- UPDATED ---
  // Stats cards logic is now correct
  const statusCounts = {
    // show current month totals when available
    all: dashboardStats?.monthlyCount ?? reservations.length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    'checked-in': reservations.filter(r => r.status === 'checked-in').length,
    'checked-out': reservations.filter(r => r.status === 'checked-out').length,
  };

  // --- JSX (No changes needed, but updated for clarity) ---
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
      
        
        {/* Stats Cards Grid (no change) */}
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
        // The table and modals will now receive the correct BookingData type,
        // fixing all TypeScript errors.
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
          onCheckOut={handleCheckOut}
          onEdit={handleEditReservation}
          onCancel={(reservation: BookingData) => handleCancelReservation(reservation.bookingId)}
          onAddReservation={handleWalkInBooking}
          onDelete={(reservation: BookingData) => handleDeleteReservation(reservation.bookingId)} // <-- ADD THIS LINE
        />
        )}
      </div>

      {/* Check-in Modal */}
      {showCheckInModal && selectedReservation && (
        <CheckInModal
          isOpen={showCheckInModal}
          onClose={() => {
            setShowCheckInModal(false);
            setSelectedReservation(null);
          }}
          reservation={selectedReservation} // Prop is now BookingData
          onCheckIn={async (updatedReservation) => { // Receives BookingData
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

              // Update aggregated stats: increment currentGuests if transitioning to checked-in
              if (wasStatus !== 'checked-in' && updatedReservation.status === 'checked-in') {
                await updateCurrentGuests(1);
              }
              
              // Update rooms collection
              try {
                const prevRoom = reservations.find(r => r.bookingId === updatedReservation.bookingId)?.roomNumber;
                const newRoom = updatedReservation.roomNumber;
                if (newRoom) {
                  // --- FIX ---
                  await setDoc(doc(db, 'rooms', newRoom), {
                    roomNumber: newRoom,
                    status: 'occupied',
                    isActive: false, // Add this
                    currentReservation: updatedReservation.bookingId
                  }, { merge: true });
                }
                if (prevRoom && prevRoom !== newRoom) {
                  // --- FIX ---
                  await setDoc(doc(db, 'rooms', prevRoom), {
                    roomNumber: prevRoom,
                    status: 'available',
                    isActive: true, // Add this
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
      
      {/* Reservation Details Modal */}
      {showDetailsModal && selectedReservation && (
        <ReservationDetailsModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedReservation(null);
          }}
          reservation={selectedReservation} // Prop is now BookingData
          onEdit={handleEditReservation}
          onCheckIn={handleCheckIn}
          onCheckOut={(reservationId) => {
            const reservation = reservations.find(r => r.bookingId === reservationId);
            if (reservation) handleCheckOut(reservation);
          }}
          onCancel={handleCancelReservation}
        />
      )}

      {/* Edit Reservation Modal */}
      {showEditModal && selectedReservation && (
        <EditReservationModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedReservation(null);
          }}
          reservation={selectedReservation} // Prop is now BookingData
          onSave={handleSaveReservation} // Now expects BookingData
        />
      )}

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <ConfirmDialog
          isOpen={showCancelDialog}
          onClose={() => {
            setShowCancelDialog(false);
            setReservationToCancel(null);
          }}
          onConfirm={confirmCancelReservation}
          title="Cancel Reservation"
          message="Are you sure you want to cancel this reservation? This action cannot be undone."
          confirmText="Cancel Reservation"
        />
      )}

      {/* --- ADD THIS NEW DIALOG --- */}
      {showDeleteDialog && (
        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => {
            setShowDeleteDialog(false);
            setReservationToDelete(null);
          }}
          onConfirm={confirmDeleteReservation}
          title="Delete Reservation"
          message="Are you sure you want to permanently delete this reservation? This action is irreversible."
          confirmText="Delete"
          type='danger' // <-- THIS IS THE FIX
        />
      )}
      {/* --- END ADD --- */}

    </div>
  );
};