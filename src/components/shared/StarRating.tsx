import React, { useState } from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  readonly?: boolean;
  showText?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  size = 'md',
  readonly = false,
  showText = false
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };

  const handleClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const getStarColor = (index: number) => {
    const currentRating = hoverRating || rating;
    if (index <= currentRating) {
      return 'text-yellow-400';
    }
    return 'text-gray-300';
  };

  const ratingText = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(index)}
            onMouseEnter={() => !readonly && setHoverRating(index)}
            onMouseLeave={() => !readonly && setHoverRating(0)}
            disabled={readonly}
            className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-all duration-200 ${sizeClasses[size]}`}
          >
            <svg
              className={`${getStarColor(index)} transition-colors duration-200`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
      {showText && (
        <span className="text-sm font-medium text-gray-600">
          {ratingText[Math.floor(rating) - 1] || 'No rating'}
        </span>
      )}
      {!readonly && hoverRating > 0 && (
        <span className="text-sm font-medium text-heritage-green">
          {ratingText[hoverRating - 1]}
        </span>
      )}
    </div>
  );
};

// Star Rating Display (readonly with count)
interface StarRatingDisplayProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const StarRatingDisplay: React.FC<StarRatingDisplayProps> = ({
  rating,
  count,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((index) => (
          <svg
            key={index}
            className={`${sizeClasses[size]} ${
              index <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className={`${textSizeClasses[size]} font-bold text-gray-700`}>
        {rating.toFixed(1)}
      </span>
      {count !== undefined && (
        <span className={`${textSizeClasses[size]} text-gray-500`}>
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
};
