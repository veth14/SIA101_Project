import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { StarRating } from '../shared/StarRating';
import { Camera, X } from 'lucide-react';
export const ReviewForm = ({ bookingId, roomName, onSubmit, onCancel }) => {
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [review, setReview] = useState('');
    const [photos, setPhotos] = useState([]);
    const [photoPreviews, setPhotoPreviews] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const handlePhotoChange = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).slice(0, 5 - photos.length);
            setPhotos([...photos, ...newFiles]);
            // Create previews
            newFiles.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPhotoPreviews(prev => [...prev, reader.result]);
                };
                reader.readAsDataURL(file);
            });
        }
    };
    const removePhoto = (index) => {
        setPhotos(photos.filter((_, i) => i !== index));
        setPhotoPreviews(photoPreviews.filter((_, i) => i !== index));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }
        if (!title.trim()) {
            setError('Please enter a title');
            return;
        }
        if (!review.trim()) {
            setError('Please write a review');
            return;
        }
        setError('');
        setSubmitting(true);
        try {
            await onSubmit({ rating, title, review, photos });
        }
        catch (err) {
            setError('Failed to submit review. Please try again.');
            setSubmitting(false);
        }
    };
    return (_jsx("div", { className: "bg-gradient-to-br from-white to-slate-50/50 rounded-xl sm:rounded-2xl shadow-lg border border-slate-200/50 p-4 sm:p-6 md:p-8", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-5 sm:space-y-6", children: [_jsxs("div", { className: "pb-5 border-b border-gray-100", children: [_jsx("label", { className: "block text-sm sm:text-base font-bold text-gray-900 mb-3 sm:mb-4", children: "How would you rate your stay? *" }), _jsx("div", { className: "flex flex-col sm:flex-row sm:items-center gap-3", children: _jsx(StarRating, { rating: rating, onRatingChange: setRating, size: "lg", showText: true }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm sm:text-base font-bold text-gray-900 mb-2", children: "Give your review a title *" }), _jsx("input", { type: "text", value: title, onChange: (e) => setTitle(e.target.value), placeholder: "e.g., Amazing stay with great service!", className: "w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-heritage-green focus:ring-2 focus:ring-heritage-green/20 transition-all", maxLength: 100 }), _jsxs("div", { className: "flex justify-between items-center mt-1.5", children: [_jsx("p", { className: "text-xs text-gray-500", children: "Be specific and descriptive" }), _jsxs("p", { className: "text-xs font-medium text-gray-600", children: [title.length, "/100"] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm sm:text-base font-bold text-gray-900 mb-2", children: "Share your experience *" }), _jsx("textarea", { value: review, onChange: (e) => setReview(e.target.value), placeholder: "What did you love about your stay? How was the room, service, and amenities?", rows: 6, className: "w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-heritage-green focus:ring-2 focus:ring-heritage-green/20 transition-all resize-none", maxLength: 1000 }), _jsxs("div", { className: "flex justify-between items-center mt-1.5", children: [_jsx("p", { className: "text-xs text-gray-500", children: "Minimum 10 characters" }), _jsxs("p", { className: "text-xs font-medium text-gray-600", children: [review.length, "/1000"] })] })] }), _jsxs("div", { className: "pt-5 border-t border-gray-100", children: [_jsx("label", { className: "block text-sm sm:text-base font-bold text-gray-900 mb-2", children: "Add Photos (Optional)" }), _jsx("p", { className: "text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4", children: "Upload up to 5 photos to showcase your experience" }), photoPreviews.length > 0 && (_jsx("div", { className: "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3 mb-3 sm:mb-4", children: photoPreviews.map((preview, index) => (_jsxs("div", { className: "relative aspect-square rounded-lg overflow-hidden group shadow-md", children: [_jsx("img", { src: preview, alt: `Preview ${index + 1}`, className: "w-full h-full object-cover" }), _jsx("div", { className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center", children: _jsx("button", { type: "button", onClick: () => removePhoto(index), className: "w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg", children: _jsx(X, { className: "w-4 h-4" }) }) })] }, index))) })), photos.length < 5 && (_jsxs("label", { className: "flex flex-col items-center justify-center w-full h-28 sm:h-32 border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl cursor-pointer hover:border-heritage-green hover:bg-heritage-green/5 transition-all group", children: [_jsx(Camera, { className: "w-7 h-7 sm:w-8 sm:h-8 text-gray-400 group-hover:text-heritage-green mb-2 transition-colors" }), _jsx("span", { className: "text-xs sm:text-sm font-medium text-gray-600 group-hover:text-heritage-green transition-colors", children: "Click to upload photos" }), _jsxs("span", { className: "text-xs text-gray-400 mt-1", children: [5 - photos.length, " remaining"] }), _jsx("input", { type: "file", accept: "image/*", multiple: true, onChange: handlePhotoChange, className: "hidden" })] }))] }), error && (_jsx("div", { className: "p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 rounded-lg", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx("svg", { className: "w-5 h-5 text-red-500 flex-shrink-0 mt-0.5", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) }), _jsx("p", { className: "text-sm font-medium text-red-700", children: error })] }) })), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100", children: [_jsx("button", { type: "submit", disabled: submitting, className: `flex-1 py-3 sm:py-3.5 px-6 rounded-lg sm:rounded-xl font-bold text-white transition-all duration-200 shadow-md ${submitting
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-heritage-green to-emerald-600 hover:shadow-lg hover:scale-[1.02] active:scale-95'}`, children: submitting ? (_jsxs("span", { className: "flex items-center justify-center gap-2", children: [_jsxs("svg", { className: "animate-spin h-5 w-5", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Submitting..."] })) : 'Submit Review' }), _jsx("button", { type: "button", onClick: onCancel, disabled: submitting, className: "px-6 py-3 sm:py-3.5 rounded-lg sm:rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed", children: "Cancel" })] })] }) }));
};
