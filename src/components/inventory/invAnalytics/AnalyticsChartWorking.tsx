import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  Package,
  Utensils,
  Sparkles,
  LucideIcon,
} from "lucide-react";
import {
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  XAxis,
  YAxis,
} from "recharts";
import useGetInvAnalytic from "@/api/getInvAnalytic";
import { exportToPDF } from "@/utils/exportUtils";

// Recharts JSX typing aliases (avoid strict JSX return types)
const RResponsiveContainer =
  ResponsiveContainer as unknown as React.ComponentType<
    Record<string, unknown>
  >;
const RAreaChart = AreaChart as unknown as React.ComponentType<
  Record<string, unknown>
>;
const RXAxis = XAxis as unknown as React.ComponentType<Record<string, unknown>>;
const RYAxis = YAxis as unknown as React.ComponentType<Record<string, unknown>>;
const RCartesianGrid = CartesianGrid as unknown as React.ComponentType<
  Record<string, unknown>
>;
const RTooltip = Tooltip as unknown as React.ComponentType<
  Record<string, unknown>
>;
const RArea = Area as unknown as React.ComponentType<Record<string, unknown>>;

// Sample data for inventory analytics
// const chartData = [
//   { month: "Jan", linens: 2400, cleaning: 1400, food: 2400, maintenance: 800 },
//   { month: "Feb", linens: 1398, cleaning: 2210, food: 2290, maintenance: 1200 },
//   { month: "Mar", linens: 2800, cleaning: 2290, food: 2000, maintenance: 1500 },
//   { month: "Apr", linens: 3908, cleaning: 2000, food: 2181, maintenance: 900 },
//   { month: "May", linens: 4800, cleaning: 2181, food: 2500, maintenance: 1100 },
//   { month: "Jun", linens: 3800, cleaning: 2500, food: 2100, maintenance: 1300 },
//   { month: "Jul", linens: 4300, cleaning: 2100, food: 2800, maintenance: 1000 },
//   { month: "Aug", linens: 4100, cleaning: 2350, food: 2650, maintenance: 1150 },
//   { month: "Sep", linens: 3600, cleaning: 2400, food: 2300, maintenance: 1250 },
//   { month: "Oct", linens: 3200, cleaning: 2150, food: 2450, maintenance: 950 },
//   { month: "Nov", linens: 2900, cleaning: 1950, food: 2200, maintenance: 1050 },
//   { month: "Dec", linens: 3500, cleaning: 2300, food: 2600, maintenance: 1200 },
// ];

// Summary statistics for inventory
// const summaryStats = [
//   {
//     title: "Total Items",
//     value: "38,247",
//     change: "+12.5%",
//     changeType: "positive" as const,
//     icon: Package,
//     iconBg: "bg-blue-100",
//   },
//   {
//     title: "Categories",
//     value: "4",
//     change: "Active",
//     changeType: "neutral" as const,
//     icon: Sparkles,
//     iconBg: "bg-emerald-100",
//   },
//   {
//     title: "Peak Usage",
//     value: "4.8K",
//     change: "May",
//     changeType: "neutral" as const,
//     icon: TrendingUp,
//     iconBg: "bg-violet-100",
//   },
//   {
//     title: "Avg. Monthly",
//     value: "2.9K",
//     change: "+8.2%",
//     changeType: "positive" as const,
//     icon: Utensils,
//     iconBg: "bg-amber-100",
//   },
// ];

interface SummaryStat {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: string; // string from backend
  iconBg: string;
}

const iconMap: Record<string, LucideIcon> = {
  TrendingUp,
  Package,
  Utensils,
  Sparkles,
};

