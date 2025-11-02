// Financial Reports Data Types and Sample Data

export interface FinancialReport {
  id: string;
  name: string;
  category: string;
  month: number; // 1-12
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

export const reportCategories = [
  {
    id: 'income',
    name: 'Income Reports',
    icon: '💰',
    color: 'from-emerald-50 to-white',
    borderColor: 'border-emerald-100',
    hoverColor: 'hover:border-emerald-300',
    description: 'Revenue and income statements'
  },
  {
    id: 'expense',
    name: 'Expense Reports',
    icon: '📊',
    color: 'from-red-50 to-white',
    borderColor: 'border-red-100',
    hoverColor: 'hover:border-red-300',
    description: 'Operating costs and expenditures'
  },
  {
    id: 'payroll',
    name: 'Payroll Summaries',
    icon: '👥',
    color: 'from-blue-50 to-white',
    borderColor: 'border-blue-100',
    hoverColor: 'hover:border-blue-300',
    description: 'Employee salary reports'
  },
  {
    id: 'profit-loss',
    name: 'Profit & Loss',
    icon: '📈',
    color: 'from-purple-50 to-white',
    borderColor: 'border-purple-100',
    hoverColor: 'hover:border-purple-300',
    description: 'P&L statements and analysis'
  },
  {
    id: 'balance',
    name: 'Balance Sheets',
    icon: '⚖️',
    color: 'from-amber-50 to-white',
    borderColor: 'border-amber-100',
    hoverColor: 'hover:border-amber-300',
    description: 'Assets and liabilities overview'
  },
  {
    id: 'custom',
    name: 'Custom Reports',
    icon: '📋',
    color: 'from-indigo-50 to-white',
    borderColor: 'border-indigo-100',
    hoverColor: 'hover:border-indigo-300',
    description: 'Specialized financial reports'
  }
];

export const months = [
  { month: 1, name: 'January', short: 'Jan' },
  { month: 2, name: 'February', short: 'Feb' },
  { month: 3, name: 'March', short: 'Mar' },
  { month: 4, name: 'April', short: 'Apr' },
  { month: 5, name: 'May', short: 'May' },
  { month: 6, name: 'June', short: 'Jun' },
  { month: 7, name: 'July', short: 'Jul' },
  { month: 8, name: 'August', short: 'Aug' },
  { month: 9, name: 'September', short: 'Sep' },
  { month: 10, name: 'October', short: 'Oct' },
  { month: 11, name: 'November', short: 'Nov' },
  { month: 12, name: 'December', short: 'Dec' }
];

// Sample Reports Data
export const sampleReports: FinancialReport[] = [
  // October Reports
  {
    id: 'IR-2025-10-001',
    name: 'IncomeReport-2025-10-v1.pdf',
    category: 'income',
    month: 10,
    year: 2025,
    dateGenerated: '2025-10-14',
    preparedBy: 'Finance Team',
    fileType: 'PDF',
    fileSize: '2.4 MB',
    status: 'active',
    version: 1
  },
  {
    id: 'ER-2025-10-001',
    name: 'ExpenseReport-2025-10-v1.pdf',
    category: 'expense',
    month: 10,
    year: 2025,
    dateGenerated: '2025-10-14',
    preparedBy: 'Accounting Dept',
    fileType: 'PDF',
    fileSize: '1.8 MB',
    status: 'active',
    version: 1
  },
  {
    id: 'PR-2025-10-001',
    name: 'PayrollReport-2025-10-v1.pdf',
    category: 'payroll',
    month: 10,
    year: 2025,
    dateGenerated: '2025-10-14',
    preparedBy: 'HR Department',
    fileType: 'PDF',
    fileSize: '3.2 MB',
    status: 'active',
    version: 1
  },
  // September Reports
  {
    id: 'IR-2025-09-001',
    name: 'IncomeReport-2025-09-v1.pdf',
    category: 'income',
    month: 9,
    year: 2025,
    dateGenerated: '2025-09-30',
    preparedBy: 'Finance Team',
    fileType: 'PDF',
    fileSize: '2.1 MB',
    status: 'active',
    version: 1
  },
  {
    id: 'PL-2025-09-001',
    name: 'ProfitLoss-2025-09-v2.pdf',
    category: 'profit-loss',
    month: 9,
    year: 2025,
    dateGenerated: '2025-09-30',
    preparedBy: 'Finance Team',
    fileType: 'PDF',
    fileSize: '1.5 MB',
    status: 'active',
    version: 2
  },
  // August Reports (Archived)
  {
    id: 'IR-2025-08-001',
    name: 'IncomeReport-2025-08-v1.pdf',
    category: 'income',
    month: 8,
    year: 2025,
    dateGenerated: '2025-08-31',
    preparedBy: 'Finance Team',
    fileType: 'PDF',
    fileSize: '2.3 MB',
    status: 'archived',
    version: 1
  },
  {
    id: 'BS-2025-08-001',
    name: 'BalanceSheet-2025-08-v1.xlsx',
    category: 'balance',
    month: 8,
    year: 2025,
    dateGenerated: '2025-08-31',
    preparedBy: 'Accounting Dept',
    fileType: 'Excel',
    fileSize: '856 KB',
    status: 'archived',
    version: 1
  },
  // July Reports
  {
    id: 'CR-2025-07-001',
    name: 'CustomReport-2025-07-v1.pdf',
    category: 'custom',
    month: 7,
    year: 2025,
    dateGenerated: '2025-07-31',
    preparedBy: 'Management',
    fileType: 'PDF',
    fileSize: '1.2 MB',
    status: 'active',
    version: 1
  },
  {
    id: 'PR-2025-07-001',
    name: 'PayrollReport-2025-07-v1.pdf',
    category: 'payroll',
    month: 7,
    year: 2025,
    dateGenerated: '2025-07-31',
    preparedBy: 'HR Department',
    fileType: 'PDF',
    fileSize: '3.1 MB',
    status: 'active',
    version: 1
  },
  // June Reports
  {
    id: 'ER-2025-06-001',
    name: 'ExpenseReport-2025-06-v1.pdf',
    category: 'expense',
    month: 6,
    year: 2025,
    dateGenerated: '2025-06-30',
    preparedBy: 'Accounting Dept',
    fileType: 'PDF',
    fileSize: '1.9 MB',
    status: 'active',
    version: 1
  },
  {
    id: 'PL-2025-06-001',
    name: 'ProfitLoss-2025-06-v1.pdf',
    category: 'profit-loss',
    month: 6,
    year: 2025,
    dateGenerated: '2025-06-30',
    preparedBy: 'Finance Team',
    fileType: 'PDF',
    fileSize: '1.6 MB',
    status: 'archived',
    version: 1
  }
];

// Get reports by category and month
export const getReportsByCategory = (category: string, year: number = 2025): FinancialReport[] => {
  return sampleReports.filter(r => r.category === category && r.year === year);
};

// Get reports by month
export const getReportsByMonth = (category: string, month: number, year: number = 2025): FinancialReport[] => {
  return sampleReports.filter(r => r.category === category && r.month === month && r.year === year);
};

// Get month data with report counts
export const getMonthDataForCategory = (category: string, year: number = 2025): MonthData[] => {
  return months.map(month => ({
    ...month,
    reportCount: getReportsByMonth(category, month.month, year).length
  }));
};

// Get archived reports
export const getArchivedReports = (): FinancialReport[] => {
  return sampleReports.filter(r => r.status === 'archived');
};
