import React from 'react';
interface AlertDialogProps {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}
interface AlertDialogContentProps {
    children: React.ReactNode;
}
interface AlertDialogHeaderProps {
    children: React.ReactNode;
}
interface AlertDialogTitleProps {
    children: React.ReactNode;
}
interface AlertDialogDescriptionProps {
    children: React.ReactNode;
}
interface AlertDialogFooterProps {
    children: React.ReactNode;
}
interface AlertDialogActionProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}
interface AlertDialogCancelProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}
export declare const AlertDialog: React.FC<AlertDialogProps>;
export declare const AlertDialogContent: React.FC<AlertDialogContentProps>;
export declare const AlertDialogHeader: React.FC<AlertDialogHeaderProps>;
export declare const AlertDialogTitle: React.FC<AlertDialogTitleProps>;
export declare const AlertDialogDescription: React.FC<AlertDialogDescriptionProps>;
export declare const AlertDialogFooter: React.FC<AlertDialogFooterProps>;
export declare const AlertDialogAction: React.FC<AlertDialogActionProps>;
export declare const AlertDialogCancel: React.FC<AlertDialogCancelProps>;
export {};