// Custom tooltip component with proper typing
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
          <div
            key={`tooltip-${index}`}
            className="flex items-center justify-between gap-4 mb-1"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600 capitalize">
                {entry.dataKey}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {entry.value.toLocaleString()} units
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function AnalyticsChart(): React.ReactElement {
  const [selectedPeriod, setSelectedPeriod] = useState("Last 30 Days");
  const [summaryStats, setSummaryStats] = useState<SummaryStat[]>([]);
  const [chartData, setChartData] = useState([]);

  const { getInvAnalyticsChart, loadingForGetInvAnalyticsChart } =
    useGetInvAnalytic();

  useEffect(() => {
    const useGetInvAnalyticFunc = async () => {
      const response = await getInvAnalyticsChart();

      if (!response.success) {
        alert(response.message);
        return;
      }

      setSummaryStats(response.data[0]);
      setChartData(response.data[1]);
    };

    useGetInvAnalyticFunc();
  }, []);

  const handleExport = () => {
    if (!chartData || chartData.length === 0) {
      alert("No data available to export");
      return;
    }

    // Prepare export data with formatted values
    const exportData = chartData.map((item: any) => ({
      Month: item.month,
      "Linens & Textiles": item.linens || 0,
      "Cleaning Supplies": item.cleaning || 0,
      "Food & Beverage": item.food || 0,
      Maintenance: item.maintenance || 0,
      Total:
        (item.linens || 0) +
        (item.cleaning || 0) +
        (item.food || 0) +
        (item.maintenance || 0),
    }));

    // Add summary row
    const totals = {
      Month: "TOTAL",
      "Linens & Textiles": exportData.reduce(
        (sum, item) => sum + item["Linens & Textiles"],
        0
      ),
      "Cleaning Supplies": exportData.reduce(
        (sum, item) => sum + item["Cleaning Supplies"],
        0
      ),
      "Food & Beverage": exportData.reduce(
        (sum, item) => sum + item["Food & Beverage"],
        0
      ),
      Maintenance: exportData.reduce(
        (sum, item) => sum + item["Maintenance"],
        0
      ),
      Total: exportData.reduce((sum, item) => sum + item.Total, 0),
    };

    exportData.push(totals);

    // Export to PDF with title
    exportToPDF(
      exportData,
      `inventory_usage_trends_${selectedPeriod
        .toLowerCase()
        .replace(/\s+/g, "_")}`,
      `Inventory Usage Trends - ${selectedPeriod}`
    );
  };

  return (
    <div className="w-full space-y-8">
      {/* Simple Metrics Display */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        {summaryStats.map((stat, index) => {
          const Icon = iconMap[stat.icon] || TrendingUp;
          return (
            <div
              key={index}
              className="relative p-8 overflow-hidden transition-all duration-700 border shadow-2xl bg-white/90 backdrop-blur-xl rounded-3xl border-white/30 hover:shadow-3xl hover:-translate-y-3 hover:scale-105 group"
            >
              {/* Enhanced Background Effects */}
              <div className="absolute inset-0 transition-opacity duration-700 opacity-50 bg-gradient-to-br from-heritage-green/10 via-emerald-50/40 to-heritage-green/5 rounded-3xl group-hover:opacity-100"></div>
              <div className="absolute top-0 right-0 w-32 h-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-bl from-heritage-green/20 to-transparent animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 delay-1000 -translate-x-1/2 translate-y-1/2 rounded-full bg-gradient-to-tr from-emerald-100/30 to-transparent animate-pulse"></div>

              {/* Floating Decorative Elements */}
              <div className="absolute w-2 h-2 rounded-full top-4 left-4 bg-heritage-green/30 animate-ping"></div>
              <div className="absolute w-1 h-1 delay-500 rounded-full bottom-4 right-4 bg-emerald-400/40 animate-ping"></div>

              <div className="relative flex items-start justify-between">
                <div className="flex-1 mr-4">
                  <div className="flex items-center mb-3 space-x-2">
                    <div className="w-1 h-6 rounded-full bg-gradient-to-b from-heritage-green to-emerald-600"></div>
                    <p className="text-sm font-bold tracking-wider text-gray-700 uppercase">
                      {stat.title}
                    </p>
                  </div>
                  <p className="mb-3 text-4xl font-black transition-transform duration-500 text-heritage-green drop-shadow-sm group-hover:scale-105">
                    {stat.value}
                  </p>
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      stat.changeType === "positive"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-gray-100 text-gray-800 border border-gray-200"
                    }`}
                  >
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 17l9.2-9.2M17 17V7H7"
                      />
                    </svg>
                    {stat.change}
                  </div>
                </div>
                <div className="relative">
                  <div
                    className={`w-20 h-20 ${stat.iconBg} rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                  >
                    <Icon className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="absolute transition-opacity duration-500 opacity-0 -inset-2 bg-gradient-to-r from-heritage-green/30 to-emerald-400/30 rounded-2xl blur-lg group-hover:opacity-60"></div>
                  <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-heritage-green animate-pulse"></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Beautiful Header Section for Chart - Similar to ProcurementGrid */}
      <div className="overflow-hidden border shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60">
        {/* Header */}
        <div className="px-8 py-6 border-b bg-gradient-to-r from-slate-50 to-white border-gray-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="flex items-center justify-center w-10 h-10 shadow-xl bg-gradient-to-br from-heritage-green to-emerald-600 rounded-2xl">
                  <TrendingUp
                    className="w-5 h-5 text-white"
                    strokeWidth={2.5}
                  />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-heritage-green to-emerald-400 rounded-2xl blur opacity-30"></div>
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900">
                  Inventory Usage Trends
                </h3>
                <p className="text-sm font-medium text-gray-500">
                  Monthly consumption patterns across categories
                  {selectedPeriod !== "All Time" && (
                    <span className="ml-2 text-heritage-green">
                      • Period: {selectedPeriod}
                    </span>
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
                disabled={
                  loadingForGetInvAnalyticsChart ||
                  !chartData ||
                  chartData.length === 0
                }
                className="inline-flex items-center px-6 py-3 font-semibold text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-heritage-green to-emerald-600 rounded-xl hover:from-heritage-green/90 hover:to-emerald-600/90 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {loadingForGetInvAnalyticsChart ? "Loading..." : "Export"}
              </button>
            </div>
          </div>
        </div>

        {/* Chart Content Section */}
        <div className="p-8">
          {/* Chart Container */}
          <div className="w-full h-80">
            <RResponsiveContainer width="100%" height="100%">
              <RAreaChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <defs>
                  <linearGradient
                    id="linensGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient
                    id="cleaningGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="foodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient
                    id="maintenanceGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <RCartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />

                <RXAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  dy={10}
                />

                <RYAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  dx={-10}
                />

                <RTooltip content={<CustomTooltip />} />

                <RArea
                  type="monotone"
                  dataKey="linens"
                  stroke="#10B981"
                  strokeWidth={3}
                  fill="url(#linensGradient)"
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                  activeDot={{
                    r: 6,
                    stroke: "#10B981",
                    strokeWidth: 2,
                    fill: "#ffffff",
                  }}
                />

                <RArea
                  type="monotone"
                  dataKey="cleaning"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fill="url(#cleaningGradient)"
                  dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                  activeDot={{
                    r: 6,
                    stroke: "#3B82F6",
                    strokeWidth: 2,
                    fill: "#ffffff",
                  }}
                />

                <RArea
                  type="monotone"
                  dataKey="food"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  fill="url(#foodGradient)"
                  dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }}
                  activeDot={{
                    r: 6,
                    stroke: "#F59E0B",
                    strokeWidth: 2,
                    fill: "#ffffff",
                  }}
                />

                <RArea
                  type="monotone"
                  dataKey="maintenance"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  fill="url(#maintenanceGradient)"
                  dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                  activeDot={{
                    r: 6,
                    stroke: "#8B5CF6",
                    strokeWidth: 2,
                    fill: "#ffffff",
                  }}
                />
              </RAreaChart>
            </RResponsiveContainer>
          </div>

          {/* Chart Legend */}
          <div className="flex flex-wrap justify-center gap-6 pt-6 mt-6 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-medium text-gray-700">
                Linens & Textiles
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">
                Cleaning Supplies
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-sm font-medium text-gray-700">
                Food & Beverage
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-violet-500"></div>
              <span className="text-sm font-medium text-gray-700">
                Maintenance
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsChart;
