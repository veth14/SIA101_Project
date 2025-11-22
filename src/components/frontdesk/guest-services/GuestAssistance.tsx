import React, { useState } from 'react';
import { Modal } from '../../admin/Modal';

interface AssistanceRequest {
  id: string;
  guestName: string;
  roomNumber: string;
  requestType: 'housekeeping' | 'maintenance' | 'concierge' | 'dining' | 'transport' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  requestTime: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  assignedTo?: string;
  estimatedTime?: string;
  notes?: string;
}

export const GuestAssistance: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  const initialRequests: AssistanceRequest[] = [
    {
      id: '1',
      guestName: 'Maria Santos',
      roomNumber: '201',
      requestType: 'housekeeping',
      priority: 'medium',
      description: 'Need extra towels and pillows for additional guests',
      requestTime: '2024-01-15T14:30:00',
      status: 'in-progress',
      assignedTo: 'Ana Cruz - Housekeeping',
      estimatedTime: '15 minutes'
    },
    {
      id: '2',
      guestName: 'John Rodriguez',
      roomNumber: '305',
      requestType: 'maintenance',
      priority: 'high',
      description: 'Air conditioning not working properly, room too warm',
      requestTime: '2024-01-15T13:45:00',
      status: 'pending',
      estimatedTime: '30 minutes'
    },
    {
      id: '3',
      guestName: 'Lisa Chen',
      roomNumber: '102',
      requestType: 'concierge',
      priority: 'low',
      description: 'Restaurant recommendations for vegetarian dining nearby',
      requestTime: '2024-01-15T12:20:00',
      status: 'completed',
      assignedTo: 'Mark Dela Cruz - Concierge',
      notes: 'Provided list of 5 vegetarian restaurants with contact details'
    },
    {
      id: '4',
      guestName: 'Carlos Mendoza',
      roomNumber: '408',
      requestType: 'transport',
      priority: 'medium',
      description: 'Airport transfer needed tomorrow at 6 AM',
      requestTime: '2024-01-15T11:15:00',
      status: 'completed',
      assignedTo: 'Transport Team',
      notes: 'Booked sedan for 6 AM pickup, driver: Jose Santos'
    },
    {
      id: '5',
      guestName: 'Anna Williams',
      roomNumber: '156',
      requestType: 'dining',
      priority: 'urgent',
      description: 'Food allergy concern - need gluten-free meal options',
      requestTime: '2024-01-15T10:30:00',
      status: 'in-progress',
      assignedTo: 'Chef Miguel - Kitchen',
      estimatedTime: '10 minutes'
    }
  ];

  const [assistanceRequests, setAssistanceRequests] = useState<AssistanceRequest[]>(initialRequests);

  // Modal & form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [guestContact, setGuestContact] = useState('');
  const [requestType, setRequestType] = useState<AssistanceRequest['requestType']>('housekeeping');
  const [priority, setPriority] = useState<AssistanceRequest['priority']>('medium');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState<string>('Unassigned');
  const [notifyAssignee, setNotifyAssignee] = useState(true);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const calcEstimatedTime = (type: AssistanceRequest['requestType']) => {
    switch (type) {
      case 'housekeeping':
        return '15 minutes';
      case 'maintenance':
        return '30 minutes';
      default:
        return '30 minutes';
    }
  };

  const resetForm = () => {
    setGuestName('');
    setRoomNumber('');
    setGuestContact('');
    setRequestType('housekeeping');
    setPriority('medium');
    setDescription('');
    setAssignedTo('Unassigned');
    setNotifyAssignee(true);
    setFormErrors({});
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!guestName.trim()) errs.guestName = 'Guest name is required.';
    if (!requestType) errs.requestType = 'Request type is required.';
    if (!priority) errs.priority = 'Priority is required.';
    if (!description.trim() || description.trim().length < 10) errs.description = 'Description must be at least 10 characters.';
    if (!assignedTo) errs.assignedTo = 'Please assign the request or pick Unassigned.';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validateForm()) return;

    const newReq: AssistanceRequest = {
      id: Date.now().toString(),
      guestName: guestName.trim(),
      roomNumber: roomNumber || '—',
      requestType: requestType,
      priority: priority,
      description: description.trim(),
      requestTime: new Date().toISOString(),
      status: assignedTo && assignedTo !== 'Unassigned' && notifyAssignee ? 'in-progress' : 'pending',
      assignedTo: assignedTo !== 'Unassigned' ? assignedTo : undefined,
      estimatedTime: calcEstimatedTime(requestType),
      notes: guestContact ? `Contact: ${guestContact}` : undefined
    };

    setAssistanceRequests(prev => [newReq, ...prev]);
    // TODO: wire to backend & notifications
    closeModal();
  };

  // Simple guest lookup: if guestName matches an existing entry, autofill room/contact
  const handleGuestNameBlur = () => {
    const match = assistanceRequests.find(r => r.guestName.toLowerCase() === guestName.trim().toLowerCase());
    if (match) {
      setRoomNumber(match.roomNumber);
      if (match.notes?.includes('Contact:')) {
        setGuestContact(match.notes.replace('Contact:', '').trim());
      }
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      housekeeping: 'bg-blue-100 text-blue-800 border-blue-200',
      maintenance: 'bg-orange-100 text-orange-800 border-orange-200',
      concierge: 'bg-purple-100 text-purple-800 border-purple-200',
      dining: 'bg-green-100 text-green-800 border-green-200',
      transport: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      other: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      urgent: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[priority as keyof typeof colors] || colors.low;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      housekeeping: '🧹',
      maintenance: '🔧',
      concierge: '🛎️',
      dining: '🍽️',
      transport: '🚗',
      other: '❓'
    };
    return icons[type as keyof typeof icons] || icons.other;
  };

  const filteredRequests = assistanceRequests.filter(request => {
    const typeMatch = selectedType === 'all' || request.requestType === selectedType;
    const statusMatch = selectedStatus === 'all' || request.status === selectedStatus;
    const priorityMatch = selectedPriority === 'all' || request.priority === selectedPriority;
    return typeMatch && statusMatch && priorityMatch;
  });

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search requests, guests, or rooms..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-heritage-green/20 focus:border-heritage-green bg-white w-80"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-heritage-green/20 focus:border-heritage-green bg-white"
          >
            <option value="all">All Types</option>
            <option value="housekeeping">Housekeeping</option>
            <option value="maintenance">Maintenance</option>
            <option value="concierge">Concierge</option>
            <option value="dining">Dining</option>
            <option value="transport">Transport</option>
            <option value="other">Other</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-heritage-green/20 focus:border-heritage-green bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-heritage-green/20 focus:border-heritage-green bg-white"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <button onClick={openModal} className="bg-heritage-green text-white px-4 py-2 rounded-xl hover:bg-heritage-green/90 transition-colors font-medium flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Request</span>
        </button>
      </div>

      {/* Create New Request Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Create New Request" size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Guest Information */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Guest Information</h4>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600">Guest Name <span className="text-rose-500">*</span></label>
                <input value={guestName} onChange={(e) => setGuestName(e.target.value)} onBlur={handleGuestNameBlur} className="mt-1 w-full px-3 py-2 border rounded-lg" placeholder="Start typing guest name..." />
                {formErrors.guestName && <div className="text-rose-600 text-xs mt-1">{formErrors.guestName}</div>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600">Room Number</label>
                <input value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg bg-white" placeholder="Auto-filled when guest selected or enter manually" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600">Guest Contact (Optional)</label>
                <input value={guestContact} onChange={(e) => setGuestContact(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg" placeholder="Phone or email" />
              </div>
            </div>
          </div>

          {/* Request Details */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Request Details</h4>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600">Request Type <span className="text-rose-500">*</span></label>
                <select value={requestType} onChange={(e) => setRequestType(e.target.value as AssistanceRequest['requestType'])} className="mt-1 w-full px-3 py-2 border rounded-lg bg-white">
                  <option value="housekeeping">Housekeeping</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="concierge">Concierge</option>
                  <option value="dining">Dining</option>
                  <option value="transport">Transport</option>
                  <option value="other">Other</option>
                </select>
                {formErrors.requestType && <div className="text-rose-600 text-xs mt-1">{formErrors.requestType}</div>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600">Priority <span className="text-rose-500">*</span></label>
                <select value={priority} onChange={(e) => setPriority(e.target.value as AssistanceRequest['priority'])} className="mt-1 w-full px-3 py-2 border rounded-lg bg-white">
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                {formErrors.priority && <div className="text-rose-600 text-xs mt-1">{formErrors.priority}</div>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600">Description <span className="text-rose-500">*</span></label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg" rows={4} placeholder="Describe the guest's request or issue..."></textarea>
                <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                  <div>{description.length}/500</div>
                  {formErrors.description && <div className="text-rose-600">{formErrors.description}</div>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600">Estimated Completion</label>
                <div className="mt-1 text-sm text-gray-700">Est: {calcEstimatedTime(requestType)}</div>
              </div>
            </div>
          </div>

          {/* Assignment */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Assignment</h4>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600">Assign To <span className="text-rose-500">*</span></label>
                <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg bg-white">
                  <option value="Unassigned">Unassigned</option>
                  <option value="Housekeeping Team">Housekeeping Team</option>
                  <option value="Maintenance Team">Maintenance Team</option>
                  <option value="Electrical Team">Electrical Team</option>
                  <option value="Plumbing Team">Plumbing Team</option>
                  <option value="Concierge">Concierge</option>
                  <option value="Transport Team">Transport Team</option>
                  <option value="Kitchen">Kitchen</option>
                </select>
                {formErrors.assignedTo && <div className="text-rose-600 text-xs mt-1">{formErrors.assignedTo}</div>}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input id="notify" type="checkbox" checked={notifyAssignee} onChange={(e) => setNotifyAssignee(e.target.checked)} className="h-4 w-4" />
                  <label htmlFor="notify" className="text-sm text-gray-700">Notify Assignee</label>
                </div>
                <div className="text-xs text-gray-500">Notification methods: Push / Email / SMS (if available)</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-heritage-green text-white text-sm">Submit Request</button>
          </div>
        </form>
      </Modal>

      {/* Assistance Requests Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Guest Info</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-gray-900">{request.guestName}</div>
                      <div className="text-sm text-gray-500">Room {request.roomNumber}</div>
                      <div className="text-xs text-gray-400">{formatTime(request.requestTime)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getTypeIcon(request.requestType)}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(request.requestType)}`}>
                        {request.requestType.charAt(0).toUpperCase() + request.requestType.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                      {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <p className="text-sm text-gray-700 truncate">{request.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status.replace('-', ' ').charAt(0).toUpperCase() + request.status.replace('-', ' ').slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700">
                      {request.assignedTo || 'Unassigned'}
                    </div>
                    {request.estimatedTime && (
                      <div className="text-xs text-gray-500">Est: {request.estimatedTime}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="text-heritage-green hover:text-heritage-green/80 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      {request.status === 'pending' && (
                        <button className="text-blue-600 hover:text-blue-800 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      )}
                      {request.status === 'in-progress' && (
                        <button className="text-green-600 hover:text-green-800 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No assistance requests found for the selected filters.</p>
        </div>
      )}
    </div>
  );
};
