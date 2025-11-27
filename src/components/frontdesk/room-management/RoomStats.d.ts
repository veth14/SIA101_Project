/**
 * RoomStats Component
 * * Premium modern statistics cards with beautiful gradients and animations.
 * Provides an engaging overview of room management statistics.
 */
import React from 'react';
import type { RoomStats as RoomStatsType } from './Room-backendLogic/roomService';
interface RoomStatsProps {
    roomStats: RoomStatsType;
    loading?: boolean;
}
/**
 * Statistics component for Room Management dashboard
 */
declare const RoomStats: React.FC<RoomStatsProps>;
export default RoomStats;
