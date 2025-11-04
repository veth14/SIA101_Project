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

  return (
    <div className="min-h-screen bg-[#F9F6EE]">
      {/* Light Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Subtle Light Orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 rounded-full blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl animate-pulse delay-1000 opacity-25"></div>
        <div className="absolute bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 rounded-full blur-3xl animate-pulse delay-2000 opacity-20"></div>
        
        {/* Light Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(134, 134, 134, 0.1) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">
      {/* Enhanced Header */}
      <div className="relative bg-gradient-to-br from-white via-green-50/20 to-green-500/5 rounded-3xl shadow-2xl border border-green-500/10 overflow-hidden mb-8">
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#82A33D] to-green-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                </div>
                <div className="space-y-2">
                  <h1 className="text-5xl font-black text-[#82A33D] drop-shadow-sm">
                    Tickets & Tasks
                  </h1>
                  <p className="text-xl text-gray-700 font-medium tracking-wide">
                    Manage maintenance tickets and tasks
                  </p>
                  <div className="flex items-center space-x-4 mt-4">
                    <div className="flex items-center space-x-2 bg-emerald-50 backdrop-blur-sm rounded-full px-4 py-2 border border-emerald-200">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-emerald-700">All systems operational</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-blue-50 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-200">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-blue-700">
                        Tuesday, Sep 24
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="relative group">
                <div className="bg-gradient-to-br from-white/90 to-green-500/5 backdrop-blur-xl rounded-3xl p-8 border border-green-500/20 shadow-xl group-hover:scale-105 transition-all duration-500">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#82A33D] to-green-400 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                  <div className="relative">
                    <p className="text-4xl font-black bg-gradient-to-r from-[#82A33D] to-green-600 bg-clip-text text-transparent drop-shadow-sm">
                      {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-gray-700 mt-2 font-semibold tracking-wide">Current Time</p>
                    <div className="mt-3 flex items-center justify-center space-x-2">
                      <div className="w-1 h-1 bg-[#82A33D] rounded-full animate-ping"></div>
                      <div className="w-1 h-1 bg-green-600 rounded-full animate-ping delay-75"></div>
                      <div className="w-1 h-1 bg-green-400 rounded-full animate-ping delay-150"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons and Search */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <button 
          onClick={() => setIsCreateTicketModalOpen(true)}
          className="bg-heritage-green text-white px-4 py-2 rounded-lg hover:bg-heritage-green/90 transition-colors"
        >
          Create New Ticket
        </button>
        
        {/* Search Bar */}
        <div className="flex-1 min-w-[200px] max-w-md">
          <input
            type="text"
            placeholder="Search tickets..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-heritage-green/50"
          />
        </div>
        
        <select className="border border-gray-300 rounded-lg px-3 py-2">
          <option>All Status</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
        <select className="border border-gray-300 rounded-lg px-3 py-2">
          <option>All Priority</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        
        {/* Clear Filters Button */}
        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300">
          Clear Filters
        </button>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Active Tickets</h2>
        </div>
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
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #MT-001
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  AC unit not cooling properly
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Room 205
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    High
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  John Smith
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    In Progress
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex flex-wrap gap-2">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition-colors">
                      Confirm Availability
                    </button>
                    <button 
                      onClick={() => openReportComplicationModal({
                        id: '#MT-001',
                        title: 'AC unit not cooling properly',
                        description: 'Guest reported AC unit making loud noise and not cooling properly.',
                        location: 'Room 205',
                        assignedTo: 'John Smith',
                        createdDate: 'Sep. 20, 11:15 AM',
                        dueDate: 'Sep. 20, 12:00 PM'
                      })}
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
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #MT-002
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Lobby lighting flickering
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Main Lobby
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Medium
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Mike Johnson
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    Open
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex flex-wrap gap-2">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition-colors">
                      Confirm Availability
                    </button>
                    <button 
                      onClick={() => openReportComplicationModal({
                        id: '#MT-002',
                        title: 'Lobby lighting flickering',
                        description: 'Lobby lights are flickering intermittently.',
                        location: 'Main Lobby',
                        assignedTo: 'Mike Johnson',
                        createdDate: 'Sep. 20, 9:00 AM',
                        dueDate: 'Sep. 20, 5:00 PM'
                      })}
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
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #MT-003
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Pool filter maintenance
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Pool Area
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    High
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Robert Brown
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex flex-wrap gap-2">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition-colors">
                      Confirm Availability
                    </button>
                    <button 
                      onClick={() => openReportComplicationModal({
                        id: '#MT-003',
                        title: 'Pool filter maintenance',
                        description: 'Regular pool filter cleaning and maintenance.',
                        location: 'Pool Area',
                        assignedTo: 'Robert Brown',
                        createdDate: 'Sep. 19, 2:00 PM',
                        dueDate: 'Sep. 20, 10:00 AM'
                      })}
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
              placeholder="Conditioning not working"
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
              placeholder="Guest in Room 205 reported that the AC unit is making loud noise and not cooling properly."
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
            <select
              value={createTicketForm.roomNumber}
              onChange={(e) => setCreateTicketForm({ ...createTicketForm, roomNumber: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-heritage-green/50"
            >
              <option value="">Select Room</option>
              <option value="Room 205">Room 205</option>
              <option value="Room 301">Room 301</option>
              <option value="Main Lobby">Main Lobby</option>
              <option value="Pool Area">Pool Area</option>
            </select>
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
              placeholder="Replaced AC filter and tested unit. Cooling properly now."
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
