import React from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AnalyticsChart from "../invAnalytics/AnalyticsChartWorking";

const departmentData = [
  { department: 'Housekeeping', usage: 300 },
  { department: 'F&B', usage: 250 },
  { department: 'Front Desk', usage: 100 },
  { department: 'Maintenance', usage: 150 },
  { department: 'Kitchen', usage: 400 }
];

export const DashboardCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6">
      {/* Inventory Analytics - live chart using AnalyticsChart design */}
      <AnalyticsChart />

      {/* Department Usage Analysis */}
      <Card className="relative overflow-hidden shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border-white/60 animate-fade-in group">
        {/* Background Elements */}
        <div className="absolute inset-0 transition-opacity duration-700 bg-gradient-to-br from-heritage-green/8 via-heritage-light/30 to-heritage-green/5 rounded-3xl opacity-60 group-hover:opacity-100"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-heritage-green/15 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-100/20 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000"></div>
        
        <CardHeader className="relative pb-4 border-b border-gray-200/60 bg-gradient-to-r from-white via-slate-50/80 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5">
              <div className="relative group">
                <div className="p-2 bg-[#82A33D]/10 rounded-xl">
                  <svg className="w-5 h-5 text-[#82A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm6 0v-4a2 2 0 00-2-2h-2" />
                  </svg>
                </div>
                <div className="absolute transition-opacity duration-300 -inset-2 bg-gradient-to-r from-heritage-green/20 to-heritage-neutral/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-100"></div>
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text">
                  Department Usage Analysis
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs font-semibold text-gray-600">Inventory consumption by department</p>
                  <div className="w-1 h-1 rounded-full bg-heritage-green"></div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="relative px-8 py-6 flex flex-col justify-between">
          {/* Enhanced Horizontal Bar Chart */}
          <div>
            <div className="space-y-3">
              {departmentData.map((dept, index) => {
                const maxUsage = Math.max(...departmentData.map(d => d.usage));
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
          <div className="mt-4 pt-3 border-t border-gray-100">
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