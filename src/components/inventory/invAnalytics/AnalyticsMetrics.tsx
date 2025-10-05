import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  percentage: number;
  color: string;
  trend: string;
  isWastage?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, percentage, color, trend, isWastage }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{title}</h3>
        <span className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-3 py-1.5 rounded-full font-semibold shadow-sm">
          {trend}
        </span>
      </div>
      <div className="mb-6">
        <div className={`text-4xl font-black bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
          {value}
        </div>
        <div className="text-sm text-gray-500 mt-1">{subtitle}</div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          className={`bg-gradient-to-r ${color.replace('text-transparent', '')} h-3 rounded-full transition-all duration-1000 ease-out shadow-sm`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const AnalyticsMetrics: React.FC = () => {
  const metrics = [
    {
      title: 'Stock Turnover Rate',
      value: '8.5x',
      subtitle: 'Excellent performance',
      percentage: 85,
      color: 'from-heritage-green to-green-600',
      trend: '+12%'
    },
    {
      title: 'Wastage Rate',
      value: '2.1%',
      subtitle: 'Within acceptable range',
      percentage: 21,
      color: 'from-yellow-500 to-orange-500',
      trend: '+2%',
      isWastage: true
    },
    {
      title: 'Usage Trends',
      value: '₱164K',
      subtitle: 'Monthly consumption',
      percentage: 75,
      color: 'from-blue-500 to-indigo-600',
      trend: '+12%'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
};

export default AnalyticsMetrics;
