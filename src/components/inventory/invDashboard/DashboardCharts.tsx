import React, { useEffect, useState } from 'react';
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import useGetInvDashboard from '../../../api/getInvDashboard';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { setChartData } from 'recharts/types/state/chartDataSlice';


const chartConfig = {
  consumption: {
    label: "Consumption",
    color: "#82A33D",
  },
} satisfies ChartConfig;


export const DashboardCharts: React.FC = () => {
  const [departmentData,setDepartmentData] = useState<any>([]);
  const [chartData,setChartData] = useState<any>([]);

  const {
    getInvDashboardChart,
    loadingForGetInvDashboardChart,
  } = useGetInvDashboard();

  useEffect(() => {
    const useGetInvDashboardChartFunc = async () => {
      const response = await getInvDashboardChart();
      console.log(response);
      if (!response.data) {
        alert(response.message);
        return;
      }

      setDepartmentData(response.data.departmentData);
      setChartData(response.data.chartData);
    };
    useGetInvDashboardChartFunc();
  }, []);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6">
      {/* Inventory Consumption Trends - Shadcn Card */}
      <Card className="relative bg-white/90 backdrop-blur-xl shadow-2xl border-white/30 hover:shadow-3xl hover:-translate-y-2 transition-all duration-700 group overflow-hidden">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/8 via-emerald-50/30 to-heritage-green/5 rounded-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-heritage-green/15 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-100/20 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000"></div>
        
        <CardHeader className="relative pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-heritage-green drop-shadow-sm">Inventory Consumption Trends</CardTitle>
              <CardDescription className="text-xs text-gray-600 font-medium">January - June 2024</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative pt-0">
          <div className="h-48 sm:h-56">
            <ChartContainer config={chartConfig}>
              {React.createElement(LineChart as any, {
                data: chartData,
                margin: {
                  left: 8,
                  right: 8,
                  top: 8,
                  bottom: 8,
                },
              }, [
              React.createElement(CartesianGrid as any, { key: "grid", vertical: false }),
              React.createElement(XAxis as any, {
                key: "xaxis",
                dataKey: "month",
                tickLine: false,
                axisLine: false,
                tickMargin: 8,
                tick: { fontSize: 11, fill: '#6b7280' },
                tickFormatter: (value: string) => value.slice(0, 3)
              }),
              React.createElement("YAxis" as any, {
                key: "yaxis",
                tickLine: false,
                axisLine: false,
                tick: { fontSize: 10, fill: '#6b7280' },
                tickFormatter: (value: number) => `${(value / 1000).toFixed(1)}k`
              }),
              React.createElement(ChartTooltip as any, {
                key: "tooltip",
                cursor: false,
                content: React.createElement(ChartTooltipContent as any, { hideLabel: true })
              }),
              React.createElement(Line as any, {
                key: "line",
                dataKey: "consumption",
                type: "natural",
                stroke: "var(--color-consumption)",
                strokeWidth: 2,
                dot: {
                  fill: "var(--color-consumption)",
                },
                activeDot: {
                  r: 6,
                }
              })
            ])}
            </ChartContainer>
          </div>
          {/* Chart Legend */}
          <div className="flex items-center justify-center mt-2 pb-2">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-3 h-0.5 bg-[#82A33D] rounded"></div>
              <span>Monthly Consumption (Units)</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="relative flex-col items-start gap-1 text-sm pt-2">
          <div className="flex gap-2 leading-none font-medium text-heritage-green text-xs">
            Trending up by 40% this period <TrendingUp className="h-3 w-3" />
          </div>
          <div className="text-xs text-gray-500 leading-none">
            Peak consumption: 2.8k units in June • Average: 2.3k units/month
          </div>
        </CardFooter>
      </Card>

      {/* Department Usage Analysis */}
      <Card className="relative bg-white/90 backdrop-blur-xl shadow-2xl border-white/30 hover:shadow-3xl hover:-translate-y-2 transition-all duration-700 group overflow-hidden">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-blue-50/30 to-heritage-green/5 rounded-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-100/15 to-transparent rounded-full -translate-y-1/2 -translate-x-1/2 animate-pulse delay-500"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-heritage-green/10 to-transparent rounded-full translate-y-1/2 translate-x-1/2 animate-pulse delay-1500"></div>
        
        <CardHeader className="relative pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-heritage-green drop-shadow-sm">Department Usage Analysis</CardTitle>
              <CardDescription className="text-xs text-gray-600 font-medium">Inventory consumption by department</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="relative pt-0">
          <div className="h-48 sm:h-56">
            {/* Enhanced Horizontal Bar Chart */}
            <div className="space-y-3 h-full flex flex-col justify-center">
              {departmentData && departmentData.length > 0 && departmentData.map((dept: any, index: number) => {
                const maxUsage = Math.max(...departmentData.map((d: any) => d.usage));
                const percentage = (dept.usage / maxUsage) * 100;
                return (
                  <div key={index} className="flex items-center space-x-3 group">
                    <div className="w-20 text-xs font-semibold text-gray-700 text-right">
                      {dept.department}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden shadow-inner">
                      <div 
                        className="bg-gradient-to-r from-[#82A33D] to-[#6d8a33] h-6 rounded-full flex items-center justify-end pr-3 transition-all duration-1500 ease-out shadow-lg group-hover:shadow-xl"
                        style={{ 
                          width: `${percentage}%`,
                          transform: 'translateX(0)'
                        }}
                      >
                        <span className="text-white text-xs font-bold drop-shadow-sm">
                          {dept.usage}
                        </span>
                      </div>
                    </div>
                    <div className="w-10 text-xs text-gray-500 font-medium">
                      {Math.round(percentage)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Bar Chart Legend and Insights */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-2 bg-gradient-to-r from-[#82A33D] to-[#6d8a33] rounded"></div>
                <span>Usage by Department</span>
              </div>
              <span className="font-medium">Total: 1,200 units</span>
            </div>
            <div className="text-xs text-gray-500 leading-relaxed">
              <strong>Highest:</strong> Kitchen (400 units, 33%) • <strong>Lowest:</strong> Front Desk (100 units, 8%)
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
