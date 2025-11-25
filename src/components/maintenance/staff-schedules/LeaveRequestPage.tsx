// src/components/maintenance/staff-schedules/LeaveRequestsPage.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { db } from '../../../config/firebase';
import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  DocumentReference
} from 'firebase/firestore';

import LeaveRequestFilters from './LeaveRequestFilters';
import LeaveRequestTable from './LeaveRequestTable';
import CreateLeaveRequestModal from './CreateLeaveRequestModal';

import { LeaveRequest, Staff } from './types';
import { getWeekDateRange } from './utils';

const LeaveRequestsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [classificationFilter, setClassificationFilter] = useState<string>('all');

  const [currentWeekOffset, setCurrentWeekOffset] = useState<number>(0);
  const currentWeekRange = getWeekDateRange(currentWeekOffset);

  // ------------------------------
  // Fetch Staff
  // ------------------------------
  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try {
      const col = collection(db, 'staff');
      const snap = await getDocs(col);

      // Map docs to Staff (do NOT cast to LeaveRequest)
      const data: Staff[] = snap.docs.map(d => {
        const raw = d.data() as Staff;
        const { id: _ignored, ...rest } = raw as any; // remove any id inside document data (safe)
        return { id: d.id, ...rest } as Staff;
      });

      setStaffList(data);
    } catch (err) {
      console.error('Error fetching staff:', err);
      setStaffList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ------------------------------
  // Fetch Leave Requests
  // ------------------------------
  const fetchLeaveRequests = useCallback(async () => {
    setLoading(true);
    try {
      const col = collection(db, 'leave_requests');
      const q = query(col, orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);

      const fetched: LeaveRequest[] = snap.docs.map(d => {
        const raw = d.data() as LeaveRequest;
        const { id: _ignored, ...rest } = raw as any; // strip id if present in doc data
        return { id: d.id, ...rest } as LeaveRequest;
      });

      setLeaveRequests(fetched);
    } catch (err) {
      console.error('Error fetching leave requests:', err);
      setLeaveRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaveRequests();
  }, [fetchLeaveRequests, currentWeekOffset]);

  useEffect(() => {
    if (isModalOpen) {
      fetchStaff();
    }
  }, [isModalOpen, fetchStaff]);

  // ------------------------------
  // Create Leave Request
  // ------------------------------
  const handleCreateLeaveRequest = async (payload: {
    staffId: string;
    fullName: string;
    classification?: string;
    startDate: string;
    endDate: string;
    leaveType: string;
    notes?: string;
  }) => {
    try {
      const col = collection(db, 'leave_requests');
      const staffRef: DocumentReference = doc(db, 'staff', payload.staffId);

      await addDoc(col, {
        staffId: payload.staffId,
        staffRef,
        fullName: payload.fullName,
        classification: payload.classification || '',
        startDate: payload.startDate,
        endDate: payload.endDate,
        leaveType: payload.leaveType,
        notes: payload.notes || '',
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      setIsModalOpen(false);
      await fetchLeaveRequests();
      alert('Leave request created.');
    } catch (err) {
      console.error('Error creating leave request:', err);
      alert('Failed to create leave request.');
    }
  };

  // ------------------------------
  // Approve & Reject
  // ------------------------------
  const handleUpdateStatus = async (
    id: string,
    status: 'approved' | 'rejected' | 'pending'
  ) => {
    try {
      const ref = doc(db, 'leave_requests', id);
      await updateDoc(ref, {
        status,
        updatedAt: serverTimestamp()
      });

      await fetchLeaveRequests();
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status.');
    }
  };

  // ------------------------------
  // Apply Filters
  // ------------------------------
  const filtered = leaveRequests.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (classificationFilter !== 'all' && r.classification !== classificationFilter) return false;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      if (!r.fullName?.toLowerCase().includes(term) && !r.leaveType?.toLowerCase().includes(term)) {
        return false;
      }
    }

    const start = new Date(r.startDate);
    const end = new Date(r.endDate);

    const weekStart = currentWeekRange.start;
    const weekEnd = currentWeekRange.end;

    if (end < weekStart || start > weekEnd) return false;

    return true;
  });

  // ------------------------------
  // RENDER
  // ------------------------------
  return (
    <div className="min-h-screen bg-[#F9F6EE]">
      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">

        <LeaveRequestFilters
          onAdd={() => setIsModalOpen(true)}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          classificationFilter={classificationFilter}
          setClassificationFilter={setClassificationFilter}
          uniqueClassifications={Array.from(
            new Set(
              staffList
                .map(s => (s.classification ?? '').toString())
                .filter(c => c.trim() !== '')
            )
          )}
          currentWeekOffset={currentWeekOffset}
          setCurrentWeekOffset={setCurrentWeekOffset}
          currentWeekRange={currentWeekRange}
        />

        <LeaveRequestTable
          leaveRequests={filtered}
          loading={loading}
          onApprove={(id: string) => handleUpdateStatus(id, 'approved')}
          onReject={(id: string) => handleUpdateStatus(id, 'rejected')}
          onRefresh={fetchLeaveRequests}
        />

        <CreateLeaveRequestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          staffList={staffList}
          loadingStaff={loading}
          onCreate={handleCreateLeaveRequest}
        />
      </div>
    </div>
  );
};

export default LeaveRequestsPage;
