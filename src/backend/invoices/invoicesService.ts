import { db } from '../../config/firebase';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { createNotification } from '../notifications/notificationsService';

export interface InvoiceCreateData {
  invoiceNumber: string;
  customerName: string;
  customerEmail?: string;
  customerAddress?: string;
  notes?: string;
  taxRate: number;
  subtotal: number;
  taxAmount: number;
  total: number;
  dueDate: string;
  status: string;
  transactionId?: string;
  transactionReference?: string;
  transactionDescription?: string;
  transactionCategory?: string;
  transactionMethod?: string;
  transactionDate?: string;
  transactionTime?: string;
}

export interface InvoiceRecord extends InvoiceCreateData {
  id: string;
  createdAt?: Date;
}

export const generateInvoiceNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `INV-${year}${month}${day}-${random}`;
};

export const createInvoice = async (data: InvoiceCreateData) => {
  const payload = {
    ...data,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, 'invoices'), payload);
  try {
    await createNotification({
      type: 'invoice',
      title: `New invoice ${data.invoiceNumber}`,
      message: `${data.customerName || 'Guest'} • ₱${Number(data.total || 0).toLocaleString('en-PH')}`,
      sourceId: docRef.id,
    });
  } catch (e) {
    // Non-blocking: log but don't break invoice creation
    console.warn('Failed to create invoice notification', e);
  }
  return docRef;
};

export const subscribeToInvoices = (
  onData: (invoices: InvoiceRecord[]) => void,
  onError?: (error: unknown) => void
) => {
  const q = query(collection(db, 'invoices'), orderBy('createdAt', 'desc'));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const loaded: InvoiceRecord[] = snapshot.docs.map((doc) => {
        const data = doc.data() as any;
        let createdAtDate: Date | undefined;
        if (data.createdAt && typeof data.createdAt.toDate === 'function') {
          createdAtDate = data.createdAt.toDate();
        }

        return {
          id: doc.id,
          invoiceNumber: data.invoiceNumber || doc.id,
          customerName: data.customerName || '',
          customerEmail: data.customerEmail || '',
          customerAddress: data.customerAddress || '',
          notes: data.notes || '',
          taxRate: typeof data.taxRate === 'number' ? data.taxRate : 0,
          subtotal: typeof data.subtotal === 'number' ? data.subtotal : 0,
          taxAmount: typeof data.taxAmount === 'number' ? data.taxAmount : 0,
          total: typeof data.total === 'number' ? data.total : 0,
          dueDate: data.dueDate || '',
          status: data.status || 'draft',
          transactionId: data.transactionId,
          transactionReference: data.transactionReference,
          transactionDescription: data.transactionDescription,
          transactionCategory: data.transactionCategory,
          transactionMethod: data.transactionMethod,
          transactionDate: data.transactionDate,
          transactionTime: data.transactionTime,
          createdAt: createdAtDate,
        };
      });

      onData(loaded);
    },
    (error) => {
      console.error('Error listening to invoices:', error);
      if (onError) {
        onError(error);
      }
    }
  );

  return unsubscribe;
};
