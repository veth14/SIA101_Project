import React, { useState } from 'react';
import { StarRating } from '../shared/StarRating';
import { Camera, X } from 'lucide-react';

interface ReviewFormProps {
  bookingId: string;
  roomName: string;
  onSubmit: (reviewData: ReviewData) => Promise<void>;
  onCancel: () => void;
}

export interface ReviewData {
  rating: number;
  category: string;
  review: string;
  photos: File[];
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  bookingId,
  roomName,
  onSubmit,
  onCancel
}) => {
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState('');
  const [review, setReview] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).slice(0, 5 - photos.length);
      setPhotos([...photos, ...newFiles]);

      // Create previews
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
    setPhotoPreviews(photoPreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!category.trim()) {
      setError('Please select a category');
      return;
    }

    if (!review.trim()) {
      setError('Please write a review');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      await onSubmit({ rating, category, review, photos });
    } catch (err) {
      setError('Failed to submit review. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-xl sm:rounded-2xl shadow-lg border border-slate-200/50 p-4 sm:p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        {/* Rating Section */}
        <div className="pb-5 border-b border-gray-100">
          <label className="block text-sm sm:text-base font-bold text-gray-900 mb-3 sm:mb-4">
            How would you rate your stay? *
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              size="lg"
              showText
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm sm:text-base font-bold text-gray-900 mb-2">
            Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-heritage-green focus:ring-2 focus:ring-heritage-green/20 transition-all"
          >
            <option value="">Select a category</option>
            <option value="Service">Service</option>
            <option value="Cleanliness">Cleanliness</option>
            <option value="Amenities">Amenities</option>
            <option value="Food">Food</option>
            <option value="General">General</option>
          </select>
          <div className="flex justify-between items-center mt-1.5">
            <p className="text-xs text-gray-500">Choose the most relevant category</p>
          </div>
        </div>

        {/* Review Text */}
        <div>
          <label className="block text-sm sm:text-base font-bold text-gray-900 mb-2">
            Share your experience *
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="What did you love about your stay? How was the room, service, and amenities?"
            rows={6}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-heritage-green focus:ring-2 focus:ring-heritage-green/20 transition-all resize-none"
            maxLength={1000}
          />
          <div className="flex justify-between items-center mt-1.5">
            <p className="text-xs text-gray-500">Minimum 10 characters</p>
            <p className="text-xs font-medium text-gray-600">{review.length}/1000</p>
          </div>
        </div>

        {/* Photos */}
        <div className="pt-5 border-t border-gray-100">
          <label className="block text-sm sm:text-base font-bold text-gray-900 mb-2">
            Add Photos (Optional)
          </label>
          <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">Upload up to 5 photos to showcase your experience</p>
          
          {photoPreviews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3 mb-3 sm:mb-4">
              {photoPreviews.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden group shadow-md">
                  <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {photos.length < 5 && (
            <label className="flex flex-col items-center justify-center w-full h-28 sm:h-32 border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl cursor-pointer hover:border-heritage-green hover:bg-heritage-green/5 transition-all group">
              <Camera className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400 group-hover:text-heritage-green mb-2 transition-colors" />
              <span className="text-xs sm:text-sm font-medium text-gray-600 group-hover:text-heritage-green transition-colors">Click to upload photos</span>
              <span className="text-xs text-gray-400 mt-1">{5 - photos.length} remaining</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Buttons - Mobile Responsive */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
          <button
            type="submit"
            disabled={submitting}
            className={`flex-1 py-3 sm:py-3.5 px-6 rounded-lg sm:rounded-xl font-bold text-white transition-all duration-200 shadow-md ${
              submitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-heritage-green to-emerald-600 hover:shadow-lg hover:scale-[1.02] active:scale-95'
            }`}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : 'Submit Review'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="px-6 py-3 sm:py-3.5 rounded-lg sm:rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
