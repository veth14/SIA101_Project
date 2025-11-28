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

  // Filter states for Completed Tickets
  const [completedFilters, setCompletedFilters] = useState({
    search: '',
    category: '',
    priority: '',
    date: '',
  });
  const completedDateInputRef = React.useRef<HTMLInputElement>(null);

  // Ticket data
  const [activeTickets, setActiveTickets] = useState<Ticket[]>([]);
  const [completedTickets, setCompletedTickets] = useState<Ticket[]>([]);
  const [filteredCompletedTickets, setFilteredCompletedTickets] = useState<Ticket[]>([]);
  const [filteredActiveTickets, setFilteredActiveTickets] = useState<Ticket[]>([]);

  // Pagination
  const [activeTicketsPage, setActiveTicketsPage] = useState(1);
  const [completedTicketsPage, setCompletedTicketsPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

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

  // Apply filters to completed tickets
  useEffect(() => {
    const applyCompletedFilters = async () => {
      if (completedFilters.search || completedFilters.category || completedFilters.priority || completedFilters.date) {
        const filtered = await searchTickets({
          search: completedFilters.search,
          category: completedFilters.category,
          priority: completedFilters.priority,
          // backend may support a date param; pass date as provided
          date: completedFilters.date,
          isCompleted: true,
        } as any);
        setFilteredCompletedTickets(filtered);
      } else {
        setFilteredCompletedTickets(completedTickets);
      }
    };

    applyCompletedFilters();
  }, [completedFilters, completedTickets]);

  // Reset pagination when filters change
  useEffect(() => {
    setActiveTicketsPage(1);
  }, [filters, filteredActiveTickets]);

  useEffect(() => {
    setCompletedTicketsPage(1);
  }, [completedFilters, filteredCompletedTickets]);

  // Pagination calculations for Active Tickets
  const activeTotalPages = Math.max(1, Math.ceil(filteredActiveTickets.length / ITEMS_PER_PAGE));
  const activeDisplayTickets = filteredActiveTickets.slice(
    (activeTicketsPage - 1) * ITEMS_PER_PAGE,
    activeTicketsPage * ITEMS_PER_PAGE
  );

  // Pagination calculations for Completed Tickets
  const completedTotalPages = Math.max(1, Math.ceil(filteredCompletedTickets.length / ITEMS_PER_PAGE));
  const completedDisplayTickets = filteredCompletedTickets.slice(
    (completedTicketsPage - 1) * ITEMS_PER_PAGE,
    completedTicketsPage * ITEMS_PER_PAGE
  );

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

  const handleClearCompletedFilters = () => {
    setCompletedFilters({
      search: '',
      category: '',
      priority: '',
      date: '',
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
    <>
      <style>{`
        @keyframes table-slide-in {
          0% {
            opacity: 0;
            transform: translateX(-30px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        
        .animate-table-slide-in {
          animation: table-slide-in 0.7s ease-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(130, 163, 61, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(130, 163, 61, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(130, 163, 61, 0.5);
        }
      `}</style>

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
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-heritage-green to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:from-heritage-green/90 hover:to-emerald-600/90 hover:shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New Ticket
            </button>
          </div>

          {/* Active Tickets Section */}
          <div className="flex flex-col h-full overflow-hidden bg-white border shadow-md rounded-xl border-gray-200/70">
            {/* Header with Search and Controls */}
            <div className="p-6 border-b border-gray-200/70 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="flex items-center gap-3 text-2xl font-black text-gray-900">
                    <div className="p-2 bg-[#82A33D]/10 rounded-xl">
                      <svg className="w-6 h-6 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    Active Tickets
                  </h3>
                  <p className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                    <span className="inline-flex items-center px-2 py-1 bg-[#82A33D]/10 text-[#82A33D] rounded-lg text-xs font-semibold">
                      {filteredActiveTickets.length} {filteredActiveTickets.length === 1 ? 'ticket' : 'tickets'}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span>In Progress & Open</span>
                  </p>
                </div>
              </div>

              {/* Search and Filter Row */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {/* Search */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-[#82A33D] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium placeholder:text-gray-400 hover:border-gray-300"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium hover:border-gray-300 cursor-pointer"
                >
                  <option value="">📊 All Categories</option>
                  <option value="Maintenance">🔧 Maintenance</option>
                  <option value="Housekeeping">🏠 Housekeeping</option>
                </select>

                {/* Priority Filter */}
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                  className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium hover:border-gray-300 cursor-pointer"
                >
                  <option value="">⚡ All Priority</option>
                  <option value="High">🔴 High</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="Low">🟢 Low</option>
                </select>

                {/* Status Filter */}
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium hover:border-gray-300 cursor-pointer"
                >
                  <option value="">📋 All Status</option>
                  <option value="Open">🔵 Open</option>
                  <option value="In Progress">🟠 In Progress</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-x-auto">
              {filteredActiveTickets.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="mb-4 text-5xl text-gray-400">🎫</div>
                  <p className="font-medium text-gray-500">No active tickets found</p>
                  <p className="mt-1 text-sm text-gray-400">Create a new ticket to get started</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50">
                    <tr>
                      <th className="px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase">Ticket ID</th>
                      <th className="px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase">Description</th>
                      <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">Location</th>
                      <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">Priority</th>
                      <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">Assigned To</th>
                      <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">Status</th>
                      <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activeDisplayTickets.map((ticket, index) => (
                      <tr 
                        key={ticket.id}
                        style={{ animationDelay: `${index * 50}ms`, height: '74px' }}
                        className="group transition-all duration-300 hover:shadow-sm hover:bg-gray-50"
                      >
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#82A33D]/10">
                              <svg className="w-4 h-4 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                              </svg>
                            </div>
                            <div className="text-sm font-bold text-gray-900 transition-colors group-hover:text-[#82A33D]">
                              {ticket.ticketNumber}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="max-w-xs">
                            <div className="text-sm font-semibold text-gray-900">{ticket.taskTitle}</div>
                            <div className="text-xs text-gray-500 truncate">{ticket.description}</div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">Room {ticket.roomNumber}</div>
                        </td>
                        <td className="px-6 py-5 text-center whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                            ticket.priority === 'High' 
                              ? 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200'
                              : ticket.priority === 'Medium' 
                              ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200'
                              : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 mr-2 rounded-full ${
                              ticket.priority === 'High' ? 'bg-red-500' :
                              ticket.priority === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                            }`} />
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{ticket.assignedTo}</div>
                        </td>
                        <td className="px-6 py-5 text-center whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                            ticket.status === 'In Progress' 
                              ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200'
                              : 'bg-gradient-to-r from-blue-100 to-blue-100 text-blue-800 border border-blue-200'
                          }`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-2 flex-wrap">
                            {ticket.status === 'Open' && (
                              <button 
                                onClick={() => handleUpdateStatus(ticket.id, 'In Progress')}
                                disabled={loading}
                                className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50"
                              >
                                Confirm Availability
                              </button>
                            )}
                            <button 
                              onClick={() => openReportComplicationModal(ticket)}
                              disabled={loading}
                              className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-100 rounded-lg hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
                            >
                              Report Complication
                            </button>
                            <button 
                              onClick={() => handleMarkCompleted(ticket.id)}
                              disabled={loading}
                              className="px-3 py-1.5 text-xs font-bold text-[#82A33D] bg-[#82A33D]/10 rounded-lg hover:bg-[#82A33D] hover:text-white transition-all disabled:opacity-50"
                            >
                              Mark as Completed
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination for Active Tickets */}
            {activeTotalPages > 1 && (
              <div className="p-4 border-t border-gray-100 bg-white/50">
                <div className="flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTicketsPage(Math.max(1, activeTicketsPage - 1))}
                      disabled={activeTicketsPage === 1}
                      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(7, activeTotalPages) }, (_, i) => {
                        let pageNum: number;
                        if (activeTotalPages <= 7) {
                          pageNum = i + 1;
                        } else if (activeTicketsPage <= 4) {
                          pageNum = i + 1;
                        } else if (activeTicketsPage >= activeTotalPages - 3) {
                          pageNum = activeTotalPages - 6 + i;
                        } else {
                          pageNum = activeTicketsPage - 3 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setActiveTicketsPage(pageNum)}
                            className={`min-w-[40px] px-3 py-2 text-sm font-medium rounded-md transition-all ${
                              activeTicketsPage === pageNum
                                ? 'bg-[#82A33D] text-white shadow-sm'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setActiveTicketsPage(Math.min(activeTotalPages, activeTicketsPage + 1))}
                      disabled={activeTicketsPage === activeTotalPages}
                      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
            </div>

          {/* Completed Tickets Section */}
          <div className="flex flex-col h-full overflow-hidden bg-white border shadow-md rounded-xl border-gray-200/70">
            {/* Header with Search and Controls */}
            <div className="p-6 border-b border-gray-200/70 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="flex items-center gap-3 text-2xl font-black text-gray-900">
                    <div className="p-2 bg-[#82A33D]/10 rounded-xl">
                      <svg className="w-6 h-6 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    Completed Tickets
                  </h3>
                  <p className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                    <span className="inline-flex items-center px-2 py-1 bg-[#82A33D]/10 text-[#82A33D] rounded-lg text-xs font-semibold">
                      {filteredCompletedTickets.length} {filteredCompletedTickets.length === 1 ? 'ticket' : 'tickets'}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span>Finished Tasks</span>
                  </p>
                </div>
              </div>

              {/* Search and Filter Row */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {/* Search */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-[#82A33D] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search completed tickets..."
                    value={completedFilters.search}
                    onChange={(e) => setCompletedFilters({ ...completedFilters, search: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium placeholder:text-gray-400 hover:border-gray-300"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={completedFilters.category}
                  onChange={(e) => setCompletedFilters({ ...completedFilters, category: e.target.value })}
                  className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium hover:border-gray-300 cursor-pointer"
                >
                  <option value="">📊 All Categories</option>
                  <option value="Maintenance">🔧 Maintenance</option>
                  <option value="Housekeeping">🏠 Housekeeping</option>
                </select>

                {/* Priority Filter */}
                <select
                  value={completedFilters.priority}
                  onChange={(e) => setCompletedFilters({ ...completedFilters, priority: e.target.value })}
                  className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium hover:border-gray-300 cursor-pointer"
                >
                  <option value="">⚡ All Priority</option>
                  <option value="High">🔴 High</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="Low">🟢 Low</option>
                </select>

                {/* Date Filter */}
                <div className="relative">
                  <input
                    ref={completedDateInputRef}
                    type="date"
                    value={completedFilters.date}
                    onChange={(e) => setCompletedFilters({ ...completedFilters, date: e.target.value })}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm transition-all font-medium hover:border-gray-300 cursor-pointer"
                    style={{ 
                      colorScheme: 'light',
                      ...((!completedFilters.date) && {
                        position: 'relative',
                        zIndex: 1,
                        opacity: 0,
                        pointerEvents: 'none'
                      })
                    }}
                  />
                  {!completedFilters.date && (
                    <button
                      type="button"
                      onClick={() => completedDateInputRef.current?.showPicker?.()}
                      className="absolute inset-0 flex items-center pl-4 text-sm text-gray-500 font-medium bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all cursor-pointer z-10"
                    >
                      📅 All Dates
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-x-auto">
              {filteredCompletedTickets.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="mb-4 text-5xl text-gray-400">🎫</div>
                  <p className="font-medium text-gray-500">No completed tickets found</p>
                  <p className="mt-1 text-sm text-gray-400">Completed tasks will appear here</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50">
                    <tr>
                      <th className="px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase">Ticket ID</th>
                      <th className="px-6 py-5 text-xs font-black tracking-wider text-left text-gray-700 uppercase">Description</th>
                      <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">Location</th>
                      <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">Priority</th>
                      <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">Assigned To</th>
                      <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">Completed Date</th>
                      <th className="px-6 py-5 text-xs font-black tracking-wider text-center text-gray-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {completedDisplayTickets.map((ticket, index) => (
                      <tr 
                        key={ticket.id}
                        style={{ animationDelay: `${index * 50}ms`, height: '74px' }}
                        className="group transition-all duration-300 hover:shadow-sm hover:bg-gray-50"
                      >
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#82A33D]/10">
                              <svg className="w-4 h-4 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="text-sm font-bold text-gray-900 transition-colors group-hover:text-[#82A33D]">
                              {ticket.ticketNumber}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="max-w-xs">
                            <div className="text-sm font-semibold text-gray-900">{ticket.taskTitle}</div>
                            <div className="text-xs text-gray-500 truncate">{ticket.description}</div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">Room {ticket.roomNumber}</div>
                        </td>
                        <td className="px-6 py-5 text-center whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                            ticket.priority === 'High' 
                              ? 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200'
                              : ticket.priority === 'Medium' 
                              ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200'
                              : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 mr-2 rounded-full ${
                              ticket.priority === 'High' ? 'bg-red-500' :
                              ticket.priority === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                            }`} />
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{ticket.assignedTo}</div>
                        </td>
                        <td className="px-6 py-5 text-center whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{formatDate(ticket.completedAt)}</div>
                        </td>
                        <td className="px-6 py-5 text-center whitespace-nowrap">
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
                            className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-600 hover:text-white transition-all disabled:opacity-50"
                          >
                            Archive Ticket
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination for Completed Tickets */}
            {completedTotalPages > 1 && (
              <div className="p-4 border-t border-gray-100 bg-white/50">
                <div className="flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCompletedTicketsPage(Math.max(1, completedTicketsPage - 1))}
                      disabled={completedTicketsPage === 1}
                      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(7, completedTotalPages) }, (_, i) => {
                        let pageNum: number;
                        if (completedTotalPages <= 7) {
                          pageNum = i + 1;
                        } else if (completedTicketsPage <= 4) {
                          pageNum = i + 1;
                        } else if (completedTicketsPage >= completedTotalPages - 3) {
                          pageNum = completedTotalPages - 6 + i;
                        } else {
                          pageNum = completedTicketsPage - 3 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCompletedTicketsPage(pageNum)}
                            className={`min-w-[40px] px-3 py-2 text-sm font-medium rounded-md transition-all ${
                              completedTicketsPage === pageNum
                                ? 'bg-[#82A33D] text-white shadow-sm'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setCompletedTicketsPage(Math.min(completedTotalPages, completedTicketsPage + 1))}
                      disabled={completedTicketsPage === completedTotalPages}
                      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
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
              data-autofocus="true"
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
    </>
  );
};

export default TicketsTasksPage;