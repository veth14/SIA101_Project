import React, { useState, useCallback } from 'react';
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

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInvoiceData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    setItems(prev => prev.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        // Recalculate total when quantity or unitPrice changes
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
        }
        return updatedItem;
      }
      return item;
    }));
  };

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
      status: 'pending',
      totalAmount: calculateTotal(),
      items: items.filter(item => item.description && item.unitPrice > 0)
    };
    
    setIsCreating(false);
    
    // Call the callback to notify parent component
    onInvoiceCreated(submittedInvoice);
    
    // Close the modal
    handleClose();
  };



  const isFormValid = () => {
    return invoiceData.guestName && 
           invoiceData.roomNumber && 
           items.some(item => item.description && item.unitPrice > 0);
  };

  return createPortal(
    <>
      <style>{`
        @keyframes slideInUp {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.3s ease-out;
        }
      `}</style>
      <div 
        className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 animate-slideInUp border border-heritage-neutral/10">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-heritage-neutral/10 bg-gradient-to-r from-heritage-green/5 to-heritage-light/10 rounded-t-2xl backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-heritage-green">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-heritage-green">
                  Create New Invoice
                </h2>
                <p className="text-sm text-heritage-neutral">
                  Generate a new invoice for guest services
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 transition-all duration-200 rounded-full text-heritage-neutral hover:text-heritage-green hover:bg-heritage-green/10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Invoice Form Content */}
              <div>
                {/* Guest Information */}
                <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
              {/* Left Column - Guest Details */}
              <div className="space-y-4">
                <h4 className="flex items-center text-lg font-bold text-heritage-green">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Guest Information
                </h4>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-heritage-neutral">Guest Name *</label>
                  <input
                    type="text"
                    name="guestName"
                    value={invoiceData.guestName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 transition-colors border rounded-lg border-heritage-neutral/30 focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                    placeholder="Enter guest name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-heritage-neutral">Room Number *</label>
                  <input
                    type="text"
                    name="roomNumber"
                    value={invoiceData.roomNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 transition-colors border rounded-lg border-heritage-neutral/30 focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                    placeholder="e.g., 201"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-heritage-neutral">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={invoiceData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 transition-colors border rounded-lg border-heritage-neutral/30 focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                    placeholder="guest@email.com"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-heritage-neutral">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={invoiceData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 transition-colors border rounded-lg border-heritage-neutral/30 focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                    placeholder="+63 XXX XXX XXXX"
                  />
                </div>
              </div>

              {/* Right Column - Stay Details */}
              <div className="space-y-4">
                <h4 className="flex items-center text-lg font-bold text-heritage-green">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h8a2 2 0 012 2v4h1a2 2 0 012 2v1l-1 5-2 5H3l-1-5-1-5v-1a2 2 0 012-2h1z" />
                  </svg>
                  Stay Details
                </h4>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-heritage-neutral">Check-in Date</label>
                  <input
                    type="date"
                    name="checkIn"
                    value={invoiceData.checkIn}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 transition-colors border rounded-lg border-heritage-neutral/30 focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                  />
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-heritage-neutral">Check-out Date</label>
                  <input
                    type="date"
                    name="checkOut"
                    value={invoiceData.checkOut}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 transition-colors border rounded-lg border-heritage-neutral/30 focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                  />
                </div>

                <div className="p-4 rounded-lg bg-heritage-light/20">
                  <div className="mb-1 text-sm text-heritage-neutral">Duration</div>
                  <div className="text-lg font-semibold text-heritage-green">
                    {calculateNights()} {calculateNights() === 1 ? 'night' : 'nights'}
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-heritage-neutral">Address</label>
                  <textarea
                    name="address"
                    value={invoiceData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 transition-colors border rounded-lg resize-none border-heritage-neutral/30 focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                    placeholder="Guest address"
                  />
                </div>
              </div>
            </div>

            {/* Invoice Items */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h4 className="flex items-center text-lg font-bold text-heritage-green">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Invoice Items
                </h4>
                <button
                  onClick={addItem}
                  className="px-4 py-2 text-sm font-medium transition-colors border rounded-lg text-heritage-green border-heritage-green hover:bg-heritage-green hover:text-white"
                >
                  Add Item
                </button>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 p-4 border rounded-lg bg-heritage-light/10 border-heritage-neutral/10">
                    <div className="col-span-12 md:col-span-4">
                      <label className="block mb-1 text-xs font-medium text-heritage-neutral">Description</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 text-sm border rounded-md border-heritage-neutral/30 focus:ring-1 focus:ring-heritage-green focus:border-heritage-green"
                        placeholder="Item description"
                      />
                    </div>
                    <div className="col-span-6 md:col-span-2">
                      <label className="block mb-1 text-xs font-medium text-heritage-neutral">Category</label>
                      <select
                        value={item.category}
                        onChange={(e) => handleItemChange(index, 'category', e.target.value)}
                        className="w-full px-3 py-2 text-sm border rounded-md border-heritage-neutral/30 focus:ring-1 focus:ring-heritage-green focus:border-heritage-green"
                      >
                        <option value="room">Room</option>
                        <option value="food">Food</option>
                        <option value="services">Services</option>
                        <option value="taxes">Taxes</option>
                      </select>
                    </div>
                    <div className="col-span-6 md:col-span-2">
                      <label className="block mb-1 text-xs font-medium text-heritage-neutral">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 text-sm border rounded-md border-heritage-neutral/30 focus:ring-1 focus:ring-heritage-green focus:border-heritage-green"
                      />
                    </div>
                    <div className="col-span-6 md:col-span-2">
                      <label className="block mb-1 text-xs font-medium text-heritage-neutral">Unit Price</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-sm border rounded-md border-heritage-neutral/30 focus:ring-1 focus:ring-heritage-green focus:border-heritage-green"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="flex items-end col-span-6 md:col-span-2">
                      <div className="w-full">
                        <label className="block mb-1 text-xs font-medium text-heritage-neutral">Total</label>
                        <div className="px-3 py-2 text-sm font-medium border rounded-md bg-heritage-light/30 border-heritage-neutral/20 text-heritage-green">
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
            <div className="mb-8">
              <label className="block mb-2 text-sm font-medium text-heritage-neutral">Additional Notes</label>
              <textarea
                name="notes"
                value={invoiceData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 transition-colors border rounded-lg resize-none border-heritage-neutral/30 focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                placeholder="Any additional notes or special instructions..."
              />
            </div>

            {/* Invoice Summary */}
            <div className="p-6 border bg-gradient-to-r from-heritage-neutral/5 to-heritage-light/10 rounded-xl border-heritage-neutral/10">
              <h4 className="flex items-center mb-4 text-lg font-bold text-heritage-green">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Invoice Summary
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between pt-3 border-t border-heritage-neutral/20">
                  <span className="text-lg font-bold text-heritage-green">Total Amount:</span>
                  <span className="text-xl font-bold text-heritage-green">₱{calculateTotal().toFixed(2)}</span>
                </div>
                <div className="text-sm text-heritage-neutral">
                  {items.filter(item => item.description && item.unitPrice > 0).length} item(s)
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex pt-6 mt-6 space-x-4 border-t border-heritage-neutral/10">
              <button
                onClick={handleClose}
                className="flex-1 px-6 py-3 transition-all duration-300 border-2 border-heritage-neutral/30 text-heritage-neutral rounded-xl hover:bg-heritage-neutral/5"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitInvoice}
                disabled={!isFormValid() || isCreating}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-heritage-green to-heritage-neutral text-white rounded-xl hover:from-heritage-green/90 hover:to-heritage-neutral/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isCreating ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Submitting Invoice...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Submit Invoice</span>
                  </>
                )}
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default CreateInvoiceModal;