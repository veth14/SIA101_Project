import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Room } from './Room-backendLogic/roomService'; 

interface EditRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
  onSave: (roomData: Partial<Room>) => Promise<void>;
}

// --- Icon Components ---
const IconBed = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
);
const IconTag = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
);
const IconSave = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
);

export const EditRoomModal: React.FC<EditRoomModalProps> = ({
  isOpen,
  onClose,
  room,
  onSave
}) => {
  // Form State
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomName: '', 
    roomType: '',
    basePrice: 0,
    maxGuests: 2,
    roomSize: '',
    status: 'available',
    description: '',
    amenities: [] as string[]
  });

  const [amenityInput, setAmenityInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Prevent background scroll
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  }, [isOpen]);

  // Populate Data on Open
  useEffect(() => {
    if (isOpen && room) {
      setFormData({
        roomNumber: room.roomNumber,
        roomName: room.roomName || '', 
        roomType: room.roomType,
        basePrice: room.basePrice,
        maxGuests: room.maxGuests,
        roomSize: room.roomSize || '',
        status: room.status,
        description: room.description || '',
        amenities: room.amenities || room.features || []
      });
      setErrors({});
    }
  }, [isOpen, room]);

  const handleAddAmenity = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && amenityInput.trim()) {
      e.preventDefault();
      if (!formData.amenities.includes(amenityInput.trim())) {
        setFormData(prev => ({ ...prev, amenities: [...prev.amenities, amenityInput.trim()] }));
      }
      setAmenityInput('');
    }
  };

  const removeAmenity = (tag: string) => {
    setFormData(prev => ({ ...prev, amenities: prev.amenities.filter(a => a !== tag) }));
  };

  const handleSubmit = async () => {
    if (!room) return;

    setLoading(true);
    try {
      // We only send the fields we actually allowed editing for, plus the ID
      // However, sending the whole object is usually safer to ensure consistency,
      // as long as the backend handles it.
      const payload = { ...formData, id: room.id };
      // @ts-ignore
      await onSave(payload);
      onClose();
    } catch (error) {
      console.error("Failed to save room", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !room) return null;

  // Helper class for disabled inputs to ensure consistency
  const disabledInputClass = "w-full px-3 py-2 border border-gray-200 bg-gray-100 text-gray-500 rounded-md cursor-not-allowed";

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
              <div className="flex items-center justify-center w-12 h-12 text-white rounded-full shadow-sm bg-emerald-600">
                <IconBed />
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold md:text-2xl text-emerald-700">
                  Edit Room Details
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Updating {formData.roomName || formData.roomType} - Room {formData.roomNumber}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="absolute flex items-center justify-center rounded-md top-4 right-4 w-9 h-9 text-emerald-700 bg-emerald-50 ring-1 ring-emerald-100 hover:bg-emerald-100"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Main Info */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Basic Info Card */}
              <div className="p-5 bg-white rounded-2xl ring-1 ring-black/5">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Room Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Room Number - FIXED */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Room Number</label>
                    <input 
                      type="text"
                      value={formData.roomNumber}
                      disabled
                      className={disabledInputClass}
                    />
                  </div>

                  {/* Room Name - READ ONLY */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Display Name</label>
                    <input 
                      type="text" 
                      value={formData.roomName}
                      disabled
                      className={disabledInputClass}
                    />
                  </div>

                  {/* Room Type - READ ONLY */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Room Type</label>
                    <input 
                        type="text" 
                        value={formData.roomType}
                        disabled
                        className={disabledInputClass}
                    />
                  </div>

                  {/* Base Price - READ ONLY */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Base Price (₱)</label>
                    <input 
                      type="number"
                      value={formData.basePrice}
                      disabled
                      className={disabledInputClass}
                    />
                  </div>

                  {/* Status - EDITABLE */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Operational Status</label>
                    <select 
                      value={formData.status}
                      // @ts-ignore
                      onChange={e => setFormData({...formData, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="cleaning">Cleaning</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Amenities Section - EDITABLE */}
              <div className="p-5 bg-white rounded-2xl ring-1 ring-black/5">
                <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                  <IconTag />
                  <span className="ml-2">Amenities & Features</span>
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Add Amenities</label>
                    <input 
                      type="text"
                      value={amenityInput}
                      onChange={e => setAmenityInput(e.target.value)}
                      onKeyDown={handleAddAmenity}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      placeholder="Type feature and press Enter (e.g. 'Smart TV')"
                    />
                    <p className="text-xs text-gray-500 mt-1">Press Enter to add a tag</p>
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-gray-50 rounded-xl border border-gray-100">
                    {formData.amenities.length === 0 && <span className="text-sm text-gray-400 italic">No amenities added yet.</span>}
                    {formData.amenities.map((amenity, idx) => (
                      <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm">
                        {amenity}
                        <button 
                            onClick={() => removeAmenity(amenity)} 
                            className="ml-2 text-emerald-600 hover:text-emerald-900 hover:bg-emerald-200 rounded-full w-4 h-4 flex items-center justify-center"
                        >
                            ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Details */}
            <div className="space-y-6">
              <div className="p-5 bg-white rounded-2xl ring-1 ring-black/5">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h4>
                <div className="space-y-4">
                  {/* Max Guests - READ ONLY */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Max Guests</label>
                    <input 
                        type="number" 
                        value={formData.maxGuests}
                        disabled
                        className={disabledInputClass}
                      />
                  </div>
                  
                  {/* Room Size - READ ONLY */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Room Size (Fixed)</label>
                    <input 
                      type="text"
                      value={formData.roomSize}
                      disabled
                      className={disabledInputClass}
                      placeholder="N/A"
                    />
                  </div>
                </div>
              </div>

              {/* Description - EDITABLE */}
              <div className="p-5 bg-white rounded-2xl ring-1 ring-black/5">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Description
                </h4>
                <textarea 
                  rows={5}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder="Enter a description for this room..."
                />
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white border-t border-gray-100 flex-shrink-0">
          <div className="flex flex-col justify-end gap-3 sm:flex-row sm:items-center">
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 bg-white/80 rounded-2xl shadow-sm hover:bg-gray-50 transition transform"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center justify-center gap-3 px-5 py-2.5 text-sm font-semibold text-white rounded-3xl bg-gradient-to-br from-[#82A33D] to-[#6d8a33] shadow-lg hover:scale-[1.02] transform transition-all ring-1 ring-black/5 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (
                <>
                  <IconSave />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
};