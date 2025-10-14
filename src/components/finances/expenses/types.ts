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
}
