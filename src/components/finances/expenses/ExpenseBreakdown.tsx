import { useState, useEffect } from 'react';

interface ExpenseCategory {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export const ExpenseBreakdown = () => {
  const [expenseData, setExpenseData] = useState<ExpenseCategory[]>([]);

  useEffect(() => {
    // TODO: Fetch from Firestore
    // For now, using dummy data
    const rawData = [
      { name: 'Salaries & Wages', value: 25000, color: '#82A33D' },
      { name: 'Utilities', value: 8000, color: '#ABAD8A' },
      { name: 'Maintenance', value: 12000, color: '#60A5FA' },
      { name: 'Supplies', value: 6000, color: '#F59E0B' },
      { name: 'Marketing', value: 3000, color: '#EF4444' },
      { name: 'Miscellaneous', value: 1000, color: '#8B5CF6' },
    ];

    const total = rawData.reduce((sum, item) => sum + item.value, 0);
    const dataWithPercentages = rawData.map(item => ({
      ...item,
      percentage: Math.round((item.value / total) * 100),
    }));

    setExpenseData(dataWithPercentages);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const totalExpenses = expenseData.reduce((sum, item) => sum + item.value, 0);

  // Calculate cumulative percentages for SVG donut chart
  let cumulativePercentage = 0;
  const chartData = expenseData.map(item => {
    const startAngle = cumulativePercentage * 3.6; // Convert percentage to degrees
    cumulativePercentage += item.percentage;
    const endAngle = cumulativePercentage * 3.6;
    return {
      ...item,
      startAngle,
      endAngle,
    };
  });

  // SVG path generator for donut segments
  const createPath = (startAngle: number, endAngle: number, innerRadius: number, outerRadius: number) => {
    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);
    
    const x1 = 100 + outerRadius * Math.cos(startAngleRad);
    const y1 = 100 + outerRadius * Math.sin(startAngleRad);
    const x2 = 100 + outerRadius * Math.cos(endAngleRad);
    const y2 = 100 + outerRadius * Math.sin(endAngleRad);
    
    const x3 = 100 + innerRadius * Math.cos(endAngleRad);
    const y3 = 100 + innerRadius * Math.sin(endAngleRad);
    const x4 = 100 + innerRadius * Math.cos(startAngleRad);
    const y4 = 100 + innerRadius * Math.sin(startAngleRad);
    
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900">Expense Breakdown</h3>
        <p className="text-sm text-gray-500">Distribution by category</p>
      </div>

      {/* Custom SVG Donut Chart */}
      <div className="relative h-56 mb-4 flex items-center justify-center">
        <svg width="200" height="200" className="transform -rotate-90">
          {chartData.map((item, index) => (
            <g key={index}>
              <path
                d={createPath(item.startAngle, item.endAngle, 50, 85)}
                fill={item.color}
                className="hover:opacity-80 transition-opacity cursor-pointer"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
              >
                <title>{`${item.name}: ${formatCurrency(item.value)} (${item.percentage}%)`}</title>
              </path>
            </g>
          ))}
        </svg>
        
        {/* Center Total */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(totalExpenses)}</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {expenseData.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-xs font-medium text-gray-600">{item.name}</span>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-gray-900">{formatCurrency(item.value)}</p>
              <p className="text-xs text-gray-500">{item.percentage}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
