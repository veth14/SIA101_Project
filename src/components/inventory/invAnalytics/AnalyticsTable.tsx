import React from 'react';
import { AnalyticsReportData } from './analyticsColumns';

const sampleData: AnalyticsReportData[] = [
  {
    id: '1',
    item: 'Bath Towels',
    category: 'Linens & Textiles',
    department: 'Housekeeping',
    consumed: 150,
    procured: 200,
    variance: 50,
    turnoverRate: 85.5,
    value: 45000,
    lastUpdated: '2024-01-20T10:30:00Z'
  },
  {
    id: '2',
    item: 'Coffee Beans',
    category: 'Food & Beverage',
    department: 'F&B',
    consumed: 80,
    procured: 75,
    variance: -5,
    turnoverRate: 92.3,
    value: 28000,
    lastUpdated: '2024-01-19T14:20:00Z'
  },
  {
    id: '3',
    item: 'Cleaning Spray',
    category: 'Cleaning Supplies',
    department: 'Maintenance',
    consumed: 120,
    procured: 100,
    variance: -20,
    turnoverRate: 78.1,
    value: 15000,
    lastUpdated: '2024-01-18T09:15:00Z'
  },
  {
    id: '4',
    item: 'Printer Paper',
    category: 'Office Supplies',
    department: 'Front Office',
    consumed: 50,
    procured: 60,
    variance: 10,
    turnoverRate: 65.4,
    value: 8500,
    lastUpdated: '2024-01-17T16:45:00Z'
  },
  {
    id: '5',
    item: 'LED Bulbs',
    category: 'Electrical',
    department: 'Maintenance',
    consumed: 30,
    procured: 40,
    variance: 10,
    turnoverRate: 71.2,
    value: 12000,
    lastUpdated: '2024-01-16T11:30:00Z'
  }
];

export const AnalyticsTable: React.FC = () => {
  const getTurnoverColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getVarianceColor = (variance: number) => {
    return variance >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Analytics Report</h3>
        <p className="text-sm text-gray-500 mt-1">Detailed inventory performance analysis</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Item</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Department</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Consumed</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Procured</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Variance</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Turnover Rate</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Value</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {sampleData.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <div>
                    <div className="font-medium text-gray-900">{item.item}</div>
                    <div className="text-sm text-gray-500">{item.category}</div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {item.department}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm font-medium text-gray-900">
                    {item.consumed.toLocaleString()}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm font-medium text-gray-900">
                    {item.procured.toLocaleString()}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className={`text-sm font-medium ${getVarianceColor(item.variance)}`}>
                    {item.variance >= 0 ? '+' : ''}{item.variance.toLocaleString()}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className={`text-sm font-medium ${getTurnoverColor(item.turnoverRate)}`}>
                    {item.turnoverRate.toFixed(1)}%
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm font-medium text-gray-900">
                    ₱{item.value.toLocaleString()}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm text-gray-500">
                    {new Date(item.lastUpdated).toLocaleDateString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-heritage-green">
              {sampleData.reduce((sum, item) => sum + item.consumed, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Consumed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {sampleData.reduce((sum, item) => sum + item.procured, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Procured</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {(sampleData.reduce((sum, item) => sum + item.turnoverRate, 0) / sampleData.length).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Avg Turnover</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              ₱{sampleData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Value</div>
          </div>
        </div>
      </div>
      
      {sampleData.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No analytics data available for the selected filters.</p>
        </div>
      )}
    </div>
  );
};
