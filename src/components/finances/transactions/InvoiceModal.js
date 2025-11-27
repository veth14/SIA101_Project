import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import SuccessModal from './SuccessModal';
const InvoiceModal = ({ isOpen, onClose, transaction }) => {
    const navigate = useNavigate();
    const [invoiceData, setInvoiceData] = useState({
        customerName: '',
        customerEmail: '',
        customerAddress: '',
        invoiceNumber: `INV-${Date.now()}`,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        notes: '',
        taxRate: 12, // Default VAT rate in Philippines
    });
    const [isCreating, setIsCreating] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [createdInvoiceNumber, setCreatedInvoiceNumber] = useState('');
    if (!isOpen || !transaction)
        return null;
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInvoiceData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const calculateTotals = () => {
        const subtotal = transaction.amount;
        const taxAmount = (subtotal * invoiceData.taxRate) / 100;
        const total = subtotal + taxAmount;
        return {
            subtotal,
            taxAmount,
            total
        };
    };
    const handleCreateInvoice = async () => {
        setIsCreating(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Here you would typically send the invoice data to your backend
        const invoicePayload = {
            ...invoiceData,
            transactionId: transaction.id,
            ...calculateTotals(),
            createdAt: new Date().toISOString()
        };
        console.log('Creating invoice:', invoicePayload);
        setIsCreating(false);
        setCreatedInvoiceNumber(invoiceData.invoiceNumber);
        setIsSuccessModalOpen(true);
    };
    const handleSuccessModalClose = () => {
        setIsSuccessModalOpen(false);
        onClose(); // Close the invoice modal as well
    };
    const handleViewInvoice = () => {
        setIsSuccessModalOpen(false);
        onClose(); // Close the invoice modal
        // Navigate to invoices page with the created invoice data
        navigate('/admin/finances/invoices', {
            state: {
                newInvoice: {
                    invoiceNumber: createdInvoiceNumber,
                    transactionId: transaction?.id,
                    customerName: invoiceData.customerName,
                    amount: calculateTotals().total,
                    status: 'draft',
                    createdAt: new Date().toISOString()
                }
            }
        });
    };
    const { subtotal, taxAmount, total } = calculateTotals();
    return createPortal(_jsxs(_Fragment, { children: [_jsx("style", { children: `
        @keyframes slideInUp {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.3s ease-out;
        }
      ` }), _jsx("div", { className: "fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/45 backdrop-blur-lg overflow-y-auto", onClick: handleBackdropClick, children: _jsxs("div", { className: "relative z-10 w-full max-w-4xl lg:max-w-5xl rounded-3xl bg-white/95 shadow-2xl ring-1 ring-black/5 transform transition-all duration-300 animate-slideInUp", children: [_jsxs("div", { className: "relative px-6 pt-6 pb-5 bg-white border-b border-gray-100 rounded-t-3xl", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "flex items-center justify-center w-12 h-12 text-white rounded-full shadow-sm bg-emerald-600", children: _jsxs("svg", { className: "w-5 h-5", viewBox: "0 0 24 24", fill: "currentColor", stroke: "none", children: [_jsx("path", { d: "M9 2h6l4 4v12a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2z" }), _jsx("path", { d: "M9 11h6M9 15h4", stroke: "rgba(255,255,255,0.9)", strokeWidth: "1", fill: "none" })] }) }), _jsxs("div", { className: "flex flex-col", children: [_jsx("h2", { className: "text-lg font-semibold text-emerald-700 md:text-2xl", children: "Create Invoice" }), _jsxs("p", { className: "mt-1 text-sm text-gray-500", children: ["Generate invoice for transaction #", transaction.id] })] })] }), _jsx("div", { "aria-hidden": true })] }), _jsx("button", { onClick: onClose, "aria-label": "Close", className: "absolute flex items-center justify-center rounded-md top-4 right-4 w-9 h-9 text-emerald-700 bg-emerald-50 ring-1 ring-emerald-100", children: _jsx("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), _jsxs("div", { className: "p-6 space-y-6", children: [_jsx("div", { className: "p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-xs font-semibold tracking-wide text-gray-600 uppercase", children: "Reference Transaction" }), _jsx("p", { className: "text-base font-bold text-gray-900", children: transaction.description }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Transaction #", transaction.id, " \u2022 ", transaction.date] })] }), _jsxs("div", { className: "text-right space-y-1", children: [_jsx("p", { className: "text-xs font-semibold tracking-wide text-gray-600 uppercase", children: "Amount" }), _jsxs("p", { className: "text-2xl font-black text-gray-900", children: ["\u20B1", transaction.amount.toLocaleString()] }), _jsxs("span", { className: `inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${transaction.status === 'completed'
                                                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                                            : transaction.status === 'pending'
                                                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                                                : 'bg-red-100 text-red-800 border border-red-200'}`, children: [_jsx("span", { className: `w-2 h-2 rounded-full mr-2 ${transaction.status === 'completed'
                                                                    ? 'bg-emerald-500'
                                                                    : transaction.status === 'pending'
                                                                        ? 'bg-amber-500'
                                                                        : 'bg-red-500'}` }), transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)] })] })] }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-6", children: [_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("h4", { className: "text-lg font-semibold text-gray-900 flex items-center", children: [_jsx("svg", { className: "w-5 h-5 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }) }), "Customer Information"] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-2 text-sm font-medium text-gray-700", children: "Customer Name *" }), _jsx("input", { type: "text", name: "customerName", value: invoiceData.customerName, onChange: handleInputChange, className: "w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/50 focus:border-[#82A33D] transition-colors", placeholder: "Enter customer name", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-2 text-sm font-medium text-gray-700", children: "Email Address" }), _jsx("input", { type: "email", name: "customerEmail", value: invoiceData.customerEmail, onChange: handleInputChange, className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/50 focus:border-[#82A33D] transition-colors", placeholder: "customer@email.com" })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-2 text-sm font-medium text-gray-700", children: "Billing Address" }), _jsx("textarea", { name: "customerAddress", value: invoiceData.customerAddress, onChange: handleInputChange, rows: 3, className: "w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/50 focus:border-[#82A33D] transition-colors resize-none", placeholder: "Enter billing address" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-2 text-sm font-medium text-gray-700", children: "Additional Notes" }), _jsx("textarea", { name: "notes", value: invoiceData.notes, onChange: handleInputChange, rows: 3, className: "w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/50 focus:border-[#82A33D] transition-colors resize-none", placeholder: "Any additional notes or terms for this invoice..." })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("h4", { className: "text-lg font-semibold text-gray-900 flex items-center", children: [_jsx("svg", { className: "w-5 h-5 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }) }), "Invoice Settings"] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-2 text-sm font-medium text-gray-700", children: "Invoice Number" }), _jsx("input", { type: "text", name: "invoiceNumber", value: invoiceData.invoiceNumber, onChange: handleInputChange, className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/50 focus:border-[#82A33D] transition-colors", placeholder: "INV-001" })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-2 text-sm font-medium text-gray-700", children: "Due Date" }), _jsx("input", { type: "date", name: "dueDate", value: invoiceData.dueDate, onChange: handleInputChange, className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/50 focus:border-[#82A33D] transition-colors" })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-2 text-sm font-medium text-gray-700", children: "Tax Rate (%)" }), _jsx("input", { type: "number", name: "taxRate", value: invoiceData.taxRate, onChange: handleInputChange, min: "0", max: "100", step: "0.01", className: "w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/50 focus:border-[#82A33D] transition-colors", placeholder: "12.00" })] })] }), _jsxs("div", { className: "p-6 bg-gradient-to-br from-gray-50 to-gray-100/60 rounded-xl border border-gray-200/60", children: [_jsxs("h4", { className: "mb-4 text-lg font-semibold text-gray-900 flex items-center", children: [_jsx("svg", { className: "w-5 h-5 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" }) }), "Invoice Summary"] }), _jsxs("div", { className: "space-y-3 text-sm", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Subtotal" }), _jsxs("span", { className: "font-semibold text-gray-900", children: ["\u20B1", subtotal.toLocaleString()] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "text-gray-600", children: ["Tax (", invoiceData.taxRate, "%):"] }), _jsxs("span", { className: "font-semibold text-gray-900", children: ["\u20B1", taxAmount.toLocaleString()] })] }), _jsxs("div", { className: "flex items-center justify-between pt-3 border-t border-gray-200", children: [_jsx("span", { className: "text-sm font-semibold tracking-wide text-gray-500 uppercase", children: "Total Amount" }), _jsxs("span", { className: "px-3 py-1 text-base font-extrabold text-[#82A33D] bg-[#82A33D]/10 rounded-lg", children: ["\u20B1", total.toLocaleString()] })] })] })] })] })] }), _jsxs("div", { className: "flex space-x-4 pt-4 border-t border-gray-200", children: [_jsx("button", { onClick: onClose, className: "flex-1 px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200", children: "Cancel" }), _jsx("button", { onClick: handleCreateInvoice, disabled: !invoiceData.customerName || isCreating, className: "flex-1 flex items-center justify-center space-x-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#82A33D] to-emerald-600 rounded-xl hover:from-[#6d8735] hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none", children: isCreating ? (_jsxs(_Fragment, { children: [_jsxs("svg", { className: "animate-spin w-5 h-5", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), _jsx("span", { children: "Creating Invoice..." })] })) : (_jsxs(_Fragment, { children: [_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }), _jsx("span", { children: "Create Invoice" })] })) })] })] })] }) }), _jsx(SuccessModal, { isOpen: isSuccessModalOpen, onClose: handleSuccessModalClose, title: "Invoice Created Successfully!", message: "Your invoice has been generated and is ready for processing.", invoiceNumber: createdInvoiceNumber, onViewInvoice: handleViewInvoice })] }), document.body);
};
export default InvoiceModal;
