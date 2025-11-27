import React from 'react';
interface GuestLayoutProps {
    children: React.ReactNode;
}
/**
 * GuestLayout - Reusable layout wrapper for guest-facing pages
 * Eliminates duplication of Header/Footer wrapper in route definitions
 */
export declare const GuestLayout: React.FC<GuestLayoutProps>;
export {};
