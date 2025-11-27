import React from 'react';
interface QuickActionsPanelProps {
    onWalkInBooking: () => void;
    onRoomStatus: () => void;
    onGuestServices: () => void;
}
declare const QuickActionsPanel: React.FC<QuickActionsPanelProps>;
export default QuickActionsPanel;
