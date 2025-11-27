// Philippine Tax Calculation Utilities (2025 Rates)
/**
 * Calculate SSS Contribution based on 2025 SSS Contribution Table
 * @param monthlySalary - Monthly Salary Bracket
 * @returns Employee and Employer SSS contribution
 */
export const calculateSSS = (monthlySalary) => {
    // 2025 SSS Contribution Table (Semi-monthly basis, so divide monthly by 2)
    const semiMonthly = monthlySalary / 2;
    if (semiMonthly < 3250)
        return { employee: 135, employer: 315, total: 450 };
    if (semiMonthly < 3750)
        return { employee: 157.50, employer: 367.50, total: 525 };
    if (semiMonthly < 4250)
        return { employee: 180, employer: 420, total: 600 };
    if (semiMonthly < 4750)
        return { employee: 202.50, employer: 472.50, total: 675 };
    if (semiMonthly < 5250)
        return { employee: 225, employer: 525, total: 750 };
    if (semiMonthly < 5750)
        return { employee: 247.50, employer: 577.50, total: 825 };
    if (semiMonthly < 6250)
        return { employee: 270, employer: 630, total: 900 };
    if (semiMonthly < 6750)
        return { employee: 292.50, employer: 682.50, total: 975 };
    if (semiMonthly < 7250)
        return { employee: 315, employer: 735, total: 1050 };
    if (semiMonthly < 7750)
        return { employee: 337.50, employer: 787.50, total: 1125 };
    if (semiMonthly < 8250)
        return { employee: 360, employer: 840, total: 1200 };
    if (semiMonthly < 8750)
        return { employee: 382.50, employer: 892.50, total: 1275 };
    if (semiMonthly < 9250)
        return { employee: 405, employer: 945, total: 1350 };
    if (semiMonthly < 9750)
        return { employee: 427.50, employer: 997.50, total: 1425 };
    if (semiMonthly < 10250)
        return { employee: 450, employer: 1050, total: 1500 };
    if (semiMonthly < 10750)
        return { employee: 472.50, employer: 1102.50, total: 1575 };
    if (semiMonthly < 11250)
        return { employee: 495, employer: 1155, total: 1650 };
    if (semiMonthly < 11750)
        return { employee: 517.50, employer: 1207.50, total: 1725 };
    if (semiMonthly < 12250)
        return { employee: 540, employer: 1260, total: 1800 };
    if (semiMonthly < 12750)
        return { employee: 562.50, employer: 1312.50, total: 1875 };
    if (semiMonthly < 13250)
        return { employee: 585, employer: 1365, total: 1950 };
    if (semiMonthly < 13750)
        return { employee: 607.50, employer: 1417.50, total: 2025 };
    if (semiMonthly < 14250)
        return { employee: 630, employer: 1470, total: 2100 };
    if (semiMonthly < 14750)
        return { employee: 652.50, employer: 1522.50, total: 2175 };
    if (semiMonthly < 15250)
        return { employee: 675, employer: 1575, total: 2250 };
    if (semiMonthly < 15750)
        return { employee: 697.50, employer: 1627.50, total: 2325 };
    if (semiMonthly < 16250)
        return { employee: 720, employer: 1680, total: 2400 };
    if (semiMonthly < 16750)
        return { employee: 742.50, employer: 1732.50, total: 2475 };
    if (semiMonthly < 17250)
        return { employee: 765, employer: 1785, total: 2550 };
    if (semiMonthly < 17750)
        return { employee: 787.50, employer: 1837.50, total: 2625 };
    if (semiMonthly < 18250)
        return { employee: 810, employer: 1890, total: 2700 };
    if (semiMonthly < 18750)
        return { employee: 832.50, employer: 1942.50, total: 2775 };
    if (semiMonthly < 19250)
        return { employee: 855, employer: 1995, total: 2850 };
    if (semiMonthly < 19750)
        return { employee: 877.50, employer: 2047.50, total: 2925 };
    // Maximum SSS contribution
    return { employee: 900, employer: 2100, total: 3000 };
};
/**
 * Calculate PhilHealth Contribution (2025 Rate: 5% of monthly salary, divided by 2 for employee share)
 * Maximum monthly salary ceiling: ₱100,000
 * @param monthlySalary - Monthly Salary
 * @returns Employee and Employer PhilHealth contribution
 */
export const calculatePhilHealth = (monthlySalary) => {
    const cappedSalary = Math.min(monthlySalary, 100000); // Maximum ceiling
    const totalContribution = cappedSalary * 0.05; // 5% of salary
    const employeeShare = totalContribution / 2;
    const employerShare = totalContribution / 2;
    return {
        employee: Math.round(employeeShare * 100) / 100,
        employer: Math.round(employerShare * 100) / 100,
        total: Math.round(totalContribution * 100) / 100
    };
};
/**
 * Calculate Pag-IBIG Contribution (2025 Rate)
 * Employee: 1-2% of monthly salary (depending on salary bracket)
 * Employer: 2% of monthly salary
 * Maximum employee contribution: ₱200/month
 * @param monthlySalary - Monthly Salary
 * @returns Employee and Employer Pag-IBIG contribution
 */
