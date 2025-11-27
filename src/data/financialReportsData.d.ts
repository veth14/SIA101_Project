export interface FinancialReport {
    id: string;
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
export interface ReportFolder {
    id: string;
    name: string;
    category: string;
    icon: string;
    color: string;
    year: number;
    reportCount: number;
    lastUpdated: string;
    description: string;
}
export interface MonthData {
    month: number;
    name: string;
    reportCount: number;
}
export declare const reportCategories: {
    id: string;
    name: string;
    icon: string;
    color: string;
    borderColor: string;
    hoverColor: string;
    description: string;
}[];
export declare const months: {
    month: number;
    name: string;
    short: string;
}[];
export declare const sampleReports: FinancialReport[];
export declare const getReportsByCategory: (category: string, year?: number) => FinancialReport[];
export declare const getReportsByMonth: (category: string, month: number, year?: number) => FinancialReport[];
export declare const getMonthDataForCategory: (category: string, year?: number) => MonthData[];
export declare const getArchivedReports: () => FinancialReport[];
