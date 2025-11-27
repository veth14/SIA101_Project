import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import LostFoundStats from './LostFoundStats';
import LostFoundGrid from './LostFoundGrid';
import LostFoundNavigation from './LostFoundNavigation';
import { Modal } from '../../admin/Modal';
import { db } from '../../../config/firebase';
import { updateDoc, doc, setDoc } from 'firebase/firestore';
import { startListeners, stopListeners, createAndReserveDoc as svcCreateAndReserveDoc, allocateSequentialId as svcAllocateSequentialId, fetchPage } from './lostFoundService';
const LostFoundPage = () => {
    // Use sample data from external file (make stateful so we can add/update items)
    // Split into two arrays: foundItems (uses sample data) and lostItems (separate collection)
    const [foundItems, setFoundItems] = useState([]);
    const [lostItems, setLostItems] = useState([]);
    // Modal / selected item state
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedCollection, setSelectedCollection] = useState('found');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formItem, setFormItem] = useState(null);
    const [docMapFound, setDocMapFound] = useState({}); // maps itemId -> firestore docId for found collection
    const [docMapLost, setDocMapLost] = useState({}); // maps for lost collection
    const [lastFoundDocs, setLastFoundDocs] = useState([]);
    const [lastLostDocs, setLastLostDocs] = useState([]);
    const [hasMoreFound, setHasMoreFound] = useState(true);
    const [hasMoreLost, setHasMoreLost] = useState(true);
    const [activeTab, setActiveTab] = useState('found');
    // Firestore document shape for lost/found collections (partial)
    // (No localStorage cache in simplified Option A)
    // Helper: remove duplicate items by a stable key. Prefer docId (via docMap)
    // when available to avoid collisions when itemId can change (temp ids).
    const dedupeItemsById = (arr, docMap) => {
        const seen = new Set();
        const out = [];
        for (const it of arr) {
            if (!it || typeof it.id === 'undefined' || it.id === null)
                continue;
            const idStr = String(it.id);
            // prefer docId from mapping when present
            const stableKey = (docMap && docMap[idStr]) ? docMap[idStr] : idStr;
            if (seen.has(stableKey))
                continue;
            seen.add(stableKey);
            out.push(it);
        }
        return out;
    };
    // Start service listeners on mount so clients receive deltas rather than re-reading collections.
    useEffect(() => {
        const onFoundUpdate = (items, map) => {
            setFoundItems(dedupeItemsById(items, map));
            setDocMapFound(map);
        };
        const onLostUpdate = (items, map) => {
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
    const loadMore = async (collectionName) => {
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
                if (res.docs.length < 20)
                    setHasMoreFound(false);
            }
            else {
                const lastDoc = lastLostDocs.length ? lastLostDocs[lastLostDocs.length - 1] : null;
                const res = await fetchPage('lost', 20, lastDoc);
                if (!res || !res.docs || res.docs.length === 0) {
                    setHasMoreLost(false);
                    return;
                }
                setLostItems(prev => dedupeItemsById([...prev, ...res.items], { ...docMapLost, ...res.map }));
                setDocMapLost(prev => ({ ...prev, ...res.map }));
                setLastLostDocs(prev => [...prev, ...res.docs]);
                if (res.docs.length < 20)
                    setHasMoreLost(false);
            }
        }
        catch (err) {
            console.warn('Failed to load more lost/found items', err);
        }
    };
    // (Refresh handled by reloading the page or calling fetchAndCacheFromFirestore manually if needed)
    // Calculate statistics
    const activeItems = activeTab === 'found' ? foundItems : lostItems;
    const statusCounts = {
        all: activeItems.length,
        unclaimed: activeItems.filter(item => item.status === 'unclaimed').length,
        claimed: activeItems.filter(item => item.status === 'claimed').length,
        disposed: activeItems.filter(item => item.status === 'disposed').length,
    };
    // Handler functions
    const handleViewDetails = (item) => {
        // Open shared Modal with item data (remember which collection is active)
        setSelectedCollection(activeTab);
        setSelectedItem(item);
        // deep clone to avoid accidental mutation
        try {
            setFormItem(JSON.parse(JSON.stringify(item)));
        }
        catch {
            setFormItem({ ...item });
        }
        setIsModalOpen(true);
    };
    const handleMarkClaimed = (item, collectionName) => {
        // mark item as claimed in local state and persist to firestore when possible
        const updated = { ...item, status: 'claimed', claimedDate: new Date().toISOString() };
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
        }
        else {
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
    const handleSaveItem = async (updated, collectionName) => {
        // Optimistic save: update UI immediately, persist to Firestore in background
        let savedItem = { ...updated };
        // determine if we need to create a new ID for this item
        // Use a timestamp + random suffix to avoid collisions when multiple items are created rapidly
        const hasDocMap = collectionName === 'found' ? docMapFound[updated.id ?? ''] : docMapLost[updated.id ?? ''];
        if (!updated.id || updated.id.toString().startsWith('new-') || !hasDocMap) {
            // Create path (non-blocking): give a temporary client id, close modal immediately,
            // then allocate a final LF### id in background and reconcile the local state.
            const tempId = `new-${Date.now().toString()}-${Math.random().toString(36).slice(2, 8)}`;
            savedItem = { ...updated, id: tempId };
            // optimistic local update with temp id
            if (collectionName === 'found') {
                setFoundItems(prev => dedupeItemsById([savedItem, ...prev], docMapFound));
                // tentatively map tempId -> tempId so updates during the short window work
                setDocMapFound(prev => ({ ...prev, [tempId]: tempId }));
            }
            else {
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
                    const writePayload = {
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
                    }
                    else {
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
                        }
                        else {
                            await setDoc(doc(db, targetCol, finalIdToUse), { ...writePayload, itemId: finalIdToUse });
                        }
                        // reconcile local state: replace tempId with finalIdToUse
                        if (collectionName === 'found') {
                            setFoundItems(prev => dedupeItemsById(prev.map(i => i.id === tempId ? { ...i, id: finalIdToUse } : i), docMapFound));
                            setDocMapFound(prev => {
                                const next = { ...prev };
                                delete next[tempId];
                                next[finalIdToUse] = finalIdToUse;
                                return next;
                            });
                        }
                        else {
                            setLostItems(prev => dedupeItemsById(prev.map(i => i.id === tempId ? { ...i, id: finalIdToUse } : i), docMapLost));
                            setDocMapLost(prev => {
                                const next = { ...prev };
                                delete next[tempId];
                                next[finalIdToUse] = finalIdToUse;
                                return next;
                            });
                        }
                    }
                    catch (errUnknown) {
                        console.warn('Failed to allocate/persist new lostFound item:', errUnknown);
                        // Optionally: mark temp item as unsynced or show toast to user
                    }
                }
                catch (err) {
                    console.warn('Failed to allocate/persist new lostFound item:', err);
                    // Optionally: mark temp item as unsynced or show toast to user
                }
            })();
        }
        else {
            // updating existing item: optimistic local update and background updateDoc
            savedItem = updated;
            if (collectionName === 'found') {
                setFoundItems(prev => dedupeItemsById(prev.map(i => i.id === savedItem.id ? savedItem : i), docMapFound));
            }
            else {
                setLostItems(prev => dedupeItemsById(prev.map(i => i.id === savedItem.id ? savedItem : i), docMapLost));
            }
            setIsModalOpen(false);
            setSelectedItem(null);
            setFormItem(null);
            const docId = String(collectionName === 'found' ? (docMapFound[updated.id] ?? updated.id) : (docMapLost[updated.id] ?? updated.id));
            const targetCol = collectionName === 'found' ? 'found' : 'lost';
            (async () => {
                try {
                    const payload = {
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
                    }
                    else {
                        payload.dateLost = updated.dateLost ?? updated.dateFound; // prefer explicit lost fields
                        payload.lostBy = updated.lostBy ?? updated.foundBy;
                    }
                    await updateDoc(doc(db, targetCol, docId), payload);
                }
                catch (err) {
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
            }
            catch {
                // fallback to shallow copy
                setFormItem({ ...selectedItem });
            }
        }
    }, [selectedItem]);
    // helper to update nested guestInfo safely
    const updateGuestInfo = (field, value) => {
        setFormItem(prev => {
            const p = prev;
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
        if (!formItem)
            return false;
        // Use `selectedCollection` (the modal's collection) to validate the form fields
        const dateField = selectedCollection === 'lost' ? (formItem.dateLost ?? formItem.dateFound) : formItem.dateFound;
        const byField = selectedCollection === 'lost' ? (formItem.lostBy ?? formItem.foundBy) : formItem.foundBy;
        const required = [formItem.itemName, formItem.category, formItem.location, dateField, byField, formItem.description];
        return required.every(f => typeof f === 'string' && f.trim().length > 0);
    };
    const saveDisabled = isFormNew && !isAddFormValid();
    return (_jsxs("div", { className: "min-h-screen bg-[#F9F6EE]", children: [_jsxs("div", { className: "fixed inset-0 pointer-events-none", children: [_jsx("div", { className: "absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 rounded-full blur-3xl animate-pulse opacity-30" }), _jsx("div", { className: "absolute top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl animate-pulse delay-1000 opacity-25" }), _jsx("div", { className: "absolute bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 rounded-full blur-3xl animate-pulse delay-2000 opacity-20" }), _jsx("div", { className: "absolute inset-0 opacity-5", children: _jsx("div", { className: "absolute inset-0", style: {
                                backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(134, 134, 134, 0.1) 1px, transparent 0)',
                                backgroundSize: '50px 50px'
                            } }) })] }), _jsxs("div", { className: "relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full", children: [_jsx(LostFoundStats, { stats: statusCounts }), _jsx(LostFoundNavigation, { activeTab: activeTab, onTabChange: (t) => setActiveTab(t) }), _jsx("div", { className: "mt-6", children: _jsx(LostFoundGrid, { items: activeTab === 'found' ? foundItems : lostItems, activeTab: activeTab, onViewDetails: (item) => handleViewDetails(item), onMarkClaimed: (item) => handleMarkClaimed(item, activeTab) }) }), _jsxs("div", { className: "mt-4 flex justify-center", children: [activeTab === 'found' && hasMoreFound && (_jsx("button", { onClick: () => loadMore('found'), className: "px-4 py-2 bg-heritage-green text-white rounded-md", children: "Load more found" })), activeTab === 'lost' && hasMoreLost && (_jsx("button", { onClick: () => loadMore('lost'), className: "px-4 py-2 bg-heritage-green text-white rounded-md", children: "Load more lost" }))] }), _jsx(Modal, { isOpen: isModalOpen, onClose: handleModalClose, title: "", size: "lg", showCloseButton: false, showHeaderBar: false, headerContent: formItem ? (_jsxs("div", { className: "relative z-30 flex  w-[100%] px-8 py-4 items-center justify-between border-b border-heritage-neutral/10 bg-gradient-to-r from-heritage-green/5 to-heritage-light/10 backdrop-blur-sm", children: [_jsxs("div", { className: "flex items-center space-x-3 ", children: [_jsx("div", { className: "flex items-center justify-center w-10 h-10 rounded-full bg-heritage-green", children: _jsx("svg", { className: "w-5 h-5 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-heritage-green", children: formItem.id?.toString().startsWith('new-') ? `Add ${selectedCollection === 'found' ? 'Found' : 'Lost'} Item` : 'Item Details' }), _jsx("p", { className: "text-sm text-heritage-neutral", children: formItem.id?.toString().startsWith('new-') ? `Create a new ${selectedCollection === 'found' ? 'found' : 'lost'} item record` : 'View or edit the item information' })] })] }), _jsx("button", { onClick: handleModalClose, className: "p-2 transition-all duration-200 rounded-full text-heritage-neutral hover:text-heritage-green hover:bg-heritage-green/10 ml-4", children: _jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] })) : undefined, children: formItem && (_jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block mb-2 text-sm font-medium text-heritage-neutral", children: "Item Name" }), _jsx("input", { value: formItem.itemName, onChange: (e) => setFormItem({ ...formItem, itemName: e.target.value }), className: "w-full px-4 py-3 transition-colors border rounded-lg border-heritage-neutral/30 focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", placeholder: "Enter item name" }), isFormNew && (!formItem.itemName || formItem.itemName.trim() === '') && (_jsx("p", { className: "text-xs text-red-500 mt-1", children: "Item name is required." }))] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-2 text-sm font-medium text-heritage-neutral", children: "Category" }), _jsxs("select", { value: formItem.category, onChange: (e) => setFormItem({ ...formItem, category: e.target.value }), className: "w-full px-4 py-3 transition-colors border rounded-lg border-heritage-neutral/30 focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", children: [_jsx("option", { value: "electronics", children: "Electronics" }), _jsx("option", { value: "clothing", children: "Clothing" }), _jsx("option", { value: "jewelry", children: "Jewelry" }), _jsx("option", { value: "documents", children: "Documents" }), _jsx("option", { value: "personal", children: "Personal" }), _jsx("option", { value: "other", children: "Other" })] }), isFormNew && (!formItem.category || formItem.category.trim() === '') && (_jsx("p", { className: "text-xs text-red-500 mt-1", children: "Category is required." }))] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-2 text-sm font-medium text-heritage-neutral", children: "Status" }), _jsxs("select", { value: formItem.status, onChange: (e) => setFormItem({ ...formItem, status: e.target.value }), className: "w-full px-4 py-3 transition-colors border rounded-lg border-heritage-neutral/30 focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", children: [_jsx("option", { value: "unclaimed", children: "Unclaimed" }), _jsx("option", { value: "claimed", children: "Claimed" }), _jsx("option", { value: "disposed", children: "Disposed" })] })] })] }), _jsxs("div", { className: "mt-4", children: [_jsx("label", { className: "block mb-2 text-sm font-medium text-heritage-neutral", children: selectedCollection === 'found' ? 'Location Found' : 'Location Lost' }), _jsx("input", { value: formItem.location, onChange: (e) => setFormItem({ ...formItem, location: e.target.value }), className: "w-full px-4 py-3 transition-colors border rounded-lg border-heritage-neutral/30 focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", placeholder: "e.g., Lobby, Poolside" }), isFormNew && (!formItem.location || formItem.location.trim() === '') && (_jsx("p", { className: "text-xs text-red-500 mt-1", children: "Location is required." }))] }), _jsxs("div", { className: "mt-4", children: [_jsx("label", { className: "block mb-2 text-sm font-medium text-heritage-neutral", children: selectedCollection === 'found' ? 'Found By' : 'Lost By' }), _jsx("input", { value: formItem.foundBy, onChange: (e) => setFormItem({ ...formItem, foundBy: e.target.value }), className: "w-full px-4 py-3 transition-colors border rounded-lg border-heritage-neutral/30 focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", placeholder: "Staff name or description" }), isFormNew && (!formItem.foundBy || formItem.foundBy.trim() === '') && (_jsx("p", { className: "text-xs text-red-500 mt-1", children: selectedCollection === 'found' ? 'Found by is required.' : 'Lost by is required.' }))] }), _jsxs("div", { className: "mt-4", children: [_jsx("label", { className: "block mb-2 text-sm font-medium text-heritage-neutral", children: selectedCollection === 'found' ? 'Date Found' : 'Date Lost' }), _jsx("input", { type: "date", value: selectedCollection === 'found'
                                                ? (formItem.dateFound ? new Date(formItem.dateFound).toISOString().slice(0, 10) : '')
                                                : (formItem.dateLost ? new Date(formItem.dateLost).toISOString().slice(0, 10) : (formItem.dateFound ? new Date(formItem.dateFound).toISOString().slice(0, 10) : '')), onChange: (e) => {
                                                const iso = e.target.value ? new Date(e.target.value).toISOString() : '';
                                                setFormItem({
                                                    ...formItem,
                                                    dateFound: selectedCollection === 'found' ? iso : formItem.dateFound,
                                                    dateLost: selectedCollection === 'lost' ? iso : formItem.dateLost
                                                });
                                            }, className: "w-48 px-4 py-3 transition-colors border rounded-lg border-heritage-neutral/30 focus:ring-2 focus:ring-heritage-green focus:border-heritage-green" }), isFormNew && ((selectedCollection === 'found' && (!formItem.dateFound || String(formItem.dateFound).trim() === '')) || (selectedCollection === 'lost' && !((formItem.dateLost ?? formItem.dateFound)))) && (_jsx("p", { className: "text-xs text-red-500 mt-1", children: selectedCollection === 'found' ? 'Date found is required.' : 'Date lost is required.' }))] }), _jsxs("div", { className: "mt-4", children: [_jsx("label", { className: "block mb-2 text-sm font-medium text-heritage-neutral", children: "Description" }), _jsx("textarea", { value: formItem.description, onChange: (e) => setFormItem({ ...formItem, description: e.target.value }), className: "w-full px-4 py-1 transition-colors border rounded-lg resize-none border-heritage-neutral/30 focus:ring-2 focus:ring-heritage-green focus:border-heritage-green max-h-13 overflow-auto", rows: 2 }), isFormNew && (!formItem.description || formItem.description.trim() === '') && (_jsx("p", { className: "text-xs text-red-500 mt-1", children: "Description is required." }))] }), !isFormNew && (_jsxs("div", { className: "mt-6", children: [_jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block mb-2 text-sm font-medium text-heritage-neutral", children: "Claimed By (Name)" }), _jsx("input", { value: formItem.claimedBy ?? '', onChange: (e) => setFormItem({ ...formItem, claimedBy: e.target.value }), className: "w-full px-4 py-3 transition-colors border rounded-lg border-heritage-neutral/30 focus:ring-2 focus:ring-heritage-green focus:border-heritage-green" })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-2 text-sm font-medium text-heritage-neutral", children: "Claimed Date" }), _jsx("input", { type: "date", value: formItem.claimedDate ? new Date(formItem.claimedDate).toISOString().slice(0, 10) : '', onChange: (e) => setFormItem({ ...formItem, claimedDate: e.target.value ? new Date(e.target.value).toISOString() : undefined }), className: "w-full px-4 py-3 transition-colors border rounded-lg border-heritage-neutral/30 focus:ring-2 focus:ring-heritage-green focus:border-heritage-green" })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-2 text-sm font-medium text-heritage-neutral", children: "\u00A0" }), _jsx("div", { className: "text-sm text-heritage-neutral/80 mt-1", children: "Optional claim details for guest contact" })] })] }), _jsxs("div", { className: "pt-4", children: [_jsxs("h4", { className: "flex items-center text-lg font-bold text-heritage-green", children: [_jsx("svg", { className: "w-5 h-5 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }) }), "Guest Information"] }), _jsxs("div", { className: "grid grid-cols-3 gap-4 mt-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block mb-2 text-sm font-medium text-heritage-neutral", children: "Name" }), _jsx("input", { value: (formItem.guestInfo && formItem.guestInfo.name) ?? '', onChange: (e) => updateGuestInfo('name', e.target.value), className: "w-full px-4 py-3 transition-colors border rounded-lg border-heritage-neutral/30 focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", placeholder: "Guest full name" })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-2 text-sm font-medium text-heritage-neutral", children: "Room" }), _jsx("input", { value: (formItem.guestInfo && formItem.guestInfo.room) ?? '', onChange: (e) => updateGuestInfo('room', e.target.value), className: "w-full px-4 py-3 transition-colors border rounded-lg border-heritage-neutral/30 focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", placeholder: "Room number" })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-2 text-sm font-medium text-heritage-neutral", children: "Contact" }), _jsx("input", { value: (formItem.guestInfo && formItem.guestInfo.contact) ?? '', onChange: (e) => updateGuestInfo('contact', e.target.value), className: "w-full px-4 py-3 transition-colors border rounded-lg border-heritage-neutral/30 focus:ring-2 focus:ring-heritage-green focus:border-heritage-green", placeholder: "Contact number or email" })] })] })] })] })), _jsxs("div", { className: "flex pt-6 mt-6 space-x-4 border-t border-heritage-neutral/10", children: [_jsx("button", { onClick: handleModalClose, className: "flex-1 px-6 py-3 transition-all duration-300 border-2 border-heritage-neutral/30 text-heritage-neutral rounded-xl hover:bg-heritage-neutral/5", children: "Cancel" }), _jsxs("button", { onClick: () => formItem && handleSaveItem(formItem, selectedCollection), disabled: saveDisabled, className: "flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-heritage-green to-heritage-neutral text-white rounded-xl hover:from-heritage-green/90 hover:to-heritage-neutral/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none", children: [_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }), _jsx("span", { children: "Save" })] })] })] })) })] })] }));
};
export default LostFoundPage;
