import React, { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Invoice } from './InvoiceList';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvoiceCreated: (invoice: Invoice) => void;
}

const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({ 
  isOpen, 
  onClose, 
  onInvoiceCreated 
}) => {
  const [invoiceData, setInvoiceData] = useState({
    guestName: '',
    roomNumber: '',
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // tomorrow
    email: '',
    phone: '',
    address: '',
    notes: '',
  });

  const [items, setItems] = useState([
    {
      id: '1',
      description: '',
      category: 'room' as const,
      quantity: 1,
      unitPrice: 0,
      total: 0
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [linkedBookingId, setLinkedBookingId] = useState<string | null>(null);
  const [isStayOpen, setIsStayOpen] = useState(false);
  const [linkInput, setLinkInput] = useState('');

  const handleClose = useCallback(() => {
    // Reset form data when closing modal
    setInvoiceData({
      guestName: '',
      roomNumber: '',
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      email: '',
      phone: '',
      address: '',
      notes: '',
    });
    setItems([{
      id: '1',
      description: '',
      category: 'room',
      quantity: 1,
      unitPrice: 0,
      total: 0
    }]);
    setIsCreating(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleOpenLinking = () => {
    setIsLinking(true);
  };

  const handleCloseLinking = () => {
    setIsLinking(false);
  };

  const handleLinkById = (id: string) => {
    if (!id) return;
    // For client-side quick link, just set the linkedBookingId and leave stay fields editable
    setLinkedBookingId(id);
    setIsLinking(false);
    setIsStayOpen(true);
  };

  const handleUsePendingBooking = () => {
    try {
      const raw = sessionStorage.getItem('pendingBooking');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const bookingData = parsed.bookingData || parsed;
      if (!bookingData) return;

      // Fill stay-related fields from pending booking
      setInvoiceData(prev => ({
        ...prev,
        guestName: bookingData.userName || prev.guestName,
        roomNumber: bookingData.roomName || prev.roomNumber || '',
        checkIn: bookingData.checkIn || prev.checkIn,
        checkOut: bookingData.checkOut || prev.checkOut,
      }));

      setLinkedBookingId(bookingData.bookingId || 'pending');
      setIsLinking(false);
      setIsStayOpen(true);
    } catch (err) {
      console.error('Failed to parse pending booking', err);
    }
  };

  const handleUnlink = () => {
    setLinkedBookingId(null);
    // keep stay fields as reference but allow editing
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Date handling: prevent selecting past dates
    if (name === 'checkIn') {
      // if user sets checkIn in the past, ignore
      const today = getTodayDate();
      if (value < today) return;
      setInvoiceData(prev => {
        const next = { ...prev, checkIn: value };
        // Ensure checkOut is not before checkIn
        if (new Date(next.checkOut) < new Date(value)) {
          next.checkOut = value;
        }
        return next;
      });
      return;
    }

    if (name === 'checkOut') {
      const today = getTodayDate();
      // disallow selecting a checkOut date before today
      if (value < today) return;
      setInvoiceData(prev => {
        const next = { ...prev, checkOut: value };
        // Ensure checkOut is not before checkIn
        if (new Date(value) < new Date(next.checkIn)) {
          next.checkOut = next.checkIn;
        }
        return next;
      });
      return;
    }

    setInvoiceData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    setItems(prev => prev.map((item, i) => {
      if (i === index) {
        const updatedItem: any = { ...item };

        // Update field but keep unitPrice/quantity flexible to allow clearing input
        if (field === 'quantity') {
          // allow temporary empty string while typing
          if (value === '') {
            updatedItem.quantity = '';
          } else {
            updatedItem.quantity = Number(value) || 0;
          }
        } else if (field === 'unitPrice') {
          // allow temporary empty string while typing
          if (value === '') {
            updatedItem.unitPrice = '';
          } else {
            updatedItem.unitPrice = Number(value) || 0;
          }
        } else {
          updatedItem[field] = value;
        }

        // If category changed away from 'room', clear roomId (defensive)
        if (field === 'category' && value !== 'room') {
          delete updatedItem.roomId;
        }

        // Recalculate total using numeric coercion; empty strings become 0
        const qtyNum = Number(updatedItem.quantity || 0);
        const priceNum = Number(updatedItem.unitPrice || 0);
        updatedItem.total = qtyNum * priceNum;

        return updatedItem as typeof item;
      }
      return item;
    }));
  };

  ;

  const addItem = () => {
    setItems(prev => [...prev, {
      id: String(prev.length + 1),
      description: '',
      category: 'room',
      quantity: 1,
      unitPrice: 0,
      total: 0
    }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateNights = () => {
    const checkInDate = new Date(invoiceData.checkIn);
    const checkOutDate = new Date(invoiceData.checkOut);
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const generateUniqueId = () => {
    return `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSubmitInvoice = async () => {
    if (!isFormValid()) return;
    
    setIsCreating(true);
    
    // Simulate submission API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create the final invoice directly
    const submittedInvoice: Invoice = {
      id: generateUniqueId(),
      guestName: invoiceData.guestName,
      roomNumber: invoiceData.roomNumber,
      checkIn: invoiceData.checkIn,
      checkOut: invoiceData.checkOut,
      linkedBookingId: linkedBookingId ?? undefined,
      status: 'pending',
      totalAmount: calculateTotal(),
      items: items
        .filter(item => item.description && Number((item as any).unitPrice) > 0)
        .map(item => ({ ...item, unitPrice: Number((item as any).unitPrice) }))
    };
    
    setIsCreating(false);
    
    // Call the callback to notify parent component
    onInvoiceCreated(submittedInvoice);
    
    // Close the modal
    handleClose();
  };



  const isFormValid = () => {
    return invoiceData.guestName && 
           items.some(item => item.description && Number((item as any).unitPrice) > 0);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center" role="dialog" aria-modal="true">
      {/* Overlay */}
      <div
        className="fixed inset-0 transition-opacity duration-200 bg-black/45 backdrop-blur-lg"
        onClick={handleClose}
        aria-label="Close overlay" 
      />

      {/* Modal Card */}
  <div className="relative z-10 w-full max-w-5xl max-h-[80vh] mx-6 my-6 overflow-hidden rounded-3xl bg-white/95 shadow-2xl ring-1 ring-black/5 pb-2 flex flex-col">
  {/* Header */}
  <div className="relative px-6 py-4 bg-white border-b border-gray-100 rounded-t-3xl">
          <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 text-white rounded-full shadow-sm bg-emerald-600">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M9 2h6l4 4v12a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2z" />
                  <path d="M9 11h6M9 15h4" stroke="rgba(255,255,255,0.9)" strokeWidth="1" fill="none" />
                </svg>
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-emerald-700 md:text-2xl">Create New Invoice</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Generate a new invoice for guest services. <span className="font-medium text-gray-700">Note:</span> Room charges are managed by Front Desk/Bookings and should not be added here.
                </p>
              </div>
            </div>
            <div aria-hidden />
          </div>

          <button
            onClick={handleClose}
            aria-label="Close"
            className="absolute flex items-center justify-center rounded-md top-4 right-4 w-9 h-9 text-emerald-700 bg-emerald-50 ring-1 ring-emerald-100"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
  <div className="p-6 pb-10 overflow-y-auto overflow-x-hidden flex-1 min-h-0 space-y-6">
          {/* Top info banner */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 ring-1 ring-black/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl text-emerald-600">💳</div>
                <div>
                  <h3 className="text-base font-semibold text-emerald-700">Invoice Summary</h3>
                  <p className="text-sm text-emerald-600">Review the current invoice total before submitting</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-gray-500">Current Total</p>
                <p className="text-2xl font-bold text-gray-900">₱{calculateTotal().toFixed(2)}</p>
              </div>
            </div>
          </div>
          {/* Guest Information + Stay Details */}
          <div className="grid grid-cols-1 gap-8 mb-4 md:grid-cols-2">
            <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <h4 className="flex items-center mb-4 text-lg font-semibold ">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Guest Information
              </h4>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-600">Guest Name *</label>
                  <input
                    type="text"
                    name="guestName"
                    value={invoiceData.guestName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 transition-colors border rounded-lg border-gray-200 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                    placeholder="Enter guest name"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-600">Room Number</label>
                  <input
                    type="text"
                    name="roomNumber"
                    value={invoiceData.roomNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 transition-colors border rounded-lg border-gray-200 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                    placeholder="Optional — e.g., 201 (for reference)"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-600">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={invoiceData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 transition-colors border rounded-lg border-gray-200 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                    placeholder="guest@email.com"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-600">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={invoiceData.phone}
                    onChange={handleInputChange}
                      className="w-full px-4 py-3 transition-colors border rounded-lg border-gray-200 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                    placeholder="+63 XXX XXX XXXX"
                  />
                </div>
              </div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="flex items-center text-lg font-semibold">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h8a2 2 0 012 2v4h1a2 2 0 012 2v1l-1 5-2 5H3l-1-5-1-5v-1a2 2 0 012-2h1z" />
                  </svg>
                  Stay Details
                </h4>
                <div className="flex items-center gap-3">
                  {linkedBookingId ? (
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-full">Linked: {linkedBookingId}</span>
                      <button onClick={handleUnlink} className="text-sm text-gray-600 hover:underline">Unlink</button>
                    </div>
                  ) : (
                    <>
                      <button onClick={handleOpenLinking} className="px-3 py-1 text-sm font-medium text-white bg-emerald-600 rounded-md hover:brightness-95">Link booking</button>
                      <button onClick={() => setIsStayOpen(s => !s)} className="text-sm text-gray-600">{isStayOpen ? 'Collapse' : 'Expand'}</button>
                    </>
                  )}
                </div>
              </div>

              {!isStayOpen && (
                <div className="text-sm text-gray-500">No booking linked — click "Link booking" to attach this invoice to a reservation (optional).</div>
              )}

              {isStayOpen && (
                <div className="grid grid-cols-1 gap-4 mt-3">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-600">Check-in Date</label>
                      <input
                        type="date"
                        name="checkIn"
                        value={invoiceData.checkIn}
                        min={getTodayDate()}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 transition-colors border rounded-md border-gray-200 focus:ring-2 focus:ring-heritage-green-200 focus:border-heritage-green-400"
                        readOnly={!!linkedBookingId}
                      />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-600">Check-out Date</label>
                    <input
                      type="date"
                      name="checkOut"
                      value={invoiceData.checkOut}
                      min={invoiceData.checkIn || getTodayDate()}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 transition-colors border rounded-md border-gray-200 focus:ring-2 focus:ring-heritage-green-200 focus:border-heritage-green-400"
                      readOnly={!!linkedBookingId}
                    />
                  </div>

                  <div className="p-3 rounded-md bg-gray-50">
                    <div className="mb-1 text-sm text-gray-600">Duration</div>
                    <div className="text-lg font-semibold text-emerald-700">
                      {calculateNights()} {calculateNights() === 1 ? 'night' : 'nights'}
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-600">Address</label>
                    <textarea
                      name="address"
                      value={invoiceData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 transition-colors border rounded-md resize-none border-gray-200 focus:ring-2 focus:ring-heritage-green-200 focus:border-heritage-green-400"
                      placeholder="Guest address"
                      readOnly={!!linkedBookingId}
                    />
                  </div>
                </div>
              )}

              {/* Link booking panel */}
              {isLinking && (
                <div className="mt-4 p-3 border rounded-md bg-gray-50">
                  <div className="mb-2 text-sm font-medium text-gray-700">Quick link (client-side)</div>
                  <div className="flex flex-col md:flex-row gap-2 items-stretch">
                    <input
                      type="text"
                      value={linkInput}
                      onChange={(e) => setLinkInput(e.target.value)}
                      placeholder="Paste booking ID"
                      className="flex-1 min-w-0 px-3 py-2 border rounded-md"
                    />
                    <div className="flex gap-2 flex-wrap md:flex-nowrap md:items-center">
                      <button onClick={() => handleLinkById(linkInput)} className="px-3 py-2 bg-emerald-600 text-white rounded-md">Link</button>
                      <button onClick={handleUsePendingBooking} className="px-3 py-2 bg-white border rounded-md">Use pending</button>
                      <button onClick={handleCloseLinking} className="px-3 py-2 text-gray-600 border rounded-md">Cancel</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Invoice Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="flex items-center text-lg font-semibold">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Invoice Items
              </h4>
              <button
                onClick={addItem}
                className="px-3 py-1 text-sm font-medium rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-600 hover:text-white shadow-sm transition-colors"
              >
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="flex flex-col gap-4 p-5 bg-white border rounded-lg border-gray-100 md:grid md:grid-cols-12 md:gap-6">
                  <div className="col-span-12 md:col-span-4">
                    <label className="block mb-1 text-xs font-medium text-gray-600">Description</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 text-sm border rounded-md border-gray-200 focus:ring-1 focus:ring-emerald-200 focus:border-emerald-400"
                      placeholder="Item description (e.g., minibar, laundry, spa)"
                    />
                  </div>
                  <div className="col-span-6 md:col-span-2">
                    <label className="block mb-1 text-xs font-medium text-gray-600">Category</label>
                    <select
                      value={item.category}
                      onChange={(e) => handleItemChange(index, 'category', e.target.value)}
                      className="w-full px-3 py-2 text-sm border rounded-md border-gray-200 focus:ring-1 focus:ring-emerald-200 focus:border-emerald-400"
                    >
                      <option value="food">Food</option>
                      <option value="services">Services</option>
                      <option value="taxes">Taxes</option>
                    </select>
                  </div>
                  <div className="col-span-6 md:col-span-2">
                    <label className="block mb-1 text-xs font-medium text-gray-600">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={item.quantity as any}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className="w-full px-3 py-2 text-sm border rounded-md border-gray-200 focus:ring-1 focus:ring-emerald-200 focus:border-emerald-400"
                    />
                  </div>
                  <div className="col-span-6 md:col-span-2">
                    <label className="block mb-1 text-xs font-medium text-gray-600">Unit Price</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice as any}
                      onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                      className="w-full px-3 py-2 text-sm border rounded-md border-gray-200 focus:ring-1 focus:ring-heritage-green-200 focus:border-heritage-green-400"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex items-end col-span-6 md:col-span-2">
                    <div className="w-full">
                      <label className="block mb-1 text-xs font-medium text-gray-600">Total</label>
                      <div className="px-3 py-2 text-sm font-medium border rounded-md bg-gray-50 border-gray-100 text-emerald-700">
                        ₱{item.total.toFixed(2)}
                      </div>
                    </div>
                    {items.length > 1 && (
                      <button
                        onClick={() => removeItem(index)}
                        className="p-2 ml-2 text-red-500 transition-colors rounded-md hover:bg-red-50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <label className="block mb-2 text-sm font-medium text-gray-600">Additional Notes</label>
            <textarea
              name="notes"
              value={invoiceData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 transition-colors border rounded-lg resize-none border-gray-200 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
              placeholder="Any additional notes or special instructions..."
            />
          </div>

          {/* Invoice Summary */}
          <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
            <h4 className="flex items-center mb-3 text-lg font-semibold black">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Invoice Summary
            </h4>

            <div className="space-y-3">
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-lg font-semibold text-gray-700">Total Amount:</span>
                <span className="text-xl font-bold text-emerald-700">₱{calculateTotal().toFixed(2)}</span>
              </div>
              <div className="text-sm text-gray-500">
                {items.filter(item => item.description && Number((item as any).unitPrice) > 0).length} item(s)
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/80">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmitInvoice}
            disabled={!isFormValid() || isCreating}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-lg shadow-md bg-gradient-to-r from-emerald-600 to-emerald-700 border border-emerald-700/20 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isCreating ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Submitting Invoice...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Submit Invoice</span>
              </>
            )}
          </button>
        </div>
        {/* Spacer so footer isn't flush against modal bottom */}
      </div>
    </div>,
    document.body
  );
};

export default CreateInvoiceModal;