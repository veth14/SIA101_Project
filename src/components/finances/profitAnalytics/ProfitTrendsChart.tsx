import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrencyPH, formatShortCurrencyPH } from '../../../lib/utils';

// Workaround: Recharts JSX types sometimes conflict with the project's React typings.
// Create safe aliases typed as React.ComponentType<any> and use them in JSX to avoid typing issues.
const RResponsiveContainer = ResponsiveContainer as unknown as React.ComponentType<Record<string, unknown>>;
const RAreaChart = AreaChart as unknown as React.ComponentType<Record<string, unknown>>;
const RXAxis = XAxis as unknown as React.ComponentType<Record<string, unknown>>;
const RYAxis = YAxis as unknown as React.ComponentType<Record<string, unknown>>;
const RCartesianGrid = CartesianGrid as unknown as React.ComponentType<Record<string, unknown>>;
const RTooltip = Tooltip as unknown as React.ComponentType<Record<string, unknown>>;
const RArea = Area as unknown as React.ComponentType<Record<string, unknown>>;

// Tooltip payload shape used by Recharts tooltip entries
interface TooltipPayload {
  dataKey: string;
  value: number;
  color?: string;
}

// Sample profit data generator
const getProfitData = (timeframe: 'weekly' | 'monthly' | 'yearly') => {
  const baseData = {
    weekly: [
      { period: 'Monday', revenue: 12500, expenses: 8200, profit: 4300 },
      { period: 'Tuesday', revenue: 11800, expenses: 7900, profit: 3900 },
      { period: 'Wednesday', revenue: 13200, expenses: 8800, profit: 4400 },
      { period: 'Thursday', revenue: 14100, expenses: 9200, profit: 4900 },
      { period: 'Friday', revenue: 15400, expenses: 9800, profit: 5600 },
      { period: 'Saturday', revenue: 16200, expenses: 10200, profit: 6000 },
      { period: 'Sunday', revenue: 14800, expenses: 9500, profit: 5300 }
    ],
    monthly: [
      { period: 'Jan', revenue: 285000, expenses: 195000, profit: 90000 },
      { period: 'Feb', revenue: 298000, expenses: 205000, profit: 93000 },
      { period: 'Mar', revenue: 312000, expenses: 215000, profit: 97000 },
      { period: 'Apr', revenue: 295000, expenses: 200000, profit: 95000 },
      { period: 'May', revenue: 325000, expenses: 225000, profit: 100000 },
      { period: 'Jun', revenue: 340000, expenses: 235000, profit: 105000 },
      { period: 'Jul', revenue: 355000, expenses: 245000, profit: 110000 },
      { period: 'Aug', revenue: 348000, expenses: 240000, profit: 108000 },
      { period: 'Sep', revenue: 332000, expenses: 228000, profit: 104000 },
      { period: 'Oct', revenue: 365000, expenses: 250000, profit: 115000 },
      { period: 'Nov', revenue: 378000, expenses: 258000, profit: 120000 },
      { period: 'Dec', revenue: 395000, expenses: 270000, profit: 125000 }
    ],
    yearly: [
      { period: '2020', revenue: 2800000, expenses: 2100000, profit: 700000 },
      { period: '2021', revenue: 3200000, expenses: 2400000, profit: 800000 },
      { period: '2022', revenue: 3600000, expenses: 2700000, profit: 900000 },
      { period: '2023', revenue: 3900000, expenses: 2850000, profit: 1050000 },
      { period: '2024', revenue: 4200000, expenses: 3000000, profit: 1200000 }
    ]
  };
  return baseData[timeframe];
};

