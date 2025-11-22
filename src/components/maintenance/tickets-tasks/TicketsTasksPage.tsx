import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Modal } from '../../admin/Modal';
import { useAuth } from '../../../hooks/useAuth';
import { 
  Ticket, 
  createTicket, 
  subscribeToActiveTickets, 
  subscribeToCompletedTickets,
  markTicketCompleted,
  updateTicketStatus,
  updateTicketDetails,
  archiveTicket,
  searchTickets
} from './ticketsService';

const TicketsTasksPage: React.FC = () => {
  const { user } = useAuth();
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);
  const [isReportComplicationModalOpen, setIsReportComplicationModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states for Create Ticket
  const [createTicketForm, setCreateTicketForm] = useState({
    title: '',
    description: '',
    category: 'Maintenance',
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    roomNumber: '',
    dueDateTime: '',
  });

  // Form states for Report Complication
  const [reportComplicationForm, setReportComplicationForm] = useState({
    description: '',
    priorityLevel: 'Medium' as 'High' | 'Medium' | 'Low',
    dueDateTime: '',
  });

  // Filter states for Active Tickets
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    priority: '',
    status: '',
  });

  // Ticket data
  const [activeTickets, setActiveTickets] = useState<Ticket[]>([]);
  const [completedTickets, setCompletedTickets] = useState<Ticket[]>([]);
  const [filteredActiveTickets, setFilteredActiveTickets] = useState<Ticket[]>([]);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribeActive = subscribeToActiveTickets((tickets) => {
      setActiveTickets(tickets);
    });

    const unsubscribeCompleted = subscribeToCompletedTickets((tickets) => {
      setCompletedTickets(tickets);
    });

    return () => {
      unsubscribeActive();
      unsubscribeCompleted();
    };
  }, []);

  // Apply filters to active tickets
  useEffect(() => {
    const applyFilters = async () => {
      if (filters.search || filters.category || filters.priority || filters.status) {
        const filtered = await searchTickets({
          search: filters.search,
          category: filters.category,
          priority: filters.priority,
          status: filters.status,
          isCompleted: false,
        });
        setFilteredActiveTickets(filtered);
      } else {
        setFilteredActiveTickets(activeTickets);
      }
    };

    applyFilters();
  }, [filters, activeTickets]);

  const resetCreateForm = () => {
    setCreateTicketForm({
      title: '',
      description: '',
      category: 'Maintenance',
      priority: 'Medium',
      roomNumber: '',
      dueDateTime: '',
    });
  };

  const closeCreateModal = () => {
    setIsCreateTicketModalOpen(false);
    // clear fields when modal closes
    resetCreateForm();
  };

  const handleCreateTicket = async () => {
    if (!createTicketForm.title || !createTicketForm.dueDateTime) {
      setError('Please fill in all required fields');
      return;
    }

    if (!user?.email) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createTicket({
        taskTitle: createTicketForm.title,
        description: createTicketForm.description,
        category: createTicketForm.category,
        priority: createTicketForm.priority,
        roomNumber: createTicketForm.roomNumber,
        dueDateTime: createTicketForm.dueDateTime,
        createdBy: user.email,
      });

      // Close and reset form after successful create
      setIsCreateTicketModalOpen(false);
      resetCreateForm();
    } catch (err: any) {
      setError(err.message || 'Failed to create ticket');
      console.error('Error creating ticket:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReportComplication = async () => {
    if (!selectedTicket || !reportComplicationForm.description) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Instead of creating a new ticket, update the current ticket's details
      await updateTicketDetails(selectedTicket.id, {
        description: `Original Ticket: ${selectedTicket.ticketNumber}\n\n${reportComplicationForm.description}`,
        priority: reportComplicationForm.priorityLevel,
        dueDateTime: reportComplicationForm.dueDateTime,
      });

      setIsReportComplicationModalOpen(false);
      // Reset form
      setReportComplicationForm({
        description: '',
        priorityLevel: 'Medium',
        dueDateTime: '',
      });
      setSelectedTicket(null);
    } catch (err: any) {
      setError(err.message || 'Failed to report complication');
      console.error('Error reporting complication:', err);
    } finally {
      setLoading(false);
    }
  };

  const openReportComplicationModal = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsReportComplicationModalOpen(true);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      priority: '',
      status: '',
    });
  };

  const handleMarkCompleted = async (ticketId: string) => {
    setLoading(true);
    setError(null);

    try {
      await markTicketCompleted(ticketId);
    } catch (err: any) {
      setError(err.message || 'Failed to mark ticket as completed');
      console.error('Error marking ticket completed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (ticketId: string, status: 'In Progress') => {
    setLoading(true);
    setError(null);

    try {
      await updateTicketStatus(ticketId, status);
    } catch (err: any) {
      setError(err.message || 'Failed to update ticket status');
      console.error('Error updating ticket status:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  // ErrorModal: appears on top of everything. Uses a portal with a higher z-index
  const ErrorModal: React.FC<{ open: boolean; message: string | null; onClose: () => void }> = ({ open, message, onClose }) => {
    if (!open) return null;
    return createPortal(
      <div className="fixed inset-0 z-[1000000] flex items-center justify-center p-4 bg-black/60">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <div className="px-6 py-4 border-b border-heritage-neutral/10">
            <h3 className="text-xl font-semibold text-gray-900">Error</h3>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-700">{message}</p>
            <div className="flex justify-end mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-heritage-green text-white rounded-lg hover:bg-heritage-green/90"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className="min-h-screen bg-[#F9F6EE]">
      {/* Main Content Container */}
      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">
        
        {/* Error Message */}
              {/* Error modal will appear on top of any other modal */}
              {/* Rendered via portal below as ErrorModal */}

        {/* Create Ticket Button */}
        <div className="mb-6">
          <button 
            onClick={() => setIsCreateTicketModalOpen(true)}
            disabled={loading}
            className="bg-heritage-green text-white px-4 py-2 rounded-lg hover:bg-heritage-green/90 transition-colors disabled:opacity-50"
          >
            Create New Ticket
          </button>
        </div>

        {/* Active Tickets Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Active Tickets</h2>
          </div>

          {/* Filter Bar for Active Tickets */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Search Bar */}
              <div className="flex-1 min-w-[200px] max-w-md">
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-heritage-green/50"
                />
              </div>
              
              {/* Category Filter */}
              <select 
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">All Categories</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Housekeeping">Housekeeping</option>
              </select>

              {/* Priority Filter */}
              <select 
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              {/* Status Filter */}
              <select 
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">All Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
              </select>
              
              {/* Clear Filters Button */}
              <button 
                onClick={handleClearFilters}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Active Tickets Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredActiveTickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                      No active tickets found
                    </td>
                  </tr>
                ) : (
                  filteredActiveTickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {ticket.ticketNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="font-medium">{ticket.taskTitle}</div>
                        <div className="text-gray-500 text-xs">{ticket.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Room {ticket.roomNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          ticket.priority === 'High' ? 'bg-red-100 text-red-800' :
                          ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ticket.assignedTo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          ticket.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-wrap gap-2">
                          {ticket.status === 'Open' && (
                            <button 
                              onClick={() => handleUpdateStatus(ticket.id, 'In Progress')}
                              disabled={loading}
                              className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition-colors disabled:opacity-50"
                            >
                              Start Task
                            </button>
                          )}
                          <button 
                            onClick={() => openReportComplicationModal(ticket)}
                            disabled={loading}
                            className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors disabled:opacity-50"
                          >
                            Report Issue
                          </button>
                          <button 
                            onClick={() => handleMarkCompleted(ticket.id)}
                            disabled={loading}
                            className="bg-heritage-green text-white px-3 py-1 rounded text-xs hover:bg-heritage-green/90 transition-colors disabled:opacity-50"
                          >
                            Complete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Completed Tickets Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Completed Tickets</h2>
          </div>

          {/* Completed Tickets Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completed Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {completedTickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                      No completed tickets found
                    </td>
                  </tr>
                ) : (
                  completedTickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {ticket.ticketNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="font-medium">{ticket.taskTitle}</div>
                        <div className="text-gray-500 text-xs">{ticket.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Room {ticket.roomNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          ticket.priority === 'High' ? 'bg-red-100 text-red-800' :
                          ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ticket.assignedTo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(ticket.completedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={async () => {
                              setLoading(true);
                              setError(null);
                              try {
                                await archiveTicket(ticket.id);
                              } catch (err: any) {
                                setError(err.message || 'Failed to archive ticket');
                                console.error('Error archiving ticket:', err);
                              } finally {
                                setLoading(false);
                              }
                            }}
                            disabled={loading}
                            className="bg-gray-400 text-white px-3 py-1 rounded text-xs hover:bg-gray-500 transition-colors disabled:opacity-50"
                          >
                            Archive Ticket
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Ticket Modal */}
      <Modal
        isOpen={isCreateTicketModalOpen}
        onClose={closeCreateModal}
        title="Create Ticket"
        size="md"
      >
        <div className="space-y-4">
          {/* Task Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title
            </label>
            <input
              type="text"
              value={createTicketForm.title}
              onChange={(e) => setCreateTicketForm({ ...createTicketForm, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-heritage-green/50"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={createTicketForm.description}
              onChange={(e) => setCreateTicketForm({ ...createTicketForm, description: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-heritage-green/50"
            />
          </div>

          {/* Category and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={createTicketForm.category}
                onChange={(e) => setCreateTicketForm({ ...createTicketForm, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-heritage-green/50"
              >
                <option value="Maintenance">Maintenance</option>
                <option value="Housekeeping">Housekeeping</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={createTicketForm.priority}
                onChange={(e) => setCreateTicketForm({ ...createTicketForm, priority: e.target.value as 'High' | 'Medium' | 'Low' })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-heritage-green/50"
              >
                <option value="High">Urgent</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Room Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Number
            </label>
            <input
              type="text"
              value={createTicketForm.roomNumber}
              onChange={(e) => setCreateTicketForm({ ...createTicketForm, roomNumber: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-heritage-green/50"
            />
          </div>

          {/* Due Date & Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date & Time
            </label>
            <input
              type="datetime-local"
              value={createTicketForm.dueDateTime}
              onChange={(e) => setCreateTicketForm({ ...createTicketForm, dueDateTime: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-heritage-green/50"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={closeCreateModal}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateTicket}
              disabled={loading}
              className="px-6 py-2 bg-heritage-green text-white rounded-lg hover:bg-heritage-green/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Ticket'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Report Complication Modal */}
      <Modal
        isOpen={isReportComplicationModalOpen}
        onClose={() => {
          setIsReportComplicationModalOpen(false);
          setSelectedTicket(null);
        }}
        title="Report Task Complication"
        size="md"
      >
        <div className="space-y-4">
          {/* Ticket Info Header */}
          {selectedTicket && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-gray-900 mb-1">{selectedTicket.taskTitle}</h3>
              <p className="text-sm text-gray-600 mb-3">Room {selectedTicket.roomNumber}</p>
              <div className="flex flex-col gap-1 text-xs text-gray-500">
                <div>
                  <span className="font-medium">Ticket:</span> {selectedTicket.ticketNumber}
                </div>
                <div>
                  <span className="font-medium">Due:</span> {formatDate(selectedTicket.dueDate)}
                </div>
                <div>
                  <span className="font-medium">Created:</span> {formatDate(selectedTicket.createdAt)}
                </div>
              </div>
            </div>
          )}

          {/* Description of Issue */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description of Issue
            </label>
            <textarea
              value={reportComplicationForm.description}
              onChange={(e) => setReportComplicationForm({ ...reportComplicationForm, description: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-heritage-green/50"
            />
          </div>

          {/* Priority Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority Level
            </label>
            <div className="flex gap-4">
              {['High', 'Medium', 'Low'].map((level) => (
                <label key={level} className="flex items-center">
                  <input
                    type="radio"
                    name="priorityLevel"
                    value={level}
                    checked={reportComplicationForm.priorityLevel === level}
                    onChange={(e) => setReportComplicationForm({ ...reportComplicationForm, priorityLevel: e.target.value as 'High' | 'Medium' | 'Low' })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">{level}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Due Date & Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date & Time
            </label>
            <input
              type="datetime-local"
              value={reportComplicationForm.dueDateTime}
              onChange={(e) => setReportComplicationForm({ ...reportComplicationForm, dueDateTime: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-heritage-green/50"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => {
                setIsReportComplicationModalOpen(false);
                setSelectedTicket(null);
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleReportComplication}
              disabled={loading}
              className="px-6 py-2 bg-heritage-green text-white rounded-lg hover:bg-heritage-green/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Reporting...' : 'Report Task'}
            </button>
          </div>
        </div>
      </Modal>
      {/* Error modal (renders after other modals so it appears on top) */}
      <ErrorModal open={!!error} message={error} onClose={() => setError(null)} />
    </div>
  );
};

export default TicketsTasksPage;