import React, { useState, useEffect, useCallback } from 'react';
import LostFoundStats from './LostFoundStats';
import LostFoundGrid from './LostFoundGrid';
import LostFoundNavigation from './LostFoundNavigation';
import type { LostFoundItem, LostFoundStats as StatsType } from './types';
import { Modal } from '../../admin/Modal';
import { db } from '../../../config/firebase';
import { collection, getDocs, updateDoc, doc, setDoc, runTransaction } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';

const LostFoundPage: React.FC = () => {
  // Use sample data from external file (make stateful so we can add/update items)
  // Split into two arrays: foundItems (uses sample data) and lostItems (separate collection)
  const [foundItems, setFoundItems] = useState<LostFoundItem[]>([]);
  const [lostItems, setLostItems] = useState<LostFoundItem[]>([]);

  // Modal / selected item state
  const [selectedItem, setSelectedItem] = useState<LostFoundItem | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<'found' | 'lost'>('found');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formItem, setFormItem] = useState<LostFoundItem | null>(null);
  const [docMapFound, setDocMapFound] = useState<Record<string, string>>({}); // maps itemId -> firestore docId for found collection
  const [docMapLost, setDocMapLost] = useState<Record<string, string>>({}); // maps for lost collection

  const [activeTab, setActiveTab] = useState<'found' | 'lost'>('found');

  // Firestore document shape for lost/found collections (partial)
  type FirestoreLostFound = Partial<{
    itemId: string;
    itemName: string;
    description: string;
    category: LostFoundItem['category'];
    location: string;
    dateFound: string;
    foundBy: string;
    // for lost collection
    dateLost: string;
    lostBy: string;
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

  // (No session caching — always read fresh data on mount)

  // Helper: compute next sequential ID for a collection using a given prefix (e.g., FND/LST)
  // It looks for trailing digits in existing ids and returns prefix + zero-padded number.
  const getNextSequentialId = (items: LostFoundItem[], prefix: string) => {
    let max = 0;
    for (const it of items) {
      if (!it || !it.id) continue;
      const idStr = String(it.id).toUpperCase();
      const m = idStr.match(/(\d+)$/);
      if (m) {
        const n = parseInt(m[1], 10);
        if (!Number.isNaN(n) && n > max) max = n;
      }
    }
    const next = max + 1;
    return `${prefix}${String(next).padStart(3, '0')}`;
  };

  // Allocate a sequential ID by scanning the target collection for the highest numeric suffix
  // and returning the next number. This keeps logic simple and avoids maintaining a
  // separate counters document. Note: this is still subject to race conditions if multiple
  // clients create items at the exact same time. For stronger guarantees, consider a
  // server-side generator or a transaction-based counter.
  const allocateSequentialId = async (collectionName: 'found' | 'lost') => {
    const prefix = collectionName === 'found' ? 'FND' : 'LST';
    try {
      const snap = await getDocs(collection(db, collectionName));
      let max = 0;
      snap.docs.forEach(d => {
        const data = d.data() as FirestoreLostFound;
        // prefer explicit itemId field, otherwise use Firestore doc id
        const itemId = String(data.itemId ?? d.id).toUpperCase();
        const m = itemId.match(/(\d+)$/);
        if (m) {
          const n = parseInt(m[1], 10);
          if (!Number.isNaN(n) && n > max) max = n;
        }
      });
      const next = max + 1; // 1 when empty
      return `${prefix}${String(next).padStart(3, '0')}`;
    } catch (err) {
      console.warn('Failed to compute next sequential id from collection, falling back to local items', err);
      const fallbackItems = collectionName === 'found' ? foundItems : lostItems;
      return getNextSequentialId(fallbackItems, prefix);
    }
  };

  // Create a document with a reserved sequential id using a transaction.
  // Tries up to `maxRetries` times: compute next id, then atomically create the doc only
  // if it doesn't already exist. This avoids a separate counters doc and reduces
  // collisions without needing Cloud Functions (works on Spark). If all retries fail,
  // returns null so caller can fallback.
  const createAndReserveDoc = async (
    collectionName: 'found' | 'lost',
    payload: DocumentData,
    maxRetries = 5
  ): Promise<string | null> => {
    const targetCol = collectionName === 'found' ? 'found' : 'lost';
    // Read the collection once to compute the current max numeric suffix.
    // This prevents repeated full-collection reads on each retry.
    try {
      const snap = await getDocs(collection(db, collectionName));
      let max = 0;
      snap.docs.forEach(d => {
        const data = d.data() as FirestoreLostFound;
        const itemId = String(data.itemId ?? d.id).toUpperCase();
        const m = itemId.match(/(\d+)$/);
        if (m) {
          const n = parseInt(m[1], 10);
          if (!Number.isNaN(n) && n > max) max = n;
        }
      });

      const prefix = collectionName === 'found' ? 'FND' : 'LST';
      // Try candidate ids incrementally without re-scanning the whole collection.
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        const candidateNum = max + 1 + attempt;
        const candidateId = `${prefix}${String(candidateNum).padStart(3, '0')}`;
        const docRef = doc(db, targetCol, candidateId);
        try {
          await runTransaction(db, async (tx) => {
            const snapDoc = await tx.get(docRef);
            if (snapDoc.exists()) {
              // someone else already wrote this id — abort this transaction so we can retry with next candidate
              throw new Error('DOC_EXISTS');
            }
            tx.set(docRef, payload);
          });
          return candidateId; // success
        } catch (txErr) {
          const msg = (txErr && typeof txErr === 'object' && 'message' in txErr) ? String((txErr as { message?: unknown }).message ?? '') : '';
          if (msg === 'DOC_EXISTS') {
            // try next candidate without re-reading the whole collection
            continue;
          }
          // transient error: back off and retry
          console.warn('[LostFound] createAndReserveDoc transaction failed for', candidateId, txErr);
          await new Promise((res) => setTimeout(res, 200 * (attempt + 1)));
        }
      }
    } catch (err) {
      console.warn('[LostFound] Failed to scan collection for base id', err);
    }
    // all attempts failed
    return null;
  };

  // Helper: fetch from Firestore and cache results
  // OPTIMIZED: Check sessionStorage cache first to reduce reads
  const fetchAndCacheFromFirestore = useCallback(async () => {
    try {
      // Always fetch latest data from Firestore on mount so deletions and remote updates are reflected.
      console.debug('[LostFoundPage] fetching collections: found, lost (no session cache read)');
      // Fetch found items
      const snapFound = await getDocs(collection(db, 'found'));
      const found: LostFoundItem[] = snapFound.docs.map(d => {
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

      const mapFound: Record<string, string> = {};
      snapFound.docs.forEach(d => {
        const data = d.data() as FirestoreLostFound;
        const itemId = data.itemId ?? d.id;
        mapFound[itemId] = d.id;
      });

      // Fetch lost items (fields use dateLost / lostBy)
      const snapLost = await getDocs(collection(db, 'lost'));
      const lost: LostFoundItem[] = snapLost.docs.map(d => {
        const data = d.data() as FirestoreLostFound;
        return {
          id: data.itemId ?? d.id,
          itemName: data.itemName ?? '',
          description: data.description ?? '',
          category: (data.category ?? 'other') as LostFoundItem['category'],
          location: data.location ?? '',
          // normalize to the UI model: use dateFound/foundBy fields for display but they come from dateLost/lostBy
          dateFound: (data.dateLost as string) ?? new Date().toISOString(),
          foundBy: (data.lostBy as string) ?? '',
          status: (data.status ?? 'unclaimed') as LostFoundItem['status'],
          guestInfo: data.guestInfo,
          claimedDate: data.claimedDate,
          claimedBy: data.claimedBy
        } as LostFoundItem;
      });

      const mapLost: Record<string, string> = {};
      snapLost.docs.forEach(d => {
        const data = d.data() as FirestoreLostFound;
        const itemId = data.itemId ?? d.id;
        mapLost[itemId] = d.id;
      });

      setFoundItems(dedupeItemsById(found));
      setLostItems(dedupeItemsById(lost));
      setDocMapFound(mapFound);
      setDocMapLost(mapLost);

      // No session cache writes — keep UI data fresh from Firestore on mount

      // no-op: counters are initialized during allocation based on actual collection contents
    } catch (err) {
      console.warn('Failed to fetch lost/found items from firestore:', err);
    }
  }, []);

  // Fetch items from Firestore on mount. (No localStorage cache in Option A)
  useEffect(() => {
    fetchAndCacheFromFirestore();
  }, [fetchAndCacheFromFirestore]);

  // (Refresh handled by reloading the page or calling fetchAndCacheFromFirestore manually if needed)

  // Calculate statistics
  const activeItems = activeTab === 'found' ? foundItems : lostItems;
  const statusCounts: StatsType = {
    all: activeItems.length,
    unclaimed: activeItems.filter(item => item.status === 'unclaimed').length,
    claimed: activeItems.filter(item => item.status === 'claimed').length,
    disposed: activeItems.filter(item => item.status === 'disposed').length,
  };

  // Handler functions
  const handleViewDetails = (item: LostFoundItem) => {
    // Open shared Modal with item data (remember which collection is active)
    setSelectedCollection(activeTab);
    setSelectedItem(item);
    setFormItem({ ...item });
    setIsModalOpen(true);
  };

  const handleMarkClaimed = (item: LostFoundItem, collectionName: 'found' | 'lost') => {
    // mark item as claimed in local state and persist to firestore when possible
    const updated: LostFoundItem = { ...item, status: 'claimed' as LostFoundItem['status'], claimedDate: new Date().toISOString() };
    // update local state
    if (collectionName === 'found') {
  setFoundItems(prev => dedupeItemsById(prev.map(i => i.id === updated.id ? updated : i)));
      const docId = docMapFound[item.id];
      if (docId) {
        updateDoc(doc(db, 'found', docId), {
          status: 'claimed',
          claimedDate: updated.claimedDate
        }).catch(err => console.warn('Failed to update claim status (found):', err));
      }
    } else {
  setLostItems(prev => dedupeItemsById(prev.map(i => i.id === updated.id ? updated : i)));
      const docId = docMapLost[item.id];
      if (docId) {
        updateDoc(doc(db, 'lost', docId), {
          status: 'claimed',
          claimedDate: updated.claimedDate
        }).catch(err => console.warn('Failed to update claim status (lost):', err));
      }
    }
  };

  // Save (create or update) item from modal form
  const handleSaveItem = async (updated: LostFoundItem, collectionName: 'found' | 'lost') => {
    // Optimistic save: update UI immediately, persist to Firestore in background
    let savedItem: LostFoundItem = { ...updated };

    // determine if we need to create a new ID for this item
    // Use a timestamp + random suffix to avoid collisions when multiple items are created rapidly
  const hasDocMap = collectionName === 'found' ? docMapFound[updated.id ?? ''] : docMapLost[updated.id ?? ''];
  if (!updated.id || updated.id.toString().startsWith('new-') || !hasDocMap) {
      // Create path (non-blocking): give a temporary client id, close modal immediately,
      // then allocate a final LF### id in background and reconcile the local state.
      const tempId = `new-${Date.now().toString()}-${Math.random().toString(36).slice(2,8)}`;
      savedItem = { ...updated, id: tempId };

      // optimistic local update with temp id
      if (collectionName === 'found') {
        setFoundItems(prev => dedupeItemsById([savedItem, ...prev]));
        // tentatively map tempId -> tempId so updates during the short window work
        setDocMapFound(prev => ({ ...prev, [tempId]: tempId }));
      } else {
        setLostItems(prev => dedupeItemsById([savedItem, ...prev]));
        setDocMapLost(prev => ({ ...prev, [tempId]: tempId }));
      }

      // close modal immediately for snappy UX
      setIsModalOpen(false);
      setSelectedItem(null);
      setFormItem(null);

      // Background: allocate final sequential id and persist to Firestore (write to the chosen collection)
      (async () => {
        try {
              const targetCol = collectionName === 'found' ? 'found' : 'lost';
              // write field names depending on collection: found => dateFound/foundBy, lost => dateLost/lostBy
              const writePayload: DocumentData = {
            itemName: savedItem.itemName,
            description: savedItem.description,
            category: savedItem.category,
            location: savedItem.location,
            status: savedItem.status,
            guestInfo: savedItem.guestInfo ?? null,
            claimedDate: savedItem.claimedDate ?? null,
            claimedBy: savedItem.claimedBy ?? null
          };
          if (collectionName === 'found') {
            writePayload.dateFound = savedItem.dateFound;
            writePayload.foundBy = savedItem.foundBy;
          } else {
            writePayload.dateLost = savedItem.dateFound; // normalized field
            writePayload.lostBy = savedItem.foundBy;
          }
              // Attempt transactional reservation to avoid collisions
              try {
                const reservedId = await createAndReserveDoc(collectionName, writePayload);
                const finalIdToUse = reservedId ?? (await allocateSequentialId(collectionName));
                // If reservedId was null we fall back to a best-effort setDoc (may overwrite in rare race)
                await setDoc(doc(db, targetCol, finalIdToUse), { ...writePayload, itemId: finalIdToUse });

                // reconcile local state: replace tempId with finalIdToUse
                if (collectionName === 'found') {
                  setFoundItems(prev => dedupeItemsById(prev.map(i => i.id === tempId ? { ...i, id: finalIdToUse } : i)));
                  setDocMapFound(prev => {
                    const next = { ...prev };
                    delete next[tempId as string];
                    next[finalIdToUse] = finalIdToUse;
                    return next;
                  });
                } else {
                  setLostItems(prev => dedupeItemsById(prev.map(i => i.id === tempId ? { ...i, id: finalIdToUse } : i)));
                  setDocMapLost(prev => {
                    const next = { ...prev };
                    delete next[tempId as string];
                    next[finalIdToUse] = finalIdToUse;
                    return next;
                  });
                }
              } catch (errUnknown) {
                console.warn('Failed to allocate/persist new lostFound item:', errUnknown);
                // Optionally: mark temp item as unsynced or show toast to user
              }
          
        } catch (err) {
          console.warn('Failed to allocate/persist new lostFound item:', err);
          // Optionally: mark temp item as unsynced or show toast to user
        }
      })();
    } else {
      // updating existing item: optimistic local update and background updateDoc
      savedItem = updated;
        if (collectionName === 'found') {
        setFoundItems(prev => dedupeItemsById(prev.map(i => i.id === savedItem.id ? savedItem : i)));
      } else {
        setLostItems(prev => dedupeItemsById(prev.map(i => i.id === savedItem.id ? savedItem : i)));
      }

      setIsModalOpen(false);
      setSelectedItem(null);
      setFormItem(null);

      const docId = collectionName === 'found' ? (docMapFound[updated.id] ?? updated.id) : (docMapLost[updated.id] ?? updated.id);
      const targetCol = collectionName === 'found' ? 'found' : 'lost';
      (async () => {
        try {
          const payload: DocumentData = {
            itemName: updated.itemName,
            description: updated.description,
            category: updated.category,
            location: updated.location,
            status: updated.status,
            guestInfo: updated.guestInfo ?? null,
            claimedDate: updated.claimedDate ?? null,
            claimedBy: updated.claimedBy ?? null
          };
          if (collectionName === 'found') {
            payload.dateFound = updated.dateFound;
            payload.foundBy = updated.foundBy;
          } else {
            payload.dateLost = updated.dateFound; // normalized
            payload.lostBy = updated.foundBy;
          }
          await updateDoc(doc(db, targetCol, docId), payload);
        } catch (err) {
          console.warn('Failed to update lost/found item in firestore:', err);
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

        {/* Items Grid Navigation (consistent with Guest Experience Management) */}
        <LostFoundNavigation activeTab={activeTab} onTabChange={(t) => setActiveTab(t)} />

        <div className="mt-6">
          <LostFoundGrid
            items={activeTab === 'found' ? foundItems : lostItems}
            activeTab={activeTab}
            onViewDetails={(item) => handleViewDetails(item)}
            onMarkClaimed={(item) => handleMarkClaimed(item, activeTab)}
          />
        </div>
  {/* Reuse shared Modal wrapper but render invoice-style header and content inside */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title=""
          size="lg"
          showCloseButton={false}
          showHeaderBar={false}
          headerContent={formItem ? (
            <div className="relative z-30 flex  w-[100%] px-8 py-4 items-center justify-between border-b border-heritage-neutral/10 bg-gradient-to-r from-heritage-green/5 to-heritage-light/10 backdrop-blur-sm">
              <div className="flex items-center space-x-3 ">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-heritage-green">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>  
                </div>
                <div>
                  <h2 className="text-xl font-bold text-heritage-green">{formItem.id?.toString().startsWith('new-') ? `Add ${selectedCollection === 'found' ? 'Found' : 'Lost'} Item` : 'Item Details'}</h2>
                  <p className="text-sm text-heritage-neutral">{formItem.id?.toString().startsWith('new-') ? `Create a new ${selectedCollection === 'found' ? 'found' : 'lost'} item record` : 'View or edit the item information'}</p>
                </div>
              </div>
              <button onClick={handleModalClose} className="p-2 transition-all duration-200 rounded-full text-heritage-neutral hover:text-heritage-green hover:bg-heritage-green/10 ml-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ) : undefined}
        >
          {formItem && (
            <div className="p-4">
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
                  <label className="block mb-2 text-sm font-medium text-heritage-neutral">{selectedCollection === 'found' ? 'Location Found' : 'Location Lost'}</label>
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
                  <label className="block mb-2 text-sm font-medium text-heritage-neutral">{selectedCollection === 'found' ? 'Found By' : 'Lost By'}</label>
                  <input
                    value={formItem.foundBy}
                    onChange={(e) => setFormItem({ ...formItem, foundBy: e.target.value })}
                    className="w-full px-4 py-3 transition-colors border rounded-lg border-heritage-neutral/30 focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                    placeholder="Staff name or description"
                  />
                  {isFormNew && (!formItem.foundBy || formItem.foundBy.trim() === '') && (
                    <p className="text-xs text-red-500 mt-1">{selectedCollection === 'found' ? 'Found by is required.' : 'Lost by is required.'}</p>
                  )}
                </div>

                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium text-heritage-neutral">{selectedCollection === 'found' ? 'Date Found' : 'Date Lost'}</label>
                  <input
                    type="date"
                    value={new Date(formItem.dateFound).toISOString().slice(0, 10)}
                    onChange={(e) => setFormItem({ ...formItem, dateFound: new Date(e.target.value).toISOString() })}
                    className="w-48 px-4 py-3 transition-colors border rounded-lg border-heritage-neutral/30 focus:ring-2 focus:ring-heritage-green focus:border-heritage-green"
                  />
                  {isFormNew && (!formItem.dateFound || String(formItem.dateFound).trim() === '') && (
                    <p className="text-xs text-red-500 mt-1">{selectedCollection === 'found' ? 'Date found is required.' : 'Date lost is required.'}</p>
                  )}
                </div>

                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium text-heritage-neutral">Description</label>
                  <textarea
                    value={formItem.description}
                    onChange={(e) => setFormItem({ ...formItem, description: e.target.value })}
                    className="w-full px-4 py-1 transition-colors border rounded-lg resize-none border-heritage-neutral/30 focus:ring-2 focus:ring-heritage-green focus:border-heritage-green max-h-13 overflow-auto"
                    rows={2}
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
                  <button onClick={() => formItem && handleSaveItem(formItem, selectedCollection)} disabled={saveDisabled} className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-heritage-green to-heritage-neutral text-white rounded-xl hover:from-heritage-green/90 hover:to-heritage-neutral/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
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
