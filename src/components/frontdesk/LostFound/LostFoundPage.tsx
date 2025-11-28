import React, { useState, useEffect } from 'react';
import LostFoundStats from './LostFoundStats';
import LostFoundGrid from './LostFoundGrid';
import LostFoundNavigation from './LostFoundNavigation';
import type { LostFoundItem, LostFoundStats as StatsType } from './types';
import { Modal } from '../../admin/Modal';
import { db } from '../../../config/firebase';
import { updateDoc, doc, setDoc } from 'firebase/firestore';
import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import {
  startListeners,
  stopListeners,
  createAndReserveDoc as svcCreateAndReserveDoc,
  allocateSequentialId as svcAllocateSequentialId,
  fetchPage
} from './lostFoundService';

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
  const [lastFoundDocs, setLastFoundDocs] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [lastLostDocs, setLastLostDocs] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [hasMoreFound, setHasMoreFound] = useState(true);
  const [hasMoreLost, setHasMoreLost] = useState(true);

  const [activeTab, setActiveTab] = useState<'found' | 'lost'>('found');

  // Firestore document shape for lost/found collections (partial)
  

  // (No localStorage cache in simplified Option A)

  // Helper: remove duplicate items by a stable key. Prefer docId (via docMap)
  // when available to avoid collisions when itemId can change (temp ids).
  const dedupeItemsById = (arr: LostFoundItem[], docMap?: Record<string, string>) => {
    const seen = new Set<string>();
    const out: LostFoundItem[] = [];
    for (const it of arr) {
      if (!it || typeof it.id === 'undefined' || it.id === null) continue;
      const idStr = String(it.id);
      // prefer docId from mapping when present
      const stableKey = (docMap && docMap[idStr]) ? docMap[idStr] : idStr;
      if (seen.has(stableKey)) continue;
      seen.add(stableKey);
      out.push(it);
    }
    return out;
  };
  // Start service listeners on mount so clients receive deltas rather than re-reading collections.
  useEffect(() => {
    const onFoundUpdate = (items: LostFoundItem[], map: Record<string, string>) => {
      setFoundItems(dedupeItemsById(items, map));
      setDocMapFound(map);
    };
    const onLostUpdate = (items: LostFoundItem[], map: Record<string, string>) => {
      setLostItems(dedupeItemsById(items, map));
      setDocMapLost(map);
    };

    // Start listeners but subscribe to only the first page to avoid full-collection reads.
    startListeners(onFoundUpdate, onLostUpdate, 20);
    return () => {
      stopListeners();
    };
  }, []);

  // Load more pages on demand. Uses service.fetchPage to get next results.
  const loadMore = async (collectionName: 'found' | 'lost') => {
    try {
      if (collectionName === 'found') {
      const lastDoc = lastFoundDocs.length ? lastFoundDocs[lastFoundDocs.length - 1] : null;
      const res = await fetchPage('found', 20, lastDoc);
        if (!res || !res.docs || res.docs.length === 0) {
          setHasMoreFound(false);
          return;
        }
        // append items and update last docs
        setFoundItems(prev => dedupeItemsById([...prev, ...res.items], { ...docMapFound, ...res.map }));
        setDocMapFound(prev => ({ ...prev, ...res.map }));
        setLastFoundDocs(prev => [...prev, ...res.docs]);
        if (res.docs.length < 20) setHasMoreFound(false);
      } else {
        const lastDoc = lastLostDocs.length ? lastLostDocs[lastLostDocs.length - 1] : null;
        const res = await fetchPage('lost', 20, lastDoc);
        if (!res || !res.docs || res.docs.length === 0) {
          setHasMoreLost(false);
          return;
        }
        setLostItems(prev => dedupeItemsById([...prev, ...res.items], { ...docMapLost, ...res.map }));
        setDocMapLost(prev => ({ ...prev, ...res.map }));
        setLastLostDocs(prev => [...prev, ...res.docs]);
        if (res.docs.length < 20) setHasMoreLost(false);
      }
    } catch (err) {
      console.warn('Failed to load more lost/found items', err);
    }
  };

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
    // deep clone to avoid accidental mutation
    try { setFormItem(JSON.parse(JSON.stringify(item))); } catch { setFormItem({ ...item }); }
    setIsModalOpen(true);
  };

  const handleMarkClaimed = (item: LostFoundItem, collectionName: 'found' | 'lost') => {
    // mark item as claimed in local state and persist to firestore when possible
    const updated: LostFoundItem = { ...item, status: 'claimed' as LostFoundItem['status'], claimedDate: new Date().toISOString() };
    // update local state
    if (collectionName === 'found') {
  setFoundItems(prev => dedupeItemsById(prev.map(i => i.id === updated.id ? updated : i), docMapFound));
      const docId = docMapFound[item.id];
      if (docId) {
        updateDoc(doc(db, 'found', docId), {
          status: 'claimed',
          claimedDate: updated.claimedDate
        }).catch(err => console.warn('Failed to update claim status (found):', err));
      }
    } else {
  setLostItems(prev => dedupeItemsById(prev.map(i => i.id === updated.id ? updated : i), docMapLost));
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
        setFoundItems(prev => dedupeItemsById([savedItem, ...prev], docMapFound));
        // tentatively map tempId -> tempId so updates during the short window work
        setDocMapFound(prev => ({ ...prev, [tempId]: tempId }));
      } else {
        setLostItems(prev => dedupeItemsById([savedItem, ...prev], docMapLost));
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
            // For lost items, prefer explicit dateLost/lostBy fields if the form provides them.
            writePayload.dateLost = savedItem.dateLost ?? savedItem.dateFound;
            writePayload.lostBy = savedItem.lostBy ?? savedItem.foundBy;
          }
              // Attempt transactional reservation to avoid collisions
              try {
                const reservedId = await svcCreateAndReserveDoc(collectionName, writePayload);
                const finalIdToUse = reservedId ?? (await svcAllocateSequentialId(collectionName));
                if (!finalIdToUse) {
                  console.warn('[LostFound] failed to allocate final id for new item');
                  return;
                }

                // If the service already reserved the doc (created it inside the transaction), prefer a lightweight update
                if (reservedId) {
                  // add the itemId field to the reserved doc without overwriting other fields
                  await updateDoc(doc(db, targetCol, finalIdToUse), { itemId: finalIdToUse }).catch(err => {
                    // if update fails (rare), fall back to setDoc
                    console.warn('[LostFound] update after reserve failed, falling back to setDoc', err);
                    return setDoc(doc(db, targetCol, finalIdToUse), { ...writePayload, itemId: finalIdToUse });
                  });
                } else {
                  await setDoc(doc(db, targetCol, finalIdToUse), { ...writePayload, itemId: finalIdToUse });
                }

                // reconcile local state: replace tempId with finalIdToUse
                if (collectionName === 'found') {
                  setFoundItems(prev => dedupeItemsById(prev.map(i => i.id === tempId ? { ...i, id: finalIdToUse } : i), docMapFound));
                  setDocMapFound(prev => {
                    const next = { ...prev };
                    delete next[tempId as string];
                    next[finalIdToUse] = finalIdToUse;
                    return next;
                  });
                } else {
                  setLostItems(prev => dedupeItemsById(prev.map(i => i.id === tempId ? { ...i, id: finalIdToUse } : i), docMapLost));
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
          setFoundItems(prev => dedupeItemsById(prev.map(i => i.id === savedItem.id ? savedItem : i), docMapFound));
      } else {
          setLostItems(prev => dedupeItemsById(prev.map(i => i.id === savedItem.id ? savedItem : i), docMapLost));
      }

      setIsModalOpen(false);
      setSelectedItem(null);
      setFormItem(null);

      const docId = String(collectionName === 'found' ? (docMapFound[updated.id] ?? updated.id) : (docMapLost[updated.id] ?? updated.id));
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
            payload.dateLost = (updated as LostFoundItem).dateLost ?? updated.dateFound; // prefer explicit lost fields
            payload.lostBy = (updated as LostFoundItem).lostBy ?? updated.foundBy;
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
    if (selectedItem) {
      try {
        // deep-clone to avoid accidental mutation of nested fields (guestInfo etc.)
        setFormItem(JSON.parse(JSON.stringify(selectedItem)));
      } catch {
        // fallback to shallow copy
        setFormItem({ ...selectedItem });
      }
    }
  }, [selectedItem]);

  // helper to update nested guestInfo safely
  const updateGuestInfo = (field: keyof NonNullable<LostFoundItem['guestInfo']>, value: string) => {
    setFormItem(prev => {
      const p = prev!;
      const prevGi = p.guestInfo ?? { name: '', room: '', contact: '' };
      return {
        ...p,
        guestInfo: {
          name: field === 'name' ? value : (prevGi.name ?? ''),
          room: field === 'room' ? value : (prevGi.room ?? ''),
          contact: field === 'contact' ? value : (prevGi.contact ?? '')
        }
      };
    });
  };

  // Validation helper for Add Item (all required fields)
  const isFormNew = !!formItem && String(formItem.id ?? '').startsWith('new-');
  const isAddFormValid = () => {
    if (!formItem) return false;
    // Use `selectedCollection` (the modal's collection) to validate the form fields
    const dateField = selectedCollection === 'lost' ? (formItem.dateLost ?? formItem.dateFound) : formItem.dateFound;
    const byField = selectedCollection === 'lost' ? (formItem.lostBy ?? formItem.foundBy) : formItem.foundBy;
    const required = [formItem.itemName, formItem.category, formItem.location, dateField, byField, formItem.description];
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
        {/* Load more button for pagination (fetches next page) */}
        <div className="mt-4 flex justify-center">
          {activeTab === 'found' && hasMoreFound && (
            <button onClick={() => loadMore('found')} className="px-4 py-2 bg-heritage-green text-white rounded-md">Load more found</button>
          )}
          {activeTab === 'lost' && hasMoreLost && (
            <button onClick={() => loadMore('lost')} className="px-4 py-2 bg-heritage-green text-white rounded-md">Load more lost</button>
          )}
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
            <div className="relative z-30 flex w-[100%] px-8 py-4 items-center justify-between bg-white">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-600 text-white shadow-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>  
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-emerald-700">{formItem.id?.toString().startsWith('new-') ? `Add ${selectedCollection === 'found' ? 'Found' : 'Lost'} Item` : 'Item Details'}</h2>
                  <p className="text-sm text-gray-500">{formItem.id?.toString().startsWith('new-') ? `Create a new ${selectedCollection === 'found' ? 'found' : 'lost'} item record` : 'View or edit the item information'}</p>
                </div>
              </div>
              <button onClick={handleModalClose} className="p-2 transition rounded-full text-emerald-700 hover:bg-emerald-50 ring-1 ring-emerald-100 ml-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ) : undefined}
        >
          {formItem && (
            <div className="p-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Item Name</label>
                    <input
                      value={formItem.itemName}
                      onChange={(e) => setFormItem({ ...formItem, itemName: e.target.value })}
                      className="w-full px-4 py-3 transition-colors border rounded-lg border-gray-300 bg-white/80 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
                      placeholder="Enter item name"
                    />
                    {isFormNew && (!formItem.itemName || formItem.itemName.trim() === '') && (
                      <p className="text-xs text-red-500 mt-1">Item name is required.</p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Category</label>
                    <select
                      value={formItem.category}
                      onChange={(e) => setFormItem({ ...formItem, category: e.target.value as LostFoundItem['category'] })}
                      className="w-full px-4 py-3 transition-colors border rounded-lg border-gray-300 bg-white/80 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
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
                    <label className="block mb-2 text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={formItem.status}
                      onChange={(e) => setFormItem({ ...formItem, status: e.target.value as LostFoundItem['status'] })}
                      className="w-full px-4 py-3 transition-colors border rounded-lg border-gray-300 bg-white/80 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
                    >
                      <option value="unclaimed">Unclaimed</option>
                      <option value="claimed">Claimed</option>
                      <option value="disposed">Disposed</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">{selectedCollection === 'found' ? 'Location Found' : 'Location Lost'}</label>
                  <input
                    value={formItem.location}
                    onChange={(e) => setFormItem({ ...formItem, location: e.target.value })}
                    className="w-full px-4 py-3 transition-colors border rounded-lg border-gray-300 bg-white/80 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
                    placeholder="e.g., Lobby, Poolside"
                  />
                  {isFormNew && (!formItem.location || formItem.location.trim() === '') && (
                    <p className="text-xs text-red-500 mt-1">Location is required.</p>
                  )}
                </div>

                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">{selectedCollection === 'found' ? 'Found By' : 'Lost By'}</label>
                  <input
                    value={formItem.foundBy}
                    onChange={(e) => setFormItem({ ...formItem, foundBy: e.target.value })}
                    className="w-full px-4 py-3 transition-colors border rounded-lg border-gray-300 bg-white/80 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
                    placeholder="Staff name or description"
                  />
                  {isFormNew && (!formItem.foundBy || formItem.foundBy.trim() === '') && (
                    <p className="text-xs text-red-500 mt-1">{selectedCollection === 'found' ? 'Found by is required.' : 'Lost by is required.'}</p>
                  )}
                </div>

                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">{selectedCollection === 'found' ? 'Date Found' : 'Date Lost'}</label>
                  <input
                    type="date"
                    value={
                      selectedCollection === 'found'
                        ? (formItem.dateFound ? new Date(formItem.dateFound).toISOString().slice(0, 10) : '')
                        : (formItem.dateLost ? new Date(formItem.dateLost).toISOString().slice(0, 10) : (formItem.dateFound ? new Date(formItem.dateFound).toISOString().slice(0,10) : ''))
                    }
                    onChange={(e) => {
                      const iso = e.target.value ? new Date(e.target.value).toISOString() : '';
                      setFormItem({
                        ...formItem,
                        dateFound: selectedCollection === 'found' ? iso : formItem.dateFound,
                        dateLost: selectedCollection === 'lost' ? iso : formItem.dateLost
                      });
                    }}
                    className="w-48 px-4 py-3 transition-colors border rounded-lg border-gray-300 bg-white/80 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
                  />
                  {isFormNew && ((selectedCollection === 'found' && (!formItem.dateFound || String(formItem.dateFound).trim() === '')) || (selectedCollection === 'lost' && !((formItem.dateLost ?? formItem.dateFound)))) && (
                    <p className="text-xs text-red-500 mt-1">{selectedCollection === 'found' ? 'Date found is required.' : 'Date lost is required.'}</p>
                  )}
                </div>

                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={formItem.description}
                    onChange={(e) => setFormItem({ ...formItem, description: e.target.value })}
                    className="w-full px-4 py-1 transition-colors border rounded-lg resize-none border-gray-300 bg-white/80 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 max-h-13 overflow-auto"
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
                        <label className="block mb-2 text-sm font-medium text-gray-700">Claimed By (Name)</label>
                        <input
                          value={formItem.claimedBy ?? ''}
                          onChange={(e) => setFormItem({ ...formItem, claimedBy: e.target.value })}
                          className="w-full px-4 py-3 transition-colors border rounded-lg border-gray-300 bg-white/80 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Claimed Date</label>
                        <input
                          type="date"
                          value={formItem.claimedDate ? new Date(formItem.claimedDate).toISOString().slice(0, 10) : ''}
                          onChange={(e) => setFormItem({ ...formItem, claimedDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                          className="w-full px-4 py-3 transition-colors border rounded-lg border-gray-300 bg-white/80 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">&nbsp;</label>
                        <div className="text-sm text-gray-500 mt-1">Optional claim details for guest contact</div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <h4 className="flex items-center text-lg font-semibold text-emerald-700">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Guest Information
                      </h4>

                      <div className="grid grid-cols-3 gap-4 mt-3">
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">Name</label>
                          <input
                            value={(formItem.guestInfo && formItem.guestInfo.name) ?? ''}
                            onChange={(e) => updateGuestInfo('name', e.target.value)}
                            className="w-full px-4 py-3 transition-colors border rounded-lg border-gray-300 bg-white/80 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
                            placeholder="Guest full name"
                          />
                        </div>

                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">Room</label>
                          <input
                            value={(formItem.guestInfo && formItem.guestInfo.room) ?? ''}
                            onChange={(e) => updateGuestInfo('room', e.target.value)}
                            className="w-full px-4 py-3 transition-colors border rounded-lg border-gray-300 bg-white/80 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
                            placeholder="Room number"
                          />
                        </div>

                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">Contact</label>
                          <input
                            value={(formItem.guestInfo && formItem.guestInfo.contact) ?? ''}
                            onChange={(e) => updateGuestInfo('contact', e.target.value)}
                            className="w-full px-4 py-3 transition-colors border rounded-lg border-gray-300 bg-white/80 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
                            placeholder="Contact number or email"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action buttons - aligned with reservation modal */}
                <div className="flex pt-6 mt-6 space-x-4 border-t border-gray-100">
                  <button onClick={handleModalClose} className="flex-1 px-6 py-3 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5">Cancel</button>
                  <button onClick={() => formItem && handleSaveItem(formItem, selectedCollection)} disabled={saveDisabled} className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-2xl shadow-sm hover:bg-emerald-700 transition transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
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
