import React, { useState } from "react";
import { createPortal } from "react-dom";
import usePostInvSupplier from "../../../api/postInvSupplier";

interface NewSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface NewSupplierData {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  paymentTerms: string;
  deliveryTime: string;
  notes: string;
}

const NewSupplierModal: React.FC<NewSupplierModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [supplierData, setSupplierData] = useState<NewSupplierData>({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    category: "",
    paymentTerms: "",
    deliveryTime: "",
    notes: "",
  });

  const { postInvSupplier, loadingForPostInvSupplier } = usePostInvSupplier();

  const categories = [
    "Food & Beverage",
    "Housekeeping",
    "Maintenance",
    "Technology",
    "Furniture",
    "Office Supplies",
    "Utilities",
    "Others"
  ];

  const paymentTermsOptions = [
    "Net 30",
    "Net 60",
    "Net 90",
    "Cash on Delivery",
    "Advance Payment",
    "50% Advance, 50% on Delivery"
  ];

  const handleSave = async () => {
    // Validation
    if (!supplierData.name.trim()) {
      alert("Please enter supplier name");
      return;
    }

    if (!supplierData.contactPerson.trim()) {
      alert("Please enter contact person");
      return;
    }

    if (!supplierData.email.trim() || !supplierData.email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    if (!supplierData.phone.trim()) {
      alert("Please enter phone number");
      return;
    }

    if (!supplierData.address.trim()) {
      alert("Please enter address");
      return;
    }

    if (!supplierData.category) {
      alert("Please select a category");
      return;
    }

    if (!supplierData.paymentTerms) {
      alert("Please select payment terms");
      return;
    }

    if (!supplierData.deliveryTime.trim()) {
      alert("Please enter delivery time");
      return;
    }

    const newSupplier = {
      name: supplierData.name,
      contactPerson: supplierData.contactPerson,
      email: supplierData.email,
      phone: supplierData.phone,
      address: supplierData.address,
      category: supplierData.category,
      paymentTerms: supplierData.paymentTerms,
      deliveryTime: supplierData.deliveryTime,
      notes: supplierData.notes,
      status: "active",
      rating: 0,
      totalOrders: 0,
      totalValue: 0,
    };

    try {
      const response = await postInvSupplier(newSupplier);
      
      if (response.success) {
        console.log("Supplier created successfully:", response);
        alert("Supplier created successfully!");
        handleCancel();
        if (onSuccess) onSuccess();
      } else {
        alert(response.message || "Failed to create supplier");
      }
    } catch (error) {
      console.error("Error creating supplier:", error);
      alert("An error occurred while creating the supplier");
    }
  };

  const handleCancel = () => {
    setSupplierData({
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      category: "",
      paymentTerms: "",
      deliveryTime: "",
      notes: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[99999] overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-heritage-green/5 to-emerald-50/30">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Add New Supplier</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto max-h-[calc(100vh-250px)] px-6 py-5">
            <div className="space-y-5">
              {/* Basic Information */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Supplier Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={supplierData.name}
                      onChange={(e) => setSupplierData({ ...supplierData, name: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green bg-white"
                      placeholder="Enter supplier name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Contact Person <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={supplierData.contactPerson}
                      onChange={(e) => setSupplierData({ ...supplierData, contactPerson: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green bg-white"
                      placeholder="Enter contact person name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={supplierData.category}
                      onChange={(e) => setSupplierData({ ...supplierData, category: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green bg-white"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={supplierData.email}
                      onChange={(e) => setSupplierData({ ...supplierData, email: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green bg-white"
                      placeholder="supplier@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={supplierData.phone}
                      onChange={(e) => setSupplierData({ ...supplierData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green bg-white"
                      placeholder="+63 XXX XXX XXXX"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={supplierData.address}
                      onChange={(e) => setSupplierData({ ...supplierData, address: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green bg-white resize-none"
                      placeholder="Enter complete address"
                    />
                  </div>
                </div>
              </div>

              {/* Business Terms */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Business Terms</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Payment Terms <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={supplierData.paymentTerms}
                      onChange={(e) => setSupplierData({ ...supplierData, paymentTerms: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green bg-white"
                    >
                      <option value="">Select Payment Terms</option>
                      {paymentTermsOptions.map((term) => (
                        <option key={term} value={term}>
                          {term}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Delivery Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={supplierData.deliveryTime}
                      onChange={(e) => setSupplierData({ ...supplierData, deliveryTime: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green bg-white"
                      placeholder="e.g., 3-5 business days"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={supplierData.notes}
                      onChange={(e) => setSupplierData({ ...supplierData, notes: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green bg-white resize-none"
                      placeholder="Add any additional notes about this supplier..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleCancel}
              disabled={loadingForPostInvSupplier}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              CANCEL
            </button>
            <button
              onClick={handleSave}
              disabled={loadingForPostInvSupplier}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-heritage-green rounded-lg hover:bg-heritage-green/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loadingForPostInvSupplier ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "SAVE SUPPLIER"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default NewSupplierModal;
