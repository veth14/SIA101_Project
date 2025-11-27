import React from "react";
interface NewRequisitionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}
declare const NewRequisitionModal: React.FC<NewRequisitionModalProps>;
export default NewRequisitionModal;
