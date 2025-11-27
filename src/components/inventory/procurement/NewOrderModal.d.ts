import React from "react";
interface NewOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}
declare const NewOrderModal: React.FC<NewOrderModalProps>;
export default NewOrderModal;
