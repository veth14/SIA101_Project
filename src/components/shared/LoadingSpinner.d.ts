import React from 'react';
interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    color?: 'primary' | 'white' | 'gray';
    text?: string;
}
export declare const LoadingSpinner: React.FC<LoadingSpinnerProps>;
export declare const LoadingOverlay: React.FC<{
    text?: string;
}>;
export declare const InlineLoader: React.FC<{
    text?: string;
}>;
export {};
