import { collection, onSnapshot, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';

export interface ReportRecord {
  id: string;
  name: string;
  category: string; // 'income' | 'expense' | 'payroll' | 'profit-loss' | 'balance' | 'custom'
  month: number; // 1-12
  year: number;
  dateGenerated: string; // yyyy-mm-dd
  preparedBy: string;
  fileType: 'PDF' | 'Excel' | 'CSV';
  fileSize: string; // e.g. "2.4 MB"
  status: 'active' | 'archived';
  version: number;
}

export interface ReportCreateData {
  name: string;
  category: string;
  month: number;
  year: number;
  dateGenerated: string;
  preparedBy: string;
  fileType: 'PDF' | 'Excel' | 'CSV';
  fileSize: string;
  status: 'active' | 'archived';
  version: number;
}

const COLLECTION_NAME = 'reports';

export const subscribeToReports = (
  onNext: (reports: ReportRecord[]) => void,
  onError: (error: unknown) => void
) => {
  const colRef = collection(db, COLLECTION_NAME);

  return onSnapshot(
    colRef,
    (snapshot) => {
      try {
        const records: ReportRecord[] = snapshot.docs.map((doc) => {
          const data = doc.data() as any;

          const dateGenerated: string =
            typeof data.dateGenerated === 'string'
              ? data.dateGenerated
              : data.dateGenerated?.toDate?.()?.toISOString().split('T')[0] ?? '';

          return {
            id: doc.id,
            name: (data.name as string) || '',
            category: (data.category as string) || 'custom',
            month: Number(data.month) || 1,
            year: Number(data.year) || new Date().getFullYear(),
            dateGenerated,
            preparedBy: (data.preparedBy as string) || 'Finance Team',
            fileType: (data.fileType as 'PDF' | 'Excel' | 'CSV') || 'PDF',
            fileSize: (data.fileSize as string) || '0.0 MB',
            status: (data.status as 'active' | 'archived') || 'active',
            version: Number(data.version) || 1,
          };
        });
        onNext(records);
      } catch (err) {
        console.error('Error mapping reports snapshot:', err);
        onError(err);
      }
    },
    (err) => {
      console.error('Error subscribing to reports:', err);
      onError(err);
    }
  );
};

export const createReport = async (data: ReportCreateData): Promise<string> => {
  const colRef = collection(db, COLLECTION_NAME);

  const docRef = await addDoc(colRef, {
    ...data,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};

export const checkReportExists = async (
  category: string,
  month: number,
  year: number
): Promise<boolean> => {
  const colRef = collection(db, COLLECTION_NAME);
  const q = query(
    colRef,
    where('category', '==', category),
    where('month', '==', month),
    where('year', '==', year)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};
