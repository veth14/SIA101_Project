import { useState, useEffect } from 'react';
import { Modal } from '../admin/Modal';
import { FileUploader } from '../admin/FileUploader';
import { departments, positions, type Staff } from '../../data/sampleStaff';

interface StaffFormProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff | null;
  onSave: (staffData: Partial<Staff>) => void;
}

export const StaffForm = ({ isOpen, onClose, staff, onSave }: StaffFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'staff' as Staff['role'],
    department: '',
    position: '',
    status: 'active' as Staff['status'],
    hireDate: '',
    salary: 0,
    avatar: '',
    permissions: [] as string[],
    emergencyContact: {
      name: '',
      phone: '',
      relationship: '',
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        role: staff.role,
        department: staff.department,
        position: staff.position,
        status: staff.status,
        hireDate: staff.hireDate,
        salary: staff.salary,
        avatar: staff.avatar || '',
        permissions: staff.permissions,
        emergencyContact: staff.emergencyContact,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'staff',
        department: '',
        position: '',
        status: 'active',
        hireDate: new Date().toISOString().split('T')[0],
        salary: 0,
        avatar: '',
        permissions: [],
        emergencyContact: {
          name: '',
          phone: '',
          relationship: '',
        },
      });
    }
    setErrors({});
  }, [staff, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('emergencyContact.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'salary' ? Number(value) : value,
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permission]
        : prev.permissions.filter(p => p !== permission),
    }));
  };

  const handleImageUpload = (file: File) => {
    // In a real app, you would upload to Firebase Storage
    const mockUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, avatar: mockUrl }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    if (!formData.position) {
      newErrors.position = 'Position is required';
    }

    if (!formData.hireDate) {
      newErrors.hireDate = 'Hire date is required';
    }

    if (formData.salary <= 0) {
      newErrors.salary = 'Salary must be greater than 0';
    }

    if (!formData.emergencyContact.name.trim()) {
      newErrors['emergencyContact.name'] = 'Emergency contact name is required';
    }

    if (!formData.emergencyContact.phone.trim()) {
      newErrors['emergencyContact.phone'] = 'Emergency contact phone is required';
    }

    if (!formData.emergencyContact.relationship.trim()) {
      newErrors['emergencyContact.relationship'] = 'Emergency contact relationship is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSave(formData);
  };

  const availablePermissions = [
    'reservations',
    'check-in',
    'check-out',
    'guest-services',
    'inventory',
    'stock-management',
    'suppliers',
    'reports',
    'analytics',
    'transactions',
    'revenue',
    'maintenance-requests',
    'room-status',
    'housekeeping',
    'restaurant',
    'room-service',
  ];

  const rolePermissions = {
    admin: ['all'],
    frontdesk: ['reservations', 'check-in', 'check-out', 'guest-services'],
    'inventory-manager': ['inventory', 'stock-management', 'suppliers', 'reports'],
    accounting: ['analytics', 'reports', 'transactions', 'revenue'],
    staff: ['maintenance-requests', 'room-status', 'housekeeping', 'restaurant', 'room-service'],
  };

  const getDefaultPermissions = (role: Staff['role']) => {
    return rolePermissions[role] || [];
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as Staff['role'];
    setFormData(prev => ({
      ...prev,
      role: newRole,
      permissions: getDefaultPermissions(newRole),
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={staff ? 'Edit Staff Member' : 'Add New Staff Member'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Picture
          </label>
          <FileUploader
            onFileSelect={handleImageUpload}
            accept="image/*"
            maxSize={5}
            preview={true}
          />
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter full name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter email address"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green ${
                errors.phone ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="+63 XXX XXX XXXX"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green"
            >
              <option value="active">Active</option>
              <option value="on-leave">On Leave</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Employment Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleRoleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green"
            >
              <option value="staff">Staff</option>
              <option value="frontdesk">Front Desk</option>
              <option value="inventory-manager">Inventory Manager</option>
              <option value="accounting">Accounting</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green ${
                errors.department ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select department</option>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
            {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position <span className="text-red-500">*</span>
            </label>
            <select
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green ${
                errors.position ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select position</option>
              {positions.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
            {errors.position && <p className="mt-1 text-sm text-red-600">{errors.position}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hire Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="hireDate"
              value={formData.hireDate}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green ${
                errors.hireDate ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.hireDate && <p className="mt-1 text-sm text-red-600">{errors.hireDate}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monthly Salary (₱) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleInputChange}
            min="0"
            step="1000"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green ${
              errors.salary ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="0"
          />
          {errors.salary && <p className="mt-1 text-sm text-red-600">{errors.salary}</p>}
        </div>

        {/* Emergency Contact */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="emergencyContact.name"
                value={formData.emergencyContact.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green ${
                  errors['emergencyContact.name'] ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Contact name"
              />
              {errors['emergencyContact.name'] && <p className="mt-1 text-sm text-red-600">{errors['emergencyContact.name']}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="emergencyContact.phone"
                value={formData.emergencyContact.phone}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green ${
                  errors['emergencyContact.phone'] ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="+63 XXX XXX XXXX"
              />
              {errors['emergencyContact.phone'] && <p className="mt-1 text-sm text-red-600">{errors['emergencyContact.phone']}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relationship <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="emergencyContact.relationship"
                value={formData.emergencyContact.relationship}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green ${
                  errors['emergencyContact.relationship'] ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., Spouse, Parent, Sibling"
              />
              {errors['emergencyContact.relationship'] && <p className="mt-1 text-sm text-red-600">{errors['emergencyContact.relationship']}</p>}
            </div>
          </div>
        </div>

        {/* Permissions */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Permissions</h3>
          {formData.role === 'admin' ? (
            <div className="bg-green-50 p-3 rounded-md">
              <p className="text-sm text-green-800">Admin users have all permissions by default.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availablePermissions.map((permission) => (
                <label key={permission} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(permission)}
                    onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                    className="h-4 w-4 text-heritage-green focus:ring-heritage-green border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {permission.replace('-', ' ')}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-heritage-green"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-heritage-green border border-transparent rounded-md hover:bg-heritage-green/90 focus:outline-none focus:ring-2 focus:ring-heritage-green"
          >
            {staff ? 'Update Staff' : 'Add Staff'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
