import React from 'react';
import type { IconType } from 'react-icons';
interface AmenityProps {
    icon: IconType;
    name: string;
    description: string;
}
export declare const AmenitiesSection: React.FC<{
    amenities: AmenityProps[];
}>;
export {};
