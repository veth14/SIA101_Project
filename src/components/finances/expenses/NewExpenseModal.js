import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { ExpenseModal } from './ExpenseModal';
import SuccessModal from './SuccessModal';
const NewExpenseModal = ({ isOpen, onClose, onCreate }) => {
    const [form, setForm] = useState({
        description: '',
        category: 'supplies',
        amount: 0,
        vendor: '',
        date: new Date().toISOString().slice(0, 10),
        status: 'pending',
        submittedBy: 'You',
        notes: '',
        accountCode: '',
        costCenter: '',
        project: '',
        paymentMethod: '',
        invoiceNumber: '',
        purchaseOrder: '',
    });
    const [errors, setErrors] = useState(null);
    const [attachments, setAttachments] = useState([]);
    const fileRef = useRef(null);
    useEffect(() => {
        if (!isOpen) {
            setForm({
                description: '',
                category: 'supplies',
                amount: 0,
                vendor: '',
                date: new Date().toISOString().slice(0, 10),
                status: 'pending',
                submittedBy: 'You',
                notes: '',
                accountCode: '',
                costCenter: '',
                project: '',
                paymentMethod: '',
                invoiceNumber: '',
                purchaseOrder: '',
            });
            setErrors(null);
            setAttachments([]);
        }
    }, [isOpen]);
    const onFiles = (files) => {
        if (!files)
            return;
        setAttachments((prev) => [...prev, ...Array.from(files)]);
    };
    const removeAttachment = (index) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    };
    const submit = () => {
        if (!form.description || !form.vendor || !form.amount || Number(form.amount) <= 0) {
            setErrors('Please provide description, vendor and a positive amount.');
            return;
        }
        const created = {
            id: `EXP-${Date.now()}`,
            description: String(form.description),
            category: form.category || 'supplies',
            amount: Number(form.amount),
            vendor: String(form.vendor),
            date: String(form.date),
            status: 'pending',
            submittedBy: String(form.submittedBy ?? 'You'),
            notes: form.notes,
            invoiceNumber: form.invoiceNumber,
            purchaseOrder: form.purchaseOrder,
            accountCode: form.accountCode,
            costCenter: form.costCenter,
            project: form.project,
            paymentMethod: form.paymentMethod,
            attachments: [],
            createdAt: new Date().toISOString(),
        };
        // NOTE: attachments not uploaded — caller can handle file upload separately.
        onCreate(created);
        // Show success confirmation
        setJustCreated(created);
        setShowSuccess(true);
    };
    const [showSuccess, setShowSuccess] = useState(false);
    const [justCreated, setJustCreated] = useState(null);
    return (_jsxs(_Fragment, { children: [_jsx(ExpenseModal, { isOpen: isOpen, onClose: onClose, children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "flex items-center justify-center w-12 h-12 text-white rounded-full shadow-sm bg-emerald-600", children: _jsx("svg", { className: "w-5 h-5", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }) }), _jsxs("div", { className: "flex flex-col", children: [_jsx("h2", { className: "text-lg font-semibold text-emerald-700 md:text-2xl", children: "Create New Expense" }), _jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Capture expense details quickly. Finance will review and process." })] })] }), _jsx("button", { type: "button", onClick: onClose, "aria-label": "Close", className: "inline-flex items-center justify-center w-9 h-9 text-emerald-700 bg-emerald-50 rounded-md ring-1 ring-emerald-100", children: _jsx("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), _jsxs("div", { className: "space-y-5", children: [_jsx("div", { className: "p-4 rounded-xl bg-emerald-50 border border-emerald-100 ring-1 ring-black/5", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "text-2xl text-emerald-600", children: "\uD83D\uDCB8" }), _jsxs("div", { children: [_jsx("h3", { className: "text-base font-semibold text-emerald-700", children: "Expense summary" }), _jsx("p", { className: "text-sm text-emerald-600", children: "Review the current amount before submitting." })] })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-xs font-medium text-gray-500", children: "Current Amount" }), _jsxs("p", { className: "text-2xl font-bold text-gray-900", children: ["\u20B1", Number(form.amount || 0).toLocaleString()] })] })] }) }), _jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-3", children: [_jsx("div", { className: "md:col-span-2", children: _jsxs("div", { className: "p-5 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4", children: [_jsx("h4", { className: "text-sm font-semibold text-gray-900", children: "Expense Details" }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold text-gray-600", children: "Description" }), _jsx("input", { value: form.description, onChange: (e) => setForm({ ...form, description: e.target.value }), className: "w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/40 focus:border-[#82A33D]", placeholder: "e.g. Monthly electricity bill" })] }), _jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold text-gray-600", children: "Vendor" }), _jsx("input", { value: form.vendor, onChange: (e) => setForm({ ...form, vendor: e.target.value }), className: "w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/40 focus:border-[#82A33D]" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold text-gray-600", children: "Amount" }), _jsx("input", { type: "number", value: String(form.amount ?? ''), onChange: (e) => setForm({ ...form, amount: Number(e.target.value) }), className: "w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-[#82A33D]/40 focus:border-[#82A33D]" })] })] }), _jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold text-gray-600", children: "Category" }), _jsxs("select", { value: form.category, onChange: (e) => setForm({ ...form, category: e.target.value }), className: "w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/40 focus:border-[#82A33D]", children: [_jsx("option", { value: "utilities", children: "Utilities" }), _jsx("option", { value: "supplies", children: "Supplies" }), _jsx("option", { value: "maintenance", children: "Maintenance" }), _jsx("option", { value: "marketing", children: "Marketing" }), _jsx("option", { value: "staff", children: "Staff" }), _jsx("option", { value: "food", children: "Food & Beverage" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold text-gray-600", children: "Date" }), _jsx("input", { type: "date", value: form.date, onChange: (e) => setForm({ ...form, date: e.target.value }), className: "w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/40 focus:border-[#82A33D]" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold text-gray-600", children: "Payment Method" }), _jsx("input", { value: form.paymentMethod, onChange: (e) => setForm({ ...form, paymentMethod: e.target.value }), className: "w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/40 focus:border-[#82A33D]", placeholder: "Cash, Card, Transfer" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold text-gray-600", children: "Notes" }), _jsx("textarea", { value: form.notes, onChange: (e) => setForm({ ...form, notes: e.target.value }), className: "w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg h-28 resize-none focus:ring-2 focus:ring-[#82A33D]/40 focus:border-[#82A33D]", placeholder: "Add context for the approver (optional)" })] })] }) }), _jsxs("aside", { className: "space-y-4", children: [_jsxs("div", { className: "p-4 bg-white border border-gray-100 rounded-2xl shadow-sm", children: [_jsx("label", { className: "block mb-2 text-xs font-semibold text-gray-600", children: "Accounting" }), _jsx("input", { value: form.accountCode, onChange: (e) => setForm({ ...form, accountCode: e.target.value }), placeholder: "Account code", className: "w-full px-2 py-2 mb-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#82A33D]/30 focus:border-[#82A33D]" }), _jsx("input", { value: form.costCenter, onChange: (e) => setForm({ ...form, costCenter: e.target.value }), placeholder: "Cost center", className: "w-full px-2 py-2 mb-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#82A33D]/30 focus:border-[#82A33D]" }), _jsx("input", { value: form.project, onChange: (e) => setForm({ ...form, project: e.target.value }), placeholder: "Project", className: "w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#82A33D]/30 focus:border-[#82A33D]" })] }), _jsxs("div", { className: "p-4 bg-white border border-gray-100 rounded-2xl shadow-sm", children: [_jsx("label", { className: "block mb-2 text-xs font-semibold text-gray-600", children: "Identifiers" }), _jsx("input", { value: form.invoiceNumber ?? '', onChange: (e) => setForm({ ...form, invoiceNumber: e.target.value }), placeholder: "Invoice #", className: "w-full px-2 py-2 mb-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#82A33D]/30 focus:border-[#82A33D]" }), _jsx("input", { value: form.purchaseOrder ?? '', onChange: (e) => setForm({ ...form, purchaseOrder: e.target.value }), placeholder: "PO #", className: "w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#82A33D]/30 focus:border-[#82A33D]" })] }), _jsxs("div", { className: "p-4 bg-white border border-gray-100 rounded-2xl shadow-sm", children: [_jsx("label", { className: "block mb-2 text-xs font-semibold text-gray-600", children: "Attachments" }), _jsxs("div", { className: "p-3 text-center border-2 border-dashed border-gray-200 rounded-md", children: [_jsx("p", { className: "text-xs text-gray-500", children: "Drag & drop files here or" }), _jsxs("div", { className: "mt-2", children: [_jsx("input", { ref: fileRef, type: "file", multiple: true, onChange: (e) => onFiles(e.target.files), className: "hidden" }), _jsx("button", { type: "button", onClick: () => fileRef.current?.click(), className: "px-3 py-2 text-xs font-semibold bg-white border border-gray-300 rounded-md hover:bg-gray-50", children: "Upload files" })] })] }), attachments.length > 0 && (_jsx("ul", { className: "mt-2 text-sm text-gray-700", children: attachments.map((f, i) => (_jsxs("li", { className: "flex items-center justify-between gap-2", children: [_jsx("span", { className: "truncate", children: f.name }), _jsx("button", { type: "button", onClick: () => removeAttachment(i), className: "text-xs font-semibold text-red-600 hover:underline", children: "Remove" })] }, i))) }))] })] })] })] }), errors && _jsx("div", { className: "mt-3 text-sm text-red-600", children: errors }), _jsxs("div", { className: "flex items-center justify-end gap-3 pt-4 border-t border-gray-100", children: [_jsx("button", { type: "button", onClick: onClose, className: "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100", children: "Cancel" }), _jsxs("button", { type: "button", onClick: submit, className: "inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-lg shadow-md bg-gradient-to-r from-[#82A33D] to-heritage-neutral hover:from-[#6d8735] hover:to-emerald-700", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }), "Create Expense"] })] })] }) }), _jsx(SuccessModal, { isOpen: showSuccess, onClose: () => {
                    setShowSuccess(false);
                    setJustCreated(null);
                    // Close the create modal as well
                    onClose();
                }, title: "Expense Created", message: justCreated ? `Expense ${justCreated.id} has been created and sent for review.` : 'Expense has been created.', cta: justCreated ? { label: 'View Expense', onClick: () => {
                        // Open the created expense in the detail modal by emitting it through onCreate -> parent will need to handle select
                        // As a fallback, we'll open the details in the create modal by navigating via a small custom event
                        const evt = new CustomEvent('expense:created:open', { detail: justCreated });
                        window.dispatchEvent(evt);
                    } } : null })] }));
};
export default NewExpenseModal;
