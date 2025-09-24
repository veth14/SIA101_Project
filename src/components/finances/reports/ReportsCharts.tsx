interface ReportsChartsProps {
  chartData: any[];
}

export const ReportsCharts = ({ chartData }: ReportsChartsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const maxValue = Math.max(...chartData.map(item => item.value || 0));

  // Sample breakdown data for donut chart
  const breakdownData = [
    { name: 'Rooms', value: 180000, color: '#82A33D', percentage: 60 },
    { name: 'Events', value: 60000, color: '#ABAD8A', percentage: 20 },
    { name: 'Dining', value: 45000, color: '#3B82F6', percentage: 15 },
    { name: 'Others', value: 15000, color: '#F59E0B', percentage: 5 },
  ];

  // Calculate angles for donut chart
  const chartDataWithAngles = breakdownData.map((item, index) => {
    const previousItems = breakdownData.slice(0, index);
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

  const totalBreakdown = breakdownData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Line/Bar Chart - Takes 2 columns */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-4 border border-gray-100">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-[#82A33D]">Trend Analysis</h3>
          <p className="text-sm text-gray-500">Performance over time</p>
        </div>
        
        {/* Bar Chart */}
        <div className="h-64 flex items-end justify-between gap-2 px-3 py-4 bg-gradient-to-t from-gray-50 to-white rounded-xl border border-gray-100">
          {chartData.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-1 flex-1">
              <div className="flex items-end h-48">
                <div 
                  className="bg-gradient-to-t from-[#82A33D] to-[#9bb347] rounded-t-lg w-full max-w-8 transition-all duration-500 hover:opacity-80 relative group shadow-sm"
                  style={{ height: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%` }}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {formatCurrency(item.value || 0)}
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-600 font-medium">{item.month || item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Donut Chart - Takes 1 column */}
      <div className="lg:col-span-1 bg-white rounded-2xl shadow-md p-4 border border-gray-100">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-[#82A33D]">Revenue Breakdown</h3>
          <p className="text-sm text-gray-500">By category</p>
        </div>

        {/* Custom SVG Donut Chart */}
        <div className="relative h-48 flex items-center justify-center mb-3">
          <svg width="180" height="180" className="transform -rotate-90">
            {chartDataWithAngles.map((item, index) => (
              <g key={index}>
                <path
                  d={createPath(item.startAngle, item.endAngle, 45, 75)}
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
              <p className="text-lg font-bold text-gray-900">{formatCurrency(totalBreakdown)}</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2">
          {breakdownData.map((item, index) => (
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
    </div>
  );
};
