import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

interface Department {
  id: string;
  name: string;
  manager: string;
  itemsAssigned: number;
  totalUsage: number;
  monthlyConsumption: number;
}

interface EditDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department | null;
  onSuccess?: () => void;
}

export const EditDepartmentModal: React.FC<EditDepartmentModalProps> = ({
  isOpen,
  onClose,
  department,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    manager: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name,
        manager: department.manager,
      });
    }
  }, [department]);

  if (!isOpen || !department) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault;
    setIsSubmitting(true);

    try {
      const response = await fetch(`http://localhost:3000/api/inventory-department/update-department/${department.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          manager: formData.manager,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert('Department updated successfully!');
        onSuccess?.();
        onClose();
      } else {
        alert(result.message || 'Failed to update department');
      }
    } catch (error) {
      console.error('Error updating department:', error);
      alert('An error occurred while updating the department');
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-heritage-green flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Edit Department</h2>
              <p className="text-sm text-gray-500 mt-0.5">{department.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
              placeholder="Department name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Manager <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="manager"
              value={formData.manager}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
              placeholder="Manager name"
            />
          </div>

          {/* Read-only Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Items Assigned:</span>
              <span className="font-semibold text-gray-900">{department.itemsAssigned}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Usage:</span>
              <span className="font-semibold text-gray-900">{department.totalUsage}%</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-heritage-green rounded-md hover:bg-heritage-green/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};
