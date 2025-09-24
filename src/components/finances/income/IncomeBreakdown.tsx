import { useState, useEffect } from 'react';

interface IncomeSource {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export const IncomeBreakdown = () => {
  const [incomeData, setIncomeData] = useState<IncomeSource[]>([]);

  useEffect(() => {
    // TODO: Fetch from Firestore
    // For now, using dummy data
    const data = [
      { name: 'Rooms', value: 150000, color: '#82A33D' },
      { name: 'Events', value: 45000, color: '#ABAD8A' },
      { name: 'Dining', value: 30000, color: '#3B82F6' },
      { name: 'Others', value: 15000, color: '#F59E0B' },
    ];

    const total = data.reduce((sum, item) => sum + item.value, 0);
    const dataWithPercentages = data.map(item => ({
      ...item,
      percentage: Math.round((item.value / total) * 100),
    }));

    setIncomeData(dataWithPercentages);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const totalIncome = incomeData.reduce((sum, item) => sum + item.value, 0);

  // Calculate angles for donut chart
  const chartData = incomeData.map((item, index) => {
    const previousItems = incomeData.slice(0, index);
    const startAngle = previousItems.reduce((sum, prevItem) => sum + (prevItem.percentage * 3.6), 0);
    const endAngle = startAngle + (item.percentage * 3.6);
    
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
    <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100 h-full flex flex-col">
      <div className="mb-3">
        <h3 className="text-lg font-bold text-[#82A33D]">Income Sources</h3>
        <p className="text-sm text-gray-500">Revenue breakdown by category</p>
      </div>

      {/* Custom SVG Donut Chart */}
      <div className="relative flex-1 flex items-center justify-center mb-3">
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
            <p className="text-sm font-medium text-gray-500 mb-1">Total</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(totalIncome)}</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {incomeData.map((item, index) => (
          <div key={index} className="flex items-center justify-between py-1.5 px-2 hover:bg-gray-50 rounded-lg transition-colors">
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
