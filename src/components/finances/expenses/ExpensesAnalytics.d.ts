import React from 'react';
import type { Expense } from './types';
interface ExpenseAnalyticsProps {
    expenses?: Expense[];
    staffFromPayroll?: number;
}
declare const ExpenseAnalytics: React.FC<ExpenseAnalyticsProps>;
export default ExpenseAnalytics;
