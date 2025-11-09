import useGetInvAnalytic from "@/api/getInvAnalytic";
import React, { useEffect, useState } from "react";
interface TopMovingItem {
  name: string;
  department: string;
  units: string;
  trend: string;
  trendColor?: string;
  color: string;
  border: string;
}

interface CriticalStock {
  name: string;
  department: string;
  status: string;
  statusColor: string;
  textColor: string;
  emoji: string;
  color: string;
  border: string;
}

interface WastageItem {
  name: string;
  department: string;
  amount: string;
  percentage: string;
  color: string;
  border: string;
  textColor: string;
}

interface TopMovingItemsProps {
  topMovingItems: TopMovingItem[];
}
interface CriticalStockProps {
  criticalStocks: CriticalStock[];
}
interface WastageItemsProps {
  wastageItems: WastageItem[];
}
const TopMovingItems: React.FC<TopMovingItemsProps> = ({ topMovingItems }) => {
  return (
    <div className="bg-gradient-to-br from-white via-white to-heritage-green/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/60 hover:shadow-3xl hover:-translate-y-2 transition-all duration-700 group">
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-heritage-green/20 via-green-400/30 to-emerald-500/20 rounded-2xl flex items-center justify-center mr-5 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500">
          <div className="text-3xl animate-pulse">📈</div>
        </div>
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-heritage-green to-emerald-600 bg-clip-text text-transparent">
            Top Moving Items
          </h3>
          <p className="text-base text-gray-600 mt-1">
            High-demand inventory trends
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {topMovingItems.map((item, index) => (
          <div
            key={index}
            className={`group/item flex items-center justify-between p-6 bg-gradient-to-r ${item.color} rounded-2xl border ${item.border} hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="font-bold text-lg text-gray-900 mb-1">
                {item.name}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {item.department}
              </div>
            </div>
            <div className="text-right relative z-10">
              <div className="font-black text-xl text-gray-900 mb-1">
                {item.units}
              </div>
              <div
                className={`text-sm font-bold ${
                  item.trendColor || "text-green-600"
                } flex items-center justify-end bg-white/60 px-3 py-1 rounded-full shadow-sm`}
              >
                <span className="mr-1 text-base">
                  {item.trend.startsWith("-") ? "↘" : "↗"}
                </span>{" "}
                {item.trend}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CriticalStocksLevel: React.FC<CriticalStockProps> = ({
  criticalStocks,
}) => {
  return (
    <div className="bg-gradient-to-br from-white via-white to-red-50/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/60 hover:shadow-3xl hover:-translate-y-2 transition-all duration-700 group">
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-red-100 via-orange-200/50 to-red-200/30 rounded-2xl flex items-center justify-center mr-5 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500">
          <div className="text-3xl animate-bounce">⚠️</div>
        </div>
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Critical Stocks Level
          </h3>
          <p className="text-base text-gray-600 mt-1">
            Items requiring immediate attention
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {criticalStocks.map((stock, index) => (
          <div
            key={index}
            className={`group/item flex items-center justify-between p-6 bg-gradient-to-r ${stock.color} rounded-2xl border ${stock.border} hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="font-bold text-lg text-gray-900 mb-1">
                {stock.name}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {stock.department}
              </div>
            </div>
            <div className="text-right relative z-10">
              <span
                className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold bg-gradient-to-r ${stock.statusColor} ${stock.textColor} shadow-lg hover:shadow-xl transition-all duration-300 group-hover/item:scale-105`}
              >
                <span className="mr-2 text-base animate-pulse">
                  {stock.emoji}
                </span>{" "}
                {stock.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const WastageAnalysis: React.FC<WastageItemsProps> = ({ wastageItems }) => {
  return (
    <div className="bg-gradient-to-br from-white via-white to-orange-50/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/60 hover:shadow-3xl hover:-translate-y-2 transition-all duration-700 group">
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-100 via-red-200/50 to-orange-200/30 rounded-2xl flex items-center justify-center mr-5 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500">
          <div className="text-3xl animate-pulse">📊</div>
        </div>
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Wastage Analysis
          </h3>
          <p className="text-base text-gray-600 mt-1">
            Cost impact assessment & trends
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {wastageItems.map((item, index) => (
          <div
            key={index}
            className={`group/item flex items-center justify-between p-6 bg-gradient-to-r ${item.color} rounded-2xl border ${item.border} hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="font-bold text-lg text-gray-900 mb-1">
                {item.name}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {item.department}
              </div>
            </div>
            <div className="text-right relative z-10">
              <div className="font-black text-xl text-gray-900 mb-1">
                {item.amount}
              </div>
              <div
                className={`text-sm font-bold ${item.textColor} bg-white/60 px-3 py-1 rounded-full shadow-sm`}
              >
                {item.percentage}
              </div>
            </div>
          </div>
        ))}

        <div className="border-t-2 border-gradient-to-r from-gray-200 to-gray-300 pt-8 mt-8">
          <div className="flex items-center justify-between p-8 bg-gradient-to-br from-red-100 via-orange-100 to-red-200/50 rounded-3xl border-2 border-red-200/60 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 group/total">
            <div className="font-black text-xl text-gray-900">
              Total This Month
            </div>
            <div className="text-right">
              <div className="text-4xl font-black bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent group-hover/total:scale-110 transition-transform duration-300">
                ₱26,620
              </div>
              <div className="text-base font-bold text-gray-700 mt-1 bg-white/60 px-3 py-1 rounded-full shadow-sm">
                5.3% total waste
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AnalyticsBottomSections: React.FC = () => {
  const [topMovingItems, setTopMovingItems] = useState<TopMovingItem[]>([]);
  const [criticalStocks, setCriticalStocks] = useState<CriticalStock[]>([]);
  const [wastageItems, setWastageItems] = useState<WastageItem[]>([]);

  const {
    getInvAnalyticsBottomSection,
    setLoadingForGetInvAnalyticsBottomSection,
  } = useGetInvAnalytic();
  useEffect(() => {
    const useGetInvAnalyticFunc = async () => {
      const response = await getInvAnalyticsBottomSection();
      if (!response.success) {
        alert(response.message);
        return;
      }
      console.log(response.data);
      setTopMovingItems(response.data[0]);
      setCriticalStocks(response.data[1]);
      setWastageItems(response.data[2]);
    };
    useGetInvAnalyticFunc();
  }, []);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
      <TopMovingItems topMovingItems={topMovingItems} />
      <CriticalStocksLevel criticalStocks={criticalStocks} />
      <WastageAnalysis wastageItems={wastageItems} />
    </div>
  );
};

export default AnalyticsBottomSections;
