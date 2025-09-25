import React, { useState } from 'react';

interface Requisition {
  id: string;
  requestNumber: string;
  department: string;
  requestedBy: string;
  items: {
    name: string;
    quantity: number;
    unit: string;
    estimatedCost: number;
    reason: string;
  }[];
  totalEstimatedCost: number;
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requestDate: string;
  requiredDate: string;
  approvedBy?: string;
  approvalDate?: string;
  notes?: string;
  justification: string;
}

const RequisitionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  // Sample requisitions data
  const requisitions: Requisition[] = [
    {
      id: 'REQ001',
      requestNumber: 'REQ-2024-001',
      department: 'Housekeeping',
      requestedBy: 'Maria Santos',
      items: [
        { name: 'Vacuum Cleaner Bags', quantity: 50, unit: 'pieces', estimatedCost: 2500, reason: 'Current stock depleted' },
        { name: 'Floor Cleaner', quantity: 10, unit: 'bottles', estimatedCost: 1200, reason: 'Monthly restocking' }
      ],
      totalEstimatedCost: 3700,
      status: 'pending',
      priority: 'high',
      requestDate: '2024-09-20',
      requiredDate: '2024-09-25',
      justification: 'Essential cleaning supplies needed for daily operations. Current stock is running low and may affect service quality.'
    },
    {
      id: 'REQ002',
      requestNumber: 'REQ-2024-002',
      department: 'Food & Beverage',
      requestedBy: 'Carlos Rivera',
      items: [
        { name: 'Coffee Machine Filters', quantity: 100, unit: 'pieces', estimatedCost: 1500, reason: 'Replacement for worn filters' },
        { name: 'Napkins (Premium)', quantity: 20, unit: 'packs', estimatedCost: 800, reason: 'Guest service upgrade' }
      ],
      totalEstimatedCost: 2300,
      status: 'approved',
      priority: 'medium',
      requestDate: '2024-09-19',
      requiredDate: '2024-09-22',
      approvedBy: 'Admin Manager',
      approvalDate: '2024-09-20',
      justification: 'Required to maintain coffee service quality and enhance guest experience.'
    },
    {
      id: 'REQ003',
      requestNumber: 'REQ-2024-003',
      department: 'Maintenance',
      requestedBy: 'Juan Dela Cruz',
      items: [
        { name: 'LED Light Bulbs', quantity: 25, unit: 'pieces', estimatedCost: 3750, reason: 'Energy efficiency upgrade' },
        { name: 'Electrical Wire', quantity: 50, unit: 'meters', estimatedCost: 2500, reason: 'Wiring repairs' }
      ],
      totalEstimatedCost: 6250,
      status: 'fulfilled',
      priority: 'medium',
      requestDate: '2024-09-15',
      requiredDate: '2024-09-20',
      approvedBy: 'Admin Manager',
      approvalDate: '2024-09-16',
      justification: 'Preventive maintenance to ensure electrical safety and reduce energy costs.'
    },
    {
      id: 'REQ004',
      requestNumber: 'REQ-2024-004',
      department: 'Front Office',
      requestedBy: 'Ana Cruz',
      items: [
        { name: 'Printer Paper', quantity: 10, unit: 'reams', estimatedCost: 500, reason: 'Office supplies' },
        { name: 'Ink Cartridges', quantity: 4, unit: 'pieces', estimatedCost: 2000, reason: 'Printer maintenance' }
      ],
      totalEstimatedCost: 2500,
      status: 'rejected',
      priority: 'low',
      requestDate: '2024-09-18',
      requiredDate: '2024-09-23',
      approvedBy: 'Admin Manager',
      approvalDate: '2024-09-19',
      notes: 'Budget constraints - use existing stock first',
      justification: 'Regular office supplies for daily administrative tasks.'
    },
    {
      id: 'REQ005',
      requestNumber: 'REQ-2024-005',
      department: 'Security',
      requestedBy: 'Roberto Garcia',
      items: [
        { name: 'Security Camera', quantity: 2, unit: 'units', estimatedCost: 15000, reason: 'Blind spot coverage' },
        { name: 'Monitor Cable', quantity: 5, unit: 'pieces', estimatedCost: 1250, reason: 'Equipment upgrade' }
      ],
      totalEstimatedCost: 16250,
      status: 'pending',
      priority: 'urgent',
      requestDate: '2024-09-21',
      requiredDate: '2024-09-26',
      justification: 'Critical security enhancement needed to cover identified blind spots in surveillance system.'
    }
  ];

  const departments = ['all', ...Array.from(new Set(requisitions.map(req => req.department)))];

  const filteredRequisitions = requisitions.filter(req => {
    const matchesSearch = req.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || req.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      approved: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Approved' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
      fulfilled: { bg: 'bg-green-100', text: 'text-green-800', label: 'Fulfilled' },
      cancelled: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Cancelled' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Low' },
      medium: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Medium' },
      high: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'High' },
      urgent: { bg: 'bg-red-100', text: 'text-red-800', label: 'Urgent' }
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.low;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusStats = () => {
    const stats = {
      pending: requisitions.filter(req => req.status === 'pending').length,
      approved: requisitions.filter(req => req.status === 'approved').length,
      fulfilled: requisitions.filter(req => req.status === 'fulfilled').length,
      rejected: requisitions.filter(req => req.status === 'rejected').length,
    };
    return stats;
  };

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-heritage-light">
      {/* Light Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 rounded-full blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl animate-pulse delay-1000 opacity-25"></div>
        <div className="absolute bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 rounded-full blur-3xl animate-pulse delay-2000 opacity-20"></div>
        
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(134, 134, 134, 0.1) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-white via-green-50/20 to-green-500/5 rounded-3xl shadow-2xl border border-green-500/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-600/5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-green-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-green-100/15 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000"></div>
          
          <div className="relative p-10">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="relative group">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#82A33D] to-[#6d8a33] rounded-2xl flex items-center justify-center shadow-xl border border-[#82A33D]/30 group-hover:scale-110 transition-all duration-500">
                      <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#82A33D] to-green-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-5xl font-black text-[#82A33D] drop-shadow-sm">
                      Requisitions
                    </h1>
                    <p className="text-xl text-gray-700 font-medium tracking-wide">
                      Manage internal requests and requisitions
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="relative group">
                  <div className="bg-gradient-to-br from-white/90 to-green-500/5 backdrop-blur-xl rounded-3xl p-8 border border-green-500/20 shadow-xl group-hover:scale-105 transition-all duration-500">
                    <div className="relative">
                      <p className="text-4xl font-black bg-gradient-to-r from-[#82A33D] to-green-600 bg-clip-text text-transparent drop-shadow-sm">
                        {filteredRequisitions.length}
                      </p>
                      <p className="text-gray-700 mt-2 font-semibold tracking-wide">Requisitions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-blue-600">{stats.approved}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fulfilled</p>
                <p className="text-3xl font-bold text-green-600">{stats.fulfilled}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by request number, department, requester, or items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="fulfilled">Fulfilled</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-green focus:border-transparent"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
              
              <button className="px-6 py-3 bg-heritage-green text-white rounded-xl hover:bg-heritage-green/90 transition-colors font-medium">
                New Requisition
              </button>
            </div>
          </div>
        </div>

        {/* Requisitions List */}
        <div className="space-y-4">
          {filteredRequisitions.map((req) => (
            <div key={req.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{req.requestNumber}</h3>
                    <p className="text-sm text-gray-500">{req.department} • {req.requestedBy}</p>
                  </div>
                  <div className="flex space-x-2">
                    {getStatusBadge(req.status)}
                    {getPriorityBadge(req.priority)}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Request Date</p>
                    <p className="font-medium">{new Date(req.requestDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Required Date</p>
                    <p className="font-medium">{new Date(req.requiredDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Estimated Cost</p>
                    <p className="font-bold text-heritage-green text-lg">{formatCurrency(req.totalEstimatedCost)}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Justification</p>
                  <p className="text-sm text-gray-800 bg-blue-50 p-3 rounded-lg">{req.justification}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Items ({req.items.length})</p>
                  <div className="bg-gray-50 rounded-lg p-3">
                    {req.items.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex justify-between items-start py-2">
                        <div className="flex-1">
                          <span className="text-sm font-medium">{item.name}</span>
                          <p className="text-xs text-gray-500">{item.quantity} {item.unit} • {item.reason}</p>
                        </div>
                        <span className="text-sm font-medium ml-4">{formatCurrency(item.estimatedCost)}</span>
                      </div>
                    ))}
                    {req.items.length > 2 && (
                      <p className="text-xs text-gray-500 mt-1">+{req.items.length - 2} more items</p>
                    )}
                  </div>
                </div>
                
                {req.approvedBy && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Approved by: <span className="font-medium">{req.approvedBy}</span></p>
                    <p className="text-xs text-gray-500">on {req.approvalDate && new Date(req.approvalDate).toLocaleDateString()}</p>
                  </div>
                )}
                
                {req.notes && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Notes</p>
                    <p className="text-sm text-gray-800 bg-yellow-50 p-2 rounded">{req.notes}</p>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-heritage-green text-white text-sm rounded-lg hover:bg-heritage-green/90 transition-colors">
                    View Details
                  </button>
                  {req.status === 'pending' && (
                    <>
                      <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                        Approve
                      </button>
                      <button className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors">
                        Reject
                      </button>
                    </>
                  )}
                  <button className="px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRequisitions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No requisitions found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequisitionsPage;
