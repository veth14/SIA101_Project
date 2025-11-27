import React from 'react';
export type StatusVariant = 'active' | 'inactive' | 'pending' | 'approved' | 'rejected' | 'fulfilled' | 'cancelled' | 'low-stock' | 'out-of-stock' | 'in-stock' | 'received' | 'ordered';
interface StatusBadgeProps {
    status: StatusVariant;
    className?: string;
}
export declare const StatusBadge: React.FC<StatusBadgeProps>;
export {};
