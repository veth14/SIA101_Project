import React, { useState, useEffect, useRef } from 'react';
import { ExpenseModal } from './ExpenseModal';
import SuccessModal from './SuccessModal';
import type { Expense } from './types';

interface NewExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (expense: Expense) => void;
}

const NewExpenseModal: React.FC<NewExpenseModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [form, setForm] = useState<Partial<Expense>>({
    description: '',
    category: 'supplies',
    amount: 0,
    vendor: '',
    date: new Date().toISOString().slice(0,10),
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
  const [errors, setErrors] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setForm({
        description: '',
        category: 'supplies',
        amount: 0,
        vendor: '',
        date: new Date().toISOString().slice(0,10),
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

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    setAttachments((prev) => [...prev, ...Array.from(files)]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const submit = () => {
    if (!form.description || !form.vendor || !form.amount || Number(form.amount) <= 0) {
      setErrors('Please provide description, vendor and a positive amount.');
      return;
    }

    const created: Expense = {
      id: `EXP-${Date.now()}`,
      description: String(form.description),
      category: (form.category as Expense['category']) || 'supplies',
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
  const [justCreated, setJustCreated] = useState<Expense | null>(null);

  return (
  <>
    <ExpenseModal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 text-white rounded-full shadow-sm bg-emerald-600">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-emerald-700 md:text-2xl">Create New Expense</h2>
              <p className="mt-1 text-sm text-gray-500">
                Capture expense details quickly. Finance will review and process.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex items-center justify-center w-9 h-9 text-emerald-700 bg-emerald-50 rounded-md ring-1 ring-emerald-100"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5">
          {/* Summary banner */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 ring-1 ring-black/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl text-emerald-600">💸</div>
                <div>
                  <h3 className="text-base font-semibold text-emerald-700">Expense summary</h3>
                  <p className="text-sm text-emerald-600">Review the current amount before submitting.</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-gray-500">Current Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₱{Number(form.amount || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Left column: main expense details */}
            <div className="md:col-span-2">
              <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h4 className="text-sm font-semibold text-gray-900">Expense Details</h4>

                <div>
                  <label className="block text-xs font-semibold text-gray-600">Description</label>
                  <input
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/40 focus:border-[#82A33D]"
                    placeholder="e.g. Monthly electricity bill"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600">Vendor</label>
                    <input
                      value={form.vendor}
                      onChange={(e) => setForm({ ...form, vendor: e.target.value })}
                      className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/40 focus:border-[#82A33D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600">Amount</label>
                    <input
                      type="number"
                      value={String(form.amount ?? '')}
                      onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                      className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-[#82A33D]/40 focus:border-[#82A33D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value as Expense['category'] })}
                      className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/40 focus:border-[#82A33D]"
                    >
                      <option value="utilities">Utilities</option>
                      <option value="supplies">Supplies</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="marketing">Marketing</option>
                      <option value="staff">Staff</option>
                      <option value="food">Food &amp; Beverage</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600">Date</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/40 focus:border-[#82A33D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600">Payment Method</label>
                    <input
                      value={form.paymentMethod}
                      onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                      className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/40 focus:border-[#82A33D]"
                      placeholder="Cash, Card, Transfer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600">Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg h-28 resize-none focus:ring-2 focus:ring-[#82A33D]/40 focus:border-[#82A33D]"
                    placeholder="Add context for the approver (optional)"
                  />
                </div>
              </div>
            </div>

            {/* Right column: side cards */}
            <aside className="space-y-4">
              <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <label className="block mb-2 text-xs font-semibold text-gray-600">Accounting</label>
                <input
                  value={form.accountCode}
                  onChange={(e) => setForm({ ...form, accountCode: e.target.value })}
                  placeholder="Account code"
                  className="w-full px-2 py-2 mb-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#82A33D]/30 focus:border-[#82A33D]"
                />
                <input
                  value={form.costCenter}
                  onChange={(e) => setForm({ ...form, costCenter: e.target.value })}
                  placeholder="Cost center"
                  className="w-full px-2 py-2 mb-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#82A33D]/30 focus:border-[#82A33D]"
                />
                <input
                  value={form.project}
                  onChange={(e) => setForm({ ...form, project: e.target.value })}
                  placeholder="Project"
                  className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#82A33D]/30 focus:border-[#82A33D]"
                />
              </div>

              <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <label className="block mb-2 text-xs font-semibold text-gray-600">Identifiers</label>
                <input
                  value={form.invoiceNumber ?? ''}
                  onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
                  placeholder="Invoice #"
                  className="w-full px-2 py-2 mb-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#82A33D]/30 focus:border-[#82A33D]"
                />
                <input
                  value={form.purchaseOrder ?? ''}
                  onChange={(e) => setForm({ ...form, purchaseOrder: e.target.value })}
                  placeholder="PO #"
                  className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#82A33D]/30 focus:border-[#82A33D]"
                />
              </div>

              <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <label className="block mb-2 text-xs font-semibold text-gray-600">Attachments</label>
                <div className="p-3 text-center border-2 border-dashed border-gray-200 rounded-md">
                  <p className="text-xs text-gray-500">Drag &amp; drop files here or</p>
                  <div className="mt-2">
                    <input
                      ref={fileRef}
                      type="file"
                      multiple
                      onChange={(e) => onFiles(e.target.files)}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="px-3 py-2 text-xs font-semibold bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Upload files
                    </button>
                  </div>
                </div>

                {attachments.length > 0 && (
                  <ul className="mt-2 text-sm text-gray-700">
                    {attachments.map((f, i) => (
                      <li key={i} className="flex items-center justify-between gap-2">
                        <span className="truncate">{f.name}</span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(i)}
                          className="text-xs font-semibold text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </aside>
          </div>
        </div>

        {errors && <div className="mt-3 text-sm text-red-600">{errors}</div>}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-lg shadow-md bg-gradient-to-r from-[#82A33D] to-heritage-neutral hover:from-[#6d8735] hover:to-emerald-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Expense
          </button>
        </div>
      </div>
    </ExpenseModal>

    <SuccessModal
      isOpen={showSuccess}
      onClose={() => {
        setShowSuccess(false);
        setJustCreated(null);
        // Close the create modal as well
        onClose();
      }}
      title="Expense Created"
      message={justCreated ? `Expense ${justCreated.id} has been created and sent for review.` : 'Expense has been created.'}
      cta={justCreated ? { label: 'View Expense', onClick: () => {
        // Open the created expense in the detail modal by emitting it through onCreate -> parent will need to handle select
        // As a fallback, we'll open the details in the create modal by navigating via a small custom event
        const evt = new CustomEvent('expense:created:open', { detail: justCreated });
        window.dispatchEvent(evt);
      }} : null}
    />
    </>
  );
};

export default NewExpenseModal;
