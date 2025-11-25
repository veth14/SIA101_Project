// Revenue Analytics Logic and Data Processing

interface RevenueDataPoint {
  day: string;
  revenue: number;
}

interface ChartMetrics {
  totalRevenue: number;
  averageRevenue: number;
  maxRevenue: number;
  maxDay: string;
  projectedRevenue: number;
  growthRate: number;
}

// Generate sample revenue data based on timeframe
export const getRevenueData = (timeframe: 'weekly' | 'monthly' | 'yearly'): RevenueDataPoint[] => {
  if (timeframe === 'weekly') {
    return [
      { day: 'Mon', revenue: 12800 },
      { day: 'Tue', revenue: 11200 },
      { day: 'Wed', revenue: 13500 },
      { day: 'Thu', revenue: 14100 },
      { day: 'Fri', revenue: 15400 },
      { day: 'Sat', revenue: 13900 },
      { day: 'Sun', revenue: 10900 }
    ];
  } else if (timeframe === 'monthly') {
    return [
      { day: 'Week 1', revenue: 48200 },
      { day: 'Week 2', revenue: 52100 },
      { day: 'Week 3', revenue: 49800 },
      { day: 'Week 4', revenue: 54300 }
    ];
  } else {
    return [
      { day: 'Jan', revenue: 185000 },
      { day: 'Feb', revenue: 192000 },
      { day: 'Mar', revenue: 201000 },
      { day: 'Apr', revenue: 198000 },
      { day: 'May', revenue: 215000 },
      { day: 'Jun', revenue: 223000 },
      { day: 'Jul', revenue: 235000 },
      { day: 'Aug', revenue: 228000 },
      { day: 'Sep', revenue: 240000 },
      { day: 'Oct', revenue: 245000 },
      { day: 'Nov', revenue: 238000 },
      { day: 'Dec', revenue: 252000 }
    ];
  }
};

// Calculate metrics from revenue data
export const calculateChartMetrics = (data: RevenueDataPoint[] | undefined): ChartMetrics => {
  if (!data || data.length === 0) {
    return {
      totalRevenue: 0,
      averageRevenue: 0,
      maxRevenue: 0,
      maxDay: '',
      projectedRevenue: 0,
      growthRate: 0,
    };
  }

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const averageRevenue = Math.round(totalRevenue / data.length);

  const maxEntry = data.reduce((max, item) => (item.revenue > max.revenue ? item : max), data[0]);
  const maxRevenue = maxEntry.revenue;
  const maxDay = maxEntry.day;
  
  // Simple projection: add 8% to total
  const projectedRevenue = Math.round(totalRevenue * 1.08);
  
  // Calculate growth rate (comparing last vs first)
  const growthRate = data.length > 1 
    ? Math.round(((data[data.length - 1].revenue - data[0].revenue) / data[0].revenue) * 100)
    : 0;
  
  return {
    totalRevenue,
    averageRevenue,
    maxRevenue,
    maxDay,
    projectedRevenue,
    growthRate
  };
};

// Format currency for display
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Format currency in short form (K, M)
export const formatShortCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `₱${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `₱${(value / 1000).toFixed(0)}K`;
  }
  return `₱${value}`;
};
