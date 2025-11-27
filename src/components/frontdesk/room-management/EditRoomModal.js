import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
// --- Icon Components ---
const IconBed = () => (_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" }) }));
const IconTag = () => (_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" }) }));
const IconSave = () => (_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" }) }));
export const EditRoomModal = ({ isOpen, onClose, room, onSave }) => {
    // Form State
    const [formData, setFormData] = useState({
        roomNumber: '',
        roomName: '',
        roomType: '',
        basePrice: 0,
        maxGuests: 2,
        roomSize: '',
        status: 'available',
        description: '',
        amenities: []
    });
    const [amenityInput, setAmenityInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    // Prevent background scroll
    useEffect(() => {
        if (!isOpen)
            return;
        const original = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = original; };
    }, [isOpen]);
    // Populate Data on Open
    useEffect(() => {
        if (isOpen && room) {
            setFormData({
                roomNumber: room.roomNumber,
                roomName: room.roomName || '',
                roomType: room.roomType,
                basePrice: room.basePrice,
                maxGuests: room.maxGuests,
                roomSize: room.roomSize || '',
                status: room.status,
                description: room.description || '',
                amenities: room.amenities || room.features || []
            });
            setErrors({});
        }
    }, [isOpen, room]);
    const handleAddAmenity = (e) => {
        if (e.key === 'Enter' && amenityInput.trim()) {
            e.preventDefault();
            if (!formData.amenities.includes(amenityInput.trim())) {
                setFormData(prev => ({ ...prev, amenities: [...prev.amenities, amenityInput.trim()] }));
            }
            setAmenityInput('');
        }
    };
    const removeAmenity = (tag) => {
        setFormData(prev => ({ ...prev, amenities: prev.amenities.filter(a => a !== tag) }));
    };
    const handleSubmit = async () => {
        if (!room)
            return;
        setLoading(true);
        try {
            // We only send the fields we actually allowed editing for, plus the ID
            // However, sending the whole object is usually safer to ensure consistency,
            // as long as the backend handles it.
            const payload = { ...formData, id: room.id };
            // @ts-ignore
            await onSave(payload);
            onClose();
        }
        catch (error) {
            console.error("Failed to save room", error);
        }
        finally {
            setLoading(false);
        }
    };
    if (!isOpen || !room)
        return null;
    // Helper class for disabled inputs to ensure consistency
    const disabledInputClass = "w-full px-3 py-2 border border-gray-200 bg-gray-100 text-gray-500 rounded-md cursor-not-allowed";
    return createPortal(_jsxs("div", { className: "fixed inset-0 z-[1000] flex items-center justify-center", role: "dialog", "aria-modal": "true", children: [_jsx("div", { className: "fixed inset-0 transition-opacity duration-200 bg-black/45 backdrop-blur-lg", onClick: onClose }), _jsxs("div", { className: "relative z-10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-white/95 shadow-2xl ring-1 ring-black/5 flex flex-col", children: [_jsx("div", { className: "relative px-6 pt-6 pb-5 bg-white border-b border-gray-100 rounded-t-3xl flex-shrink-0", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "flex items-center justify-center w-12 h-12 text-white rounded-full shadow-sm bg-emerald-600", children: _jsx(IconBed, {}) }), _jsxs("div", { className: "flex flex-col", children: [_jsx("h2", { className: "text-lg font-semibold md:text-2xl text-emerald-700", children: "Edit Room Details" }), _jsxs("p", { className: "mt-1 text-sm text-gray-500", children: ["Updating ", formData.roomName || formData.roomType, " - Room ", formData.roomNumber] })] })] }), _jsx("button", { onClick: onClose, className: "absolute flex items-center justify-center rounded-md top-4 right-4 w-9 h-9 text-emerald-700 bg-emerald-50 ring-1 ring-emerald-100 hover:bg-emerald-100", children: _jsx("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }) }), _jsx("div", { className: "p-6 overflow-y-auto flex-1", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsxs("div", { className: "p-5 bg-white rounded-2xl ring-1 ring-black/5", children: [_jsx("h4", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Room Configuration" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500 mb-1", children: "Room Number" }), _jsx("input", { type: "text", value: formData.roomNumber, disabled: true, className: disabledInputClass })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500 mb-1", children: "Display Name" }), _jsx("input", { type: "text", value: formData.roomName, disabled: true, className: disabledInputClass })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500 mb-1", children: "Room Type" }), _jsx("input", { type: "text", value: formData.roomType, disabled: true, className: disabledInputClass })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500 mb-1", children: "Base Price (\u20B1)" }), _jsx("input", { type: "number", value: formData.basePrice, disabled: true, className: disabledInputClass })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Operational Status" }), _jsxs("select", { value: formData.status, 
                                                                    // @ts-ignore
                                                                    onChange: e => setFormData({ ...formData, status: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500", children: [_jsx("option", { value: "available", children: "Available" }), _jsx("option", { value: "occupied", children: "Occupied" }), _jsx("option", { value: "maintenance", children: "Maintenance" }), _jsx("option", { value: "cleaning", children: "Cleaning" })] })] })] })] }), _jsxs("div", { className: "p-5 bg-white rounded-2xl ring-1 ring-black/5", children: [_jsxs("h4", { className: "flex items-center text-lg font-semibold text-gray-900 mb-4", children: [_jsx(IconTag, {}), _jsx("span", { className: "ml-2", children: "Amenities & Features" })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Add Amenities" }), _jsx("input", { type: "text", value: amenityInput, onChange: e => setAmenityInput(e.target.value), onKeyDown: handleAddAmenity, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all", placeholder: "Type feature and press Enter (e.g. 'Smart TV')" }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Press Enter to add a tag" })] }), _jsxs("div", { className: "flex flex-wrap gap-2 min-h-[40px] p-3 bg-gray-50 rounded-xl border border-gray-100", children: [formData.amenities.length === 0 && _jsx("span", { className: "text-sm text-gray-400 italic", children: "No amenities added yet." }), formData.amenities.map((amenity, idx) => (_jsxs("span", { className: "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm", children: [amenity, _jsx("button", { onClick: () => removeAmenity(amenity), className: "ml-2 text-emerald-600 hover:text-emerald-900 hover:bg-emerald-200 rounded-full w-4 h-4 flex items-center justify-center", children: "\u00D7" })] }, idx)))] })] })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "p-5 bg-white rounded-2xl ring-1 ring-black/5", children: [_jsx("h4", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Specifications" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500 mb-1", children: "Max Guests" }), _jsx("input", { type: "number", value: formData.maxGuests, disabled: true, className: disabledInputClass })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500 mb-1", children: "Room Size (Fixed)" }), _jsx("input", { type: "text", value: formData.roomSize, disabled: true, className: disabledInputClass, placeholder: "N/A" })] })] })] }), _jsxs("div", { className: "p-5 bg-white rounded-2xl ring-1 ring-black/5", children: [_jsx("h4", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Description" }), _jsx("textarea", { rows: 5, value: formData.description, onChange: e => setFormData({ ...formData, description: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none", placeholder: "Enter a description for this room..." })] })] })] }) }), _jsx("div", { className: "p-6 bg-white border-t border-gray-100 flex-shrink-0", children: _jsxs("div", { className: "flex flex-col justify-end gap-3 sm:flex-row sm:items-center", children: [_jsx("button", { onClick: onClose, className: "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 bg-white/80 rounded-2xl shadow-sm hover:bg-gray-50 transition transform", children: "Cancel" }), _jsx("button", { onClick: handleSubmit, disabled: loading, className: "inline-flex items-center justify-center gap-3 px-5 py-2.5 text-sm font-semibold text-white rounded-3xl bg-gradient-to-br from-[#82A33D] to-[#6d8a33] shadow-lg hover:scale-[1.02] transform transition-all ring-1 ring-black/5 disabled:opacity-50", children: loading ? 'Saving...' : (_jsxs(_Fragment, { children: [_jsx(IconSave, {}), "Save Changes"] })) })] }) })] })] }), document.body);
};
