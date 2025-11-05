import React, { useState } from 'react';
import { StarRatingDisplay } from '../shared/StarRating';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface ReviewCardProps {
  reviewId: string;
  rating: number;
  guestName: string;
  stayDate: string;
  title: string;
  review: string;
  photos?: string[];
  helpful: number;
  roomName: string;
  verified?: boolean;
  onHelpful?: (reviewId: string) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  reviewId,
  rating,
  guestName,
  stayDate,
  title,
  review,
  photos = [],
  helpful,
  roomName,
  verified = false,
  onHelpful
}) => {
  const [showFullReview, setShowFullReview] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const isLongReview = review.length > 300;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-heritage-green to-emerald-600 text-white font-bold text-lg flex-shrink-0">
            {guestName.charAt(0).toUpperCase()}
          </div>
          
          {/* Guest Info */}
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-gray-900">{guestName}</h4>
              {verified && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">Stayed at {roomName}</p>
            <p className="text-xs text-gray-500">{stayDate}</p>
          </div>
        </div>

        {/* Rating */}
        <StarRatingDisplay rating={rating} size="md" />
      </div>

      {/* Review Title */}
      <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>

      {/* Review Text */}
      <p className="text-gray-700 leading-relaxed mb-4">
        {isLongReview && !showFullReview
          ? `${review.substring(0, 300)}...`
          : review}
      </p>

      {isLongReview && (
        <button
          onClick={() => setShowFullReview(!showFullReview)}
          className="text-heritage-green font-semibold text-sm hover:underline mb-4"
        >
          {showFullReview ? 'Show less' : 'Read more'}
        </button>
      )}

      {/* Photos */}
      {photos.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-4 gap-2">
            {photos.slice(0, 4).map((photo, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img
                  src={photo}
                  alt={`Review photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {index === 3 && photos.length > 4 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      +{photos.length - 4}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Helpful */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
        <button
          onClick={() => onHelpful && onHelpful(reviewId)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 hover:bg-heritage-green/10 hover:text-heritage-green transition-colors duration-200"
        >
          <ThumbsUp className="w-4 h-4" />
          <span className="text-sm font-semibold">Helpful ({helpful})</span>
        </button>
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl w-full">
            <img
              src={selectedPhoto}
              alt="Review photo"
              className="w-full h-auto rounded-lg"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
