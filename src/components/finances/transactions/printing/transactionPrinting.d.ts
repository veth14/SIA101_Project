import type { Transaction } from '../TransactionDetails';
export declare const printTransactionReceipt: (transaction: Transaction) => void;
export declare const downloadTransactionReceiptPdf: (transaction: Transaction) => Promise<void>;
