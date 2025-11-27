interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    buttonText?: string;
}
export declare const SuccessModal: ({ isOpen, onClose, title, message, buttonText }: SuccessModalProps) => import("react/jsx-runtime").JSX.Element | null;
export {};
