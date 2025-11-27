import React from 'react';
import { MonthData } from '../../../data/financialReportsData';
interface MonthFolderCardProps {
    monthData: MonthData;
    categoryColor: string;
    onClick: () => void;
}
declare const MonthFolderCard: React.FC<MonthFolderCardProps>;
export default MonthFolderCard;
