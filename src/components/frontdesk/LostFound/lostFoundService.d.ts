import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import type { LostFoundItem } from './types';
export declare function startListeners(onFoundUpdate: (items: LostFoundItem[], docMap: Record<string, string>) => void, onLostUpdate: (items: LostFoundItem[], docMap: Record<string, string>) => void, pageSize?: number): Promise<void>;
export declare function stopListeners(): void;
export declare function fetchPage(collectionName: 'found' | 'lost', pageSize?: number, startAfterDoc?: unknown | null): Promise<{
    items: LostFoundItem[];
    map: Record<string, string>;
    docs: QueryDocumentSnapshot<DocumentData, DocumentData>[];
}>;
export declare const allocateSequentialId: (collectionName: "found" | "lost") => Promise<string | null>;
export declare const createAndReserveDoc: (collectionName: "found" | "lost", payload: DocumentData, maxRetries?: number) => Promise<string | null>;
export declare function getCached(collectionName: 'found' | 'lost'): {
    items: LostFoundItem[];
    map: Record<string, string>;
} | null;
