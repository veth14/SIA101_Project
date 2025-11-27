/**
 * Calculate SSS Contribution based on 2025 SSS Contribution Table
 * @param monthlySalary - Monthly Salary Bracket
 * @returns Employee and Employer SSS contribution
 */
export declare const calculateSSS: (monthlySalary: number) => {
    employee: number;
    employer: number;
    total: number;
};
/**
 * Calculate PhilHealth Contribution (2025 Rate: 5% of monthly salary, divided by 2 for employee share)
 * Maximum monthly salary ceiling: ₱100,000
 * @param monthlySalary - Monthly Salary
 * @returns Employee and Employer PhilHealth contribution
 */
export declare const calculatePhilHealth: (monthlySalary: number) => {
    employee: number;
    employer: number;
    total: number;
};
/**
 * Calculate Pag-IBIG Contribution (2025 Rate)
 * Employee: 1-2% of monthly salary (depending on salary bracket)
 * Employer: 2% of monthly salary
 * Maximum employee contribution: ₱200/month
 * @param monthlySalary - Monthly Salary
 * @returns Employee and Employer Pag-IBIG contribution
 */
export declare const calculatePagIBIG: (monthlySalary: number) => {
    employee: number;
    employer: number;
    total: number;
};
/**
 * Calculate Withholding Tax based on TRAIN Law (2018 onwards, updated for 2025)
 * Uses semi-monthly tax brackets
 * @param monthlyTaxableIncome - Monthly Taxable Income (Gross Pay - SSS - PhilHealth - Pag-IBIG)
 * @returns Monthly withholding tax
 */
export declare const calculateWithholdingTax: (monthlyTaxableIncome: number) => number;
/**
 * Calculate complete payroll breakdown for an employee
 * @param basicPay - Basic monthly salary
 * @param allowance - Monthly allowance
 * @param overtime - Overtime hours
 * @param overtimeRate - Rate per overtime hour
 * @returns Complete payroll breakdown
 */
export interface PayrollBreakdown {
    basicPay: number;
    allowance: number;
    overtimePay: number;
    grossPay: number;
    sss: number;
    philHealth: number;
    pagIBIG: number;
    taxableIncome: number;
    withholdingTax: number;
    totalDeductions: number;
    netPay: number;
    governmentContributions: number;
}
export declare const calculatePayroll: (basicPay: number, allowance?: number, overtime?: number, overtimeRate?: number) => PayrollBreakdown;
