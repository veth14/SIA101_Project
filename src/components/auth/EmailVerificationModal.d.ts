interface EmailVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    email: string;
    password?: string;
}
export declare const EmailVerificationModal: ({ isOpen, onClose, email, password }: EmailVerificationModalProps) => import("react/jsx-runtime").JSX.Element | null;
export {};
