import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Room } from './Room-backendLogic/roomService';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../../config/firebase';

interface ViewRoomDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
  onEdit?: (room: Room) => void;
}

// --- Icons ---
const IconBed = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const IconInfo = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const IconUser = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;

// --- Helper: Status Badge ---
const getStatusBadge = (status: string) => {
  const config = {
    available: { bg: 'bg-green-100', text: 'text-green-800', label: 'Available', dot: 'bg-green-400' },
    occupied: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Occupied', dot: 'bg-orange-400' },
    maintenance: { bg: 'bg-red-100', text: 'text-red-800', label: 'Maintenance', dot: 'bg-red-400' },
    cleaning: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Cleaning', dot: 'bg-blue-400' },
  }[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status, dot: 'bg-gray-400' };

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
      <div className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
      <span className="capitalize">{config.label}</span>
    </div>
  );
};

// --- Helper: Info Item ---
const InfoItem: React.FC<{ label: string; value: string | number | React.ReactNode }> = ({ label, value }) => (
  <div>
    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</dt>
    <dd className="mt-1 text-sm font-semibold text-gray-900">{value || "—"}</dd>
  </div>
);

export const ViewRoomDetailsModal: React.FC<ViewRoomDetailsModalProps> = ({
  isOpen,
  onClose,
  room,
  onEdit
}) => {
  const [guestDetails, setGuestDetails] = useState<{ name: string; checkIn: string; checkOut: string } | null>(null);
  const [loadingGuest, setLoadingGuest] = useState(false);

  // Prevent background scroll
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  }, [isOpen]);

  // Fetch Occupant Details when modal opens for an occupied room
  useEffect(() => {
    if (isOpen && room && room.status === 'occupied') {
      const fetchOccupancy = async () => {
        setLoadingGuest(true);
        try {
          // Query the bookings collection for the active reservation
          const q = query(
            collection(db, 'bookings'),
            where('roomNumber', '==', room.roomNumber),
            where('status', '==', 'checked-in'),
            limit(1)
          );
          
          const snapshot = await getDocs(q);
          
          if (!snapshot.empty) {
            const data = snapshot.docs[0].data();
            setGuestDetails({
              name: data.userName || 'Unknown Guest',
              checkIn: data.checkIn,
              checkOut: data.checkOut
            });
          } else {
            setGuestDetails(null);
          }
        } catch (error) {
          console.error("Error fetching guest details:", error);
          setGuestDetails(null);
        } finally {
          setLoadingGuest(false);
        }
      };

      fetchOccupancy();
    } else {
      setGuestDetails(null);
    }
  }, [isOpen, room]);

  // Helper to format date string
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  if (!isOpen || !room) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center" role="dialog" aria-modal="true">
      {/* Overlay */}
      <div 
        className="fixed inset-0 transition-opacity duration-200 bg-black/45 backdrop-blur-lg"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-white/95 shadow-2xl ring-1 ring-black/5 flex flex-col">
        
        {/* Header */}
        <div className="relative px-6 pt-6 pb-5 bg-white border-b border-gray-100 rounded-t-3xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Room Number Display */}
                <div className="relative">
                <div className="flex items-center justify-center w-14 h-14 text-white rounded-2xl shadow-lg bg-gradient-to-br from-[#82A33D] to-[#6d8a33]">
                  <span className="text-xl font-bold">{room.roomNumber}</span>
                </div>
                <div className="absolute -inset-1 bg-[#82A33D] blur opacity-20 rounded-2xl"></div>
              </div>
              
              <div className="flex flex-col">
                {/* Display Name Priority: Name -> Type */}
                <h2 className="text-2xl font-bold text-gray-900">
                  {room.roomName || room.roomType}
                </h2>
                
                <div className="flex items-center mt-1 space-x-2">
                  {/* If Name exists, show Type as a badge */}
                  {room.roomName && (
                    <span className="text-xs font-bold text-[#82A33D] uppercase tracking-wide bg-[#82A33D]/10 px-2 py-1 rounded-md border border-[#82A33D]/20">
                      {room.roomType}
                    </span>
                  )}
                  
                  {/* Status */}
                  {getStatusBadge(room.status)}
                  
                  <span className="text-xs text-gray-400 ml-2">ID: {room.id}</span>
                </div>
              </div>
            </div>
            
                <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full hover:bg-gray-100 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Price & Capacity */}
            <div className="p-5 bg-white rounded-2xl ring-1 ring-black/5 shadow-sm">
              <div className="flex items-center space-x-2 mb-4 text-[#82A33D]">
                <IconBed />
                <h4 className="font-semibold">Details</h4>
              </div>
              <div className="space-y-4">
                <InfoItem label="Base Price" value={`₱${room.basePrice.toLocaleString()}`} />
                <InfoItem label="Max Guests" value={`${room.maxGuests} Persons`} />
                {/* Note: roomSize from DB might be mapped to room.roomSize in service */}
                <InfoItem label="Room Size" value={room.roomSize} />
                <InfoItem label="Floor" value={room.floor} />
              </div>
            </div>

            {/* Amenities */}
            <div className="md:col-span-2 p-5 bg-white rounded-2xl ring-1 ring-black/5 shadow-sm">
              <div className="flex items-center space-x-2 mb-4 text-[#82A33D]">
                <IconInfo />
                <h4 className="font-semibold">Amenities & Description</h4>
              </div>
              <div className="space-y-4">
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Amenities</dt>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities && room.amenities.length > 0 ? (
                      room.amenities.map((amenity, idx) => (
                        <span key={idx} className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {amenity}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400 italic">No amenities listed</span>
                    )}
                  </div>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Description</dt>
                  <p className="text-sm text-gray-600 leading-relaxed">{room.description || "No description available."}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Current Occupancy (Dynamic Fetch) */}
          {room.status === 'occupied' && (
            <div className="p-5 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-100">
              <div className="flex items-center space-x-2 mb-4 text-orange-800">
                <IconUser />
                <h4 className="font-semibold">Current Occupancy</h4>
              </div>
              
              {loadingGuest ? (
                <div className="flex items-center space-x-2 text-sm text-orange-600 py-2">
                  <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Fetching booking details...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <InfoItem 
                     label="Guest Name" 
                     value={guestDetails?.name || room.guest || "Unknown"} 
                   />
                   <InfoItem 
                     label="Check In" 
                     value={formatDate(guestDetails?.checkIn || room.checkIn)} 
                   />
                   <InfoItem 
                     label="Check Out" 
                     value={formatDate(guestDetails?.checkOut || room.checkOut)} 
                   />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-white border-t border-gray-100 flex-shrink-0">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-2xl hover:bg-gray-50 shadow-sm transition"
            >
              Close
            </button>
            {onEdit && (
              <button
                onClick={() => {
                  onEdit(room);
                  onClose();
                }}
                className="px-5 py-2.5 text-sm font-bold text-white bg-[#82A33D] border border-[#82A33D]-100 rounded-2xl hover:bg-[#82A33D]-100 shadow-sm transition"
              >
                Edit Room
              </button>
            )}
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
};