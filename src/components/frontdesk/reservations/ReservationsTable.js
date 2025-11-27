import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DataTable } from '../../admin/DataTable';
const ReservationsTable = ({ reservations, onRowClick, onCheckIn, onCheckOut, onEdit, onCancel }) => {
    const getStatusBadge = (status) => {
        const statusConfig = {
            confirmed: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Confirmed' },
            'checked-in': { bg: 'bg-green-100', text: 'text-green-800', label: 'Checked In' },
            'checked-out': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Checked Out' },
            cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' }
        };
        const config = statusConfig[status] || statusConfig.confirmed;
        return (_jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`, children: config.label }));
    };
    const getPaymentBadge = (status) => {
        const paymentConfig = {
            paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Paid' },
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
            refunded: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Refunded' }
        };
        const config = paymentConfig[status] || paymentConfig.pending;
        return (_jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`, children: config.label }));
    };
    const getActions = (reservation) => (_jsxs("div", { className: "flex space-x-2", children: [reservation.status === 'confirmed' && (_jsx("button", { onClick: (e) => {
                    e.stopPropagation();
                    onCheckIn(reservation);
                }, className: "text-green-600 hover:text-green-900 text-sm font-medium px-2 py-1 rounded hover:bg-green-50", children: "Check In" })), reservation.status === 'checked-in' && (_jsx("button", { onClick: (e) => {
                    e.stopPropagation();
                    onCheckOut(reservation);
                }, className: "text-blue-600 hover:text-blue-900 text-sm font-medium px-2 py-1 rounded hover:bg-blue-50", children: "Check Out" })), reservation.status !== 'cancelled' && reservation.status !== 'checked-out' && (_jsx("button", { onClick: (e) => {
                    e.stopPropagation();
                    onEdit(reservation);
                }, className: "text-indigo-600 hover:text-indigo-900 text-sm font-medium px-2 py-1 rounded hover:bg-indigo-50", children: "Edit" })), reservation.status === 'confirmed' && (_jsx("button", { onClick: (e) => {
                    e.stopPropagation();
                    onCancel(reservation);
                }, className: "text-red-600 hover:text-red-900 text-sm font-medium px-2 py-1 rounded hover:bg-red-50", children: "Cancel" }))] }));
    const columns = [
        {
            key: 'id',
            label: 'Booking ID',
            sortable: true,
            render: (value) => (_jsxs("span", { className: "font-mono text-sm text-gray-600", children: ["#", value.slice(-6)] }))
        },
        {
            key: 'guestName',
            label: 'Guest Name',
            sortable: true,
            render: (value, row) => (_jsxs("div", { children: [_jsx("div", { className: "font-medium text-gray-900", children: value }), _jsx("div", { className: "text-sm text-gray-500", children: row.email })] }))
        },
        {
            key: 'roomType',
            label: 'Room Details',
            render: (value, row) => (_jsxs("div", { children: [_jsx("div", { className: "font-medium text-gray-900", children: value }), row.roomNumber && (_jsxs("div", { className: "text-sm text-gray-500", children: ["Room ", row.roomNumber] }))] }))
        },
        {
            key: 'checkIn',
            label: 'Check-in',
            sortable: true,
            render: (value) => (_jsxs("div", { className: "text-sm", children: [_jsx("div", { className: "font-medium text-gray-900", children: new Date(value).toLocaleDateString() }), _jsx("div", { className: "text-gray-500", children: new Date(value).toLocaleDateString('en-US', { weekday: 'short' }) })] }))
        },
        {
            key: 'checkOut',
            label: 'Check-out',
            sortable: true,
            render: (value) => (_jsxs("div", { className: "text-sm", children: [_jsx("div", { className: "font-medium text-gray-900", children: new Date(value).toLocaleDateString() }), _jsx("div", { className: "text-gray-500", children: new Date(value).toLocaleDateString('en-US', { weekday: 'short' }) })] }))
        },
        {
            key: 'guests',
            label: 'Guests',
            render: (value) => (_jsxs("div", { className: "flex items-center", children: [_jsx("svg", { className: "w-4 h-4 text-gray-400 mr-1", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { d: "M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" }) }), _jsx("span", { className: "text-sm font-medium text-gray-900", children: value })] }))
        },
        {
            key: 'status',
            label: 'Status',
            render: (value) => getStatusBadge(value)
        },
        {
            key: 'paymentStatus',
            label: 'Payment',
            render: (value) => getPaymentBadge(value)
        },
        {
            key: 'totalAmount',
            label: 'Amount',
            sortable: true,
            render: (value) => (_jsxs("div", { className: "text-sm font-medium text-gray-900", children: ["\u20B1", value.toLocaleString()] }))
        }
    ];
    return (_jsxs("div", { className: "bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-8 h-8 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-lg flex items-center justify-center shadow-md", children: _jsx("svg", { className: "w-4 h-4 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }) }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-gray-900", children: "Reservations" }), _jsxs("p", { className: "text-sm text-gray-500", children: [reservations.length, " total reservations"] })] })] }) }), _jsx(DataTable, { columns: columns, data: reservations, actions: getActions, onRowClick: onRowClick })] }));
};
export default ReservationsTable;
