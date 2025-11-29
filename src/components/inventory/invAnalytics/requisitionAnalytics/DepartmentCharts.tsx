import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  AreaChart,
  Area,
} from "recharts";
import useGetInvAnalytic from "@/api/getInvAnalytic";
import { exportDepartmentToPDF } from "@/utils/exportUtils";

// Interface for monthly department data (matches Controller output)
export interface DepartmentMonthlyData {
  month: string;
  housekeeping: number;
  frontoffice: number;
  fnb: number;
  maintenance: number;
  security: number;
}

// Interface for overall department performance metrics
export interface DepartmentPerformance {
  name: string;
  requests: number;
  avgTime: string;
  approval: number;
  color: string;
}

const DepartmentCharts: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Last 30 Days");
  const [departmentData, setDepartmentData] = useState<DepartmentMonthlyData[]>([]);
  const [departmentPerformance, setDepartmentPerformance] = useState<DepartmentPerformance[]>([]);
  
  const { getInvDepartmentCharts, loadingForGetInvDepartmentCharts } = useGetInvAnalytic();

  useEffect(() => {
    const useGetInvAnalyticFunc = async () => {
      const response = await getInvDepartmentCharts();

      if (!response.success) {
        // You might want to remove alert() in production and use a toast instead
        console.error(response.message);
        return;
      }

      // Backend sends [monthlyData, performanceData]
      if (response.data && Array.isArray(response.data)) {
        setDepartmentData(response.data[0]);
        setDepartmentPerformance(response.data[1]);
      }
    };
    useGetInvAnalyticFunc();
  }, []);

  const handleExport = () => {
    if (!departmentData || departmentData.length === 0) {
      alert("No data available to export");
      return;
    }

    // 1. Prepare monthly data with nice headers
    const monthlyData = departmentData.map((item: any) => ({
      Month: item.month,
      "Housekeeping": item.housekeeping || 0,
      "Front Office": item.frontoffice || 0,
      "Food & Beverage": item.fnb || 0,
      "Maintenance": item.maintenance || 0,
      "Security": item.security || 0,
      "Total": (item.housekeeping || 0) + (item.frontoffice || 0) + 
               (item.fnb || 0) + (item.maintenance || 0) + (item.security || 0)
    }));

    // 2. Calculate Totals (Fixing syntax for keys with spaces)
    const totals = {
      Month: "TOTAL",
      "Housekeeping": monthlyData.reduce((sum, item) => sum + item["Housekeeping"], 0),
      "Front Office": monthlyData.reduce((sum, item) => sum + item["Front Office"], 0),
      "Food & Beverage": monthlyData.reduce((sum, item) => sum + item["Food & Beverage"], 0),
      "Maintenance": monthlyData.reduce((sum, item) => sum + item["Maintenance"], 0),
      "Security": monthlyData.reduce((sum, item) => sum + item["Security"], 0),
      "Total": monthlyData.reduce((sum, item) => sum + item["Total"], 0)
    };

    monthlyData.push(totals);

    exportDepartmentToPDF(
      monthlyData,
      departmentPerformance,
      `department_request_trends_${selectedPeriod.toLowerCase().replace(/\s+/g, '_')}`,
      `Department Request Trends - ${selectedPeriod}`
    );
  };

  // --- TOOLTIP CONFIGURATION ---
  
  // Use 'any[]' to strictly avoid Recharts "readonly" type errors
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-4 min-w-[200px]">
          <p className="mb-2 font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 mb-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600 capitalize">
                  {/* Handle specialized names for display */}
                  {entry.dataKey === "fnb" ? "Food & Beverage" : 
                   entry.dataKey === "frontoffice" ? "Front Office" : 
                   entry.dataKey}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {entry.value} requests
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full space-y-8">
      {/* Chart Section */}
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
                  {selectedPeriod !== "All Time" && (
                    <span className="ml-2 text-heritage-green">• Period: {selectedPeriod}</span>
                  )}
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
              <button 
                onClick={handleExport}
                disabled={loadingForGetInvDepartmentCharts || !departmentData || departmentData.length === 0}
                className="inline-flex items-center px-6 py-3 font-semibold text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-heritage-green to-emerald-600 rounded-xl hover:from-heritage-green/90 hover:to-emerald-600/90 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {loadingForGetInvDepartmentCharts ? "Loading..." : "Export"}
              </button>
            </div>
          </div>
        </div>

        {/* Chart Content */}
        <div className="p-8">
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={departmentData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <defs>
                  {/* Defined Gradients for each department */}
                  <linearGradient id="housekeepingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="frontofficeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="fnbGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="maintenanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="securityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} dx={-10} />
                {/* Areas mapped to dataKeys from Controller */}
                <Area type="monotone" dataKey="housekeeping" stroke="#3B82F6" strokeWidth={3} fill="url(#housekeepingGradient)" dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }} activeDot={{ r: 6, stroke: "#3B82F6", strokeWidth: 2, fill: "#ffffff" }} />
                <Area type="monotone" dataKey="frontoffice" stroke="#10B981" strokeWidth={3} fill="url(#frontofficeGradient)" dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }} activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2, fill: "#ffffff" }} />
                <Area type="monotone" dataKey="fnb" stroke="#F59E0B" strokeWidth={3} fill="url(#fnbGradient)" dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }} activeDot={{ r: 6, stroke: "#F59E0B", strokeWidth: 2, fill: "#ffffff" }} />
                <Area type="monotone" dataKey="maintenance" stroke="#EF4444" strokeWidth={3} fill="url(#maintenanceGradient)" dot={{ fill: "#EF4444", strokeWidth: 2, r: 4 }} activeDot={{ r: 6, stroke: "#EF4444", strokeWidth: 2, fill: "#ffffff" }} />
                <Area type="monotone" dataKey="security" stroke="#8B5CF6" strokeWidth={3} fill="url(#securityGradient)" dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }} activeDot={{ r: 6, stroke: "#8B5CF6", strokeWidth: 2, fill: "#ffffff" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Chart Legend */}
          <div className="flex flex-wrap justify-center gap-6 pt-6 mt-6 border-t border-gray-100">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div><span className="text-sm font-medium text-gray-700">Housekeeping</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full"></div><span className="text-sm font-medium text-gray-700">Front Office</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500 rounded-full"></div><span className="text-sm font-medium text-gray-700">Food & Beverage</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full"></div><span className="text-sm font-medium text-gray-700">Maintenance</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-500 rounded-full"></div><span className="text-sm font-medium text-gray-700">Security</span></div>
          </div>
        </div>
      </div>

      {/* Department Performance Table */}
      <div className="mt-8 overflow-hidden border shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60">
        <div className="p-8">
          <div className="mb-6">
            <h4 className="mb-2 text-lg font-bold text-gray-900">Department Performance Metrics</h4>
            <p className="text-sm text-gray-600">Detailed performance breakdown by department</p>
          </div>

          <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl">
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-6 px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
              {["Department", "Total Requests", "Avg Response", "Approval Rate", "Performance"].map((h) => (
                <div key={h} className="text-xs font-bold tracking-wider text-gray-600 uppercase">{h}</div>
              ))}
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-100">
              {departmentPerformance.map((dept, index) => (
                <div key={index} className="grid grid-cols-5 gap-6 px-6 py-6 transition-all duration-200 hover:bg-gradient-to-r hover:from-heritage-green/5 hover:to-emerald-50/30 group">
                  
                  {/* Department Name */}
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${dept.color} shadow-sm group-hover:scale-110 transition-transform duration-200`}></div>
                    <span className="font-semibold text-gray-900 transition-colors duration-200 group-hover:text-heritage-green">{dept.name}</span>
                  </div>

                  {/* Requests */}
                  <div className="flex items-center"><div className="text-center"><span className="text-lg font-bold text-gray-900">{dept.requests}</span><p className="text-xs text-gray-500">requests</p></div></div>

                  {/* Avg Time */}
                  <div className="flex items-center"><div className="text-center"><span className="text-lg font-bold text-gray-900">{dept.avgTime}</span><p className="text-xs text-gray-500">average</p></div></div>

                  {/* Approval Rate */}
                  <div className="flex items-center"><div className="text-center"><span className="text-lg font-bold text-emerald-600">{dept.approval}%</span><p className="text-xs text-gray-500">approved</p></div></div>

                  {/* Performance Bar */}
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 h-3 overflow-hidden bg-gray-200 rounded-full shadow-inner">
                      <div className={`h-3 rounded-full ${dept.color} transition-all duration-500 ease-out shadow-sm`} style={{ width: `${dept.approval}%` }}></div>
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