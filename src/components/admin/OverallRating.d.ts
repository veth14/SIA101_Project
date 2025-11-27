import React from 'react';
interface RatingCategory {
    name: string;
    score: number;
}
interface OverallRatingProps {
    averageRating: number;
    totalReviews: number;
    categories: RatingCategory[];
}
export declare const OverallRating: React.FC<OverallRatingProps>;
export {};
