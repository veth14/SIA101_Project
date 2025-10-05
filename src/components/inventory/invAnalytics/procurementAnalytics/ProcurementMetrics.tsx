import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  trend: string;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, trend, color }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">{title}</h3>
        <span className={`text-xs px-2 py-1 rounded-md font-medium ${color}`}>
          {trend}
        </span>
      </div>
      <div className="mb-2">
        <div className="text-2xl font-bold text-gray-900">
          {value}
        </div>
        <div className="text-sm text-gray-500">{subtitle}</div>
      </div>
    </div>
  );
};

const ProcurementMetrics: React.FC = () => {
  const metrics = [
    {
      title: 'Total Orders',
      value: '347',
      subtitle: 'This month',
      trend: '+8%',
      color: 'text-green-600 bg-green-50'
    },
    {
      title: 'Total Value',
      value: '₱3.1M',
      subtitle: 'Total procurement',
      trend: '+12%',
      color: 'text-green-600 bg-green-50'
    },
    {
      title: 'Active Suppliers',
      value: '14',
      subtitle: 'Verified suppliers',
      trend: '+3',
      color: 'text-blue-600 bg-blue-50'
    },
    {
      title: 'On-Time Delivery',
      value: '94.2%',
      subtitle: 'Average performance',
      trend: '+2%',
      color: 'text-green-600 bg-green-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
};

export default ProcurementMetrics;
