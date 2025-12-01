import { db } from '../../config/firebase';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  updateDoc,
  writeBatch,
  getDocs,
  addDoc,
  serverTimestamp,
  limit,
  where,
} from 'firebase/firestore';

export interface NotificationRecord {
  id: string;
  type: 'requisition' | 'purchaseOrder' | 'invoice' | 'reservation' | string;
  title: string;
  message: string;
  status: 'unread' | 'read' | string;
  createdAt?: Date;
  // Optional metadata for deep-links
  sourceId?: string;
}

export const subscribeToNotifications = (
  onData: (notifications: NotificationRecord[]) => void,
  onError?: (error: unknown) => void,
) => {
  // Only listen to the most recent UNREAD notifications to avoid excessive reads
  const q = query(
    collection(db, 'notifications'),
    where('status', '==', 'unread'),
    orderBy('createdAt', 'desc'),
    limit(50),
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const loaded: NotificationRecord[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as any;

        let createdAt: Date | undefined;
        if (data.createdAt && typeof data.createdAt.toDate === 'function') {
          const d = data.createdAt.toDate();
          createdAt = Number.isNaN(d.getTime()) ? undefined : d;
        }

        return {
          id: docSnap.id,
          type: data.type || 'general',
          title: data.title || 'Notification',
          message: data.message || '',
          status: data.status || 'unread',
          createdAt,
          sourceId: data.sourceId,
        };
      });

      onData(loaded);
    },
    (error) => {
      console.error('Error listening to notifications:', error);
      if (onError) onError(error);
    },
  );

  return unsubscribe;
};

export const subscribeToReadNotifications = (
  onData: (notifications: NotificationRecord[]) => void,
  onError?: (error: unknown) => void,
) => {
  const q = query(
    collection(db, 'notifications'),
    where('status', '==', 'read'),
    orderBy('createdAt', 'desc'),
    limit(50),
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const loaded: NotificationRecord[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as any;

        let createdAt: Date | undefined;
        if (data.createdAt && typeof data.createdAt.toDate === 'function') {
          const d = data.createdAt.toDate();
          createdAt = Number.isNaN(d.getTime()) ? undefined : d;
        }

        return {
          id: docSnap.id,
          type: data.type || 'general',
          title: data.title || 'Notification',
          message: data.message || '',
          status: data.status || 'read',
          createdAt,
          sourceId: data.sourceId,
        };
      });

      onData(loaded);
    },
    (error) => {
      console.error('Error listening to read notifications:', error);
      if (onError) onError(error);
    },
  );

  return unsubscribe;
};

export const markNotificationRead = async (id: string) => {
  const ref = doc(db, 'notifications', id);
  await updateDoc(ref, { status: 'read' });
};

export const clearAllNotifications = async () => {
  const q = query(collection(db, 'notifications'));
  const snap = await getDocs(q);
  const batch = writeBatch(db);

  snap.docs.forEach((docSnap) => {
    batch.update(docSnap.ref, { status: 'read' });
  });

  await batch.commit();
};

export const createNotification = async (data: {
  type: NotificationRecord['type'];
  title: string;
  message: string;
  sourceId?: string;
}) => {
  await addDoc(collection(db, 'notifications'), {
    ...data,
    status: 'unread',
    createdAt: serverTimestamp(),
  });
};

export const getRecentReadNotifications = async (limitCount = 50): Promise<NotificationRecord[]> => {
  const q = query(
    collection(db, 'notifications'),
    where('status', '==', 'read'),
    orderBy('createdAt', 'desc'),
    limit(limitCount),
  );

  const snap = await getDocs(q);

  return snap.docs.map((docSnap) => {
    const data = docSnap.data() as any;

    let createdAt: Date | undefined;
    if (data.createdAt && typeof data.createdAt.toDate === 'function') {
      const d = data.createdAt.toDate();
      createdAt = Number.isNaN(d.getTime()) ? undefined : d;
    }

    return {
      id: docSnap.id,
      type: data.type || 'general',
      title: data.title || 'Notification',
      message: data.message || '',
      status: data.status || 'unread',
      createdAt,
      sourceId: data.sourceId,
    } as NotificationRecord;
  });
};
