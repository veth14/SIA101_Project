import type { Request, Response } from "express";

interface SummaryStat {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: string; // string from backend
  iconBg: string;
}

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

const chartData = [
  { month: "Jan", linens: 2400, cleaning: 1400, food: 2400, maintenance: 800 },
  { month: "Feb", linens: 1398, cleaning: 2210, food: 2290, maintenance: 1200 },
  { month: "Mar", linens: 2800, cleaning: 2290, food: 2000, maintenance: 1500 },
  { month: "Apr", linens: 3908, cleaning: 2000, food: 2181, maintenance: 900 },
  { month: "May", linens: 4800, cleaning: 2181, food: 2500, maintenance: 1100 },
  { month: "Jun", linens: 3800, cleaning: 2500, food: 2100, maintenance: 1300 },
  { month: "Jul", linens: 4300, cleaning: 2100, food: 2800, maintenance: 1000 },
  { month: "Aug", linens: 4100, cleaning: 2350, food: 2650, maintenance: 1150 },
  { month: "Sep", linens: 3600, cleaning: 2400, food: 2300, maintenance: 1250 },
  { month: "Oct", linens: 3200, cleaning: 2150, food: 2450, maintenance: 950 },
  { month: "Nov", linens: 2900, cleaning: 1950, food: 2200, maintenance: 1050 },
  { month: "Dec", linens: 3500, cleaning: 2300, food: 2600, maintenance: 1200 },
];

// Summary statistics for inventory
const summaryStats: SummaryStat[] = [
  {
    title: "Total Items",
    value: "38,347",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: "Package",
    iconBg: "bg-blue-100",
  },
  {
    title: "Categories",
    value: "4",
    change: "Active",
    changeType: "neutral" as const,
    icon: "Sparkles",
    iconBg: "bg-emerald-100",
  },
  {
    title: "Peak Usage",
    value: "4.8K",
    change: "May",
    changeType: "neutral" as const,
    icon: "TrendingUp",
    iconBg: "bg-violet-100",
  },
  {
    title: "Avg. Monthly",
    value: "2.9K",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: "Utensils",
    iconBg: "bg-amber-100",
  },
];

const topMovingItems: TopMovingItem[] = [
  {
    name: "Bdasdaasath Towels",
    department: "Housekeeping",
    units: "2,450 units",
    trend: "+15%",
    color: "from-green-50 to-emerald-50",
    border: "border-green-100",
  },
  {
    name: "Toiletries Kit",
    department: "Housekeeping",
    units: "1,890 units",
    trend: "+8%",
    color: "from-blue-50 to-indigo-50",
    border: "border-blue-100",
  },
  {
    name: "Bed Linens",
    department: "Housekeeping",
    units: "1,240 units",
    trend: "+12%",
    color: "from-purple-50 to-pink-50",
    border: "border-purple-100",
  },
  {
    name: "Mini Bar Items",
    department: "F&B",
    units: "985 units",
    trend: "-3%",
    color: "from-red-50 to-orange-50",
    border: "border-red-100",
    trendColor: "text-red-600",
  },
];

const criticalStocks: CriticalStock[] = [
  {
    name: "Cleaning Supplies",
    department: "Maintenance",
    status: "Low",
    statusColor: "from-red-100 to-red-200",
    textColor: "text-red-800",
    emoji: "🔴",
    color: "from-red-50 to-pink-50",
    border: "border-red-100",
  },
  {
    name: "Paper Products",
    department: "Housekeeping",
    status: "Medium",
    statusColor: "from-yellow-100 to-orange-100",
    textColor: "text-yellow-800",
    emoji: "🟡",
    color: "from-yellow-50 to-orange-50",
    border: "border-yellow-100",
  },
  {
    name: "Guest Amenities",
    department: "Front Office",
    status: "Good",
    statusColor: "from-green-100 to-emerald-100",
    textColor: "text-green-800",
    emoji: "🟢",
    color: "from-green-50 to-emerald-50",
    border: "border-green-100",
  },
  {
    name: "Maintenance Tools",
    department: "Maintenance",
    status: "Good",
    statusColor: "from-green-100 to-emerald-100",
    textColor: "text-green-800",
    emoji: "🟢",
    color: "from-blue-50 to-indigo-50",
    border: "border-blue-100",
  },
];

const wastageItems: WastageItem[] = [
  {
    name: "Food Items",
    department: "F&B Department",
    amount: "₱12,450",
    percentage: "2.3% waste",
    color: "from-red-50 to-orange-50",
    border: "border-red-100",
    textColor: "text-red-600",
  },
  {
    name: "Damaged Linens",
    department: "Housekeeping",
    amount: "₱8,200",
    percentage: "1.8% waste",
    color: "from-yellow-50 to-orange-50",
    border: "border-yellow-100",
    textColor: "text-yellow-600",
  },
  {
    name: "Expired Products",
    department: "All Departments",
    amount: "₱5,970",
    percentage: "1.2% waste",
    color: "from-amber-50 to-yellow-50",
    border: "border-amber-100",
    textColor: "text-yellow-600",
  },
];

export const getAnalyticsChart = (req: Request, res: Response) => {
  if (chartData.length <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Missing Chart Data" });
  }
  if (summaryStats.length <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Missing Summary Stats" });
  }

  res.status(200).json({ success: true, data: [summaryStats, chartData] });
};

export const getAnalyticsBottomSection = (req: Request, res: Response) => {
  if (topMovingItems.length <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Missing Top Moving Items" });
  }

  if (criticalStocks.length <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Missing Critical Stocks" });
  }

  if (wastageItems.length <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Missing Wastage Items" });
  }

  res.status(200).json({
    success: true,
    data: [topMovingItems, criticalStocks, wastageItems],
  });
};
