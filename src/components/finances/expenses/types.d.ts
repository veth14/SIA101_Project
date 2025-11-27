export interface Expense {
    id: string;
    description: string;
    category: 'utilities' | 'supplies' | 'maintenance' | 'marketing' | 'staff' | 'food' | 'other';
    amount: number;
    vendor: string;
    date: string;
    status: 'pending' | 'approved' | 'rejected' | 'paid';
    submittedBy: string;
    approvedBy?: string;
    receiptUrl?: string;
    notes?: string;
    invoiceNumber?: string;
    purchaseOrder?: string;
    paymentMethod?: string;
    accountCode?: string;
    costCenter?: string;
    vendorContact?: string;
    project?: string;
    attachments?: string[];
    createdAt?: string;
    updatedAt?: string;
    rejectedBy?: string;
    rejectedAt?: string;
    rejectionReason?: string;
}
