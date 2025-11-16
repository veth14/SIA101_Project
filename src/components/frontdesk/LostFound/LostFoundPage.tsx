import React, { useState, useEffect, useCallback } from 'react';
import LostFoundStats from './LostFoundStats';
import LostFoundGrid from './LostFoundGrid';
import type { LostFoundItem, LostFoundStats as StatsType } from './types';
import { sampleLostFoundItems } from './sampleData';
import { Modal } from '../../admin/Modal';
import { db } from '../../../config/firebase';
import { collection, getDocs, updateDoc, doc, setDoc, runTransaction } from 'firebase/firestore';

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

  // (No localStorage cache in simplified Option A)

  // Helper: remove duplicate items by id while preserving first occurrence order
  const dedupeItemsById = (arr: LostFoundItem[]) => {
    const seen = new Set<string>();
    const out: LostFoundItem[] = [];
    for (const it of arr) {
      if (!it || typeof it.id === 'undefined' || it.id === null) continue;
      const key = String(it.id);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(it);
    }
    return out;
  };

  // Helper: compute next sequential ID of form LF### (e.g., LF001 -> LF002)
  const getNextSequentialId = (items: LostFoundItem[]) => {
    let max = 0;
    for (const it of items) {
      if (!it || !it.id) continue;
      const idStr = String(it.id).toUpperCase();
      const m = idStr.match(/^LF0*(\d+)$/);
      if (m) {
        const n = parseInt(m[1], 10);
        if (!Number.isNaN(n) && n > max) max = n;
      }
    }
    const next = max + 1;
    return `LF${String(next).padStart(3, '0')}`;
  };

  // Allocate a globally-unique sequential ID using a Firestore transaction.
  // This avoids race conditions where multiple clients compute the same next id locally.
  const allocateSequentialId = async () => {
    try {
      const counterRef = doc(db, 'counters', 'lostFound');
      const nextNum = await runTransaction(db, async (tx) => {
        const snap = await tx.get(counterRef);
        if (!snap.exists()) {
          // Initialize counter using current known items to avoid collisions with pre-existing IDs
          const localNextStr = getNextSequentialId(lostFoundItems); // e.g. LF005
          const localNext = parseInt(localNextStr.replace(/^LF0*/i, ''), 10) || 1;
          tx.set(counterRef, { last: localNext });
          return localNext;
        }
        const data = snap.data() as { last?: number };
        const last = (data.last ?? 0) + 1;
        tx.update(counterRef, { last });
        return last;
      });
      return `LF${String(nextNum).padStart(3, '0')}`;
    } catch (err) {
      console.warn('Failed to allocate sequential ID via transaction, falling back to local next id', err);
      // fallback to local computation (may risk collision across clients)
      return getNextSequentialId(lostFoundItems);
    }
  };

  // Helper: fetch from Firestore and cache results
  // OPTIMIZED: Check sessionStorage cache first to reduce reads
  const fetchAndCacheFromFirestore = useCallback(async () => {
    try {
      // Check cache first (5-minute TTL)
      const cached = sessionStorage.getItem('lostFoundCache');
      const cacheTime = sessionStorage.getItem('lostFoundCacheTime');
      const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
      
      if (cached && cacheTime && (Date.now() - parseInt(cacheTime)) < CACHE_TTL) {
        console.log('📦 Using cached lost & found data');
        const parsedData = JSON.parse(cached);
        setLostFoundItems(dedupeItemsById(parsedData.items));
        setDocMap(parsedData.docMap);
        return;
      }
      
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

  setLostFoundItems(dedupeItemsById(items));
  setDocMap(map);
  
  // Cache the results
  sessionStorage.setItem('lostFoundCache', JSON.stringify({ items, docMap: map }));
  sessionStorage.setItem('lostFoundCacheTime', Date.now().toString());
    } catch (err) {
      console.warn('Failed to fetch lostFoundItems from firestore:', err);
    }
  }, []);

  // Fetch items from Firestore on mount. (No localStorage cache in Option A)
  useEffect(() => {
    fetchAndCacheFromFirestore();
  }, [fetchAndCacheFromFirestore]);

  // (Refresh handled by reloading the page or calling fetchAndCacheFromFirestore manually if needed)

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
      const next = dedupeItemsById(prev.map(i => i.id === updated.id ? updated : i));
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

    // determine if we need to create a new ID for this item
    // Use a timestamp + random suffix to avoid collisions when multiple items are created rapidly
    if (!updated.id || updated.id.toString().startsWith('new-') || !docMap[updated.id]) {
      // Create path (non-blocking): give a temporary client id, close modal immediately,
      // then allocate a final LF### id in background and reconcile the local state.
      const tempId = `new-${Date.now().toString()}-${Math.random().toString(36).slice(2,8)}`;
      savedItem = { ...updated, id: tempId };

      // optimistic local update with temp id
      setLostFoundItems(prev => {
        const next = dedupeItemsById([savedItem, ...prev]);
        return next;
      });

      // tentatively map tempId -> tempId so updates during the short window work
      setDocMap(prev => ({ ...prev, [tempId]: tempId }));

      // close modal immediately for snappy UX
      setIsModalOpen(false);
      setSelectedItem(null);
      setFormItem(null);

      // Background: allocate final sequential id and persist to Firestore
      (async () => {
        try {
          const finalId = await allocateSequentialId();
          // write document with finalId as doc id
          await setDoc(doc(db, 'lostFoundItems', finalId), {
            itemId: finalId,
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

          // reconcile local state: replace tempId with finalId
          setLostFoundItems(prev => {
            const replaced = prev.map(i => i.id === tempId ? { ...i, id: finalId } : i);
            return dedupeItemsById(replaced);
          });

          // update docMap: remove temp mapping and add final mapping
          setDocMap(prev => {
            const next = { ...prev };
            delete next[tempId as string];
            next[finalId] = finalId;
            return next;
          });
        } catch (err) {
          console.warn('Failed to allocate/persist new lostFound item:', err);
          // Optionally: mark temp item as unsynced or show toast to user
        }
      })();
    } else {
      // updating existing item: optimistic local update and background updateDoc
      savedItem = updated;
      setLostFoundItems(prev => {
        const next = dedupeItemsById(prev.map(i => i.id === savedItem.id ? savedItem : i));
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

  // Validation helper for Add Item (all required fields)
  const isFormNew = !!formItem && String(formItem.id ?? '').startsWith('new-');
  const isAddFormValid = () => {
    if (!formItem) return false;
    const required = [formItem.itemName, formItem.category, formItem.location, formItem.dateFound, formItem.foundBy, formItem.description];
    return required.every(f => typeof f === 'string' && f.trim().length > 0);
  };
  const saveDisabled = isFormNew && !isAddFormValid();


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

        {/* Stats Cards Grid */}
        <LostFoundStats stats={statusCounts} />

        {/* Items Grid */}
        <div className="flex items-center justify-between">
          <div />
          <div className="flex items-center space-x-2">{/* intentional placeholder - refresh removed in Option A */}</div>
        </div>

        <LostFoundGrid
          items={lostFoundItems}
          onViewDetails={handleViewDetails}
          onMarkClaimed={handleMarkClaimed}
        />
  {/* Reuse shared Modal wrapper but render invoice-style header and content inside */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title=""
          size="lg"
          showCloseButton={false}
          showHeaderBar={false}
          headerContent={formItem ? (
            <div className="relative z-30 flex m-auto w-[100%] px-8 py-8 items-center justify-between border-b border-heritage-neutral/10 bg-gradient-to-r from-heritage-green/5 to-heritage-light/10 backdrop-blur-sm">
              <div className="flex items-center space-x-3 ">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-heritage-green">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>  
                </div>
                <div>
                  <h2 className="text-xl font-bold text-heritage-green">{formItem.id?.toString().startsWith('new-') ? 'Add Lost Item' : 'Item Details'}</h2>
                  <p className="text-sm text-heritage-neutral">{formItem.id?.toString().startsWith('new-') ? 'Create a new lost item record' : 'View or edit the lost item information'}</p>
                </div>
              </div>
              <button onClick={handleModalClose} className="p-2 transition-all duration-200 rounded-full text-heritage-neutral hover:text-heritage-green hover:bg-heritage-green/10 ml-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ) : undefined}
        >
          {formItem && (
            <div className="p-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-heritage-neutral">Item Name</label>
                    <input
                      value={formItem.itemName}
                      onChange={(e) => setFormItem({ ...formItem, itemName: e.target.value })}
                      className="w-full px-4 py-3 transition-colors border rounded-lg border-heritage-neutral/30 focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                      placeholder="Enter item name"
                    />
                    {isFormNew && (!formItem.itemName || formItem.itemName.trim() === '') && (
                      <p className="text-xs text-red-500 mt-1">Item name is required.</p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-heritage-neutral">Category</label>
                    <select
                      value={formItem.category}
                      onChange={(e) => setFormItem({ ...formItem, category: e.target.value as LostFoundItem['category'] })}
                      className="w-full px-4 py-3 transition-colors border rounded-lg border-heritage-neutral/30 focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                    >
                      <option value="electronics">Electronics</option>
                      <option value="clothing">Clothing</option>
                      <option value="jewelry">Jewelry</option>
                      <option value="documents">Documents</option>
                      <option value="personal">Personal</option>
                      <option value="other">Other</option>
                    </select>
                    {isFormNew && (!formItem.category || formItem.category.trim() === '') && (
                      <p className="text-xs text-red-500 mt-1">Category is required.</p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-heritage-neutral">Status</label>
                    <select
                      value={formItem.status}
                      onChange={(e) => setFormItem({ ...formItem, status: e.target.value as LostFoundItem['status'] })}
                      className="w-full px-4 py-3 transition-colors border rounded-lg border-heritage-neutral/30 focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                    >
                      <option value="unclaimed">Unclaimed</option>
                      <option value="claimed">Claimed</option>
                      <option value="disposed">Disposed</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium text-heritage-neutral">Location Found</label>
                  <input
                    value={formItem.location}
                    onChange={(e) => setFormItem({ ...formItem, location: e.target.value })}
                    className="w-full px-4 py-3 transition-colors border rounded-lg border-heritage-neutral/30 focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                    placeholder="e.g., Lobby, Poolside"
                  />
                  {isFormNew && (!formItem.location || formItem.location.trim() === '') && (
                    <p className="text-xs text-red-500 mt-1">Location is required.</p>
                  )}
                </div>

                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium text-heritage-neutral">Found By</label>
                  <input
                    value={formItem.foundBy}
                    onChange={(e) => setFormItem({ ...formItem, foundBy: e.target.value })}
                    className="w-full px-4 py-3 transition-colors border rounded-lg border-heritage-neutral/30 focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                    placeholder="Staff name or description"
                  />
                  {isFormNew && (!formItem.foundBy || formItem.foundBy.trim() === '') && (
                    <p className="text-xs text-red-500 mt-1">Found by is required.</p>
                  )}
                </div>

                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium text-heritage-neutral">Date Found</label>
                  <input
                    type="date"
                    value={new Date(formItem.dateFound).toISOString().slice(0, 10)}
                    onChange={(e) => setFormItem({ ...formItem, dateFound: new Date(e.target.value).toISOString() })}
                    className="w-48 px-4 py-3 transition-colors border rounded-lg border-heritage-neutral/30 focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                  />
                  {isFormNew && (!formItem.dateFound || String(formItem.dateFound).trim() === '') && (
                    <p className="text-xs text-red-500 mt-1">Date found is required.</p>
                  )}
                </div>

                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium text-heritage-neutral">Description</label>
                  <textarea
                    value={formItem.description}
                    onChange={(e) => setFormItem({ ...formItem, description: e.target.value })}
                    className="w-full px-4 py-3 transition-colors border rounded-lg resize-none border-heritage-neutral/30 focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                    rows={4}
                  />
                  {isFormNew && (!formItem.description || formItem.description.trim() === '') && (
                    <p className="text-xs text-red-500 mt-1">Description is required.</p>
                  )}
                </div>

                {/* Guest / Claim information - show when not a new form */}
                {!isFormNew && (
                  <div className="mt-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-heritage-neutral">Claimed By (Name)</label>
                        <input
                          value={formItem.claimedBy ?? ''}
                          onChange={(e) => setFormItem({ ...formItem, claimedBy: e.target.value })}
                          className="w-full px-4 py-3 transition-colors border rounded-lg border-heritage-neutral/30 focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-heritage-neutral">Claimed Date</label>
                        <input
                          type="date"
                          value={formItem.claimedDate ? new Date(formItem.claimedDate).toISOString().slice(0, 10) : ''}
                          onChange={(e) => setFormItem({ ...formItem, claimedDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                          className="w-full px-4 py-3 transition-colors border rounded-lg border-heritage-neutral/30 focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-heritage-neutral">&nbsp;</label>
                        <div className="text-sm text-heritage-neutral/80 mt-1">Optional claim details for guest contact</div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <h4 className="flex items-center text-lg font-bold text-heritage-green">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Guest Information
                      </h4>

                      <div className="grid grid-cols-3 gap-4 mt-3">
                        <div>
                          <label className="block mb-2 text-sm font-medium text-heritage-neutral">Name</label>
                          <input
                            value={(formItem.guestInfo && formItem.guestInfo.name) ?? ''}
                            onChange={(e) => setFormItem({ ...formItem, guestInfo: { name: e.target.value, room: formItem.guestInfo?.room ?? '', contact: formItem.guestInfo?.contact ?? '' } })}
                            className="w-full px-4 py-3 transition-colors border rounded-lg border-heritage-neutral/30 focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                            placeholder="Guest full name"
                          />
                        </div>

                        <div>
                          <label className="block mb-2 text-sm font-medium text-heritage-neutral">Room</label>
                          <input
                            value={(formItem.guestInfo && formItem.guestInfo.room) ?? ''}
                            onChange={(e) => setFormItem({ ...formItem, guestInfo: { name: formItem.guestInfo?.name ?? '', room: e.target.value, contact: formItem.guestInfo?.contact ?? '' } })}
                            className="w-full px-4 py-3 transition-colors border rounded-lg border-heritage-neutral/30 focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                            placeholder="Room number"
                          />
                        </div>

                        <div>
                          <label className="block mb-2 text-sm font-medium text-heritage-neutral">Contact</label>
                          <input
                            value={(formItem.guestInfo && formItem.guestInfo.contact) ?? ''}
                            onChange={(e) => setFormItem({ ...formItem, guestInfo: { name: formItem.guestInfo?.name ?? '', room: formItem.guestInfo?.room ?? '', contact: e.target.value } })}
                            className="w-full px-4 py-3 transition-colors border rounded-lg border-heritage-neutral/30 focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                            placeholder="Contact number or email"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action buttons - invoice style */}
                <div className="flex pt-6 mt-6 space-x-4 border-t border-heritage-neutral/10">
                  <button onClick={handleModalClose} className="flex-1 px-6 py-3 transition-all duration-300 border-2 border-heritage-neutral/30 text-heritage-neutral rounded-xl hover:bg-heritage-neutral/5">Cancel</button>
                  <button onClick={() => formItem && handleSaveItem(formItem)} disabled={saveDisabled} className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-heritage-green to-heritage-neutral text-white rounded-xl hover:from-heritage-green/90 hover:to-heritage-neutral/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <span>Save</span>
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
