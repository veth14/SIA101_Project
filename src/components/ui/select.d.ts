import React from 'react';
interface SelectProps {
    children: React.ReactNode;
    value?: string;
    onValueChange?: (value: string) => void;
}
interface SelectTriggerProps {
    children: React.ReactNode;
    className?: string;
}
interface SelectContentProps {
    children: React.ReactNode;
}
interface SelectItemProps {
    children: React.ReactNode;
    value: string;
    onClick?: () => void;
}
interface SelectValueProps {
    placeholder?: string;
}
export declare const Select: React.FC<SelectProps>;
export declare const SelectTrigger: React.FC<SelectTriggerProps>;
export declare const SelectContent: React.FC<SelectContentProps>;
export declare const SelectItem: React.FC<SelectItemProps>;
export declare const SelectValue: React.FC<SelectValueProps>;
export {};
