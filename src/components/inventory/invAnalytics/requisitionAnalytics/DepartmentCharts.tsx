import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import {
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  AreaChart,
  Area
} from 'recharts';

const DepartmentCharts: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Last 30 Days');

  // Updated data structure for Recharts
  const departmentData = [
    { month: 'Jan', housekeeping: 45, frontoffice: 28, fnb: 35, maintenance: 22, security: 15 },
    { month: 'Feb', housekeeping: 52, frontoffice: 32, fnb: 41, maintenance: 28, security: 18 },
    { month: 'Mar', housekeeping: 38, frontoffice: 25, fnb: 29, maintenance: 19, security: 12 },
    { month: 'Apr', housekeeping: 61, frontoffice: 38, fnb: 47, maintenance: 31, security: 21 },
    { month: 'May', housekeeping: 47, frontoffice: 29, fnb: 36, maintenance: 24, security: 16 },
    { month: 'Jun', housekeeping: 55, frontoffice: 34, fnb: 42, maintenance: 28, security: 19 },
    { month: 'Jul', housekeeping: 49, frontoffice: 31, fnb: 38, maintenance: 25, security: 17 },
    { month: 'Aug', housekeeping: 53, frontoffice: 33, fnb: 40, maintenance: 27, security: 18 },
    { month: 'Sep', housekeeping: 41, frontoffice: 26, fnb: 32, maintenance: 21, security: 14 },
    { month: 'Oct', housekeeping: 58, frontoffice: 36, fnb: 44, maintenance: 29, security: 20 },
    { month: 'Nov', housekeeping: 46, frontoffice: 28, fnb: 35, maintenance: 23, security: 16 },
    { month: 'Dec', housekeeping: 51, frontoffice: 32, fnb: 39, maintenance: 26, security: 18 }
  ];

  // Department performance data
  const departmentPerformance = [
    { name: 'Housekeeping', requests: 156, avgTime: '2.1h', approval: 94, color: 'bg-blue-500' },
    { name: 'Front Office', requests: 89, avgTime: '1.8h', approval: 97, color: 'bg-green-500' },
    { name: 'Food & Beverage', requests: 134, avgTime: '2.5h', approval: 91, color: 'bg-orange-500' },
    { name: 'Maintenance', requests: 78, avgTime: '3.2h', approval: 88, color: 'bg-red-500' },
    { name: 'Security', requests: 45, avgTime: '1.5h', approval: 98, color: 'bg-purple-500' }
  ];

  // Custom tooltip component
  interface TooltipPayload {
    color: string;
    dataKey: string;
    value: number;
  }

  interface CustomTooltipProps {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-4 min-w-[200px]">
          <p className="mb-2 font-medium text-gray-900">{label}</p>
          {payload.map((entry: TooltipPayload, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 mb-1">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600 capitalize">{entry.dataKey}</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {entry.value} requests
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full space-y-8">
      {/* Beautiful Header Section for Chart - Matching AnalyticsChartWorking */}
      <div className="overflow-hidden border shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60">
        {/* Header */}
        <div className="px-8 py-6 border-b bg-gradient-to-r from-slate-50 to-white border-gray-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="flex items-center justify-center w-10 h-10 shadow-xl bg-gradient-to-br from-heritage-green to-emerald-600 rounded-2xl">
                  <TrendingUp className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-heritage-green to-emerald-400 rounded-2xl blur opacity-30"></div>
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900">Department Request Trends</h3>
                <p className="text-sm font-medium text-gray-500">
                  Monthly request volume by department
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

        {/* Chart Content Section */}
        <div className="p-8">
          {/* Chart Container */}
          <div className="w-full h-80">
            {/* @ts-expect-error - Recharts typing issue */}
            <ResponsiveContainer width="100%" height="100%">
              {/* @ts-expect-error - Recharts typing issue */}
              <AreaChart 
                data={departmentData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="housekeepingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="frontofficeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="fnbGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="maintenanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="securityGradient" x1="0" y1="0" x2="0" y2="1">
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
                
                {/* Department Areas */}
                {/* @ts-expect-error - Recharts typing issue */}
                <Area
                  type="monotone"
                  dataKey="housekeeping"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fill="url(#housekeepingGradient)"
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: '#ffffff' }}
                />
                {/* @ts-expect-error - Recharts typing issue */}
                <Area
                  type="monotone"
                  dataKey="frontoffice"
                  stroke="#10B981"
                  strokeWidth={3}
                  fill="url(#frontofficeGradient)"
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2, fill: '#ffffff' }}
                />
                {/* @ts-expect-error - Recharts typing issue */}
                <Area
                  type="monotone"
                  dataKey="fnb"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  fill="url(#fnbGradient)"
                  dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#F59E0B', strokeWidth: 2, fill: '#ffffff' }}
                />
                {/* @ts-expect-error - Recharts typing issue */}
                <Area
                  type="monotone"
                  dataKey="maintenance"
                  stroke="#EF4444"
                  strokeWidth={3}
                  fill="url(#maintenanceGradient)"
                  dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#EF4444', strokeWidth: 2, fill: '#ffffff' }}
                />
                {/* @ts-expect-error - Recharts typing issue */}
                <Area
                  type="monotone"
                  dataKey="security"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  fill="url(#securityGradient)"
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
              <span className="text-sm font-medium text-gray-700">Housekeeping</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Front Office</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Food & Beverage</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Maintenance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Security</span>
            </div>
          </div>
        </div>
      </div>

      {/* Department Performance Table - No Header (using shared header above) */}
      <div className="mt-8 overflow-hidden border shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60">
        {/* Performance Table Content */}
        <div className="p-8">
          {/* Section Title */}
          <div className="mb-6">
            <h4 className="mb-2 text-lg font-bold text-gray-900">Department Performance Metrics</h4>
            <p className="text-sm text-gray-600">Detailed performance breakdown by department</p>
          </div>
          
          <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl">
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-6 px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="text-xs font-bold tracking-wider text-gray-600 uppercase">Department</div>
              <div className="text-xs font-bold tracking-wider text-gray-600 uppercase">Total Requests</div>
              <div className="text-xs font-bold tracking-wider text-gray-600 uppercase">Avg Response</div>
              <div className="text-xs font-bold tracking-wider text-gray-600 uppercase">Approval Rate</div>
              <div className="text-xs font-bold tracking-wider text-gray-600 uppercase">Performance</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-100">
              {departmentPerformance.map((dept, index) => (
                <div key={index} className="grid grid-cols-5 gap-6 px-6 py-6 transition-all duration-200 hover:bg-gradient-to-r hover:from-heritage-green/5 hover:to-emerald-50/30 group">
                  {/* Department */}
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${dept.color.replace('bg-', 'bg-')} shadow-sm group-hover:scale-110 transition-transform duration-200`}></div>
                    <span className="font-semibold text-gray-900 transition-colors duration-200 group-hover:text-heritage-green">{dept.name}</span>
                  </div>

                  {/* Requests */}
                  <div className="flex items-center">
                    <div className="text-center">
                      <span className="text-lg font-bold text-gray-900">{dept.requests}</span>
                      <p className="text-xs text-gray-500">requests</p>
                    </div>
                  </div>

                  {/* Avg Response Time */}
                  <div className="flex items-center">
                    <div className="text-center">
                      <span className="text-lg font-bold text-gray-900">{dept.avgTime}</span>
                      <p className="text-xs text-gray-500">average</p>
                    </div>
                  </div>

                  {/* Approval Rate */}
                  <div className="flex items-center">
                    <div className="text-center">
                      <span className="text-lg font-bold text-emerald-600">{dept.approval}%</span>
                      <p className="text-xs text-gray-500">approved</p>
                    </div>
                  </div>

                  {/* Performance Bar */}
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 h-3 overflow-hidden bg-gray-200 rounded-full shadow-inner">
                      <div 
                        className={`h-3 rounded-full ${dept.color} transition-all duration-500 ease-out shadow-sm`}
                        style={{ width: `${dept.approval}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-gray-700 min-w-[3rem] bg-gray-100 px-2 py-1 rounded-md">{dept.approval}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentCharts;
