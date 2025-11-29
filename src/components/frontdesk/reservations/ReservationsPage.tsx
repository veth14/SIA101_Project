import { useState, useEffect } from 'react';
import { 
  collection, getDocs, doc, updateDoc, addDoc,
  serverTimestamp, query, Timestamp, onSnapshot, orderBy, limit,
  writeBatch, where, WriteBatch, runTransaction
} from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { createNotification } from '../../../backend/notifications/notificationsService';
import { useAuth } from '../../../contexts/AuthContext';

// --- Import from the new separate file ---
import { 
  RoomsContext, 
  BookingData, 
  IRoom 
} from './ReservationsContext';

import { CheckInModal } from './CheckInModal';
import { ReservationDetailsModal } from './ReservationDetailsModal';
import { EditReservationModal } from './EditReservationModal';
import { ConfirmCheckOutModal } from './ConfirmCheckOutModal';
import { ConfirmCancelModal } from './ConfirmCancelModal';
import FrontDeskStatsCard from '../shared/FrontDeskStatsCard';
import ModernReservationsTable from './ModernReservationsTable';
import { updateBookingCount, updateRevenue, updateArrivals, updateCurrentGuests } from '../../../lib/statsHelpers';
import { createCleaningTicketForCheckout } from '../../../services/maintenanceService';

// --- HELPER FOR ROOM UPDATES ---
const updateRoomStatusInBatch = (
  batch: WriteBatch, 
  roomId: string, 
  status: 'occupied' | 'available' | 'cleaning', 
  isActive: boolean, 
  currentReservation: string | null
) => {
  const roomRef = doc(db, 'rooms', roomId);
  batch.set(roomRef, {
    status,
    isActive,
    currentReservation,
    updatedAt: serverTimestamp()
  }, { merge: true });
};

