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
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-heritage-green to-heritage-neutral flex items-center justify-center shadow-md">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">Create New Expense</h2>
            <p className="text-sm text-gray-500">Capture expense details quickly. Finance will review and process.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-3">
            <label className="block text-xs font-semibold text-gray-600">Description</label>
            <input value={form.description} onChange={(e)=>setForm({...form, description: e.target.value})} className="w-full p-3 border rounded-lg" placeholder="e.g. Monthly electricity bill" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600">Vendor</label>
                <input value={form.vendor} onChange={(e)=>setForm({...form, vendor: e.target.value})} className="w-full p-3 border rounded-lg" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600">Amount</label>
                <input type="number" value={String(form.amount ?? '')} onChange={(e)=>setForm({...form, amount: Number(e.target.value)})} className="w-full p-3 border rounded-lg" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600">Category</label>
                <select value={form.category} onChange={(e)=>setForm({...form, category: e.target.value as Expense['category']})} className="w-full p-3 border rounded-lg">
                  <option value="utilities">Utilities</option>
                  <option value="supplies">Supplies</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="marketing">Marketing</option>
                  <option value="staff">Staff</option>
                  <option value="food">Food & Beverage</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600">Date</label>
                <input type="date" value={form.date} onChange={(e)=>setForm({...form, date: e.target.value})} className="w-full p-3 border rounded-lg" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600">Payment Method</label>
                <input value={form.paymentMethod} onChange={(e)=>setForm({...form, paymentMethod: e.target.value})} className="w-full p-3 border rounded-lg" placeholder="Cash, Card, Transfer" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600">Notes</label>
              <textarea value={form.notes} onChange={(e)=>setForm({...form, notes: e.target.value})} className="w-full p-3 border rounded-lg h-28" placeholder="Add context for the approver (optional)" />
            </div>
          </div>

          <aside className="space-y-3">
            <div className="p-3 border rounded-lg bg-gray-50">
              <label className="block text-xs font-semibold text-gray-600 mb-2">Accounting</label>
              <input value={form.accountCode} onChange={(e)=>setForm({...form, accountCode: e.target.value})} placeholder="Account code" className="w-full p-2 border rounded-md mb-2" />
              <input value={form.costCenter} onChange={(e)=>setForm({...form, costCenter: e.target.value})} placeholder="Cost center" className="w-full p-2 border rounded-md mb-2" />
              <input value={form.project} onChange={(e)=>setForm({...form, project: e.target.value})} placeholder="Project" className="w-full p-2 border rounded-md" />
            </div>

            <div className="p-3 border rounded-lg bg-white">
              <label className="block text-xs font-semibold text-gray-600 mb-2">Identifiers</label>
              <input value={form.invoiceNumber ?? ''} onChange={(e)=>setForm({...form, invoiceNumber: e.target.value})} placeholder="Invoice #" className="w-full p-2 border rounded-md mb-2" />
              <input value={form.purchaseOrder ?? ''} onChange={(e)=>setForm({...form, purchaseOrder: e.target.value})} placeholder="PO #" className="w-full p-2 border rounded-md" />
            </div>

            <div className="p-3 border rounded-lg bg-white">
              <label className="block text-xs font-semibold text-gray-600 mb-2">Attachments</label>
              <div className="border-dashed border-2 border-gray-200 rounded-md p-3 text-center">
                <p className="text-xs text-gray-500">Drag & drop files here or</p>
                <div className="mt-2">
                  <input ref={fileRef} type="file" multiple onChange={(e)=>onFiles(e.target.files)} className="hidden" />
                  <button onClick={() => fileRef.current?.click()} className="px-3 py-2 bg-white border rounded-md">Upload files</button>
                </div>
              </div>

              {attachments.length > 0 && (
                <ul className="mt-2 text-sm text-gray-700">
                  {attachments.map((f, i) => (
                    <li key={i} className="flex items-center justify-between gap-2">
                      <span className="truncate">{f.name}</span>
                      <button onClick={() => removeAttachment(i)} className="text-xs text-red-600">Remove</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>

  {errors && <div className="mt-3 text-sm text-red-600">{errors}</div>}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-white border rounded-lg">Cancel</button>
          <button onClick={submit} className="px-4 py-2 rounded-lg bg-gradient-to-r from-heritage-green to-heritage-neutral text-white font-bold shadow">Create Expense</button>
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
