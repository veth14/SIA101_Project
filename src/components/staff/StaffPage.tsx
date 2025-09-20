import { useState } from 'react';
import { DataTable } from '../admin/DataTable';
import { SearchInput } from '../admin/SearchInput';
import { Modal } from '../admin/Modal';
import { ConfirmDialog } from '../admin/ConfirmDialog';
import { StaffForm } from './StaffForm';
import { sampleStaff, getStaffByRole, getActiveStaff, departments, type Staff } from '../../data/sampleStaff';

export const StaffPage = () => {
  const [staff, setStaff] = useState<Staff[]>(sampleStaff);
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>(sampleStaff);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);
  const [showStaffDetails, setShowStaffDetails] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterStaff(query, roleFilter, statusFilter, departmentFilter);
  };

  const handleRoleFilter = (role: string) => {
    setRoleFilter(role);
    filterStaff(searchQuery, role, statusFilter, departmentFilter);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    filterStaff(searchQuery, roleFilter, status, departmentFilter);
  };

  const handleDepartmentFilter = (department: string) => {
    setDepartmentFilter(department);
    filterStaff(searchQuery, roleFilter, statusFilter, department);
  };

  const filterStaff = (query: string, role: string, status: string, department: string) => {
    let filtered = staff;

    // Search filter
    if (query) {
      filtered = filtered.filter(
        (member) =>
          member.name.toLowerCase().includes(query.toLowerCase()) ||
          member.email.toLowerCase().includes(query.toLowerCase()) ||
          member.position.toLowerCase().includes(query.toLowerCase()) ||
          member.id.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Role filter
    if (role !== 'all') {
      filtered = filtered.filter((member) => member.role === role);
    }

    // Status filter
    if (status !== 'all') {
      filtered = filtered.filter((member) => member.status === status);
    }

    // Department filter
    if (department !== 'all') {
      filtered = filtered.filter((member) => member.department === department);
    }

    setFilteredStaff(filtered);
  };

  const handleAddStaff = () => {
    setSelectedStaff(null);
    setShowStaffForm(true);
  };

  const handleEditStaff = (member: Staff) => {
    setSelectedStaff(member);
    setShowStaffForm(true);
  };

  const handleViewStaff = (member: Staff) => {
    setSelectedStaff(member);
    setShowStaffDetails(true);
  };

  const handleDeleteStaff = (member: Staff) => {
    setStaffToDelete(member);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (staffToDelete) {
      setStaff(prev => prev.filter(member => member.id !== staffToDelete.id));
      filterStaff(searchQuery, roleFilter, statusFilter, departmentFilter);
      setStaffToDelete(null);
    }
  };

  const handleSaveStaff = (staffData: Partial<Staff>) => {
    if (selectedStaff) {
      // Edit existing staff
      setStaff(prev =>
        prev.map(member =>
          member.id === selectedStaff.id
            ? { ...member, ...staffData }
            : member
        )
      );
    } else {
      // Add new staff
      const newStaff: Staff = {
        id: `STAFF${Date.now().toString().slice(-6)}`,
        name: staffData.name || '',
        email: staffData.email || '',
        phone: staffData.phone || '',
        role: staffData.role || 'staff',
        department: staffData.department || '',
        position: staffData.position || '',
        status: staffData.status || 'active',
        hireDate: staffData.hireDate || new Date().toISOString().split('T')[0],
        lastLogin: staffData.lastLogin,
        avatar: staffData.avatar,
        permissions: staffData.permissions || [],
        salary: staffData.salary || 0,
        emergencyContact: staffData.emergencyContact || {
          name: '',
          phone: '',
          relationship: ''
        },
      };
      setStaff(prev => [...prev, newStaff]);
    }
    filterStaff(searchQuery, roleFilter, statusFilter, departmentFilter);
    setShowStaffForm(false);
    setSelectedStaff(null);
  };

  const columns = [
    {
      key: 'avatar',
      label: 'Photo',
      render: (value: string, row: Staff) => (
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
          {value ? (
            <img src={value} alt={row.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-medium">
              {row.name.split(' ').map(n => n[0]).join('')}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value: string, row: Staff) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.id}</div>
        </div>
      ),
    },
    {
      key: 'position',
      label: 'Position',
      sortable: true,
      render: (value: string, row: Staff) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.department}</div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (value: string) => {
        const roleColors = {
          admin: 'bg-purple-100 text-purple-800',
          frontdesk: 'bg-blue-100 text-blue-800',
          'inventory-manager': 'bg-green-100 text-green-800',
          accounting: 'bg-yellow-100 text-yellow-800',
          staff: 'bg-gray-100 text-gray-800',
        };
        const roleLabels = {
          admin: 'Admin',
          frontdesk: 'Front Desk',
          'inventory-manager': 'Inventory',
          accounting: 'Accounting',
          staff: 'Staff',
        };
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${roleColors[value as keyof typeof roleColors]}`}>
            {roleLabels[value as keyof typeof roleLabels]}
          </span>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const statusColors = {
          active: 'bg-green-100 text-green-800',
          'on-leave': 'bg-yellow-100 text-yellow-800',
          inactive: 'bg-red-100 text-red-800',
        };
        const statusLabels = {
          active: 'Active',
          'on-leave': 'On Leave',
          inactive: 'Inactive',
        };
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[value as keyof typeof statusColors]}`}>
            {statusLabels[value as keyof typeof statusLabels]}
          </span>
        );
      },
    },
    {
      key: 'email',
      label: 'Contact',
      render: (value: string, row: Staff) => (
        <div>
          <div className="text-sm text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.phone}</div>
        </div>
      ),
    },
    {
      key: 'hireDate',
      label: 'Hire Date',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'lastLogin',
      label: 'Last Login',
      render: (value: string) => value ? new Date(value).toLocaleDateString() : 'Never',
    },
  ];

  const getActions = (member: Staff) => (
    <div className="flex space-x-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleViewStaff(member);
        }}
        className="text-heritage-green hover:text-heritage-green/80 text-sm font-medium"
      >
        View
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleEditStaff(member);
        }}
        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
      >
        Edit
      </button>
      {member.role !== 'admin' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteStaff(member);
          }}
          className="text-red-600 hover:text-red-900 text-sm font-medium"
        >
          Delete
        </button>
      )}
    </div>
  );

  const activeStaff = getActiveStaff();
  const staffStats = {
    total: staff.length,
    active: activeStaff.length,
    onLeave: staff.filter(s => s.status === 'on-leave').length,
    inactive: staff.filter(s => s.status === 'inactive').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600">Manage hotel staff and their roles</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => {
              // Export functionality
              console.log('Export staff data');
            }}
            className="bg-white text-heritage-green border border-heritage-green px-4 py-2 rounded-md hover:bg-heritage-light transition-colors"
          >
            Export CSV
          </button>
          <button
            onClick={handleAddStaff}
            className="bg-heritage-green text-white px-4 py-2 rounded-md hover:bg-heritage-green/90 transition-colors"
          >
            Add Staff
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600 text-xl">👥</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900">{staffStats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-green-600 text-xl">✅</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{staffStats.active}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-yellow-600 text-xl">🏖️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">On Leave</p>
              <p className="text-2xl font-bold text-gray-900">{staffStats.onLeave}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-purple-600 text-xl">🏢</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <SearchInput
              placeholder="Search by name, email, or position..."
              onSearch={handleSearch}
            />
          </div>
          <div className="flex space-x-4">
            <select
              value={departmentFilter}
              onChange={(e) => handleDepartmentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green"
            >
              <option value="all">All Departments</option>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
            <select
              value={roleFilter}
              onChange={(e) => handleRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="frontdesk">Front Desk</option>
              <option value="inventory-manager">Inventory Manager</option>
              <option value="accounting">Accounting</option>
              <option value="staff">Staff</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="on-leave">On Leave</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <DataTable
        columns={columns}
        data={filteredStaff}
        actions={getActions}
        onRowClick={handleViewStaff}
      />

      {/* Staff Form Modal */}
      {showStaffForm && (
        <StaffForm
          isOpen={showStaffForm}
          onClose={() => {
            setShowStaffForm(false);
            setSelectedStaff(null);
          }}
          staff={selectedStaff}
          onSave={handleSaveStaff}
        />
      )}

      {/* Staff Details Modal */}
      {showStaffDetails && selectedStaff && (
        <Modal
          isOpen={showStaffDetails}
          onClose={() => {
            setShowStaffDetails(false);
            setSelectedStaff(null);
          }}
          title="Staff Details"
          size="lg"
        >
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                {selectedStaff.avatar ? (
                  <img src={selectedStaff.avatar} alt={selectedStaff.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg font-medium">
                    {selectedStaff.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{selectedStaff.name}</h3>
                <p className="text-gray-600">{selectedStaff.position}</p>
                <p className="text-sm text-gray-500">{selectedStaff.department}</p>
                <div className="mt-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    selectedStaff.status === 'active' ? 'bg-green-100 text-green-800' :
                    selectedStaff.status === 'on-leave' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedStaff.status === 'active' ? 'Active' :
                     selectedStaff.status === 'on-leave' ? 'On Leave' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-sm text-gray-900">{selectedStaff.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="text-sm text-gray-900">{selectedStaff.phone}</p>
              </div>
            </div>

            {/* Employment Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Hire Date</label>
                <p className="text-sm text-gray-900">{new Date(selectedStaff.hireDate).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Login</label>
                <p className="text-sm text-gray-900">
                  {selectedStaff.lastLogin ? new Date(selectedStaff.lastLogin).toLocaleString() : 'Never'}
                </p>
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm font-medium text-gray-900">{selectedStaff.emergencyContact.name}</p>
                <p className="text-sm text-gray-600">{selectedStaff.emergencyContact.phone}</p>
                <p className="text-sm text-gray-500">{selectedStaff.emergencyContact.relationship}</p>
              </div>
            </div>

            {/* Permissions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
              <div className="flex flex-wrap gap-2">
                {selectedStaff.permissions.map((permission) => (
                  <span
                    key={permission}
                    className="px-2 py-1 text-xs font-medium bg-heritage-light text-heritage-green rounded-full"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Staff Member"
        message={`Are you sure you want to delete "${staffToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};
