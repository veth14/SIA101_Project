import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, MoreHorizontal, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// Sample transaction data with hotel-specific transactions
const transactionData = [
    {
        id: 'tx-001',
        customer: 'John Smith',
        room: 'Room 205',
        amount: 1250.00,
        status: 'completed',
        date: '2025-10-10',
        time: '14:30',
        type: 'payment',
        method: 'Credit Card',
        category: 'Room Booking'
    },
    {
        id: 'tx-002',
        customer: 'Sarah Johnson',
        room: 'Room 312',
        amount: 850.75,
        status: 'completed',
        date: '2025-10-10',
        time: '12:15',
        type: 'payment',
        method: 'Debit Card',
        category: 'F&B Service'
    },
    {
        id: 'tx-003',
        customer: 'Michael Brown',
        room: 'Room 108',
        amount: 1500.00,
        status: 'pending',
        date: '2025-10-10',
        time: '10:45',
        type: 'payment',
        method: 'Bank Transfer',
        category: 'Event Booking'
    },
    {
        id: 'tx-004',
        customer: 'Emma Wilson',
        room: 'Room 201',
        amount: 450.25,
        status: 'completed',
        date: '2025-10-09',
        time: '16:20',
        type: 'refund',
        method: 'Credit Card',
        category: 'Cancellation'
    },
    {
        id: 'tx-005',
        customer: 'David Lee',
        room: 'Room 405',
        amount: 975.50,
        status: 'completed',
        date: '2025-10-09',
        time: '09:30',
        type: 'payment',
        method: 'Cash',
        category: 'Room Service'
    }
];
const RecentTransactions = () => {
    const navigate = useNavigate();
    return (_jsxs("div", { className: "overflow-hidden relative bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60 shadow-2xl animate-fade-in", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-heritage-green/8 via-heritage-light/30 to-heritage-green/5 rounded-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700" }), _jsxs("div", { className: "relative z-10", children: [_jsx("div", { className: "px-8 py-7 border-b bg-gradient-to-r from-white via-slate-50/80 to-white border-gray-200/30", children: _jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "flex items-center space-x-5", children: [_jsxs("div", { className: "relative group", children: [_jsx("div", { className: "p-2 bg-[#82A33D]/10 rounded-xl", children: _jsx("svg", { className: "w-6 h-6 text-[#82A33D]", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" }) }) }), _jsx("div", { className: "absolute -inset-2 bg-gradient-to-r from-heritage-green/20 to-heritage-neutral/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300" })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent", children: "Recent Transactions" }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsx("p", { className: "text-sm font-semibold text-gray-600", children: "Latest payment activities" }), _jsx("div", { className: "w-1 h-1 bg-heritage-green rounded-full" }), _jsx("span", { className: "text-sm font-bold text-heritage-green", children: "5 transactions today" })] })] })] }) }) }), _jsxs("div", { className: "px-8 py-6", children: [_jsx("div", { className: "space-y-4", children: transactionData.map((transaction) => (_jsx("div", { className: "bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: `w-12 h-12 rounded-xl flex items-center justify-center ${transaction.type === 'payment'
                                                            ? 'bg-green-100'
                                                            : 'bg-red-100'}`, children: transaction.type === 'payment' ? (_jsx(ArrowUpRight, { className: "w-6 h-6 text-green-600" })) : (_jsx(ArrowDownLeft, { className: "w-6 h-6 text-red-600" })) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-1", children: [_jsx("h4", { className: "font-semibold text-gray-900", children: transaction.customer }), _jsx("span", { className: "text-sm text-gray-500", children: "\u2022" }), _jsx("span", { className: "text-sm font-medium text-heritage-green", children: transaction.room })] }), _jsxs("div", { className: "flex items-center gap-3 text-sm text-gray-600", children: [_jsx("span", { className: "px-2 py-1 bg-gray-100 rounded-md text-xs font-medium", children: transaction.category }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { className: "w-3 h-3" }), transaction.time] }), _jsx("span", { children: transaction.method })] })] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "text-right", children: [_jsxs("div", { className: `text-lg font-bold ${transaction.type === 'payment' ? 'text-green-600' : 'text-red-600'}`, children: [transaction.type === 'refund' ? '-' : '+', "\u20B1", transaction.amount.toLocaleString()] }), _jsx("div", { className: "text-sm text-gray-500", children: new Date(transaction.date).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                }) })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: `flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${transaction.status === 'completed'
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : 'bg-yellow-100 text-yellow-700'}`, children: [transaction.status === 'completed' ? (_jsx(CheckCircle, { className: "w-3 h-3" })) : (_jsx(Clock, { className: "w-3 h-3" })), _jsx("span", { className: "capitalize", children: transaction.status })] }), _jsx("button", { className: "p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-200", children: _jsx(MoreHorizontal, { className: "w-4 h-4" }) })] })] })] }) }, transaction.id))) }), _jsx("div", { className: "mt-6 text-center", children: _jsxs("button", { onClick: () => navigate('/admin/finances/transactions'), className: "flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-heritage-green to-heritage-neutral rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mx-auto", children: [_jsx("span", { children: "View All Transactions" }), _jsx(ArrowRight, { className: "w-4 h-4" })] }) })] })] })] }));
};
export default RecentTransactions;
