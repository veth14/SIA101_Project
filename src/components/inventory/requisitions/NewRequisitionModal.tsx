import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { createRequisition } from '../../../backend/requisitions/requisitionsService';

interface NewRequisitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingRequestNumbers: string[];
}

const generateNextRequestNumber = (existing: string[]): string => {
  const now = new Date();
  const year = now.getFullYear();
  const prefix = `REQ-${year}-`;

  let maxSeq = 0;
  for (const num of existing) {
    if (typeof num !== 'string') continue;
    if (!num.startsWith(prefix)) continue;
    const raw = num.slice(prefix.length);
    const parsed = parseInt(raw, 10);
    if (!Number.isNaN(parsed) && parsed > maxSeq) {
      maxSeq = parsed;
    }
  }

  const next = maxSeq + 1;
  const padded = next.toString().padStart(3, '0');
  return `${prefix}${padded}`;
};

const NewRequisitionModal: React.FC<NewRequisitionModalProps> = ({ isOpen, onClose, existingRequestNumbers }) => {
  const [department, setDepartment] = useState('');
  const [requestedBy, setRequestedBy] = useState('');
  const [requestDate, setRequestDate] = useState('');
  const [requiredDate, setRequiredDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [justification, setJustification] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [items, setItems] = useState<{
    name: string;
    quantity: number | string;
    unit: string;
    estimatedCost: number | string;
    reason: string;
  }[]>([
    { name: '', quantity: 1, unit: '', estimatedCost: 0, reason: '' },
  ]);

  if (!isOpen) return null;

  const requestNumber = generateNextRequestNumber(existingRequestNumbers || []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const cleanItems = items
        .filter((it) => it.name && Number(it.quantity) > 0)
        .map((it) => ({
          name: it.name,
          quantity: Number(it.quantity) || 0,
          unit: it.unit || '',
          estimatedCost: Number(it.estimatedCost) || 0,
          reason: it.reason || '',
        }));

      const totalEstimatedCost = cleanItems.reduce(
        (sum, it) => sum + (Number(it.estimatedCost) || 0) * (Number(it.quantity) || 0),
        0,
      );

      const id = requestNumber;
      await createRequisition({
        id,
        requestNumber,
        department: department.trim() || 'Unspecified Department',
        requestedBy: requestedBy.trim() || 'Unspecified Requester',
        priority,
        requestDate: requestDate || new Date().toISOString().slice(0, 10),
        requiredDate: requiredDate || undefined,
        justification: justification.trim() || 'No justification provided.',
        notes: notes.trim() || undefined,
        items: cleanItems,
        totalEstimatedCost,
      });
      onClose();
      setDepartment('');
      setRequestedBy('');
      setRequestDate('');
      setRequiredDate('');
      setPriority('medium');
      setJustification('');
      setNotes('');
      setItems([{ name: '', quantity: 1, unit: '', estimatedCost: 0, reason: '' }]);
    } catch (error) {
      console.error('Error creating requisition:', error);
      setIsSaving(false);
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/45 backdrop-blur-lg overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="relative z-10 w-full max-w-3xl rounded-3xl bg-white/95 shadow-2xl border border-white/60">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-5 bg-white border-b border-gray-100 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-11 h-11 text-white rounded-2xl shadow-sm bg-[#82A33D]">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-[#82A33D] md:text-2xl">New Requisition</h2>
                <p className="mt-1 text-sm text-gray-500 flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <span>Capture a new requisition request.</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#82A33D]/5 text-[#82A33D] border border-[#82A33D]/20">
                    ID: {requestNumber}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute flex items-center justify-center rounded-md top-4 right-4 w-9 h-9 text-[#82A33D] bg-[#82A33D]/10 ring-1 ring-[#82A33D]/20"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 bg-gray-50/60">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Left: basic info */}
            <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-gray-800 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-[#82A33D]/10 text-[#82A33D] text-xs font-bold">1</span>
                Request Information
              </h3>

              <div className="space-y-4 text-sm">
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Department</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm"
                    placeholder="e.g. Housekeeping"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Requested By</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm"
                    placeholder="Requester name"
                    value={requestedBy}
                    onChange={(e) => setRequestedBy(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Request Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm"
                      value={requestDate}
                      onChange={(e) => setRequestDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Required Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm"
                      value={requiredDate}
                      onChange={(e) => setRequiredDate(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Priority</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high' | 'urgent')}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right: justification */}
            <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-gray-800 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-[#82A33D]/10 text-[#82A33D] text-xs font-bold">2</span>
                Justification & Notes
              </h3>

              <div className="space-y-4 text-sm">
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Justification</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm resize-none"
                    placeholder="Why is this requisition needed?"
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Additional Notes</label>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82A33D]/20 focus:border-[#82A33D] text-sm resize-none"
                    placeholder="Optional internal notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Items editor */}
          <div className="p-5 bg-white rounded-2xl border border-gray-100 text-sm text-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-[#82A33D]/10 text-[#82A33D] text-xs font-bold">3</span>
                <span className="font-semibold text-gray-800">Items</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setItems((prev) => [
                    ...prev,
                    { name: '', quantity: 1, unit: '', estimatedCost: 0, reason: '' },
                  ])
                }
                className="px-3 py-1 text-xs font-medium rounded-md bg-gradient-to-r from-heritage-green to-emerald-600 text-white border border-heritage-green/20 hover:from-heritage-green/90 hover:to-emerald-600/90 transition-colors"
              >
                Add Item
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 gap-3 md:grid-cols-12 p-3 border border-gray-100 rounded-xl bg-gray-50/60"
                >
                  <div className="md:col-span-4">
                    <label className="block mb-1 text-xs font-medium text-gray-600">Item</label>
                    <input
                      type="text"
                      className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#82A33D]/20 focus:border-[#82A33D]"
                      value={item.name}
                      onChange={(e) =>
                        setItems((prev) =>
                          prev.map((it, i) =>
                            i === index ? { ...it, name: e.target.value } : it,
                          ),
                        )
                      }
                      placeholder="e.g. Cleaning supplies"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1 text-xs font-medium text-gray-600">Qty</label>
                    <input
                      type="number"
                      min={1}
                      className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#82A33D]/20 focus:border-[#82A33D]"
                      value={item.quantity}
                      onChange={(e) =>
                        setItems((prev) =>
                          prev.map((it, i) =>
                            i === index ? { ...it, quantity: e.target.value } : it,
                          ),
                        )
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1 text-xs font-medium text-gray-600">Unit</label>
                    <input
                      type="text"
                      className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#82A33D]/20 focus:border-[#82A33D]"
                      value={item.unit}
                      onChange={(e) =>
                        setItems((prev) =>
                          prev.map((it, i) =>
                            i === index ? { ...it, unit: e.target.value } : it,
                          ),
                        )
                      }
                      placeholder="e.g. pcs, box"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1 text-xs font-medium text-gray-600">Est. Cost</label>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#82A33D]/20 focus:border-[#82A33D]"
                      value={item.estimatedCost}
                      onChange={(e) =>
                        setItems((prev) =>
                          prev.map((it, i) =>
                            i === index ? { ...it, estimatedCost: e.target.value } : it,
                          ),
                        )
                      }
                    />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-1">
                    <label className="block mb-1 text-xs font-medium text-gray-600">Reason</label>
                    <textarea
                      rows={2}
                      className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#82A33D]/20 focus:border-[#82A33D] resize-none"
                      value={item.reason}
                      onChange={(e) =>
                        setItems((prev) =>
                          prev.map((it, i) =>
                            i === index ? { ...it, reason: e.target.value } : it,
                          ),
                        )
                      }
                      placeholder="Short reason"
                    />
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setItems((prev) => prev.filter((_, i) => i !== index))
                        }
                        className="self-start mt-1 text-[11px] text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end mt-3 text-xs text-gray-600">
              <span className="mr-2 font-medium">Estimated Total:</span>
              <span className="font-semibold text-[#82A33D]">
                ₱
                {items
                  .reduce(
                    (sum, it) =>
                      sum +
                      (Number(it.estimatedCost) || 0) * (Number(it.quantity) || 0),
                    0,
                  )
                  .toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white/90 rounded-b-3xl">
          <p className="text-xs text-gray-500">
            This form will create a pending requisition record that syncs with Expenses.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#82A33D]/20"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-lg shadow-md bg-[#82A33D] border border-[#82A33D]/20 focus:outline-none focus:ring-2 focus:ring-[#82A33D]/30 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{isSaving ? 'Saving...' : 'Save Requisition'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default NewRequisitionModal;