export const calculatePagIBIG = (monthlySalary) => {
    let employeeRate = 0.02; // 2% default
    if (monthlySalary <= 1500) {
        employeeRate = 0.01; // 1% for low income earners
    }
    let employeeContribution = monthlySalary * employeeRate;
    // Cap employee contribution at ₱200
    employeeContribution = Math.min(employeeContribution, 200);
    const employerContribution = monthlySalary * 0.02;
    return {
        employee: Math.round(employeeContribution * 100) / 100,
        employer: Math.round(employerContribution * 100) / 100,
        total: Math.round((employeeContribution + employerContribution) * 100) / 100
    };
};
/**
 * Calculate Withholding Tax based on TRAIN Law (2018 onwards, updated for 2025)
 * Uses semi-monthly tax brackets
 * @param monthlyTaxableIncome - Monthly Taxable Income (Gross Pay - SSS - PhilHealth - Pag-IBIG)
 * @returns Monthly withholding tax
 */
export const calculateWithholdingTax = (monthlyTaxableIncome) => {
    // Convert to semi-monthly for tax bracket calculation
    const semiMonthlyIncome = monthlyTaxableIncome / 2;
    let tax = 0;
    // 2025 TRAIN Law Tax Brackets (Semi-monthly)
    if (semiMonthlyIncome <= 10417) {
        // ₱0 - ₱250,000 annually (₱0 - ₱10,417 semi-monthly)
        tax = 0;
    }
    else if (semiMonthlyIncome <= 16667) {
        // ₱250,000 - ₱400,000 annually (₱10,417 - ₱16,667 semi-monthly)
        // 15% of excess over ₱10,417
        tax = (semiMonthlyIncome - 10417) * 0.15;
    }
    else if (semiMonthlyIncome <= 33333) {
        // ₱400,000 - ₱800,000 annually (₱16,667 - ₱33,333 semi-monthly)
        // ₱937.50 + 20% of excess over ₱16,667
        tax = 937.50 + (semiMonthlyIncome - 16667) * 0.20;
    }
    else if (semiMonthlyIncome <= 66667) {
        // ₱800,000 - ₱2,000,000 annually (₱33,333 - ₱66,667 semi-monthly)
        // ₱4,270.83 + 25% of excess over ₱33,333
        tax = 4270.83 + (semiMonthlyIncome - 33333) * 0.25;
    }
    else if (semiMonthlyIncome <= 166667) {
        // ₱2,000,000 - ₱8,000,000 annually (₱66,667 - ₱166,667 semi-monthly)
        // ₱12,604.17 + 30% of excess over ₱66,667
        tax = 12604.17 + (semiMonthlyIncome - 66667) * 0.30;
    }
    else {
        // Over ₱8,000,000 annually (Over ₱166,667 semi-monthly)
        // ₱42,604.17 + 35% of excess over ₱166,667
        tax = 42604.17 + (semiMonthlyIncome - 166667) * 0.35;
    }
    // Return monthly tax (tax calculated semi-monthly * 2)
    return Math.round(tax * 2 * 100) / 100;
};
export const calculatePayroll = (basicPay, allowance = 0, overtime = 0, overtimeRate = 0) => {
    // Calculate gross pay
    const overtimePay = overtime * overtimeRate;
    const grossPay = basicPay + allowance + overtimePay;
    // Calculate government contributions
    const sssContribution = calculateSSS(basicPay);
    const philHealthContribution = calculatePhilHealth(basicPay);
    const pagIBIGContribution = calculatePagIBIG(basicPay);
    const sss = sssContribution.employee;
    const philHealth = philHealthContribution.employee;
    const pagIBIG = pagIBIGContribution.employee;
    // Calculate taxable income (Gross - SSS - PhilHealth - Pag-IBIG)
    const taxableIncome = grossPay - sss - philHealth - pagIBIG;
    // Calculate withholding tax
    const withholdingTax = calculateWithholdingTax(taxableIncome);
    // Calculate total deductions
    const governmentContributions = sss + philHealth + pagIBIG;
    const totalDeductions = governmentContributions + withholdingTax;
    // Calculate net pay
    const netPay = grossPay - totalDeductions;
    return {
        basicPay: Math.round(basicPay * 100) / 100,
        allowance: Math.round(allowance * 100) / 100,
        overtimePay: Math.round(overtimePay * 100) / 100,
        grossPay: Math.round(grossPay * 100) / 100,
        sss: Math.round(sss * 100) / 100,
        philHealth: Math.round(philHealth * 100) / 100,
        pagIBIG: Math.round(pagIBIG * 100) / 100,
        taxableIncome: Math.round(taxableIncome * 100) / 100,
        withholdingTax: Math.round(withholdingTax * 100) / 100,
        totalDeductions: Math.round(totalDeductions * 100) / 100,
        netPay: Math.round(netPay * 100) / 100,
        governmentContributions: Math.round(governmentContributions * 100) / 100
    };
};
