interface ExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}
export declare const ExpenseModal: ({ isOpen, onClose, children }: ExpenseModalProps) => import("react").ReactPortal | null;
export {};
