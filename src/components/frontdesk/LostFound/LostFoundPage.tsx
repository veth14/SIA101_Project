import React, { useState, useEffect, useCallback } from 'react';
import LostFoundHeader from './LostFoundHeader';
import LostFoundStats from './LostFoundStats';
import LostFoundGrid from './LostFoundGrid';
import type { LostFoundItem, LostFoundStats as StatsType } from './types';
import { sampleLostFoundItems } from './sampleData';
import { Modal } from '../../admin/Modal';
import { db } from '../../../config/firebase';
import { collection, getDocs, updateDoc, doc, setDoc } from 'firebase/firestore';

const LostFoundPage: React.FC = () => {
  // Use sample data from external file (make stateful so we can add/update items)
  const [lostFoundItems, setLostFoundItems] = useState<LostFoundItem[]>(sampleLostFoundItems);

  // Modal / selected item state
  const [selectedItem, setSelectedItem] = useState<LostFoundItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formItem, setFormItem] = useState<LostFoundItem | null>(null);
  const [docMap, setDocMap] = useState<Record<string, string>>({}); // maps itemId -> firestore docId

  // Firestore document shape for lostFoundItems (partial)
  type FirestoreLostFound = Partial<{
    itemId: string;
    itemName: string;
    description: string;
    category: LostFoundItem['category'];
    location: string;
    dateFound: string;
    foundBy: string;
    status: LostFoundItem['status'];
    guestInfo: LostFoundItem['guestInfo'];
    claimedDate: string;
    claimedBy: string;
  }>;

  // Cache TTL (ms). If cache is older than this we will re-read Firestore on mount.
  const CACHE_TTL_MS = 5 * 60 * 1000;

  // Helper: fetch from Firestore and cache results
  const fetchAndCacheFromFirestore = useCallback(async () => {
    try {
      const snapshot = await getDocs(collection(db, 'lostFoundItems'));
      const items: LostFoundItem[] = snapshot.docs.map(d => {
        const data = d.data() as FirestoreLostFound;
        return {
          id: data.itemId ?? d.id,
          itemName: data.itemName ?? '',
          description: data.description ?? '',
          category: (data.category ?? 'other') as LostFoundItem['category'],
          location: data.location ?? '',
          dateFound: data.dateFound ?? new Date().toISOString(),
          foundBy: data.foundBy ?? '',
          status: (data.status ?? 'unclaimed') as LostFoundItem['status'],
          guestInfo: data.guestInfo,
          claimedDate: data.claimedDate,
          claimedBy: data.claimedBy
        } as LostFoundItem;
      });

      const map: Record<string, string> = {};
      snapshot.docs.forEach(d => {
        const data = d.data() as FirestoreLostFound;
        const itemId = data.itemId ?? d.id;
        map[itemId] = d.id;
      });

      setLostFoundItems(items);
      setDocMap(map);
      try { localStorage.setItem('lostFoundItems_cache', JSON.stringify(items)); } catch (err) { console.warn('Failed to cache lostFoundItems', err); }
      try { localStorage.setItem('lostFoundItems_docMap', JSON.stringify(map)); } catch (err) { console.warn('Failed to cache docMap', err); }
      try { localStorage.setItem('lostFoundItems_cache_ts', String(Date.now())); } catch (err) { console.warn('Failed to cache timestamp', err); }
    } catch (err) {
      console.warn('Failed to fetch lostFoundItems from firestore:', err);
    }
  }, []);

  // Load items from cache or firestore (only once). We prefer localStorage cache to avoid repeated reads.
  useEffect(() => {
    const cached = localStorage.getItem('lostFoundItems_cache');
    const docMapRaw = localStorage.getItem('lostFoundItems_docMap');
    const cacheTsRaw = localStorage.getItem('lostFoundItems_cache_ts');
    const cacheTs = cacheTsRaw ? Number(cacheTsRaw) : 0;
    const now = Date.now();

    if (cached && cacheTs && (now - cacheTs) < CACHE_TTL_MS) {
      try {
        const items = JSON.parse(cached) as LostFoundItem[];
        setLostFoundItems(items);
        setDocMap(docMapRaw ? JSON.parse(docMapRaw) : {});
        return; // cache is fresh; do not re-read from firestore
      } catch (err) {
        console.warn('Failed to parse lostFoundItems cache:', err);
      }
    }

    // cache absent or stale -> fetch from firestore once and cache it
    fetchAndCacheFromFirestore();
  }, []);

  // Manual refresh: clear local cache and re-fetch from Firestore
  const handleRefreshFromServer = async () => {
    try {
      localStorage.removeItem('lostFoundItems_cache');
      localStorage.removeItem('lostFoundItems_docMap');
      localStorage.removeItem('lostFoundItems_cache_ts');
    } catch (err) {
      console.warn('Failed to clear lostFoundItems cache', err);
    }
    await fetchAndCacheFromFirestore();
  };

  // Calculate statistics
  const statusCounts: StatsType = {
    all: lostFoundItems.length,
    unclaimed: lostFoundItems.filter(item => item.status === 'unclaimed').length,
    claimed: lostFoundItems.filter(item => item.status === 'claimed').length,
    disposed: lostFoundItems.filter(item => item.status === 'disposed').length,
  };

  // Handler functions
  const handleViewDetails = (item: LostFoundItem) => {
    // Open shared Modal with item data 
    setSelectedItem(item);
    setFormItem({ ...item });
    setIsModalOpen(true);
  };

  const handleMarkClaimed = (item: LostFoundItem) => {
    // mark item as claimed in local state and persist to firestore when possible
    const updated: LostFoundItem = { ...item, status: 'claimed' as LostFoundItem['status'], claimedDate: new Date().toISOString() };
    // update local state
    setLostFoundItems(prev => {
      const next = prev.map(i => i.id === updated.id ? updated : i);
      try { localStorage.setItem('lostFoundItems_cache', JSON.stringify(next)); } catch (err) { console.warn('Failed to cache lostFoundItems', err); }
      return next;
    });

    // persist to firestore if we have a mapping
    const docId = docMap[item.id];
    if (docId) {
      updateDoc(doc(db, 'lostFoundItems', docId), {
        status: 'claimed',
        claimedDate: updated.claimedDate
      }).catch(err => console.warn('Failed to update claim status:', err));
    }
  };

  // Save (create or update) item from modal form
  const handleSaveItem = async (updated: LostFoundItem) => {
    // Optimistic save: update UI immediately, persist to Firestore in background
    let savedItem: LostFoundItem = { ...updated };

    // determine next LF id count
    const currentCount = Object.keys(docMap).length || lostFoundItems.length;

    if (!updated.id || updated.id.toString().startsWith('new-') || !docMap[updated.id]) {
      // create deterministic newId 
      const newId = `LF${(currentCount + 1).toString().padStart(3, '0')}`;
      savedItem = { ...updated, id: newId };

      // optimistic local update
      setLostFoundItems(prev => {
        const next = [savedItem, ...prev];
        try { localStorage.setItem('lostFoundItems_cache', JSON.stringify(next)); } catch (err) { console.warn('Failed to cache lostFoundItems', err); }
        return next;
      });

      setDocMap(prev => {
        const next = { ...prev, [newId]: newId };
        try { localStorage.setItem('lostFoundItems_docMap', JSON.stringify(next)); } catch (err) { console.warn('Failed to cache docMap', err); }
        return next;
      });

      setIsModalOpen(false);
      setSelectedItem(null);
      setFormItem(null);

      // Persist to Firestore in background 
      (async () => {
        try {
          await setDoc(doc(db, 'lostFoundItems', newId), {
            itemId: newId,
            itemName: savedItem.itemName,
            description: savedItem.description,
            category: savedItem.category,
            location: savedItem.location,
            dateFound: savedItem.dateFound,
            foundBy: savedItem.foundBy,
            status: savedItem.status,
            guestInfo: savedItem.guestInfo ?? null,
            claimedDate: savedItem.claimedDate ?? null,
            claimedBy: savedItem.claimedBy ?? null
          });
        } catch (err) {
          console.warn('Failed to write new lostFound item to firestore:', err);
          // Optionally: mark item as unsynced or show toast
        }
      })();
    } else {
      // updating existing item: optimistic local update and background updateDoc
      savedItem = updated;
      setLostFoundItems(prev => {
        const next = prev.map(i => i.id === savedItem.id ? savedItem : i);
        try { localStorage.setItem('lostFoundItems_cache', JSON.stringify(next)); } catch (err) { console.warn('Failed to cache lostFoundItems', err); }
        return next;
      });

      setIsModalOpen(false);
      setSelectedItem(null);
      setFormItem(null);

      const docId = docMap[updated.id] ?? updated.id;
      (async () => {
        try {
          await updateDoc(doc(db, 'lostFoundItems', docId), {
            itemName: updated.itemName,
            description: updated.description,
            category: updated.category,
            location: updated.location,
            dateFound: updated.dateFound,
            foundBy: updated.foundBy,
            status: updated.status,
            guestInfo: updated.guestInfo ?? null,
            claimedDate: updated.claimedDate ?? null,
            claimedBy: updated.claimedBy ?? null
          });
        } catch (err) {
          console.warn('Failed to update lost found item in firestore:', err);
        }
      })();
    }
  };

  // Close modal
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setFormItem(null);
  };

  // keep formItem synced when selectedItem changes
  useEffect(() => {
    if (selectedItem) setFormItem({ ...selectedItem });
  }, [selectedItem]);


  return (
    <div className="min-h-screen bg-[#F9F6EE]">
      {/* Light Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Subtle Light Orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 rounded-full blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl animate-pulse delay-1000 opacity-25"></div>
        <div className="absolute bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 rounded-full blur-3xl animate-pulse delay-2000 opacity-20"></div>
        
        {/* Light Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(134, 134, 134, 0.1) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">
        {/* Header */}
        <LostFoundHeader />

        {/* Stats Cards Grid */}
        <LostFoundStats stats={statusCounts} />

        {/* Items Grid */}
        <div className="flex items-center justify-between">
          <div />
          <div className="flex items-center space-x-2">
            <button onClick={handleRefreshFromServer} className="px-3 py-2 rounded-md border text-sm">Refresh</button>
          </div>
        </div>

        <LostFoundGrid
          items={lostFoundItems}
          onViewDetails={handleViewDetails}
          onMarkClaimed={handleMarkClaimed}
        />
        {/* Reuse shared Modal for viewing/adding items */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title={formItem ? (formItem.id?.toString().startsWith('new-') ? 'Add Lost Item' : 'Item Details') : 'Item Details'}
          size="lg"
        >
          {formItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Item Name</label>
                  <input
                    value={formItem.itemName}
                    onChange={(e) => setFormItem({ ...formItem, itemName: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-200 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={formItem.category}
                    onChange={(e) => setFormItem({ ...formItem, category: e.target.value as LostFoundItem['category'] })}
                    className="mt-1 block w-full rounded-md border-gray-200 shadow-sm"
                  >
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="jewelry">Jewelry</option>
                    <option value="documents">Documents</option>
                    <option value="personal">Personal</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={formItem.status}
                      onChange={(e) => setFormItem({ ...formItem, status: e.target.value as LostFoundItem['status'] })}
                      className="mt-1 block w-full rounded-md border-gray-200 shadow-sm"
                    >
                      <option value="unclaimed">Unclaimed</option>
                      <option value="claimed">Claimed</option>
                      <option value="disposed">Disposed</option>
                    </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Location Found</label>
                <input
                  value={formItem.location}
                  onChange={(e) => setFormItem({ ...formItem, location: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-200 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Found By</label>
                <input
                  value={formItem.foundBy}
                  onChange={(e) => setFormItem({ ...formItem, foundBy: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-200 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date Found</label>
                <input
                  type="date"
                  value={new Date(formItem.dateFound).toISOString().slice(0, 10)}
                  onChange={(e) => setFormItem({ ...formItem, dateFound: new Date(e.target.value).toISOString() })}
                  className="mt-1 block w-48 rounded-md border-gray-200 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formItem.description}
                  onChange={(e) => setFormItem({ ...formItem, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-200 shadow-sm"
                  rows={4}
                />
              </div>

              {/* Guest / Claim information - show when status is claimed or allow editing */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Claimed By (Name)</label>
                  <input
                    value={formItem.claimedBy ?? ''}
                    onChange={(e) => setFormItem({ ...formItem, claimedBy: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-200 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Claimed Date</label>
                  <input
                    type="date"
                    value={formItem.claimedDate ? new Date(formItem.claimedDate).toISOString().slice(0, 10) : ''}
                    onChange={(e) => setFormItem({ ...formItem, claimedDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                    className="mt-1 block w-full rounded-md border-gray-200 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">&nbsp;</label>
                  <div className="text-sm text-gray-500 mt-1">Optional claim details for guest contact</div>
                </div>
              </div>

              <div className="pt-2">
                <h4 className="text-sm font-medium text-gray-800">Guest Information</h4>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div>
                    <label className="block text-sm text-gray-600">Name</label>
                    <input
                      value={(formItem.guestInfo && formItem.guestInfo.name) ?? ''}
                      onChange={(e) => setFormItem({ ...formItem, guestInfo: { name: e.target.value, room: formItem.guestInfo?.room ?? '', contact: formItem.guestInfo?.contact ?? '' } })}
                      className="mt-1 block w-full rounded-md border-gray-200 shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600">Room</label>
                    <input
                      value={(formItem.guestInfo && formItem.guestInfo.room) ?? ''}
                      onChange={(e) => setFormItem({ ...formItem, guestInfo: { name: formItem.guestInfo?.name ?? '', room: e.target.value, contact: formItem.guestInfo?.contact ?? '' } })}
                      className="mt-1 block w-full rounded-md border-gray-200 shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600">Contact</label>
                    <input
                      value={(formItem.guestInfo && formItem.guestInfo.contact) ?? ''}
                      onChange={(e) => setFormItem({ ...formItem, guestInfo: { name: formItem.guestInfo?.name ?? '', room: formItem.guestInfo?.room ?? '', contact: e.target.value } })}
                      className="mt-1 block w-full rounded-md border-gray-200 shadow-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button onClick={handleModalClose} className="px-4 py-2 rounded-md border">Cancel</button>
                <button
                  onClick={() => formItem && handleSaveItem(formItem)}
                  className="px-4 py-2 rounded-md bg-heritage-green text-white"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default LostFoundPage;
