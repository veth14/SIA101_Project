import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { EmployeePayroll } from './PayrollTable';
import { calculatePayroll } from '../../../utils/philippineTaxCalculations';

const RResponsiveContainer = ResponsiveContainer as unknown as React.ComponentType<Record<string, unknown>>;
const RBarChart = BarChart as unknown as React.ComponentType<Record<string, unknown>>;
const RXAxis = XAxis as unknown as React.ComponentType<Record<string, unknown>>;
const RYAxis = YAxis as unknown as React.ComponentType<Record<string, unknown>>;
const RCartesianGrid = CartesianGrid as unknown as React.ComponentType<Record<string, unknown>>;
const RBar = Bar as unknown as React.ComponentType<Record<string, unknown>>;

interface PayrollInsightsProps {
  employees: EmployeePayroll[];
}

interface ChartEmployee {
  name: string;
  netPay: number;
  department: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
  }).format(amount);
};

const PayrollInsights: React.FC<PayrollInsightsProps> = ({ employees }) => {
  const topEmployees: ChartEmployee[] = useMemo(() => {
    if (!employees.length) return [];

    const mapped = employees.map((emp) => {
      const payroll = calculatePayroll(emp.basicPay, emp.allowance, emp.overtime, emp.overtimeRate);
      return {
        name: emp.name,
        netPay: payroll.netPay,
        department: emp.department,
      };
    });

    return mapped
      .sort((a, b) => b.netPay - a.netPay)
      .slice(0, 5);
  }, [employees]);

  if (!topEmployees.length) return null;

  const metrics = useMemo(() => {
    if (!topEmployees.length) return null;
    const totalTop = topEmployees.reduce((sum, emp) => sum + emp.netPay, 0);
    const averageTop = Math.round(totalTop / topEmployees.length);
    const top = topEmployees[0];

    return {
      totalTop,
      averageTop,
      topName: top.name,
      topNet: top.netPay,
    };
  }, [topEmployees]);

  return (
    <div className="relative overflow-hidden shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60 mt-6">
      {/* Background gradient similar to TransactionAnalytics */}
      <div className="absolute inset-0 transition-opacity duration-700 bg-gradient-to-br from-heritage-green/8 via-heritage-light/30 to-heritage-green/5 rounded-3xl opacity-60" />

      <div className="relative z-10">
        {/* Header */}
        <div className="px-6 py-5 border-b bg-gradient-to-r from-white via-slate-50/80 to-white border-gray-200/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#82A33D]/10 rounded-xl">
              <svg className="w-6 h-6 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V7a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">Top Paid Employees</h3>
              <p className="mt-1 text-xs font-medium text-gray-500 md:text-sm">
                Based on current net pay for this period
              </p>
            </div>
          </div>
        </div>

        {/* Chart + Metrics */}
        <div className="px-4 pt-4 pb-6 w-full">
          <div className="h-[240px] w-full">
            <RResponsiveContainer width="100%" height="100%">
              <RBarChart
                data={topEmployees}
                layout="vertical"
                margin={{ top: 10, right: 40, left: 80, bottom: 10 }}
              >
                <RCartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <RXAxis type="number" tickFormatter={(v: number) => formatCurrency(v).replace('PHP', '₱')} />
                <RYAxis
                  type="category"
                  dataKey="name"
                  width={120}
                  tick={{ fill: '#374151', fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value as number)}
                  labelFormatter={(label: string) => `Employee: ${label}`}
                  contentStyle={{ borderRadius: 12, borderColor: '#D1D5DB' }}
                />
                <RBar
                  dataKey="netPay"
                  radius={[4, 4, 4, 4]}
                  fill="#82A33D"
                />
              </RBarChart>
            </RResponsiveContainer>
          </div>

          {metrics && (
            <div className="grid grid-cols-1 gap-3 mt-4 text-sm text-gray-700 md:grid-cols-3">
              <div className="p-3 bg-white/80 border border-gray-100 rounded-xl shadow-sm">
                <div className="text-xs font-medium text-gray-500">Total Net Pay (Top {topEmployees.length})</div>
                <div className="mt-1 text-lg font-bold text-[#82A33D]">
                  {formatCurrency(metrics.totalTop)}
                </div>
              </div>
              <div className="p-3 bg-white/80 border border-gray-100 rounded-xl shadow-sm">
                <div className="text-xs font-medium text-gray-500">Average Net Pay (Top {topEmployees.length})</div>
                <div className="mt-1 text-lg font-bold text-[#82A33D]">
                  {formatCurrency(metrics.averageTop)}
                </div>
              </div>
              <div className="p-3 bg-white/80 border border-gray-100 rounded-xl shadow-sm">
                <div className="text-xs font-medium text-gray-500">Top Earner</div>
                <div className="mt-1 text-sm font-semibold text-gray-900 truncate">
                  {metrics.topName}
                </div>
                <div className="text-xs font-medium text-[#82A33D]">
                  {formatCurrency(metrics.topNet)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayrollInsights;
