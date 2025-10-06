import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const ProcurementCharts: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Last 30 Days');

  // Sample procurement data
  const procurementData = [
    { month: 'Jan', orders: 45, value: 2800, suppliers: 12, onTime: 94 },
    { month: 'Feb', orders: 52, value: 3200, suppliers: 14, onTime: 96 },
    { month: 'Mar', orders: 38, value: 2400, suppliers: 11, onTime: 89 },
    { month: 'Apr', orders: 61, value: 3800, suppliers: 16, onTime: 92 },
    { month: 'May', orders: 47, value: 2900, suppliers: 13, onTime: 97 },
    { month: 'Jun', orders: 55, value: 3400, suppliers: 15, onTime: 91 },
    { month: 'Jul', orders: 49, value: 3100, suppliers: 14, onTime: 95 },
    { month: 'Aug', orders: 53, value: 3300, suppliers: 15, onTime: 93 },
    { month: 'Sep', orders: 41, value: 2600, suppliers: 12, onTime: 96 },
    { month: 'Oct', orders: 58, value: 3600, suppliers: 16, onTime: 94 },
    { month: 'Nov', orders: 46, value: 2800, suppliers: 13, onTime: 92 },
    { month: 'Dec', orders: 51, value: 3200, suppliers: 14, onTime: 95 }
  ];

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{
      color: string;
      dataKey: string;
      value: number;
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 border shadow-2xl bg-white/95 backdrop-blur-sm rounded-xl border-gray-200/60">
          <p className="mb-2 text-sm font-bold text-gray-900">{label}</p>
          {payload.map((entry: {
            color: string;
            dataKey: string;
            value: number;
          }, index: number) => (
            <div key={index} className="flex items-center mb-1 space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <p className="text-sm font-medium text-gray-700">
                {entry.dataKey === 'orders' && `Orders: ${entry.value}`}
                {entry.dataKey === 'value' && `Value: ₱${entry.value}K`}
                {entry.dataKey === 'suppliers' && `Suppliers: ${entry.value}`}
                {entry.dataKey === 'onTime' && `On-time: ${entry.value}%`}
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="overflow-hidden border shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60">
      {/* Beautiful Header Section - Similar to AnalyticsChart */}
      <div className="px-8 py-6 border-b bg-gradient-to-r from-slate-50 to-white border-gray-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="flex items-center justify-center w-10 h-10 shadow-xl bg-gradient-to-br from-heritage-green to-emerald-600 rounded-2xl">
                <ShoppingCart className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-heritage-green to-emerald-400 rounded-2xl blur opacity-30"></div>
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">Procurement Analytics</h3>
              <p className="text-sm font-medium text-gray-500">
                Purchase orders & supplier performance trends
                {selectedPeriod !== 'All Time' && <span className="ml-2 text-heritage-green">• Period: {selectedPeriod}</span>}
              </p>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-6 py-3 border border-white/40 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-heritage-green/50 focus:border-heritage-green/50 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300 cursor-pointer hover:bg-white/90 min-w-[160px]"
              >
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Last 3 Months">Last 3 Months</option>
                <option value="Last 6 Months">Last 6 Months</option>
                <option value="Last Year">Last Year</option>
                <option value="All Time">All Time</option>
              </select>
            </div>
            <button className="inline-flex items-center px-6 py-3 font-semibold text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-heritage-green to-emerald-600 rounded-xl hover:from-heritage-green/90 hover:to-emerald-600/90 hover:shadow-xl hover:scale-105">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export
            </button>
          </div>
        </div>
      </div>
      
      {/* Charts Content Section */}
      <div className="p-8">
        {/* Chart Container */}
        <div className="w-full h-80">
          {/* @ts-expect-error - Recharts typing issue */}
          <ResponsiveContainer width="100%" height="100%">
            {/* @ts-expect-error - Recharts typing issue */}
            <AreaChart
              data={procurementData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <defs>
                <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="suppliersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="onTimeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              
              {/* @ts-expect-error - Recharts typing issue */}
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                dy={10}
              />
              
              {/* @ts-expect-error - Recharts typing issue */}
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                dx={-10}
              />
              
              {/* @ts-expect-error - Recharts typing issue */}
              <Tooltip content={CustomTooltip} />
              
              {/* @ts-expect-error - Recharts typing issue */}
              <Area
                type="monotone"
                dataKey="orders"
                stroke="#3B82F6"
                strokeWidth={3}
                fill="url(#ordersGradient)"
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: '#ffffff' }}
              />
              
              {/* @ts-expect-error - Recharts typing issue */}
              <Area
                type="monotone"
                dataKey="value"
                stroke="#10B981"
                strokeWidth={3}
                fill="url(#valueGradient)"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2, fill: '#ffffff' }}
              />
              
              {/* @ts-expect-error - Recharts typing issue */}
              <Area
                type="monotone"
                dataKey="suppliers"
                stroke="#F59E0B"
                strokeWidth={3}
                fill="url(#suppliersGradient)"
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#F59E0B', strokeWidth: 2, fill: '#ffffff' }}
              />
              
              {/* @ts-expect-error - Recharts typing issue */}
              <Area
                type="monotone"
                dataKey="onTime"
                stroke="#8B5CF6"
                strokeWidth={3}
                fill="url(#onTimeGradient)"
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2, fill: '#ffffff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Legend */}
        <div className="flex flex-wrap justify-center gap-6 pt-6 mt-6 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">Purchase Orders</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">Order Value (₱K)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-sm font-medium text-gray-700">Active Suppliers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">On-time Delivery (%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcurementCharts;
