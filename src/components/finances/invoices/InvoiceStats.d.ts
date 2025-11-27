import React from 'react';
import type { Invoice } from './InvoiceList';
interface InvoiceStatsProps {
    invoices: Invoice[];
}
declare const InvoiceStats: React.FC<InvoiceStatsProps>;
export default InvoiceStats;
