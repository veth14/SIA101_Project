import React from "react";
interface NewSupplierModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}
declare const NewSupplierModal: React.FC<NewSupplierModalProps>;
export default NewSupplierModal;
