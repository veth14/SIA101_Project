/**
 *
 * Displays a paginated grid of lost and found items using LostFoundCard components.
 * Shows maximum 6 items per page with pagination controls.
 */
import React from 'react';
import type { LostFoundItem } from './types';
interface LostFoundGridProps {
    /** Array of lost and found items to display */
    items: LostFoundItem[];
    /** Which collection is currently active - affects labels */
    activeTab: 'found' | 'lost';
    /** Function to handle viewing item details */
    onViewDetails: (item: LostFoundItem) => void;
    /** Function to handle marking item as claimed */
    onMarkClaimed: (item: LostFoundItem) => void;
}
declare const LostFoundGrid: React.FC<LostFoundGridProps>;
export default LostFoundGrid;
