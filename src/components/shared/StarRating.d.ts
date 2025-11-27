import React from 'react';
interface StarRatingProps {
    rating: number;
    onRatingChange?: (rating: number) => void;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    readonly?: boolean;
    showText?: boolean;
}
export declare const StarRating: React.FC<StarRatingProps>;
interface StarRatingDisplayProps {
    rating: number;
    count?: number;
    size?: 'sm' | 'md' | 'lg';
}
export declare const StarRatingDisplay: React.FC<StarRatingDisplayProps>;
export {};
