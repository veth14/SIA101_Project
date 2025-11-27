import React from 'react';
interface StaffCardProps {
    name: string;
    email: string;
    position: string;
    department: string;
    age: number;
    gender: string;
    phone: string;
    status: 'active' | 'inactive' | 'on-leave';
    initials: string;
    colorScheme: 'blue' | 'purple' | 'emerald' | 'pink' | 'amber';
}
declare const StaffCard: React.FC<StaffCardProps>;
export default StaffCard;
