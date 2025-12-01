import { db } from '../../config/firebase';
import { collection, onSnapshot, orderBy, query, doc, updateDoc, addDoc } from 'firebase/firestore';

export interface PurchaseOrderItemRecord {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PurchaseOrderRecord {
  id: string;
  orderNumber: string;
  supplier: string;
  items: PurchaseOrderItemRecord[];
  totalAmount: number;
  status: 'pending' | 'approved' | 'sent' | 'received' | 'cancelled' | string;
  orderDate: string;
  expectedDelivery?: string;
  approvedBy?: string;
  approvedDate?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
  hasInvoice?: boolean;
}

export const subscribeToPurchaseOrders = (
  onData: (orders: PurchaseOrderRecord[]) => void,
  onError?: (error: unknown) => void
) => {
  const q = query(collection(db, 'purchaseOrders'), orderBy('createdAt', 'desc'));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const loaded: PurchaseOrderRecord[] = snapshot.docs.map((doc) => {
        const data = doc.data() as any;

        const parseDate = (value: any): Date | undefined => {
          if (!value) return undefined;
          if (typeof value.toDate === 'function') {
            const d = value.toDate();
            return Number.isNaN(d.getTime()) ? undefined : d;
          }
          if (typeof value === 'string') {
            const d = new Date(value);
            return Number.isNaN(d.getTime()) ? undefined : d;
          }
          return undefined;
        };

        const items: PurchaseOrderItemRecord[] = Array.isArray(data.items)
          ? data.items.map((item: any) => ({
              name: item.name || '',
              quantity: typeof item.quantity === 'number' ? item.quantity : 0,
              unitPrice: typeof item.unitPrice === 'number' ? item.unitPrice : 0,
              total: typeof item.total === 'number' ? item.total : 0,
            }))
          : [];

        return {
          id: data.id || doc.id,
          orderNumber: data.orderNumber || data.id || doc.id,
          supplier: data.supplier || '',
          items,
          totalAmount: typeof data.totalAmount === 'number' ? data.totalAmount : 0,
          status: data.status || 'pending',
          orderDate: data.orderDate || '',
          expectedDelivery: data.expectedDelivery || '',
          approvedBy: data.approvedBy || undefined,
          approvedDate: data.approvedDate || undefined,
          notes: data.notes || undefined,
          createdAt: parseDate(data.createdAt),
          updatedAt: parseDate(data.updatedAt),
          hasInvoice: data.hasInvoice === true,
        };
      });

      onData(loaded);
    },
    (error) => {
      console.error('Error listening to purchaseOrders:', error);
      if (onError) {
        onError(error);
      }
    }
  );

  return unsubscribe;
};

export const createPurchaseOrder = async (data: {
  orderNumber: string;
  supplier: string;
  items: PurchaseOrderItemRecord[];
  totalAmount: number;
  orderDate: string;
  expectedDelivery?: string;
  notes?: string;
}) => {
  const now = new Date();
  await addDoc(collection(db, 'purchaseOrders'), {
    orderNumber: data.orderNumber,
    supplier: data.supplier,
    items: data.items,
    totalAmount: data.totalAmount,
    status: 'pending',
    orderDate: data.orderDate,
    expectedDelivery: data.expectedDelivery || '',
    approvedBy: null,
    approvedDate: null,
    notes: data.notes || '',
    createdAt: now,
    updatedAt: now,
    hasInvoice: false,
  });
};

export const updatePurchaseOrderStatus = async (
  id: string,
  status: 'pending' | 'approved' | 'sent' | 'received' | 'cancelled' | string,
  options?: { approvedBy?: string; hasInvoice?: boolean }
) => {
  const ref = doc(db, 'purchaseOrders', id);
  const payload: any = {
    status,
    updatedAt: new Date(),
  };

  if (status === 'approved' || status === 'received') {
    if (options?.approvedBy) {
      payload.approvedBy = options.approvedBy;
    }
    payload.approvedDate = new Date().toISOString();
  }

  if (typeof options?.hasInvoice === 'boolean') {
    payload.hasInvoice = options.hasInvoice;
  }

  await updateDoc(ref, payload);
};
