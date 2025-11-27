import React from 'react';
interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    className?: string;
}
export declare const Badge: React.FC<BadgeProps>;
export {};
