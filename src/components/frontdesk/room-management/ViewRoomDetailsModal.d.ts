import React from 'react';
import type { Room } from './Room-backendLogic/roomService';
interface ViewRoomDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    room: Room | null;
    onEdit?: (room: Room) => void;
}
export declare const ViewRoomDetailsModal: React.FC<ViewRoomDetailsModalProps>;
export {};
