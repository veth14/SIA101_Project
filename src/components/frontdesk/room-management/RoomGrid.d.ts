import React from 'react';
import type { Room } from './Room-backendLogic/roomService';
interface RoomGridProps {
    rooms: Room[];
    loading: boolean;
    error: string | null;
    onView: (room: Room) => void;
    onEdit: (room: Room) => void;
}
declare const RoomGrid: React.FC<RoomGridProps>;
export default RoomGrid;
