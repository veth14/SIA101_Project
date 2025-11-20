import React, { useState } from 'react';
import { Modal } from '../../admin/Modal';

const TicketsTasksPage: React.FC = () => {
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);
  const [isReportComplicationModalOpen, setIsReportComplicationModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  // Form states for Create Ticket
  const [createTicketForm, setCreateTicketForm] = useState({
    title: '',
    description: '',
    category: 'Maintenance',
    priority: 'Medium',
    roomNumber: '',
    dueDateTime: '',
  });

  // Form states for Report Complication
  const [reportComplicationForm, setReportComplicationForm] = useState({
    description: '',
    priorityLevel: 'Medium',
    dueDateTime: '',
  });

  // Filter states for Active Tickets
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    priority: '',
    status: '',
  });

  // Mock data - replace with actual backend data
  const activeTickets: any[] = [];
  const completedTickets: any[] = [];

  const handleCreateTicket = () => {
    // Handle ticket creation logic here
    console.log('Creating ticket:', createTicketForm);
    setIsCreateTicketModalOpen(false);
    // Reset form
    setCreateTicketForm({
      title: '',
      description: '',
      category: 'Maintenance',
      priority: 'Medium',
      roomNumber: '',
      dueDateTime: '',
    });
  };

  const handleReportComplication = () => {
    // Handle report complication logic here
    console.log('Reporting complication for ticket:', selectedTicket, reportComplicationForm);
    setIsReportComplicationModalOpen(false);
    // Reset form
    setReportComplicationForm({
      description: '',
      priorityLevel: 'Medium',
      dueDateTime: '',
    });
    setSelectedTicket(null);
  };

  const openReportComplicationModal = (ticket: any) => {
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

  return (
    <div className="min-h-screen bg-[#F9F6EE]">
      {/* Main Content Container */}
      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">
        
        {/* Create Ticket Button */}
        <div className="mb-6">
          <button 
            onClick={() => setIsCreateTicketModalOpen(true)}
            className="bg-heritage-green text-white px-4 py-2 rounded-lg hover:bg-heritage-green/90 transition-colors"
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
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
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
                {activeTickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                      No active tickets found
                    </td>
                  </tr>
                ) : (
                  activeTickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {ticket.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ticket.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ticket.location}
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
                          <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition-colors">
                            Confirm Availability
                          </button>
                          <button 
                            onClick={() => openReportComplicationModal(ticket)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                          >
                            Report Complication
                          </button>
                          <button className="bg-heritage-green text-white px-3 py-1 rounded text-xs hover:bg-heritage-green/90 transition-colors">
                            Mark as Completed
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
                        {ticket.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ticket.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ticket.location}
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
                        {ticket.completedDate}
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
        onClose={() => setIsCreateTicketModalOpen(false)}
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
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={createTicketForm.priority}
                onChange={(e) => setCreateTicketForm({ ...createTicketForm, priority: e.target.value })}
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
              onClick={() => setIsCreateTicketModalOpen(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateTicket}
              className="px-6 py-2 bg-heritage-green text-white rounded-lg hover:bg-heritage-green/90 transition-colors"
            >
              Create Ticket
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
              <h3 className="font-semibold text-gray-900 mb-1">{selectedTicket.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{selectedTicket.location}</p>
              <div className="flex flex-col gap-1 text-xs text-gray-500">
                <div>
                  <span className="font-medium">Due:</span> {selectedTicket.dueDate}
                </div>
                <div>
                  <span className="font-medium">Created:</span> {selectedTicket.createdDate}
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
                    onChange={(e) => setReportComplicationForm({ ...reportComplicationForm, priorityLevel: e.target.value })}
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
              className="px-6 py-2 bg-heritage-green text-white rounded-lg hover:bg-heritage-green/90 transition-colors"
            >
              Report Task
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TicketsTasksPage;