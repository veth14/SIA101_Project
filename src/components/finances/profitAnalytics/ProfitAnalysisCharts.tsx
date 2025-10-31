import React, { useState, useEffect } from 'react';
import { OverviewCards } from './OverviewCards';
import ProfitTrendsChart from './ProfitTrendsChart';
import { DepartmentCards } from './DepartmentCards';
import { CostBreakdown } from './CostBreakdown';

interface CostAnalysis {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  icon: React.ReactNode;
  trend: 'up' | 'down';
  change: string;
  status: 'high' | 'medium' | 'low';
  description: string;
}

interface DepartmentProfit {
  department: string;
  revenue: number;
  costs: number;
  profit: number;
  margin: number;
  status: 'excellent' | 'good' | 'poor' | 'critical';
}

interface ProfitAnalysisChartsProps {
  costAnalysis: CostAnalysis[];
  departmentProfits: DepartmentProfit[];
}

export const ProfitAnalysisCharts: React.FC<ProfitAnalysisChartsProps> = ({
  costAnalysis,
  departmentProfits
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);
  const totalExpenses = costAnalysis.reduce((sum, cost) => sum + cost.amount, 0);
  const totalRevenue = departmentProfits.reduce((sum, dept) => sum + dept.revenue, 0);
  const netProfit = departmentProfits.reduce((sum, dept) => sum + dept.profit, 0);
  const monthlyTarget = 2000000;

  return (
    <div className="space-y-6">
      <OverviewCards 
        totalRevenue={totalRevenue}
        totalExpenses={totalExpenses}
        netProfit={netProfit}
        monthlyTarget={monthlyTarget}
        isLoading={isLoading}
      />

      <div className="mb-6">
        <ProfitTrendsChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DepartmentCards departmentProfits={departmentProfits} isLoading={isLoading} />
        <CostBreakdown isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ProfitAnalysisCharts;