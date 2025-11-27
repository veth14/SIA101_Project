import React from 'react';
interface SystemHealthProps {
    activeStaff?: number;
    availableRooms?: number;
    totalRooms?: number;
    lowStockItems?: number;
}
declare const SystemHealthCard: React.FC<SystemHealthProps>;
export default SystemHealthCard;
