import React from 'react';
import { FinancialReport } from '../../../data/financialReportsData';
interface ReportListProps {
    reports: FinancialReport[];
    onView: (report: FinancialReport) => void;
    onDownload: (report: FinancialReport) => void;
    onDelete: (report: FinancialReport) => void;
}
declare const ReportList: React.FC<ReportListProps>;
export default ReportList;
