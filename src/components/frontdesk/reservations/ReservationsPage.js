import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, serverTimestamp, query, Timestamp, onSnapshot, orderBy, limit, writeBatch, where } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useAuth } from '../../../contexts/AuthContext';
// --- Import from the new separate file ---
import { RoomsContext } from './ReservationsContext';
import { CheckInModal } from './CheckInModal';
import { ReservationDetailsModal } from './ReservationDetailsModal';
import { EditReservationModal } from './EditReservationModal';
import { ConfirmCheckOutModal } from './ConfirmCheckOutModal';
import { ConfirmCancelModal } from './ConfirmCancelModal';
import FrontDeskStatsCard from '../shared/FrontDeskStatsCard';
import ModernReservationsTable from './ModernReservationsTable';
import { updateBookingCount, updateRevenue, updateArrivals, updateCurrentGuests } from '../../../lib/statsHelpers';
// --- HELPER FOR ROOM UPDATES ---
const updateRoomStatusInBatch = (batch, roomId, status, isActive, currentReservation) => {
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
    const [reservations, setReservations] = useState([]);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [selectedReservation, setSelectedReservation] = useState(null);
    // Master Room List State
    const [rooms, setRooms] = useState([]);
    const [roomsLoading, setRoomsLoading] = useState(true);
    // Modal States
    const [showCheckInModal, setShowCheckInModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCheckOutModal, setShowCheckOutModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dashboardStats, setDashboardStats] = useState(null);
    // --- Fetch Rooms ---
    const fetchRooms = async () => {
        setRoomsLoading(true);
        try {
            const snap = await getDocs(collection(db, 'rooms'));
            const roomsData = snap.docs.map(d => ({
                id: d.id,
                ...d.data()
            }));
            setRooms(roomsData);
        }
        catch (err) {
            console.error("Failed to fetch rooms:", err);
        }
        finally {
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
                const parseDate = (dateField) => {
                    if (!dateField)
                        return '';
                    // Check if it's a Firestore Timestamp (has toDate method)
                    if (typeof dateField === 'object' && 'toDate' in dateField) {
                        return dateField.toDate().toISOString().split('T')[0];
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
                };
            });
            setReservations(bookingsData);
        }
        catch (error) {
            console.error('Error fetching reservations:', error);
            setReservations([]);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (user)
            fetchReservations();
        else
            setLoading(false);
    }, [user]);
    // Filter Effect
    useEffect(() => {
        setFilteredReservations(reservations);
    }, [reservations]);
    // Real-time Stats
    useEffect(() => {
        if (!user)
            return;
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
        }
        catch (err) {
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
                today.setHours(0, 0, 0, 0);
                sessionStorage.setItem('autoCheckoutLastRun', now.toString());
                const batch = writeBatch(db);
                let hasUpdates = false;
                for (const d of snap.docs) {
                    const data = d.data();
                    let checkOutVal = data.checkOut;
                    let checkOutDate = null;
                    if (checkOutVal && typeof checkOutVal === 'string') {
                        const parsed = new Date(checkOutVal);
                        if (!isNaN(parsed.getTime()))
                            checkOutDate = parsed;
                    }
                    else if (checkOutVal?.toDate) {
                        checkOutDate = checkOutVal.toDate();
                    }
                    if (!checkOutDate)
                        continue;
                    const co = new Date(checkOutDate);
                    co.setHours(0, 0, 0, 0);
                    if (co < today) {
                        hasUpdates = true;
                        batch.update(doc(db, 'bookings', d.id), {
                            status: 'checked-out',
                            updatedAt: serverTimestamp()
                        });
                        if (data.roomNumber) {
                            // USED HELPER
                            updateRoomStatusInBatch(batch, data.roomNumber, 'cleaning', false, null);
                        }
                        if (mounted) {
                            setReservations(prev => prev.map(r => r.bookingId === d.id ? { ...r, status: 'checked-out' } : r));
                        }
                    }
                }
                if (hasUpdates) {
                    await batch.commit();
                }
            }
            catch (err) {
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
    const handleCheckInComplete = async (updatedReservation) => {
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
        }
        catch (error) {
            console.error('Error checking in:', error);
            alert('Failed to check in. Please try again.');
        }
    };
    // 2. Handle Walk-In (Atomic Batch Update)
    const handleWalkInBooking = async (newBooking) => {
        try {
            const batch = writeBatch(db);
            const newBookingRef = doc(collection(db, 'bookings'));
            const bookingId = newBookingRef.id;
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
            if (newBooking.status === 'checked-in')
                await updateCurrentGuests(1);
            await fetchRooms();
        }
        catch (error) {
            console.error('Error adding walk-in:', error);
            alert('Failed to create booking.');
        }
    };
    // 3. Handle Manual Check-Out (Atomic Batch Update)
    const handleConfirmCheckOut = async (reservation) => {
        if (!reservation.bookingId)
            return;
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
            setReservations(prev => prev.map(r => r.bookingId === reservation.bookingId ? { ...r, status: 'checked-out' } : r));
            if (reservation.status === 'checked-in') {
                await updateCurrentGuests(-1);
            }
            await fetchRooms();
            setShowCheckOutModal(false);
            setSelectedReservation(null);
        }
        catch (error) {
            console.error('Error confirming check-out:', error);
            alert('Failed to check out.');
        }
    };
    // 4. Handle Cancel (Atomic Batch Update)
    const handleConfirmCancel = async (reservation) => {
        if (!reservation.bookingId)
            return;
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
            setReservations(prev => prev.map(r => r.bookingId === reservation.bookingId ? { ...r, status: 'cancelled' } : r));
            if (reservation.status === 'checked-in') {
                await updateCurrentGuests(-1);
            }
            await fetchRooms();
            setShowCancelModal(false);
            setSelectedReservation(null);
        }
        catch (error) {
            console.error('Error cancelling:', error);
            alert('Failed to cancel reservation.');
        }
    };
    // 5. Edit Handler
    const handleSaveReservation = async (updatedReservation) => {
        try {
            await updateDoc(doc(db, 'bookings', updatedReservation.bookingId), {
                ...updatedReservation,
                updatedAt: serverTimestamp()
            });
            setReservations(prev => prev.map(r => r.bookingId === updatedReservation.bookingId ? updatedReservation : r));
            await fetchRooms();
            setShowEditModal(false);
            setSelectedReservation(null);
        }
        catch (error) {
            console.error('Error saving edit:', error);
            alert('Failed to update reservation.');
        }
    };
    // --- UI Logic ---
    const handleOpenCheckOutModal = (reservation) => {
        setSelectedReservation(reservation);
        setShowCheckOutModal(true);
    };
    const handleOpenCancelModal = (reservation) => {
        setSelectedReservation(reservation);
        setShowCancelModal(true);
    };
    const statusCounts = {
        all: dashboardStats?.monthlyCount ?? reservations.length,
        confirmed: reservations.filter(r => r.status === 'confirmed').length,
        'checked-in': reservations.filter(r => r.status === 'checked-in').length,
        'checked-out': reservations.filter(r => r.status === 'checked-out').length,
    };
    return (_jsx(RoomsContext.Provider, { value: { rooms, loading: roomsLoading, refreshRooms: fetchRooms }, children: _jsxs("div", { className: "min-h-screen bg-[#F9F6EE]", children: [_jsxs("div", { className: "fixed inset-0 pointer-events-none", children: [_jsx("div", { className: "absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 rounded-full blur-3xl animate-pulse opacity-30" }), _jsx("div", { className: "absolute top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl animate-pulse delay-1000 opacity-25" }), _jsx("div", { className: "absolute bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 rounded-full blur-3xl animate-pulse delay-2000 opacity-20" }), _jsx("div", { className: "absolute inset-0 opacity-5", children: _jsx("div", { className: "absolute inset-0", style: {
                                    backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(134, 134, 134, 0.1) 1px, transparent 0)',
                                    backgroundSize: '50px 50px'
                                } }) })] }), _jsxs("div", { className: "relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full", children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6", children: [_jsx(FrontDeskStatsCard, { title: "Total Reservations", value: statusCounts.all, icon: "\uD83D\uDCCB", color: "blue" }), _jsx(FrontDeskStatsCard, { title: "Pending Check-in", value: statusCounts.confirmed, icon: "\u23F3", color: "yellow" }), _jsx(FrontDeskStatsCard, { title: "Checked In", value: statusCounts['checked-in'], icon: "\uD83C\uDFE8", color: "green" }), _jsx(FrontDeskStatsCard, { title: "Checked Out", value: statusCounts['checked-out'], icon: "\u2705", color: "gray" })] }), !user ? (_jsx("div", { className: "bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center", children: _jsx("p", { className: "text-gray-500", children: "Please log in to view reservations." }) })) : loading ? (_jsx("div", { className: "bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center", children: _jsx("p", { className: "text-gray-500", children: "Loading reservations..." }) })) : (_jsx(ModernReservationsTable, { reservations: filteredReservations, onRowClick: (reservation) => {
                                setSelectedReservation(reservation);
                                setShowDetailsModal(true);
                            }, onCheckIn: (res) => {
                                setSelectedReservation(res);
                                setShowCheckInModal(true);
                            }, onCheckOut: handleOpenCheckOutModal, onEdit: (res) => {
                                setSelectedReservation(res);
                                setShowEditModal(true);
                            }, onCancel: handleOpenCancelModal, onAddReservation: handleWalkInBooking }))] }), showCheckInModal && selectedReservation && (_jsx(CheckInModal, { isOpen: showCheckInModal, onClose: () => {
                        setShowCheckInModal(false);
                        setSelectedReservation(null);
                    }, reservation: selectedReservation, onCheckIn: handleCheckInComplete })), showDetailsModal && selectedReservation && (_jsx(ReservationDetailsModal, { isOpen: showDetailsModal, onClose: () => setShowDetailsModal(false), reservation: selectedReservation, onEdit: (res) => {
                        setSelectedReservation(res);
                        setShowEditModal(true);
                    }, onCheckIn: (res) => {
                        setSelectedReservation(res);
                        setShowCheckInModal(true);
                    }, onCheckOut: handleOpenCheckOutModal, onCancel: handleOpenCancelModal })), showEditModal && selectedReservation && (_jsx(EditReservationModal, { isOpen: showEditModal, onClose: () => {
                        setShowEditModal(false);
                        setSelectedReservation(null);
                    }, reservation: selectedReservation, onSave: handleSaveReservation })), showCheckOutModal && selectedReservation && (_jsx(ConfirmCheckOutModal, { isOpen: showCheckOutModal, onClose: () => setShowCheckOutModal(false), reservation: selectedReservation, onConfirmCheckOut: handleConfirmCheckOut })), showCancelModal && selectedReservation && (_jsx(ConfirmCancelModal, { isOpen: showCancelModal, onClose: () => setShowCancelModal(false), reservation: selectedReservation, onConfirmCancel: handleConfirmCancel }))] }) }));
};
