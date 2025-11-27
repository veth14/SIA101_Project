import React from 'react';
import { Staff } from './types';
interface CreateScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate: string;
    setSelectedDate: (date: string) => void;
    selectedShift: string;
    setSelectedShift: (shift: string) => void;
    selectedStaff: string[];
    handleStaffToggle: (staffId: string) => void;
    staffList: Staff[];
    loading: boolean;
    onSubmit: () => void;
}
declare const CreateScheduleModal: React.FC<CreateScheduleModalProps>;
export default CreateScheduleModal;
