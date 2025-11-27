import React from 'react';
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
export declare const ReviewCard: React.FC<ReviewCardProps>;
export {};
