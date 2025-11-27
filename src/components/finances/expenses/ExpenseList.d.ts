import React from 'react';
import type { Expense } from './types';
interface ExpenseListProps {
    expenses: Expense[];
    onApprove: (ids: string[] | string) => void;
    onReject: (ids: string[] | string) => void;
    onCreate?: (expense: Expense) => void;
    onExpenseSelect?: (expense: Expense) => void;
    selectedExpense?: Expense | null;
    selectedIds?: Set<string>;
    onToggleSelect?: (id: string, selected: boolean) => void;
    onSelectAll?: (ids: string[], select: boolean) => void;
    onMarkPaid?: (ids: string[] | string) => void;
}
declare const ExpenseList: React.FC<ExpenseListProps>;
export default ExpenseList;
