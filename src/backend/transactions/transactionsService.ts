import { db } from '../../config/firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

export interface TransactionRecord {
  id: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  date: string;
  time: string;
  category: string;
  status: 'completed' | 'pending' | 'failed';
  reference: string;
  method: 'cash' | 'card' | 'transfer' | 'check' | 'gcash';
  guestName?: string;
  userEmail?: string;
  hasInvoice?: boolean;
  bookingId?: string;
}

export const subscribeToTransactions = (
  onData: (transactions: TransactionRecord[]) => void,
  onError?: (error: unknown) => void
) => {
  const q = query(
    collection(db, 'transactions'),
    orderBy('createdAt', 'desc')
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const loaded: TransactionRecord[] = snapshot.docs.map((doc) => {
        const data = doc.data() as any;
        const createdAt: any = data.createdAt;
        let date = '';
        let time = '';

        if (createdAt && typeof createdAt.toDate === 'function') {
          const d = createdAt.toDate();
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          const hours = String(d.getHours()).padStart(2, '0');
          const minutes = String(d.getMinutes()).padStart(2, '0');
          date = `${year}-${month}-${day}`;
          time = `${hours}:${minutes}`;
        }

        const status: TransactionRecord['status'] =
          data.status === 'pending' || data.status === 'failed'
            ? data.status
            : 'completed';

        const raw = (data.paymentMethod || '').toString().toLowerCase();
        let method: TransactionRecord['method'];

        switch (raw) {
          case 'card':
          case 'credit_card':
          case 'debit_card':
            method = 'card';
            break;
          case 'cash':
          case 'cash_payment':
            method = 'cash';
            break;
          case 'gcash':
          case 'g-cash':
            method = 'gcash';
            break;
          case 'transfer':
          case 'bank_transfer':
          case 'bank-transfer':
            method = 'transfer';
            break;
          case 'check':
          case 'cheque':
            method = 'check';
            break;
          default:
            method = 'cash';
        }

        return {
          id: doc.id,
          description: data.description || 'Transaction',
          amount: typeof data.amount === 'number' ? data.amount : 0,
          type: 'credit',
          date,
          time,
          category: data.type || 'booking',
          status,
          reference: data.bookingId || data.transactionId || doc.id,
          method,
          guestName: data.guestName || data.userName || '',
          userEmail: data.userEmail || data.email || '',
          hasInvoice: data.hasInvoice === true,
          bookingId: data.bookingId,
        };
      });

      onData(loaded);
    },
    (error) => {
      console.error('Error listening to transactions:', error);
      if (onError) {
        onError(error);
      }
    }
  );

  return unsubscribe;
};
