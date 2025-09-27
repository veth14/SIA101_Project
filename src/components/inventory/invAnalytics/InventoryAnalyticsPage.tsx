import React, { useState, useEffect } from 'react';
import InventoryAnalyticsHeader from './InventoryAnalyticsHeader';

interface AnalyticsData {
  totalValue: number;
  monthlyConsumption: number;
  stockTurnover: number;
  costSavings: number;
  topCategories: CategoryData[];
  consumptionTrends: ConsumptionTrend[];
  supplierPerformance: SupplierPerformance[];
  departmentUsage: DepartmentUsage[];
}

interface CategoryData {
  name: string;
  value: number;
  percentage: number;
  items: number;
}

interface ConsumptionTrend {
  month: string;
  consumption: number;
  budget: number;
}

interface SupplierPerformance {
  name: string;
  orders: number;
  onTimeDelivery: number;
  qualityRating: number;
  totalValue: number;
}

interface DepartmentUsage {
  department: string;
  consumption: number;
  budget: number;
  efficiency: number;
}

export default function InventoryAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedPeriod]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const data: AnalyticsData = {
      totalValue: 3250000,
      monthlyConsumption: 485000,
      stockTurnover: 4.2,
      costSavings: 125000,
      topCategories: [
        { name: 'Housekeeping', value: 1250000, percentage: 38.5, items: 45 },
        { name: 'Food & Beverage', value: 890000, percentage: 27.4, items: 78 },
        { name: 'Maintenance', value: 650000, percentage: 20.0, items: 32 },
        { name: 'Office Supplies', value: 280000, percentage: 8.6, items: 28 },
        { name: 'Cleaning', value: 180000, percentage: 5.5, items: 15 }
      ],
      consumptionTrends: [
        { month: 'Jan', consumption: 420000, budget: 500000 },
        { month: 'Feb', consumption: 380000, budget: 500000 },
        { month: 'Mar', consumption: 450000, budget: 500000 },
        { month: 'Apr', consumption: 485000, budget: 500000 },
        { month: 'May', consumption: 520000, budget: 500000 },
        { month: 'Jun', consumption: 465000, budget: 500000 }
      ],
      supplierPerformance: [
        { name: 'Hotel Linens Supply Co.', orders: 45, onTimeDelivery: 96, qualityRating: 4.8, totalValue: 2250000 },
        { name: 'Fresh Food Distributors', orders: 78, onTimeDelivery: 92, qualityRating: 4.6, totalValue: 1890000 },
        { name: 'Maintenance Tools Inc.', orders: 32, onTimeDelivery: 88, qualityRating: 4.4, totalValue: 850000 },
        { name: 'Office Supplies Plus', orders: 28, onTimeDelivery: 94, qualityRating: 4.2, totalValue: 420000 }
      ],
      departmentUsage: [
        { department: 'Housekeeping', consumption: 185000, budget: 200000, efficiency: 92.5 },
        { department: 'Food & Beverage', consumption: 142000, budget: 150000, efficiency: 94.7 },
        { department: 'Maintenance', consumption: 98000, budget: 100000, efficiency: 98.0 },
        { department: 'Front Office', consumption: 35000, budget: 50000, efficiency: 70.0 },
        { department: 'Security', consumption: 25000, budget: 30000, efficiency: 83.3 }
      ]
    };

    setAnalyticsData(data);
    setLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600';
    if (efficiency >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return 'bg-green-100 text-green-800';
    if (rating >= 4.0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="min-h-screen bg-heritage-light">
      {/* Light Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 rounded-full blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl animate-pulse delay-1000 opacity-25"></div>
        <div className="absolute bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 rounded-full blur-3xl animate-pulse delay-2000 opacity-20"></div>
        
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(134, 134, 134, 0.1) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full">
        {/* Header */}
        <InventoryAnalyticsHeader />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Inventory Value</p>
              <p className="text-2xl font-bold text-blue-900">{formatCurrency(analyticsData.totalValue)}</p>
              <p className="text-xs text-blue-600 mt-1">+8.5% from last month</p>
            </div>
            <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-heritage-green/10 to-heritage-green/20 p-6 rounded-xl border border-heritage-green/30 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-heritage-green text-sm font-medium">Monthly Consumption</p>
              <p className="text-2xl font-bold text-heritage-green">{formatCurrency(analyticsData.monthlyConsumption)}</p>
              <p className="text-xs text-heritage-green mt-1">-3.2% from last month</p>
            </div>
            <div className="w-12 h-12 bg-heritage-green/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Stock Turnover</p>
              <p className="text-2xl font-bold text-purple-900">{analyticsData.stockTurnover}x</p>
              <p className="text-xs text-purple-600 mt-1">+0.3x from last month</p>
            </div>
            <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Cost Savings</p>
              <p className="text-2xl font-bold text-green-900">{formatCurrency(analyticsData.costSavings)}</p>
              <p className="text-xs text-green-600 mt-1">+12.8% from last month</p>
            </div>
            <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Categories by Value</h2>
          <div className="space-y-4">
            {analyticsData.topCategories.map((category, index) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-heritage-green/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-heritage-green">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-500">{category.items} items</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(category.value)}</p>
                  <p className="text-sm text-gray-500">{category.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Consumption Trends */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Consumption vs Budget</h2>
          <div className="space-y-4">
            {analyticsData.consumptionTrends.map((trend) => (
              <div key={trend.month} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{trend.month}</span>
                  <span className="text-sm text-gray-600">
                    {formatCurrency(trend.consumption)} / {formatCurrency(trend.budget)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      trend.consumption > trend.budget ? 'bg-red-500' : 'bg-heritage-green'
                    }`}
                    style={{ width: `${Math.min((trend.consumption / trend.budget) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supplier Performance */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Supplier Performance</h2>
          <div className="space-y-4">
            {analyticsData.supplierPerformance.map((supplier) => (
              <div key={supplier.name} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{supplier.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPerformanceColor(supplier.qualityRating)}`}>
                    {supplier.qualityRating}/5
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Orders</p>
                    <p className="font-medium">{supplier.orders}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">On-time</p>
                    <p className="font-medium">{supplier.onTimeDelivery}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total Value</p>
                    <p className="font-medium">{formatCurrency(supplier.totalValue)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Usage */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Department Efficiency</h2>
          <div className="space-y-4">
            {analyticsData.departmentUsage.map((dept) => (
              <div key={dept.department} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-900">{dept.department}</h3>
                  <span className={`font-semibold ${getEfficiencyColor(dept.efficiency)}`}>
                    {dept.efficiency}%
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{formatCurrency(dept.consumption)}</span>
                  <span>{formatCurrency(dept.budget)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      dept.efficiency >= 90 ? 'bg-green-500' :
                      dept.efficiency >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(dept.efficiency, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
