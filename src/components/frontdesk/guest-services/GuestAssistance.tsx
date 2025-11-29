import React, { useEffect, useState, useRef } from 'react';
import { Modal } from '../../admin/Modal';
import { collection, getDocs, query, orderBy, addDoc, serverTimestamp, doc, updateDoc, where, limit } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useAuth } from '../../../hooks/useAuth';
import { createTicket } from '../../maintenance/tickets-tasks/ticketsService';

interface AssistanceRequest {
  id: string;
  guestName: string;
  roomNumber: string;
  requestType: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  requestTime: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  assignedTo?: string;
  estimatedTime?: string;
  notes?: string;
  source?: 'contactRequests' | 'guest_request' | 'local';
  ticketNumber?: string;
}

export const GuestAssistance: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Start with no static requests; we'll load `contactRequests` from Firestore
  const [assistanceRequests, setAssistanceRequests] = useState<AssistanceRequest[]>([]);
  
  const assistanceRef = useRef<AssistanceRequest[]>([]);

  const [selectedRequest, setSelectedRequest] = useState<AssistanceRequest | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'view'>('create');
  const [status, setStatus] = useState<AssistanceRequest['status']>('pending');
  const [initialPriority, setInitialPriority] = useState<AssistanceRequest['priority'] | null>(null);
  const [initialStatus, setInitialStatus] = useState<AssistanceRequest['status'] | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialGuestName, setInitialGuestName] = useState<string | null>(null);
  const [initialRoomNumber, setInitialRoomNumber] = useState<string | null>(null);
  const [initialRequestType, setInitialRequestType] = useState<string | null>(null);
  const [initialAssignedTo, setInitialAssignedTo] = useState<string | null>(null);
  const [initialGuestContact, setInitialGuestContact] = useState<string | null>(null);

  useEffect(() => {
    const CACHE_KEY = 'guest_assistance_cache_v2';
    let cached: AssistanceRequest[] = [];
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) cached = JSON.parse(raw)?.items || [];
    } catch {}
    if (cached.length) {
      assistanceRef.current = cached;
      setAssistanceRequests(cached);
    }

    const upsert = (item: AssistanceRequest) => {
      assistanceRef.current = assistanceRef.current.filter(r => r.id !== item.id);
      assistanceRef.current.push(item);
    };

    const sortAndCommit = () => {
      const sorted = [...assistanceRef.current].sort((a, b) => new Date(b.requestTime).getTime() - new Date(a.requestTime).getTime());
      setAssistanceRequests(sorted);
      try { localStorage.setItem(CACHE_KEY, JSON.stringify({ items: sorted })); } catch {}
    };

    const mapContactDoc = (d: any, id: string): AssistanceRequest => {
      const data = d;
      const requestTime = data.submittedAt?.toDate?.() ? data.submittedAt.toDate().toISOString() : data.submittedAt || data.createdAt || new Date().toISOString();
      const guestName = [data.firstName, data.lastName].filter(Boolean).join(' ').trim() || data.email || 'Guest';
      const requestType = data.inquiryType ? data.inquiryType.toString().toLowerCase() : 'other';
      let status: AssistanceRequest['status'] = 'pending';
      if (data.status === 'resolved') status = 'completed';
      else if (data.status === 'in-progress') status = 'in-progress';
      else if (data.status === 'cancelled') status = 'cancelled';
      return {
        id,
        guestName,
        roomNumber: data.bookingReference || '—',
        requestType,
        priority: 'medium',
        description: [data.subject, data.message].filter(Boolean).join(' — '),
        requestTime,
        status,
        assignedTo: data.assignedTo || 'Front Desk',
        estimatedTime: data.estimatedTime,
        notes: data.notes,
        ticketNumber: data.ticketNumber,
        source: 'contactRequests'
      };
    };

    const mapGuestDoc = (d: any, id: string): AssistanceRequest => {
      const data = d;
      const requestTime = data.submittedAt?.toDate?.() ? data.submittedAt.toDate().toISOString() : data.submittedAt || data.createdAt || new Date().toISOString();
      return {
        id,
        guestName: data.guestName || data.firstName || 'Guest',
        roomNumber: data.roomNumber || '—',
        requestType: data.requestType || 'other',
        priority: data.priority || 'medium',
        description: data.description || '',
        requestTime,
        status: data.status || 'pending',
        assignedTo: data.assignedTo || undefined,
        estimatedTime: data.estimatedTime || undefined,
        notes: data.notes || undefined,
        ticketNumber: data.ticketNumber,
        source: 'guest_request'
      };
    };

    const fetchOnce = async () => {
      try {
        const [contactSnap, guestSnap] = await Promise.all([
          getDocs(query(collection(db, 'contactRequests'), orderBy('createdAt', 'desc'), limit(50))),
          getDocs(query(collection(db, 'guest_request'), orderBy('createdAt', 'desc'), limit(50)))
        ]);

        assistanceRef.current = [];

        contactSnap.forEach(docSnap => {
          upsert(mapContactDoc(docSnap.data(), docSnap.id));
        });

        guestSnap.forEach(docSnap => {
          upsert(mapGuestDoc(docSnap.data(), docSnap.id));
        });

        sortAndCommit();
        try { localStorage.setItem('guest_assistance_cache_meta', JSON.stringify({ ts: Date.now() })); } catch {}
      } catch (err) {
        console.error('Failed to fetch assistance requests', err);
      }
    };

    fetchOnce();

    const onFocus = () => {
      try {
        const metaRaw = localStorage.getItem('guest_assistance_cache_meta');
        const ts = metaRaw ? JSON.parse(metaRaw)?.ts : 0;
        const maxAgeMs = 5 * 60 * 1000; // 5 minutes staleness window
        if (!ts || Date.now() - ts > maxAgeMs) {
          fetchOnce();
        }
      } catch {
        fetchOnce();
      }
    };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') onFocus();
    });

    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', () => {});
    };
  }, []);

  // Keep a ref of assistanceRequests to use inside intervals without adding it to deps
  useEffect(() => {
    assistanceRef.current = assistanceRequests;
  }, [assistanceRequests]);

  // Modal & form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const [guestName, setGuestName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [guestContact, setGuestContact] = useState('');
  const [requestType, setRequestType] = useState<string>('housekeeping');
  const [priority, setPriority] = useState<AssistanceRequest['priority']>('medium');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState<string>('Unassigned');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [dueDateTime, setDueDateTime] = useState<string>('');

  const calcEstimatedTime = (type: string, p?: AssistanceRequest['priority']) => {
    if (p === 'urgent') return '15 minutes';
    switch (type) {
      case 'housekeeping':
        return '15 minutes';
      case 'maintenance':
        return '30 minutes';
      case 'electrical':
        return '30 minutes';
      case 'plumbing':
        return '30 minutes';
      default:
        return '30 minutes';
    }
  };

  const computeDueDateTime = (type: string, p?: AssistanceRequest['priority']): string => {
    const now = new Date();
    const est = calcEstimatedTime(type, p);
    const match = est.match(/(\d+)\s*minute/);
    const minutes = match ? parseInt(match[1], 10) : 30;
    const due = new Date(now.getTime() + minutes * 60 * 1000);
    return due.toISOString();
  };

  const toDateTimeLocal = (isoOrDate: string | Date): string => {
    const d = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
    const pad = (n: number) => String(n).padStart(2, '0');
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const getDefaultAssigneeForType = (type: string) => {
    const t = (type || '').toLowerCase();
    if (t === 'housekeeping') return 'Housekeeping Team';
    if (t === 'maintenance') return 'Maintenance Team';
    if (t === 'electrical') return 'Electrical Team';
    if (t === 'plumbing') return 'Plumbing Team';
    return 'Front Desk';
  };

  const resetForm = () => {
    setGuestName('');
    setRoomNumber('');
    setGuestContact('');
    setRequestType('housekeeping');
    setPriority('medium');
    setDescription('');
    setAssignedTo('Unassigned');
    setFormErrors({});
  };

  const openModal = () => {
    // open for creating a new request
    setModalMode('create');
    setSelectedRequest(null);
    resetForm();
    setInitialPriority(null);
    setInitialStatus(null);
    setInitialGuestName(null);
    setInitialRoomNumber(null);
    setInitialRequestType(null);
    setInitialAssignedTo(null);
    setInitialGuestContact(null);
    // Keep unassigned; ticket creation will auto-assign to available staff
    setAssignedTo('Unassigned');
    // Prefill due date based on estimated completion
    setDueDateTime(toDateTimeLocal(computeDueDateTime('housekeeping', priority)));
    setIsModalOpen(true);
  };

  const openViewModal = (request: AssistanceRequest) => {
    setModalMode('view');
    setSelectedRequest(request);
    setGuestName(request.guestName || '');
    setRoomNumber(request.roomNumber || '');
    if (request.notes && request.notes.includes('Contact:')) {
      setGuestContact(request.notes.replace('Contact:', '').trim());
    } else {
      setGuestContact('');
    }
    setRequestType(request.requestType || 'other');
    setPriority(request.priority || 'medium');
    setDescription(request.description || '');
    setAssignedTo(request.assignedTo || 'Unassigned');
    setStatus(request.status || 'pending');
    setInitialPriority(request.priority || 'medium');
    setInitialStatus(request.status || 'pending');
    setInitialGuestName(request.guestName || '');
    setInitialRoomNumber(request.roomNumber || '');
    setInitialRequestType(request.requestType || '');
    setInitialAssignedTo(request.assignedTo || 'Unassigned');
    setInitialGuestContact(request.notes?.includes('Contact:') ? request.notes.replace('Contact:', '').trim() : '');
    setDueDateTime('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
    setSelectedRequest(null);
    setModalMode('create');
    setInitialPriority(null);
    setInitialStatus(null);
    setIsDirty(false);
  };

  const validateForm = () => {
    if (modalMode === 'view') return true;
    const errs: Record<string, string> = {};
    if (!guestName.trim()) errs.guestName = 'Guest name is required.';
    if (!requestType) errs.requestType = 'Request type is required.';
    if (!priority) errs.priority = 'Priority is required.';
    if (!description.trim() || description.trim().length < 10) errs.description = 'Description must be at least 10 characters.';
    if (!assignedTo) errs.assignedTo = 'Please assign the request or pick Unassigned.';
    if (!dueDateTime) errs.dueDateTime = 'Due Date & Time is required.';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Track whether anything changed so the submit/save button is only enabled when there's a change
  useEffect(() => {
    if (modalMode === 'view' && selectedRequest) {
      const changed = (
        priority !== (initialPriority ?? selectedRequest.priority) ||
        status !== (initialStatus ?? selectedRequest.status) ||
        guestName !== (initialGuestName ?? selectedRequest.guestName) ||
        roomNumber !== (initialRoomNumber ?? selectedRequest.roomNumber) ||
        requestType !== (initialRequestType ?? selectedRequest.requestType) ||
        assignedTo !== (initialAssignedTo ?? (selectedRequest.assignedTo || 'Unassigned')) ||
        (guestContact || '') !== (initialGuestContact || '')
      );
      setIsDirty(changed);
    } else if (modalMode === 'create') {
      const changed = (
        guestName.trim() !== '' ||
        roomNumber.trim() !== '' ||
        guestContact.trim() !== '' ||
        requestType !== 'housekeeping' ||
        priority !== 'medium' ||
        description.trim() !== '' ||
        assignedTo !== 'Unassigned'
      );
      setIsDirty(changed);
    } else {
      setIsDirty(false);
    }
  }, [modalMode, selectedRequest, guestName, roomNumber, guestContact, requestType, priority, description, assignedTo, status, initialPriority, initialStatus, initialGuestName, initialRoomNumber, initialRequestType, initialAssignedTo, initialGuestContact]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (isSubmitting) return;

    if (modalMode === 'view' && selectedRequest) {
      try {
        const collectionName = selectedRequest.source === 'guest_request' ? 'guest_request' : 'contactRequests';
        const docRef = doc(db, collectionName, selectedRequest.id);

        if (collectionName === 'guest_request') {
          const payload = {
            guestName: guestName.trim(),
            roomNumber: roomNumber || null,
            requestType: requestType,
            priority,
            assignedTo: assignedTo !== 'Unassigned' ? assignedTo : null,
            status,
            estimatedTime: calcEstimatedTime(requestType),
            notes: guestContact ? `Contact: ${guestContact}` : null,
            updatedAt: serverTimestamp()
          };

          await updateDoc(docRef, payload);

          setAssistanceRequests(prev => prev.map(r => r.id === selectedRequest.id ? {
            ...r,
            guestName: String(payload.guestName),
            roomNumber: payload.roomNumber ? String(payload.roomNumber) : '—',
            requestType: String(payload.requestType),
            priority: payload.priority as AssistanceRequest['priority'],
            assignedTo: payload.assignedTo ? String(payload.assignedTo) : undefined,
            status: payload.status as AssistanceRequest['status'],
            estimatedTime: payload.estimatedTime as string | undefined,
            notes: payload.notes as string | undefined
          } : r));
        } else {
          // contactRequests - update common fields where possible
          const payload = {
            inquiryType: requestType,
            bookingReference: roomNumber || null,
            status,
            // include assignment when saving contactRequests
            assignedTo: assignedTo !== 'Unassigned' ? assignedTo : null,
            notes: guestContact ? `Contact: ${guestContact}` : null,
            updatedAt: serverTimestamp()
          };

          await updateDoc(docRef, payload);

          setAssistanceRequests(prev => prev.map(r => r.id === selectedRequest.id ? {
            ...r,
            requestType: requestType,
            roomNumber: roomNumber || '—',
            status,
            notes: payload.notes as string | undefined
          } : r));
        }
      } catch (error) {
        console.error('Error updating request:', error);
        alert('Failed to update request.');
      } finally {
        closeModal();
      }

      return;
    }

    // create mode
    if (!validateForm()) return;
    setIsSubmitting(true);

    const tempId = `temp-${Date.now()}`;
    const newReq: AssistanceRequest = {
      id: tempId,
      guestName: guestName.trim(),
      roomNumber: roomNumber || '—',
      requestType: requestType,
      priority: priority,
      description: description.trim(),
      requestTime: new Date().toISOString(),
      status: assignedTo && assignedTo !== 'Unassigned' ? 'in-progress' : 'pending',
      assignedTo: assignedTo !== 'Unassigned' ? assignedTo : undefined,
      estimatedTime: calcEstimatedTime(requestType),
      notes: guestContact ? `Contact: ${guestContact}` : undefined,
      source: 'guest_request'
    };

    // Optimistically add to UI
    setAssistanceRequests(prev => [newReq, ...prev]);

    try {
      const payload = {
        userId: user?.uid || null,
        guestName: newReq.guestName,
        roomNumber: newReq.roomNumber,
        requestType: newReq.requestType,
        priority: newReq.priority,
        description: newReq.description,
        status: newReq.status,
        assignedTo: newReq.assignedTo || null,
        estimatedTime: newReq.estimatedTime || null,
        notes: newReq.notes || null,
        dueDateTime: dueDateTime || null,
        createdAt: serverTimestamp(),
        submittedAt: serverTimestamp()
      };

      const createdRef = await addDoc(collection(db, 'guest_request'), payload);
      // replace temp id with real id
      setAssistanceRequests(prev => prev.map(r => r.id === tempId ? { ...r, id: createdRef.id } : r));

      // Also create a maintenance/housekeeping ticket aligned to tickets_task schema
      const mapPriority = (p: AssistanceRequest['priority']): 'High' | 'Medium' | 'Low' => {
        if (p === 'urgent' || p === 'high') return 'High';
        if (p === 'medium') return 'Medium';
        return 'Low';
      };

      const category = newReq.requestType === 'maintenance' ? 'Maintenance' : 'Housekeeping';

      const deriveTaskTitle = (type: string, desc: string): string => {
        const t = type.toLowerCase();
        if (t === 'housekeeping') {
          if (/clean|tidy|room/i.test(desc)) return 'Room Cleaning';
          return 'Housekeeping Request';
        }
        if (t === 'maintenance') {
          if (/leak|water|pipe/i.test(desc)) return 'Leak Check';
          if (/ac|air.?con|cool/i.test(desc)) return 'AC Maintenance';
          if (/electrical|power|light/i.test(desc)) return 'Electrical Issue';
          return 'Maintenance Request';
        }
        return `${type.charAt(0).toUpperCase() + type.slice(1)} Request`;
      };

      const ticket = await createTicket({
        taskTitle: deriveTaskTitle(newReq.requestType, newReq.description),
        description: newReq.description,
        category,
        priority: mapPriority(newReq.priority),
        roomNumber: newReq.roomNumber,
        dueDateTime: dueDateTime || computeDueDateTime(newReq.requestType, newReq.priority),
        createdBy: user?.email || user?.uid || 'frontdesk',
        // Let auto-assignment choose available staff
      });

      // Persist ticketNumber back to the guest_request for easy cross-reference in UI
      if (ticket && ticket.ticketNumber) {
        try {
          await updateDoc(createdRef, { ticketNumber: ticket.ticketNumber });
          // reflect in local state
          setAssistanceRequests(prev => prev.map(r => r.id === createdRef.id ? { ...r, ticketNumber: ticket.ticketNumber, notes: (r.notes ? r.notes + ` | ` : '') + `Ticket: ${ticket.ticketNumber}` } : r));
        } catch (e) {
          console.warn('Failed to persist ticketNumber to guest_request', e);
        }
      }
    } catch (error) {
      console.error('Error saving guest request:', error);
      alert('Failed to save request.');
    } finally {
      setIsSubmitting(false);
      closeModal();
    }
  };

  // Simple guest lookup: if guestName matches an existing entry, autofill room/contact
  const handleGuestNameBlur = () => {
    const match = assistanceRequests.find(r => r.guestName.toLowerCase() === guestName.trim().toLowerCase());
    if (match) {
      setRoomNumber(match.roomNumber);
      if (match.notes?.includes('Contact:')) {
        setGuestContact(match.notes.replace('Contact:', '').trim());
      }
      // Prefill due date based on the current request type if not set
      if (!dueDateTime) {
        setDueDateTime(toDateTimeLocal(computeDueDateTime(requestType)));
      }
    }
  };

  const getTypeColor = (type: string) => {
    const t = (type || '').toString().toLowerCase();
    // Map known contact inquiry types and service request types
    if (t.includes('cancellation')) return 'bg-red-100 text-red-800 border-red-200';
    if (t.includes('complaint')) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (t.includes('feedback')) return 'bg-green-100 text-green-800 border-green-200';
    if (t.includes('modification') || t.includes('booking')) return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    if (t.includes('general') || t.includes('inquiry') || t === 'general inquiry') return 'bg-slate-100 text-slate-800 border-slate-200';

    const colors = {
      housekeeping: 'bg-blue-100 text-blue-800 border-blue-200',
      maintenance: 'bg-orange-100 text-orange-800 border-orange-200',
      electrical: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      plumbing: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      concierge: 'bg-purple-100 text-purple-800 border-purple-200',
      dining: 'bg-green-100 text-green-800 border-green-200',
      transport: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      other: 'bg-gray-100 text-gray-800 border-gray-200'
    } as const;

    // Try direct key lookup; fall back to 'other'
    const direct = (colors as unknown as Record<string, string>)[t];
    return direct || colors.other;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      urgent: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[priority as keyof typeof colors] || colors.low;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getTypeIcon = (type: string) => {
    const t = (type || '').toString().toLowerCase();
    if (t.includes('cancellation')) return '🗓️';
    if (t.includes('complaint')) return '⚠️';
    if (t.includes('feedback')) return '💬';
    if (t.includes('modification') || t.includes('booking')) return '🔁';
    if (t.includes('general') || t.includes('inquiry')) return '✉️';

    const icons = {
      housekeeping: '🧹',
      maintenance: '🔧',
      electrical: '🔌',
      plumbing: '🚰',
      concierge: '🛎️',
      dining: '🍽️',
      transport: '🚗',
      other: ''
    } as const;

    const directIcon = (icons as unknown as Record<string, string>)[t];
    return directIcon || icons.other;
  };

  const formatRequestTypeLabel = (type: string) => {
    if (!type) return '';
    // Split on non-word characters and capitalize each word
    return type.toString().split(/[^a-zA-Z0-9]+/).filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const filteredRequests = assistanceRequests.filter(request => {
    const typeMatch = selectedType === 'all' || request.requestType === selectedType;
    const statusMatch = selectedStatus === 'all' || request.status === selectedStatus;
    const priorityMatch = selectedPriority === 'all' || request.priority === selectedPriority;
    const s = (searchTerm || '').toLowerCase().trim();
    const searchMatch = !s || (request.guestName && request.guestName.toLowerCase().includes(s)) || (request.roomNumber && request.roomNumber.toLowerCase().includes(s)) || (request.description && request.description.toLowerCase().includes(s));
    return typeMatch && statusMatch && priorityMatch && searchMatch;
  });

  // Pagination (match reservations design)
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRequests = filteredRequests.slice(startIndex, endIndex);

  useEffect(() => { setCurrentPage(1); }, [selectedType, selectedStatus, selectedPriority, searchTerm]);

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search requests, guests, or rooms..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-heritage-green/20 focus:border-heritage-green bg-white w-80"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-heritage-green/20 focus:border-heritage-green bg-white"
          >
            <option value="all">All Types</option>
            <option value="housekeeping">Housekeeping</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-heritage-green/20 focus:border-heritage-green bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-heritage-green/20 focus:border-heritage-green bg-white"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={openModal} className="w-auto inline-flex justify-center items-center px-6 py-3 bg-gradient-to-r from-heritage-green to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:from-heritage-green/90 hover:to-emerald-600/90 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>New Request</span>
          </button>
        </div>
      </div>

      {/* Create New Request Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalMode === 'view' ? 'Request Details' : 'Create New Request'}
        subtitle={modalMode === 'view' && selectedRequest ? `Request #${selectedRequest.id} • ${selectedRequest.guestName || guestName || 'Guest'}${selectedRequest.ticketNumber ? ` • Ticket ${selectedRequest.ticketNumber}` : ''}` : undefined}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Guest Information */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Guest Information</h4>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600">Guest Name <span className="text-rose-500">*</span></label>
                <input value={guestName} onChange={(e) => setGuestName(e.target.value)} onBlur={handleGuestNameBlur} className="mt-1 w-full px-4 py-2.5 border rounded-xl shadow-sm text-sm bg-white/80 border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition" placeholder="Start typing guest name..." />
                {formErrors.guestName && <div className="text-rose-600 text-xs mt-1">{formErrors.guestName}</div>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600">Room Number/Location</label>
                <input value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} className="mt-1 w-full px-4 py-2.5 border rounded-xl shadow-sm text-sm bg-white/80 border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition" placeholder="Auto-filled when guest selected or enter manually" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600">Guest Contact (Optional)</label>
                <input value={guestContact} onChange={(e) => setGuestContact(e.target.value)} className="mt-1 w-full px-4 py-2.5 border rounded-xl shadow-sm text-sm bg-white/80 border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition" placeholder="Phone or email" />
                {modalMode === 'view' && selectedRequest?.ticketNumber && (
                  <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7H8a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V9a2 2 0 00-2-2z" /></svg>
                    <span>Linked Ticket: {selectedRequest.ticketNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Request Details */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Request Details</h4>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600">Request Type <span className="text-rose-500">*</span></label>
                {modalMode === 'view' ? (
                  <input value={requestType} onChange={(e) => setRequestType(e.target.value)} className="mt-1 w-full px-4 py-2.5 border rounded-xl shadow-sm text-sm bg-white/80 border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition" />
                ) : (
                  <select
                    value={requestType}
                    onChange={(e) => {
                      const val = e.target.value;
                      setRequestType(val);
                      // Recompute default due date when type changes
                      setDueDateTime(toDateTimeLocal(computeDueDateTime(val, priority)));
                    }}
                    className="mt-1 w-full px-4 py-2.5 border rounded-xl shadow-sm text-sm bg-white/80 border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
                  >
                    <option value="housekeeping">Housekeeping</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                )}
                {formErrors.requestType && <div className="text-rose-600 text-xs mt-1">{formErrors.requestType}</div>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600">Priority <span className="text-rose-500">*</span></label>
                <select value={priority} onChange={(e) => {
                  const val = e.target.value as AssistanceRequest['priority'];
                  setPriority(val);
                  // Adjust due date when priority changes (urgent -> 15 mins)
                  if (modalMode === 'create') {
                    setDueDateTime(toDateTimeLocal(computeDueDateTime(requestType, val)));
                  }
                }} className="mt-1 w-full px-4 py-2.5 border rounded-xl shadow-sm text-sm bg-white/80 border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition">
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                {formErrors.priority && <div className="text-rose-600 text-xs mt-1">{formErrors.priority}</div>}
              </div>

              {modalMode === 'view' && (
                <div>
                  <label className="block text-xs font-medium text-gray-600">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value as AssistanceRequest['status'])} className="mt-1 w-full px-4 py-2.5 border rounded-xl shadow-sm text-sm bg-white/80 border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition">
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-600">Description <span className="text-rose-500">*</span></label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full px-4 py-2.5 border rounded-xl shadow-sm text-sm bg-white/80 border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition" rows={4} placeholder="Describe the guest's request or issue..." disabled={modalMode === 'view'}></textarea>
                <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                  <div>{description.length}/500</div>
                  {formErrors.description && <div className="text-rose-600">{formErrors.description}</div>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600">Estimated Completion</label>
                <div className="mt-1 text-sm text-gray-700">Est: {calcEstimatedTime(requestType)}</div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600">Due Date & Time <span className="text-rose-500">*</span></label>
                <input
                  type="datetime-local"
                  value={dueDateTime}
                  onChange={(e) => setDueDateTime(e.target.value)}
                  className="mt-1 w-full px-4 py-2.5 border rounded-xl shadow-sm text-sm bg-white/80 border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
                  disabled={modalMode === 'view'}
                />
                {formErrors.dueDateTime && <div className="text-rose-600 text-xs mt-1">{formErrors.dueDateTime}</div>}
              </div>
            </div>
          </div>

          {/* Assignment (view only) */}
          {modalMode === 'view' && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Assignment</h4>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600">Assign To</label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="mt-1 w-full px-4 py-2.5 border rounded-xl shadow-sm text-sm bg-white/80 border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
                  >
                    <option value="Unassigned">Unassigned</option>
                    <option value="Front Desk">Front Desk</option>
                    <option value="Housekeeping Team">Housekeeping Team</option>
                    <option value="Maintenance Team">Maintenance Team</option>
                  </select>
                  {formErrors.assignedTo && <div className="text-rose-600 text-xs mt-1">{formErrors.assignedTo}</div>}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button type="button" onClick={closeModal} className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5">Cancel</button>
            <button type="submit" disabled={!isDirty || isSubmitting} className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white border border-transparent rounded-2xl shadow-sm transition transform hover:-translate-y-0.5 ${(!isDirty || isSubmitting) ? 'bg-emerald-600/50 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}>{modalMode === 'view' ? 'Save Changes' : (isSubmitting ? 'Submitting...' : 'Submit Request')}</button>
          </div>
        </form>
      </Modal>

      {/* Assistance Requests Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Guest Info</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-heritage-green text-white font-bold text-lg shadow-sm">
                          {request.guestName ? request.guestName.split(' ').map(n=>n[0]).slice(0,2).join('') : 'G'}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 truncate">{request.guestName}</div>
                        <div className="text-sm text-gray-500">Room {request.roomNumber}</div>
                        <div className="text-xs text-gray-400">{formatTime(request.requestTime)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getTypeIcon(request.requestType)}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(request.requestType)}`}>
                        {formatRequestTypeLabel(request.requestType)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                      {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <p className="text-sm text-gray-700 truncate">{request.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status.replace('-', ' ').charAt(0).toUpperCase() + request.status.replace('-', ' ').slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700">
                      {request.assignedTo || 'Unassigned'}
                    </div>
                    {request.estimatedTime && (
                      <div className="text-xs text-gray-500">Est: {request.estimatedTime}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button onClick={() => openViewModal(request)} className="px-3 py-1 rounded-md text-sm text-heritage-green border border-gray-200 bg-heritage-green/10 hover:bg-heritage-green/20 transition-colors">View</button>
                      {/* 'Start' action removed per UI policy change */}
                      {/* Complete button removed per request */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No assistance requests found for the selected filters.</p>
        </div>
      )}
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-100 bg-white/50">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="ml-1">Previous</span>
              </button>

              <div className="flex items-center space-x-2">
                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 7) {
                    pageNum = i + 1;
                  } else {
                    const start = Math.max(1, Math.min(currentPage - 3, totalPages - 6));
                    pageNum = start + i;
                  }
                  const isActive = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`inline-flex items-center justify-center min-w-[38px] h-10 px-3 text-sm font-medium rounded-md transition-all ${isActive ? 'bg-gradient-to-r from-heritage-green to-heritage-neutral text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'}`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="mr-1">Next</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
