export interface DataPoint {
  day: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface ChartCalculations {
  maxValue: number;
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  averageRevenue: number;
  growthRate: number;
  profitMargin: number;
  maxRevenue: number;
  maxDay: string;
  projectedRevenue: number;
}

// Sample data generators for different timeframes
export const getDailyRevenueData = (): DataPoint[] => {
  return [
    { day: 'Monday', revenue: 12500, expenses: 7200, profit: 5300 },
    { day: 'Tuesday', revenue: 14300, expenses: 8800, profit: 5500 },
    { day: 'Wednesday', revenue: 11800, expenses: 7900, profit: 3900 },
    { day: 'Thursday', revenue: 16200, expenses: 9100, profit: 7100 },
    { day: 'Friday', revenue: 18400, expenses: 10200, profit: 8200 },
    { day: 'Saturday', revenue: 15600, expenses: 9500, profit: 6100 },
    { day: 'Sunday', revenue: 13200, expenses: 8300, profit: 4900 }
  ];
};

export const getWeeklyRevenueData = (): DataPoint[] => {
  return [
    { day: 'Week 1', revenue: 85800, expenses: 51200, profit: 34600 },
    { day: 'Week 2', revenue: 92300, expenses: 55800, profit: 36500 },
    { day: 'Week 3', revenue: 88900, expenses: 53900, profit: 35000 },
    { day: 'Week 4', revenue: 95200, expenses: 57100, profit: 38100 }
  ];
};

export const getMonthlyRevenueData = (): DataPoint[] => {
  return [
    { day: 'Jan', revenue: 342000, expenses: 205200, profit: 136800 },
    { day: 'Feb', revenue: 368000, expenses: 220800, profit: 147200 },
    { day: 'Mar', revenue: 355000, expenses: 213000, profit: 142000 },
    { day: 'Apr', revenue: 380000, expenses: 228000, profit: 152000 },
    { day: 'May', revenue: 395000, expenses: 237000, profit: 158000 },
    { day: 'Jun', revenue: 412000, expenses: 247200, profit: 164800 },
    { day: 'Jul', revenue: 425000, expenses: 255000, profit: 170000 },
    { day: 'Aug', revenue: 418000, expenses: 250800, profit: 167200 },
    { day: 'Sep', revenue: 402000, expenses: 241200, profit: 160800 },
    { day: 'Oct', revenue: 388000, expenses: 232800, profit: 155200 },
    { day: 'Nov', revenue: 375000, expenses: 225000, profit: 150000 },
    { day: 'Dec', revenue: 445000, expenses: 267000, profit: 178000 }
  ];
};

export const getYearlyRevenueData = (): DataPoint[] => {
  return [
    { day: '2020', revenue: 3200000, expenses: 1920000, profit: 1280000 },
    { day: '2021', revenue: 3850000, expenses: 2310000, profit: 1540000 },
    { day: '2022', revenue: 4200000, expenses: 2520000, profit: 1680000 },
    { day: '2023', revenue: 4650000, expenses: 2790000, profit: 1860000 },
    { day: '2024', revenue: 4920000, expenses: 2952000, profit: 1968000 }
  ];
};

export const getRevenueData = (timeframe: 'weekly' | 'monthly' | 'yearly'): DataPoint[] => {
  switch (timeframe) {
    case 'weekly':
      return getDailyRevenueData(); // Show daily data for weekly view
    case 'monthly':
      return getMonthlyRevenueData();
    case 'yearly':
      return getYearlyRevenueData();
    default:
      return getDailyRevenueData();
  }
};

export const calculateChartMetrics = (data: DataPoint[]): ChartCalculations => {
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0);
  const totalProfit = data.reduce((sum, item) => sum + item.profit, 0);
  
  const maxValue = Math.max(...data.flatMap(d => [d.revenue, d.expenses]));
  const averageRevenue = totalRevenue / data.length;
  
  // Calculate growth percentage (comparing first and last period)
  const firstPeriodRevenue = data[0]?.revenue || 0;
  const lastPeriodRevenue = data[data.length - 1]?.revenue || 0;
  const growthRate = firstPeriodRevenue > 0 ? 
    ((lastPeriodRevenue - firstPeriodRevenue) / firstPeriodRevenue) * 100 : 0;
  
  // Find best performing period
  const bestPeriod = data.reduce((best, current) => 
    current.revenue > best.revenue ? current : best, data[0] || { day: '', revenue: 0 }
  );
  
  // Calculate profit margin
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  
  // Calculate projected revenue (simple trend projection)
  const projectedRevenue = totalRevenue * 1.08; // 8% growth projection
  
  return {
    maxValue,
    totalRevenue,
    totalExpenses,
    totalProfit,
    averageRevenue,
    growthRate,
    profitMargin,
    maxRevenue: bestPeriod.revenue,
    maxDay: bestPeriod.day,
    projectedRevenue
  };
};

export const generateChartCoordinates = (
  data: DataPoint[],
  maxValue: number,
  viewBoxWidth: number = 400,
  viewBoxHeight: number = 280
) => {
  const chartWidth = viewBoxWidth - 80; // Account for padding
  const chartHeight = viewBoxHeight - 60; // Account for padding
  const startX = 40;
  const baseY = viewBoxHeight - 40;
  return data.map((item, index) => {
    const x = startX + (index * (chartWidth / (data.length - 1)));
    const revenueY = baseY - (item.revenue / maxValue) * chartHeight;
    const expenseY = baseY - (item.expenses / maxValue) * chartHeight;
    
    return {
      day: item.day,
      x,
      revenueY,
      expenseY,
      revenue: item.revenue,
      expenses: item.expenses,
      profit: item.profit
    };
  });
};
export const generateSVGPath = (coordinates: Array<{x: number; y: number}>, closePath: boolean = false): string => {
  if (coordinates.length === 0) return '';
  
  const pathData = coordinates.map((coord, index) => 
    index === 0 ? `M ${coord.x},${coord.y}` : `L ${coord.x},${coord.y}`
  ).join(' ');
  
  if (closePath && coordinates.length > 0) {
    const lastCoord = coordinates[coordinates.length - 1];
    const firstCoord = coordinates[0];
    return `${pathData} L ${lastCoord.x},240 L ${firstCoord.x},240 Z`;
  }
  
  return pathData;
};

export const formatCurrency = (value: number): string => {
  // Keep for backward compatibility — prefer formatCurrencyPH from utils
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatShortCurrency = (value: number): string => {
  // Simple compact formatting for display in axis ticks
  if (value >= 1000000) return `₱${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `₱${(value / 1000).toFixed(0)}K`;
  return `₱${value.toLocaleString('en-PH')}`;
};