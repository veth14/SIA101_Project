interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}
export declare const ConfirmDialog: ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, type, }: ConfirmDialogProps) => import("react/jsx-runtime").JSX.Element | null;
export {};
