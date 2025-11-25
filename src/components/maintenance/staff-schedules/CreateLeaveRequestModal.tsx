// src/components/maintenance/staff-schedules/CreateLeaveRequestModal.tsx
import React, { useMemo, useState } from 'react';
import { Staff } from './types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  staffList: Staff[];
  loadingStaff: boolean;
  onCreate: (payload: {
    staffId: string;
    fullName: string;
    classification?: string;
    startDate: string;
    endDate: string;
    leaveType: string;
    notes?: string;
  }) => Promise<void> | void;
}

const leaveTypes = ['Vacation', 'Sick', 'Emergency', 'Maternity', 'Paternity', 'Bereavement', 'Other'];

const CreateLeaveRequestModal: React.FC<Props> = ({ isOpen, onClose, staffList, loadingStaff, onCreate }) => {
  const [staffId, setStaffId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [leaveType, setLeaveType] = useState<string>(leaveTypes[0]);
  const [notes, setNotes] = useState<string>('');

  const selectedStaff = useMemo(() => staffList.find(s => s.id === staffId), [staffId, staffList]);

  const handleSubmit = async () => {
    if (!staffId || !startDate || !endDate || !leaveType) {
      alert('Please fill required fields.');
      return;
    }
    await onCreate({
      staffId,
      fullName: selectedStaff?.fullName || '',
      classification: selectedStaff?.classification || '',
      startDate,
      endDate,
      leaveType,
      notes
    });

    // reset
    setStaffId('');
    setStartDate('');
    setEndDate('');
    setLeaveType(leaveTypes[0]);
    setNotes('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Add Leave Request</h3>
          <button onClick={onClose} className="text-gray-500">Close</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Staff</label>
            <select
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
            >
              <option value="">Select staff</option>
              {loadingStaff ? <option>Loading...</option> : staffList.map(s => (
                <option key={s.id} value={s.id}>{s.fullName} {s.classification ? `— ${s.classification}` : ''}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Leave Type</label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
            >
              {leaveTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              rows={3}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-heritage-green text-white hover:opacity-95"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateLeaveRequestModal;