export const ReservationsPage = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<BookingData[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<BookingData[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<BookingData | null>(null);

  // Master Room List State
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);

  // Modal States
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<{
    totalBookings?: number;
    monthlyCount?: number;
  } | null>(null);

  // --- Fetch Rooms ---
  const fetchRooms = async () => {
    setRoomsLoading(true);
    try {
      const snap = await getDocs(collection(db, 'rooms'));
      const roomsData = snap.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<IRoom, 'id'>)
      }));
      setRooms(roomsData as IRoom[]);
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
    } finally {
      setRoomsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRooms();
    }
  }, [user]);

  // --- Fetch Reservations ---
  const fetchReservations = async () => {
    try {
      setLoading(true);
      const bookingsQuery = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'), limit(20));
      const bookingsSnapshot = await getDocs(bookingsQuery);

      const bookingsData = bookingsSnapshot.docs.map(docSnapshot => {
        const data = docSnapshot.data();
        
        // FIXED: Improved type checking for dateField
        const parseDate = (dateField: unknown): string => {
          if (!dateField) return '';
          // Check if it's a Firestore Timestamp (has toDate method)
          if (typeof dateField === 'object' && 'toDate' in dateField) {
            return (dateField as { toDate: () => Date }).toDate().toISOString().split('T')[0];
          }
          if (typeof dateField === 'string') {
            return dateField;
          }
          return '';
        };

        return {
          bookingId: docSnapshot.id,
          userId: data.userId || `U-UNKNOWN-${docSnapshot.id}`,
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
          paymentMethod: data.paymentDetails?.paymentMethod || data.paymentMethod || 'cash',
          paymentStatus: data.paymentDetails?.paymentStatus || data.paymentStatus || 'pending',
          paymentDetails: {
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
    } catch (error: unknown) {
      console.error('Error fetching reservations:', error);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchReservations();
    else setLoading(false);
  }, [user]);

  // Filter Effect
  useEffect(() => {
    setFilteredReservations(reservations);
  }, [reservations]);

  // Real-time Stats
  useEffect(() => {
    if (!user) return;
    try {
      const statsRef = doc(db, 'stats', 'dashboard');
      const unsub = onSnapshot(statsRef, (snap) => {
        const data = snap.data() ?? {};
        const today = new Date();
        const monthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
        
        setDashboardStats({
          totalBookings: typeof data.totalBookings === 'number' ? Number(data.totalBookings) : undefined,
          monthlyCount: typeof data.monthly?.[monthKey] === 'number' ? Number(data.monthly[monthKey]) : undefined,
        });
      });
      return () => unsub();
    } catch (err) {
      console.warn('Error setting up stats listener', err);
    }
  }, [user]);

  // Auto Checkout
  useEffect(() => {
    let mounted = true;
    const autoCheckoutAndCleanRooms = async () => {
      const lastRun = sessionStorage.getItem('autoCheckoutLastRun');
      const now = Date.now();
      const FIVE_MINUTES = 5 * 60 * 1000;

      if (lastRun && (now - parseInt(lastRun)) < FIVE_MINUTES) {
        return;
      }

      try {
        const bookingsCol = collection(db, 'bookings');
        const q = query(bookingsCol, where('status', 'in', ['confirmed', 'checked-in']));
        const snap = await getDocs(q);
        const today = new Date();
        today.setHours(0,0,0,0);

        sessionStorage.setItem('autoCheckoutLastRun', now.toString());

        const batch = writeBatch(db);
        let hasUpdates = false;

        for (const d of snap.docs) {
          const data = d.data();
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
            hasUpdates = true;
            batch.update(doc(db, 'bookings', d.id), {
              status: 'checked-out',
              updatedAt: serverTimestamp()
            });

            if (data.roomNumber) {
              // USED HELPER
              updateRoomStatusInBatch(batch, data.roomNumber, 'cleaning', false, null);
              try {
                await createCleaningTicketForCheckout(String(data.roomNumber), d.id, user?.email || user?.uid || 'system');
              } catch (e) {
                console.warn('Failed to create auto cleaning ticket', e);
              }
            }
            
            if (mounted) {
               setReservations(prev => prev.map(r => r.bookingId === d.id ? { ...r, status: 'checked-out' as const } : r));
            }
          }
        }

        if (hasUpdates) {
          await batch.commit();
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


  // --- HANDLERS ---

  // 1. Handle Check-In (Atomic Batch Update)
  const handleCheckInComplete = async (updatedReservation: BookingData) => {
    try {
      const batch = writeBatch(db);
      
      const bookingRef = doc(db, 'bookings', updatedReservation.bookingId);
      batch.update(bookingRef, {
        ...updatedReservation,
        updatedAt: serverTimestamp()
      });

      const prevRoom = reservations.find(r => r.bookingId === updatedReservation.bookingId)?.roomNumber;
      const newRoom = updatedReservation.roomNumber;

      if (prevRoom && prevRoom !== newRoom) {
        // USED HELPER
        updateRoomStatusInBatch(batch, prevRoom, 'available', true, null);
      }

      if (newRoom) {
        // USED HELPER
        updateRoomStatusInBatch(batch, newRoom, 'occupied', false, updatedReservation.bookingId);
      }

      await batch.commit();

      setReservations(prev => prev.map(r => r.bookingId === updatedReservation.bookingId ? updatedReservation : r));
      
      const wasStatus = reservations.find(r => r.bookingId === updatedReservation.bookingId)?.status;
      if (wasStatus !== 'checked-in' && updatedReservation.status === 'checked-in') {
        await updateCurrentGuests(1);
      }
      
      await fetchRooms();

      setShowCheckInModal(false);
      setSelectedReservation(null);

      try {
        await createNotification({
          type: 'reservation',
          title: 'Guest checked in',
          message: `${updatedReservation.userName} • ${updatedReservation.roomName || 'Room'} (${updatedReservation.checkIn}–${updatedReservation.checkOut})`,
          sourceId: updatedReservation.bookingId,
        });
      } catch (e) {
        console.warn('Failed to create check-in notification', e);
      }

    } catch (error) {
      console.error('Error checking in:', error);
      alert('Failed to check in. Please try again.');
    }
  };

  // 2. Handle Walk-In (Atomic Batch Update)
  const handleWalkInBooking = async (newBooking: BookingData) => {
    try {
      const batch = writeBatch(db);

      const bookingId = `BK${Date.now()}${Math.random().toString(36).substring(2, 9)}`;
      const newBookingRef = doc(db, 'bookings', bookingId);

      const bookingPayload = {
        ...newBooking,
        bookingId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      batch.set(newBookingRef, bookingPayload);

      if (newBooking.roomNumber) {
        // USED HELPER
        updateRoomStatusInBatch(batch, newBooking.roomNumber, 'occupied', false, bookingId);
      }

      await batch.commit();

      const bookingWithId = { ...newBooking, bookingId, createdAt: Timestamp.now(), updatedAt: Timestamp.now() };
      setReservations(prev => [bookingWithId, ...prev]);

      await updateBookingCount(1, newBooking.checkIn);
      await updateRevenue(newBooking.totalAmount);
      await updateArrivals(1, newBooking.checkIn);
      if (newBooking.status === 'checked-in') await updateCurrentGuests(1);
      
      await fetchRooms();

      // Upsert a guest profile for this walk-in so loyalty members are sourced from reservations
      try {
        const guestProfilesRef = collection(db, 'guestprofiles');
        const emailToCheck = (newBooking.userEmail || (newBooking as any).email || '').toString().toLowerCase();
        const amountNum = Number(newBooking.totalAmount) || 0;
        const earned = Math.floor(amountNum / 100);

        if (emailToCheck) {
          // Try to find existing profile by email first (any id), then fallback to deterministic ID
          const existingByEmailSnap = await getDocs(query(guestProfilesRef, where('email', '==', emailToCheck), limit(1)));
          let guestRef = existingByEmailSnap.empty
            ? doc(db, 'guestprofiles', `guest_${emailToCheck.replace(/[^a-z0-9]/g, '_')}`)
            : doc(db, 'guestprofiles', existingByEmailSnap.docs[0].id);

          await runTransaction(db, async (tx) => {
            const snap = await tx.get(guestRef as any);
            if (snap.exists()) {
              const current = snap.data() as any;
              const prevTotalBookings = Number(current.totalBookings || 0);
              const prevTotalSpent = Number(current.totalSpent || 0);
              const prevPoints = Number(current.loyaltyPoints || 0);
              const newPoints = prevPoints + earned;
              tx.update(guestRef as any, {
                fullName: newBooking.userName || (newBooking as any).guestName || current.fullName || '',
                firstName: ((newBooking.userName || (newBooking as any).guestName || current.fullName || '').split(' ')[0]) || current.firstName || '',
                lastName: ((newBooking.userName || (newBooking as any).guestName || current.fullName || '').split(' ').slice(1).join(' ')) || current.lastName || '',
                email: emailToCheck || current.email || '',
                phone: (newBooking as any).phone || current.phone || '',
                totalBookings: prevTotalBookings + 1,
                totalSpent: prevTotalSpent + amountNum,
                loyaltyPoints: newPoints,
                membershipTier: computeTierFromPoints(newPoints),
                lastBookingDate: serverTimestamp(),
                updatedAt: serverTimestamp(),
                status: current.status || 'Active'
              });
            } else {
              tx.set(guestRef as any, {
                fullName: newBooking.userName || (newBooking as any).guestName || '',
                firstName: ((newBooking.userName || (newBooking as any).guestName || '').split(' ')[0]) || '',
                lastName: ((newBooking.userName || (newBooking as any).guestName || '').split(' ').slice(1).join(' ')) || '',
                email: emailToCheck,
                phone: (newBooking as any).phone || '',
                totalBookings: 1,
                totalSpent: amountNum,
                loyaltyPoints: earned,
                membershipTier: computeTierFromPoints(earned),
                lastBookingDate: serverTimestamp(),
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                status: 'Active'
              });
            }
          });
        } else {
          // No email available — create a new guest profile document inside a transaction
          const guestRef = doc(guestProfilesRef);
          await runTransaction(db, async (tx) => {
            tx.set(guestRef as any, {
              fullName: newBooking.userName || (newBooking as any).guestName || '',
              firstName: ((newBooking.userName || (newBooking as any).guestName || '').split(' ')[0]) || '',
              lastName: ((newBooking.userName || (newBooking as any).guestName || '').split(' ').slice(1).join(' ')) || '',
              email: '',
              phone: (newBooking as any).phone || '',
              totalBookings: 1,
              totalSpent: amountNum,
              loyaltyPoints: earned,
              membershipTier: computeTierFromPoints(earned),
              lastBookingDate: serverTimestamp(),
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              status: 'Active'
            });
          });
        }
      } catch (err) {
        console.warn('Failed to upsert guest profile from walk-in booking:', err);
      }

      try {
        await createNotification({
          type: 'reservation',
          title: 'New reservation',
          message: `${newBooking.userName} • ${newBooking.roomName || 'Room'} (${newBooking.checkIn}–${newBooking.checkOut})`,
          sourceId: bookingId,
        });
      } catch (e) {
        console.warn('Failed to create reservation notification', e);
      }

    } catch (error) {
      console.error('Error adding walk-in:', error);
      alert('Failed to create booking.');
    }
  };

  // 3. Handle Manual Check-Out (Atomic Batch Update)
  const handleConfirmCheckOut = async (reservation: BookingData) => {
    if (!reservation.bookingId) return;
    
    try {
      const batch = writeBatch(db);

      const bookingRef = doc(db, 'bookings', reservation.bookingId);
      batch.update(bookingRef, {
        status: 'checked-out',
        updatedAt: serverTimestamp()
      });

      if (reservation.roomNumber) {
        // USED HELPER
        updateRoomStatusInBatch(batch, reservation.roomNumber, 'cleaning', false, null);
      }

      await batch.commit();

      setReservations(prev => prev.map(r => 
        r.bookingId === reservation.bookingId ? { ...r, status: 'checked-out' } : r
      ));

      if (reservation.status === 'checked-in') {
        await updateCurrentGuests(-1);
      }

      await fetchRooms();
      
      setShowCheckOutModal(false);
      setSelectedReservation(null);

      try {
        await createNotification({
          type: 'reservation',
          title: 'Guest checked out',
          message: `${reservation.userName} • ${reservation.roomName || 'Room'} (${reservation.checkIn}–${reservation.checkOut})`,
          sourceId: reservation.bookingId,
        });
      } catch (e) {
        console.warn('Failed to create check-out notification', e);
      }

      // Create cleaning ticket for housekeeping
      try {
        if (reservation.roomNumber) {
          await createCleaningTicketForCheckout(String(reservation.roomNumber), reservation.bookingId, user?.email || user?.uid || 'system');
        }
      } catch (e) {
        console.warn('Failed to create cleaning ticket', e);
      }

    } catch (error) {
      console.error('Error confirming check-out:', error);
      alert('Failed to check out.');
    }
  };

  // 4. Handle Cancel (Atomic Batch Update)
  const handleConfirmCancel = async (reservation: BookingData) => {
    if (!reservation.bookingId) return;

    try {
      const batch = writeBatch(db);

      const bookingRef = doc(db, 'bookings', reservation.bookingId);
      batch.update(bookingRef, {
        status: 'cancelled',
        updatedAt: serverTimestamp()
      });

      if (reservation.roomNumber) {
        // USED HELPER
        updateRoomStatusInBatch(batch, reservation.roomNumber, 'available', true, null);
      }

      await batch.commit();

      setReservations(prev => prev.map(r => 
        r.bookingId === reservation.bookingId ? { ...r, status: 'cancelled' } : r
      ));

      if (reservation.status === 'checked-in') {
        await updateCurrentGuests(-1);
      }

      await fetchRooms();

      setShowCancelModal(false);
      setSelectedReservation(null);

      try {
        await createNotification({
          type: 'reservation',
          title: 'Reservation cancelled',
          message: `${reservation.userName} • ${reservation.roomName || 'Room'} (${reservation.checkIn}–${reservation.checkOut})`,
          sourceId: reservation.bookingId,
        });
      } catch (e) {
        console.warn('Failed to create cancel notification', e);
      }

    } catch (error) {
      console.error('Error cancelling:', error);
      alert('Failed to cancel reservation.');
    }
  };

  // 5. Edit Handler
  const handleSaveReservation = async (updatedReservation: BookingData) => {
    try {
      await updateDoc(doc(db, 'bookings', updatedReservation.bookingId), {
        ...updatedReservation,
        updatedAt: serverTimestamp()
      });

      setReservations(prev => prev.map(r => 
        r.bookingId === updatedReservation.bookingId ? updatedReservation : r
      ));

      await fetchRooms();
      setShowEditModal(false);
      setSelectedReservation(null);
    } catch (error) {
      console.error('Error saving edit:', error);
      alert('Failed to update reservation.');
    }
  };

  // --- UI Logic ---
  const handleOpenCheckOutModal = (reservation: BookingData) => {
    setSelectedReservation(reservation);
    setShowCheckOutModal(true);
  };

  const handleOpenCancelModal = (reservation: BookingData) => {
    setSelectedReservation(reservation);
    setShowCancelModal(true);
  };

  const statusCounts = {
    all: dashboardStats?.monthlyCount ?? reservations.length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    'checked-in': reservations.filter(r => r.status === 'checked-in').length,
    'checked-out': reservations.filter(r => r.status === 'checked-out').length,
  };

  return (
    <RoomsContext.Provider value={{ rooms, loading: roomsLoading, refreshRooms: fetchRooms }}>
      <div className="min-h-screen bg-[#F9F6EE]">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <FrontDeskStatsCard title="Total Reservations" value={statusCounts.all} icon="📋" color="blue" />
            <FrontDeskStatsCard title="Pending Check-in" value={statusCounts.confirmed} icon="⏳" color="yellow" />
            <FrontDeskStatsCard title="Checked In" value={statusCounts['checked-in']} icon="🏨" color="green" />
            <FrontDeskStatsCard title="Checked Out" value={statusCounts['checked-out']} icon="✅" color="gray" />
          </div>

          {!user ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
              <p className="text-gray-500">Please log in to view reservations.</p>
            </div>
          ) : loading ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
              <p className="text-gray-500">Loading reservations...</p>
            </div>
          ) : (
            <ModernReservationsTable
              reservations={filteredReservations}
              onRowClick={(reservation: BookingData) => {
                setSelectedReservation(reservation);
                setShowDetailsModal(true);
              }}
              onCheckIn={(res) => {
                setSelectedReservation(res);
                setShowCheckInModal(true);
              }}
              onCheckOut={handleOpenCheckOutModal}
              onEdit={(res) => {
                setSelectedReservation(res);
                setShowEditModal(true);
              }}
              onCancel={handleOpenCancelModal}
              onAddReservation={handleWalkInBooking}
            />
          )}
        </div>

        {/* Modals */}
        {showCheckInModal && selectedReservation && (
          <CheckInModal
            isOpen={showCheckInModal}
            onClose={() => {
              setShowCheckInModal(false);
              setSelectedReservation(null);
            }}
            reservation={selectedReservation}
            onCheckIn={handleCheckInComplete}
          />
        )}

        {showDetailsModal && selectedReservation && (
          <ReservationDetailsModal
            isOpen={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            reservation={selectedReservation}
            onEdit={(res) => {
              setSelectedReservation(res);
              setShowEditModal(true);
            }}
            onCheckIn={(res) => {
              setSelectedReservation(res);
              setShowCheckInModal(true);
            }}
            onCheckOut={handleOpenCheckOutModal}
            onCancel={handleOpenCancelModal}
          />
        )}

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

        {showCheckOutModal && selectedReservation && (
          <ConfirmCheckOutModal
            isOpen={showCheckOutModal}
            onClose={() => setShowCheckOutModal(false)}
            reservation={selectedReservation}
            onConfirmCheckOut={handleConfirmCheckOut}
          />
        )}

        {showCancelModal && selectedReservation && (
          <ConfirmCancelModal
            isOpen={showCancelModal}
            onClose={() => setShowCancelModal(false)}
            reservation={selectedReservation}
            onConfirmCancel={handleConfirmCancel}
          />
        )}
      </div>
    </RoomsContext.Provider>
  );
};

// Compute membership tier from points (same rules as loyalty service)
const computeTierFromPoints = (points: number) => {
  if (points >= 7000) return 'Platinum';
  if (points >= 3000) return 'Gold';
  if (points >= 1000) return 'Silver';
  return 'Bronze';
};