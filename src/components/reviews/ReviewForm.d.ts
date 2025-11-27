import React from 'react';
interface ReviewFormProps {
    bookingId: string;
    roomName: string;
    onSubmit: (reviewData: ReviewData) => Promise<void>;
    onCancel: () => void;
}
export interface ReviewData {
    rating: number;
    title: string;
    review: string;
    photos: File[];
}
export declare const ReviewForm: React.FC<ReviewFormProps>;
export {};
