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

const DepartmentMetrics: React.FC = () => {
  const metrics = [
    {
      title: 'Total Departments',
      value: '8',
      subtitle: 'Active departments',
      trend: '+1',
      color: 'text-blue-600 bg-blue-50'
    },
    {
      title: 'Total Requests',
      value: '156',
      subtitle: 'This month',
      trend: '+18%',
      color: 'text-green-600 bg-green-50'
    },
    {
      title: 'Avg Response Time',
      value: '2.4h',
      subtitle: 'Request processing',
      trend: '-15%',
      color: 'text-green-600 bg-green-50'
    },
    {
      title: 'Approval Rate',
      value: '92.3%',
      subtitle: 'Request approvals',
      trend: '+3%',
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

export default DepartmentMetrics;
