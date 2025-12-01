import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  rating: number;
  totalOrders: number;
  totalValue: number;
  lastOrderDate: string;
  status: "active" | "inactive" | "suspended";
  paymentTerms: string;
  deliveryTime: string;
  notes?: string;
}

interface EditSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier;
  onSuccess?: (updatedData: Partial<Supplier>) => void;
  isUpdating?: boolean;
}

const EditSupplierModal: React.FC<EditSupplierModalProps> = ({
  isOpen,
  onClose,
  supplier,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    category: "",
    status: "active" as "active" | "inactive" | "suspended",
    paymentTerms: "",
    deliveryTime: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form with supplier data when modal opens
  useEffect(() => {
    if (isOpen && supplier) {
      setFormData({
        name: supplier.name || "",
        contactPerson: supplier.contactPerson || "",
        email: supplier.email || "",
        phone: supplier.phone || "",
        address: supplier.address || "",
        category: supplier.category || "",
        status: supplier.status || "active",
        paymentTerms: supplier.paymentTerms || "",
        deliveryTime: supplier.deliveryTime || "",
        notes: supplier.notes || "",
      });
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable body scroll when modal is closed
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, supplier]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Replace with your actual API call
      // const response = await updateSupplier(supplier.id, formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Updating supplier:", supplier.id, formData);

      // Pass the updated data back to parent component
      if (onSuccess) {
        onSuccess(formData);
      }

      onClose();
    } catch (error) {
      console.error("Error updating supplier:", error);
      alert("Failed to update supplier. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/45 backdrop-blur-lg overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative z-10 w-full max-w-3xl rounded-3xl bg-white/95 shadow-2xl border border-white/60">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-5 bg-white border-b border-gray-100 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-11 h-11 text-white rounded-2xl shadow-sm bg-[#82A33D]">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-[#82A33D] md:text-2xl">Edit Supplier</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Update supplier information and details.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute flex items-center justify-center rounded-md top-4 right-4 w-9 h-9 text-[#82A33D] bg-[#82A33D]/10 ring-1 ring-[#82A33D]/20"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 bg-gray-50/60">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Left: basic info */}
            <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-gray-800 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-[#82A33D]/10 text-[#82A33D] text-xs font-bold">1</span>
                Basic Information
              </h3>

              <div className="space-y-4 text-sm">
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Supplier Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Contact Person</label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Right: contact info */}
            <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-gray-800 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-[#82A33D]/10 text-[#82A33D] text-xs font-bold">2</span>
                Contact Information
              </h3>

              <div className="space-y-4 text-sm">
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm text-sm text-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-[#82A33D]/10 text-[#82A33D] text-xs font-bold">3</span>
              <span className="font-semibold text-gray-800">Business Details</span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 font-medium text-gray-700">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm"
                >
                  <option value="">Select Category</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Housekeeping">Housekeeping</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Technology">Technology</option>
                  <option value="Furniture">Furniture</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">Payment Terms</label>
                <input
                  type="text"
                  name="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Net 30"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">Delivery Time</label>
                <input
                  type="text"
                  name="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 2-3 days"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm text-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-[#82A33D]/10 text-[#82A33D] text-xs font-bold">4</span>
              <span className="font-semibold text-gray-800">Additional Notes</span>
            </div>

            <div>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Add any additional notes about this supplier..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white/90 rounded-b-3xl">
          <p className="text-xs text-gray-500">
            This form will update the supplier record in the system.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#82A33D]/20"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-lg shadow-md bg-[#82A33D] border border-[#82A33D]/20 focus:outline-none focus:ring-2 focus:ring-[#82A33D]/30 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{isSubmitting ? 'Updating...' : 'Update Supplier'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Use React Portal to render modal at document body level
  return ReactDOM.createPortal(modalContent, document.body);
};

export default EditSupplierModal;
