import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
export const GuestAssistance = () => {
    const [selectedType, setSelectedType] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedPriority, setSelectedPriority] = useState('all');
    const assistanceRequests = [
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
    const getTypeColor = (type) => {
        const colors = {
            housekeeping: 'bg-blue-100 text-blue-800 border-blue-200',
            maintenance: 'bg-orange-100 text-orange-800 border-orange-200',
            concierge: 'bg-purple-100 text-purple-800 border-purple-200',
            dining: 'bg-green-100 text-green-800 border-green-200',
            transport: 'bg-indigo-100 text-indigo-800 border-indigo-200',
            other: 'bg-gray-100 text-gray-800 border-gray-200'
        };
        return colors[type] || colors.other;
    };
    const getPriorityColor = (priority) => {
        const colors = {
            low: 'bg-green-100 text-green-800 border-green-200',
            medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            high: 'bg-orange-100 text-orange-800 border-orange-200',
            urgent: 'bg-red-100 text-red-800 border-red-200'
        };
        return colors[priority] || colors.low;
    };
    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
            completed: 'bg-green-100 text-green-800 border-green-200',
            cancelled: 'bg-red-100 text-red-800 border-red-200'
        };
        return colors[status] || colors.pending;
    };
    const getTypeIcon = (type) => {
        const icons = {
            housekeeping: '🧹',
            maintenance: '🔧',
            concierge: '🛎️',
            dining: '🍽️',
            transport: '🚗',
            other: '❓'
        };
        return icons[type] || icons.other;
    };
    const filteredRequests = assistanceRequests.filter(request => {
        const typeMatch = selectedType === 'all' || request.requestType === selectedType;
        const statusMatch = selectedStatus === 'all' || request.status === selectedStatus;
        const priorityMatch = selectedPriority === 'all' || request.priority === selectedPriority;
        return typeMatch && statusMatch && priorityMatch;
    });
    const formatTime = (timeString) => {
        return new Date(timeString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "relative", children: [_jsx("svg", { className: "w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }), _jsx("input", { type: "text", placeholder: "Search requests, guests, or rooms...", className: "pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-heritage-green/20 focus:border-heritage-green bg-white w-80" })] }), _jsxs("select", { value: selectedType, onChange: (e) => setSelectedType(e.target.value), className: "px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-heritage-green/20 focus:border-heritage-green bg-white", children: [_jsx("option", { value: "all", children: "All Types" }), _jsx("option", { value: "housekeeping", children: "Housekeeping" }), _jsx("option", { value: "maintenance", children: "Maintenance" }), _jsx("option", { value: "concierge", children: "Concierge" }), _jsx("option", { value: "dining", children: "Dining" }), _jsx("option", { value: "transport", children: "Transport" }), _jsx("option", { value: "other", children: "Other" })] }), _jsxs("select", { value: selectedStatus, onChange: (e) => setSelectedStatus(e.target.value), className: "px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-heritage-green/20 focus:border-heritage-green bg-white", children: [_jsx("option", { value: "all", children: "All Status" }), _jsx("option", { value: "pending", children: "Pending" }), _jsx("option", { value: "in-progress", children: "In Progress" }), _jsx("option", { value: "completed", children: "Completed" }), _jsx("option", { value: "cancelled", children: "Cancelled" })] }), _jsxs("select", { value: selectedPriority, onChange: (e) => setSelectedPriority(e.target.value), className: "px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-heritage-green/20 focus:border-heritage-green bg-white", children: [_jsx("option", { value: "all", children: "All Priority" }), _jsx("option", { value: "urgent", children: "Urgent" }), _jsx("option", { value: "high", children: "High" }), _jsx("option", { value: "medium", children: "Medium" }), _jsx("option", { value: "low", children: "Low" })] })] }), _jsxs("button", { className: "bg-heritage-green text-white px-4 py-2 rounded-xl hover:bg-heritage-green/90 transition-colors font-medium flex items-center space-x-2", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }), _jsx("span", { children: "New Request" })] })] }), _jsx("div", { className: "bg-white rounded-2xl border border-gray-100 overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 border-b border-gray-100", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Guest Info" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Type" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Priority" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Description" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Status" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Assigned To" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-100", children: filteredRequests.map((request) => (_jsxs("tr", { className: "hover:bg-gray-50 transition-colors", children: [_jsx("td", { className: "px-6 py-4", children: _jsxs("div", { children: [_jsx("div", { className: "font-semibold text-gray-900", children: request.guestName }), _jsxs("div", { className: "text-sm text-gray-500", children: ["Room ", request.roomNumber] }), _jsx("div", { className: "text-xs text-gray-400", children: formatTime(request.requestTime) })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "text-lg", children: getTypeIcon(request.requestType) }), _jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(request.requestType)}`, children: request.requestType.charAt(0).toUpperCase() + request.requestType.slice(1) })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`, children: request.priority.charAt(0).toUpperCase() + request.priority.slice(1) }) }), _jsx("td", { className: "px-6 py-4 max-w-xs", children: _jsx("p", { className: "text-sm text-gray-700 truncate", children: request.description }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`, children: request.status.replace('-', ' ').charAt(0).toUpperCase() + request.status.replace('-', ' ').slice(1) }) }), _jsxs("td", { className: "px-6 py-4", children: [_jsx("div", { className: "text-sm text-gray-700", children: request.assignedTo || 'Unassigned' }), request.estimatedTime && (_jsxs("div", { className: "text-xs text-gray-500", children: ["Est: ", request.estimatedTime] }))] }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { className: "text-heritage-green hover:text-heritage-green/80 transition-colors", children: _jsxs("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }), _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" })] }) }), request.status === 'pending' && (_jsx("button", { className: "text-blue-600 hover:text-blue-800 transition-colors", children: _jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6v6m0 0v6m0-6h6m-6 0H6" }) }) })), request.status === 'in-progress' && (_jsx("button", { className: "text-green-600 hover:text-green-800 transition-colors", children: _jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) }))] }) })] }, request.id))) })] }) }) }), filteredRequests.length === 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4", children: _jsx("svg", { className: "w-8 h-8 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" }) }) }), _jsx("p", { className: "text-gray-500 font-medium", children: "No assistance requests found for the selected filters." })] }))] }));
};