const formatCurrency = formatCurrencyPH;
const formatShortCurrency = formatShortCurrencyPH;

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: { active: boolean; payload: TooltipPayload[]; label: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-4 min-w-[200px]">
        <p className="mb-2 font-medium text-gray-900">{label}</p>
        {payload.map((entry: TooltipPayload, index: number) => (
          <div key={`tooltip-${String(index)}`} className="flex items-center justify-between gap-4 mb-1">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600 capitalize">{entry.dataKey}</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

interface ProfitTrendsChartProps {
  className?: string;
}

const ProfitTrendsChart: React.FC<ProfitTrendsChartProps> = ({ className = "" }) => {
  const [activeTimeframe, setActiveTimeframe] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  
  // Get data and calculate metrics
  const profitData = useMemo(() => getProfitData(activeTimeframe), [activeTimeframe]);
  
  const metrics = useMemo(() => {
    const totalRevenue = profitData.reduce((sum, item) => sum + item.revenue, 0);
    const totalExpenses = profitData.reduce((sum, item) => sum + item.expenses, 0);
    const totalProfit = profitData.reduce((sum, item) => sum + item.profit, 0);
    const averageProfit = totalProfit / profitData.length;
    const maxProfit = Math.max(...profitData.map(item => item.profit));
    const maxProfitPeriod = profitData.find(item => item.profit === maxProfit)?.period || '';
    const profitMargin = (totalProfit / totalRevenue) * 100;
    
    return {
      totalRevenue,
      totalExpenses,
      totalProfit,
      averageProfit,
      maxProfit,
      maxProfitPeriod,
      profitMargin
    };
  }, [profitData]);

  // Render immediately — removed artificial loading/skeleton

  const isProfitable = metrics.totalProfit > 0;

  return (
    <div className={`overflow-hidden relative bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60 shadow-2xl animate-fade-in ${className}`}>
      {/* Background Elements */}
      <div className="absolute inset-0 transition-opacity duration-700 bg-gradient-to-br from-heritage-green/8 via-heritage-light/30 to-heritage-green/5 rounded-3xl opacity-60 group-hover:opacity-100"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="px-8 border-b py-7 bg-gradient-to-r from-white via-slate-50/80 to-white border-gray-200/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5">
              <div className="relative group">
                <div className={`flex items-center justify-center w-12 h-12 shadow-2xl rounded-2xl transition-all duration-300 group-hover:scale-105 ${
                  isProfitable 
                    ? 'bg-gradient-to-br from-heritage-green via-heritage-green to-heritage-neutral' 
                    : 'bg-gradient-to-br from-red-500 via-red-600 to-red-700'
                }`}>
                  {isProfitable ? (
                    <TrendingUp className="w-6 h-6 text-white" strokeWidth={2.5} />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-white" strokeWidth={2.5} />
                  )}
                </div>
                <div className={`absolute -inset-2 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300 ${
                  isProfitable 
                    ? 'bg-gradient-to-r from-heritage-green/20 to-heritage-neutral/20' 
                    : 'bg-gradient-to-r from-red-500/20 to-red-600/20'
                }`}></div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text">
                  Profit Analysis
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm font-semibold text-gray-600">Performance Metrics</p>
                  <div className="w-1 h-1 rounded-full bg-heritage-green"></div>
                  <span className="text-sm font-bold text-heritage-green">October 2025</span>
                </div>
              </div>
            </div>
            
            {/* Toggle Buttons */}
            <div className="flex space-x-4">
              <div className="flex p-1.5 bg-gradient-to-r from-heritage-light/40 to-heritage-light/60 rounded-2xl shadow-inner backdrop-blur-sm border border-heritage-light/30">
                <button 
                  className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                    activeTimeframe === 'weekly' 
                      ? 'text-white bg-gradient-to-r from-heritage-green to-heritage-neutral shadow-lg transform scale-105' 
                      : 'text-gray-700 hover:text-heritage-green hover:bg-white/50'
                  }`}
                  onClick={() => setActiveTimeframe('weekly')}
                >
                  Weekly
                </button>
                <button 
                  className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                    activeTimeframe === 'monthly' 
                      ? 'text-white bg-gradient-to-r from-heritage-green to-heritage-neutral shadow-lg transform scale-105' 
                      : 'text-gray-700 hover:text-heritage-green hover:bg-white/50'
                  }`}
                  onClick={() => setActiveTimeframe('monthly')}
                >
                  Monthly
                </button>
                <button 
                  className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                    activeTimeframe === 'yearly' 
                      ? 'text-white bg-gradient-to-r from-heritage-green to-heritage-neutral shadow-lg transform scale-105' 
                      : 'text-gray-700 hover:text-heritage-green hover:bg-white/50'
                  }`}
                  onClick={() => setActiveTimeframe('yearly')}
                >
                  Yearly
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chart Area */}
        <div className="px-6 py-6">
          <div className="h-[340px] w-full">
            <RResponsiveContainer width="100%" height="100%">
              <RAreaChart
                data={profitData}
                margin={{ top: 20, right: 30, left: 50, bottom: 40 }}
              >
                <defs>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97706" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#FCD34D" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82A33D" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ABAD8A" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <RXAxis 
                  dataKey="period" 
                  tick={{ fill: '#82A33D', fontSize: 11 }}
                  axisLine={{ stroke: '#82A33D', strokeWidth: 1 }}
                  tickLine={false}
                  interval={0}
                  height={60}
                  angle={0}
                  textAnchor="middle"
                />

                <RYAxis 
                  tickFormatter={formatShortCurrency}
                  tick={{ fill: '#82A33D', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                <RCartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false} 
                  stroke="#ABAD8A" 
                />
                <RTooltip content={<CustomTooltip active={false} payload={[]} label="" />} />
                
                {/* Profit Area - Primary (Top Layer) */}
                <RArea 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#82A33D" 
                  fillOpacity={1}
                  fill="url(#colorProfit)" 
                  strokeWidth={3}
                  activeDot={{ 
                    r: 6, 
                    stroke: '#ABAD8A',
                    strokeWidth: 2,
                    fill: 'white'
                  }}
                />
                
                {/* Expenses Area - Secondary Layer */}
                <RArea 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#D97706" 
                  fillOpacity={0.7}
                  fill="url(#colorExpenses)" 
                  strokeWidth={2.5}
                  activeDot={{ 
                    r: 5, 
                    stroke: '#D97706',
                    strokeWidth: 2,
                    fill: 'white'
                  }}
                />
              </RAreaChart>
            </RResponsiveContainer>
          </div>
          
          {/* Chart Legend */}
          <div className="flex items-center justify-center pb-2 mt-2 space-x-6">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-3 h-0.5 bg-heritage-green rounded"></div>
              <span className="font-semibold">Net Profit</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-3 h-0.5 bg-amber-600 rounded"></div>
              <span className="font-semibold">Total Expenses</span>
            </div>
          </div>
        </div>
        
        {/* Stats and Insights Section */}
        <div className="grid grid-cols-1 gap-4 px-8 py-6 sm:grid-cols-2 md:grid-cols-4">
          <div className="p-4 border shadow-sm bg-white/80 rounded-xl border-heritage-light">
            <div className="text-sm font-medium text-gray-500">Total Profit</div>
            <div className={`text-2xl font-bold ${isProfitable ? 'text-heritage-green' : 'text-red-600'}`}>
              {formatCurrency(metrics.totalProfit)}
            </div>
            <div className={`flex gap-1 items-center mt-1 text-xs font-medium ${isProfitable ? 'text-emerald-600' : 'text-red-600'}`}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isProfitable ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"} />
              </svg>
              <span>{metrics.profitMargin.toFixed(1)}% margin</span>
            </div>
          </div>
          
          <div className="p-4 border shadow-sm bg-white/80 rounded-xl border-heritage-light">
            <div className="text-sm font-medium text-gray-500">Average Profit</div>
            <div className="text-2xl font-bold text-heritage-green">
              {formatCurrency(metrics.averageProfit)}
            </div>
            <div className="text-xs text-gray-500">Per {activeTimeframe.slice(0, -2)}</div>
          </div>
          
          <div className="p-4 border shadow-sm bg-white/80 rounded-xl border-heritage-light">
            <div className="text-sm font-medium text-gray-500">Best Period</div>
            <div className="text-2xl font-bold text-heritage-green">
              {formatCurrency(metrics.maxProfit)}
            </div>
            <div className="text-xs text-gray-500">{metrics.maxProfitPeriod}</div>
          </div>
          
          <div className="p-4 border shadow-sm bg-white/80 rounded-xl border-heritage-light">
            <div className="text-sm font-medium text-gray-500">Total Expenses</div>
            <div className="text-2xl font-bold text-amber-600">
              {formatCurrency(metrics.totalExpenses)}
            </div>
            <div className="text-xs text-gray-500">Operating costs</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitTrendsChart;
