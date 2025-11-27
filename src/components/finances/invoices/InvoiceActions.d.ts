import React from 'react';
interface InvoiceActionsProps {
    onPrint: () => void;
    onDownload: () => void;
    onEmail: () => void;
}
declare const InvoiceActions: React.FC<InvoiceActionsProps>;
export default InvoiceActions;
