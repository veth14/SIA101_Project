import React from 'react';
import type { Expense } from './types';
interface NewExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (expense: Expense) => void;
}
declare const NewExpenseModal: React.FC<NewExpenseModalProps>;
export default NewExpenseModal;
