import React from 'react';
import type { Room } from './Room-backendLogic/roomService';
interface EditRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    room: Room | null;
    onSave: (roomData: Partial<Room>) => Promise<void>;
}
export declare const EditRoomModal: React.FC<EditRoomModalProps>;
export {};
