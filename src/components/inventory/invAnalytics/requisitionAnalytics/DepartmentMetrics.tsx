import useGetInvAnalytic from "@/api/getInvAnalytic";
import React, { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react"; // ✅ Import all icons dynamically

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  iconBg: string;
}

const DepartmentMetrics: React.FC = () => {
  const { getInvDepartmentMetrics, loadingForGetInvDepartmentMetrics } =
    useGetInvAnalytic();

  const [statCards, setStatCards] = useState<StatCard[]>([]);

  useEffect(() => {
    const useGetInvAnalyticFunc = async () => {
      const response = await getInvDepartmentMetrics();
      if (!response.success) {
        alert("Failed to fetch department metrics");
        return;
      }

      // ✅ Convert icon strings (e.g. "Building") to actual Lucide components
      const formattedData = response.data.map((item: any) => {
        const IconComponent =
          (LucideIcons as any)[item.icon] || LucideIcons.HelpCircle; // fallback icon
        return {
          ...item,
          icon: <IconComponent className="w-6 h-6 text-heritage-green" />,
        };
      });

      setStatCards(formattedData);
    };

    useGetInvAnalyticFunc();
  }, [getInvDepartmentMetrics]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 hover:shadow-3xl hover:-translate-y-3 hover:scale-105 transition-all duration-700 group overflow-hidden"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-heritage-green/10 via-emerald-50/40 to-heritage-green/5 rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-heritage-green/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-100/30 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000"></div>

          {/* Floating Decorative Elements */}
          <div className="absolute top-4 left-4 w-2 h-2 bg-heritage-green/30 rounded-full animate-ping"></div>
          <div className="absolute bottom-4 right-4 w-1 h-1 bg-emerald-400/40 rounded-full animate-ping delay-500"></div>

          {/* Card Content */}
          <div className="relative flex items-start justify-between">
            <div className="flex-1 mr-4">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-1 h-6 bg-gradient-to-b from-heritage-green to-emerald-600 rounded-full"></div>
                <p className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  {stat.title}
                </p>
              </div>
              <p className="text-4xl font-black text-heritage-green drop-shadow-sm mb-3 group-hover:scale-105 transition-transform duration-500">
                {stat.value}
              </p>
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                  stat.changeType === "positive"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : stat.changeType === "negative"
                    ? "bg-red-100 text-red-800 border border-red-200"
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

            {/* Icon Section */}
            <div className="relative">
              <div
                className={`w-20 h-20 ${stat.iconBg} rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
              >
                {stat.icon}
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-heritage-green/30 to-emerald-400/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-3 h-3 bg-heritage-green rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DepartmentMetrics;
