import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import PaymentList from './PaymentList';
import PaymentDetails from './PaymentDetails';
import PaymentsStats from './PaymentsStats';
export const PaymentsPage = () => {
    const [selectedPayment, setSelectedPayment] = useState(null);
    // NOTE: removed artificial loading/skeletons so components render immediately
    // Sample payment data (moved from PaymentList)
    const payments = [
        {
            id: 'PAY-2024-001',
            guestName: 'John Smith',
            roomNumber: '204',
            amount: 580.50,
            paymentMethod: 'card',
            status: 'completed',
            transactionDate: '2024-10-07',
            transactionTime: '14:30:00',
            reference: 'TXN-4567890123',
            description: 'Room booking payment for 2 nights'
        },
        {
            id: 'PAY-2024-002',
            guestName: 'Sarah Johnson',
            roomNumber: '301',
            amount: 420.75,
            paymentMethod: 'digital',
            status: 'pending',
            transactionDate: '2024-10-08',
            transactionTime: '09:15:00',
            reference: 'TXN-4567890124',
            description: 'Room service and accommodation charges'
        },
        {
            id: 'PAY-2024-003',
            guestName: 'Michael Brown',
            roomNumber: '105',
            amount: 890.25,
            paymentMethod: 'cash',
            status: 'completed',
            transactionDate: '2024-10-06',
            transactionTime: '16:45:00',
            reference: 'TXN-4567890125',
            description: 'Full payment including spa services'
        },
        {
            id: 'PAY-2024-004',
            guestName: 'Emily Davis',
            roomNumber: '208',
            amount: 125.00,
            paymentMethod: 'card',
            status: 'failed',
            transactionDate: '2024-10-08',
            transactionTime: '11:20:00',
            reference: 'TXN-4567890126',
            description: 'Room service payment - card declined'
        },
        {
            id: 'PAY-2024-005',
            guestName: 'Robert Wilson',
            roomNumber: '402',
            amount: 320.00,
            paymentMethod: 'bank_transfer',
            status: 'refunded',
            transactionDate: '2024-10-05',
            transactionTime: '13:10:00',
            reference: 'TXN-4567890127',
            description: 'Cancelled booking refund'
        }
    ];
    const handlePaymentSelect = (payment) => {
        setSelectedPayment(payment);
    };
    const handleCloseDetails = () => {
        setSelectedPayment(null);
    };
    return (_jsxs("div", { className: "min-h-screen bg-[#F9F6EE]", children: [_jsxs("div", { className: "fixed inset-0 pointer-events-none", children: [_jsx("div", { className: "absolute rounded-full top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 blur-3xl animate-pulse opacity-30" }), _jsx("div", { className: "absolute delay-1000 rounded-full opacity-25 top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 blur-3xl animate-pulse" }), _jsx("div", { className: "absolute rounded-full bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 blur-3xl animate-pulse delay-2000 opacity-20" }), _jsx("div", { className: "absolute inset-0 opacity-5", children: _jsx("div", { className: "absolute inset-0", style: {
                                backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(134, 134, 134, 0.1) 1px, transparent 0)',
                                backgroundSize: '50px 50px'
                            } }) })] }), _jsxs("div", { className: "relative z-10 w-full px-4 py-4 space-y-6 lg:px-6", children: [_jsx("div", { className: "w-full", children: _jsx(PaymentsStats, { payments: payments }) }), _jsx("div", { className: "relative w-full", children: _jsxs("div", { className: "grid w-full grid-cols-1 gap-6 lg:grid-cols-3 items-stretch", children: [_jsx("div", { className: "lg:col-span-2 h-full", children: _jsx(PaymentList, { payments: payments, onPaymentSelect: handlePaymentSelect, selectedPayment: selectedPayment }) }), _jsx("div", { className: "col-span-1 h-full", children: _jsx(PaymentDetails, { payment: selectedPayment, onClose: handleCloseDetails }) })] }) })] })] }));
};
export default PaymentsPage;
