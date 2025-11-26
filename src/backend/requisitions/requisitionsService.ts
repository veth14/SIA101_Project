import { db } from '../../config/firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

export interface RequisitionItemRecord {
  name: string;
  quantity: number;
  unit: string;
  estimatedCost: number;
  reason: string;
}

export interface RequisitionRecord {
  id: string;
  requestNumber: string;
  department: string;
  requestedBy: string;
  items: RequisitionItemRecord[];
  totalEstimatedCost: number;
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled' | string;
  priority: 'low' | 'medium' | 'high' | 'urgent' | string;
  requestDate: string;
  requiredDate?: string;
  justification: string;
  approvedBy?: string;
  approvedDate?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
  hasInvoice?: boolean;
}

export const subscribeToRequisitions = (
  onData: (requisitions: RequisitionRecord[]) => void,
  onError?: (error: unknown) => void
) => {
  const q = query(collection(db, 'requisitions'), orderBy('createdAt', 'desc'));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const loaded: RequisitionRecord[] = snapshot.docs.map((doc) => {
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

        const items: RequisitionItemRecord[] = Array.isArray(data.items)
          ? data.items.map((item: any) => ({
              name: item.name || '',
              quantity: typeof item.quantity === 'number' ? item.quantity : 0,
              unit: item.unit || '',
              estimatedCost: typeof item.estimatedCost === 'number' ? item.estimatedCost : 0,
              reason: item.reason || '',
            }))
          : [];

        return {
          id: data.id || doc.id,
          requestNumber: data.requestNumber || data.id || doc.id,
          department: data.department || '',
          requestedBy: data.requestedBy || '',
          items,
          totalEstimatedCost:
            typeof data.totalEstimatedCost === 'number' ? data.totalEstimatedCost : 0,
          status: data.status || 'pending',
          priority: data.priority || 'low',
          requestDate: data.requestDate || '',
          requiredDate: data.requiredDate || '',
          justification: data.justification || '',
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
      console.error('Error listening to requisitions:', error);
      if (onError) {
        onError(error);
      }
    }
  );

  return unsubscribe;
};
