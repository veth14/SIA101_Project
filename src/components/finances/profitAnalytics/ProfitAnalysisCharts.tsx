import React from 'react';
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
  // No skeleton/loading simulation: render charts and sections immediately
  return (
    <div className="space-y-8">
      {/* Profit Trends Chart */}
      <div className="mb-2">
        <ProfitTrendsChart />
      </div>

      {/* Department Performance and Cost Analysis Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <DepartmentCards departmentProfits={departmentProfits} />
        <CostBreakdown costAnalysis={costAnalysis} />
      </div>
    </div>
  );
};

export default ProfitAnalysisCharts;