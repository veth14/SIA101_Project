import type { Response, Request } from "express";

// ============= INTERFACES =============
interface SummaryStat {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: string;
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

interface ProcurementStat {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: string;
  iconBg: string;
}

// ============= DATA =============
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

const summaryStats: SummaryStat[] = [
  {
    title: "Total Items",
    value: "38,347",
    change: "+12.5%",
    changeType: "positive",
    icon: "Package",
    iconBg: "bg-blue-100",
  },
  {
    title: "Categories",
    value: "4",
    change: "Active",
    changeType: "neutral",
    icon: "Sparkles",
    iconBg: "bg-emerald-100",
  },
  {
    title: "Peak Usage",
    value: "4.8K",
    change: "May",
    changeType: "neutral",
    icon: "TrendingUp",
    iconBg: "bg-violet-100",
  },
  {
    title: "Avg. Monthly",
    value: "2.9K",
    change: "+8.2%",
    changeType: "positive",
    icon: "Utensils",
    iconBg: "bg-amber-100",
  },
];

const topMovingItems: TopMovingItem[] = [
  {
    name: "Bath Towels",
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

// ============= UTILITY FUNCTIONS =============
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// ============= PROCUREMENT DATA =============
const stats = {
  totalOrders: 347,
  pendingOrders: 45,
  approvedOrders: 289,
  receivedOrders: 267,
  totalValue: 3100000,
};

const procurementStats: ProcurementStat[] = [
  {
    title: "Monthly Revenue Impact",
    value: formatCurrency(stats.totalValue * 0.85),
    change: "+18% cost savings achieved",
    changeType: "positive",
    icon: "DollarSign",
    iconBg: "bg-emerald-100",
  },
  {
    title: "Smart Procurement Score",
    value: Math.round((stats.approvedOrders / stats.totalOrders) * 100) + "%",
    change: "+12% efficiency boost",
    changeType: "positive",
    icon: "Lightbulb",
    iconBg: "bg-blue-100",
  },
  {
    title: "Vendor Performance",
    value:
      Math.round((stats.receivedOrders / stats.approvedOrders) * 100) + "%",
    change: "+8% delivery reliability",
    changeType: "positive",
    icon: "Zap",
    iconBg: "bg-purple-100",
  },
  {
    title: "Cost Optimization",
    value: formatCurrency(stats.totalValue * 0.15),
    change: "22% below budget target",
    changeType: "positive",
    icon: "BarChart",
    iconBg: "bg-amber-100",
  },
];

const procurementData = [
  { month: "Jan", orders: 45, value: 2800, suppliers: 12, onTime: 94 },
  { month: "Feb", orders: 52, value: 3200, suppliers: 14, onTime: 96 },
  { month: "Mar", orders: 38, value: 2400, suppliers: 11, onTime: 89 },
  { month: "Apr", orders: 61, value: 3800, suppliers: 16, onTime: 92 },
  { month: "May", orders: 47, value: 2900, suppliers: 13, onTime: 97 },
  { month: "Jun", orders: 55, value: 3400, suppliers: 15, onTime: 91 },
  { month: "Jul", orders: 49, value: 3100, suppliers: 14, onTime: 95 },
  { month: "Aug", orders: 53, value: 3300, suppliers: 15, onTime: 93 },
  { month: "Sep", orders: 41, value: 2600, suppliers: 12, onTime: 96 },
  { month: "Oct", orders: 58, value: 3600, suppliers: 16, onTime: 94 },
  { month: "Nov", orders: 46, value: 2800, suppliers: 13, onTime: 92 },
  { month: "Dec", orders: 51, value: 3200, suppliers: 14, onTime: 95 },
];

// ============= ROUTE HANDLERS =============
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

export const getProcurementMetrics = (req: Request, res: Response) => {
  if (procurementStats.length <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Missing Procurement Stats" });
  }

  res.status(200).json({ success: true, data: procurementStats });
};

export const getProcurementAnalytics = (req: Request, res: Response) => {
  if (procurementData.length <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Missing Procurement Stats" });
  }

  res.status(200).json({ success: true, data: procurementData });
};

// Add this interface with the other interfaces at the top
interface DepartmentStatCard {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: string;
  iconBg: string;
}

// Add this data with the other data sections
const departmentStats = {
  totalDepartments: 8,
  totalRequests: 346,
  avgResponseTime: 2.4,
  approvalRate: 92.3,
  totalValue: 850000,
};

const departmentStatCards: DepartmentStatCard[] = [
  {
    title: "Department Efficiency",
    value:
      Math.round(
        departmentStats.totalRequests / departmentStats.totalDepartments
      ) + " req/dept",
    change: "+18% productivity increase",
    changeType: "positive",
    iconBg: "bg-heritage-green/10",
    icon: "Building",
  },
  {
    title: "Service Excellence Score",
    value: Math.round(departmentStats.approvalRate) + "%",
    change: "+12% satisfaction boost",
    changeType: "positive",
    iconBg: "bg-emerald-100",
    icon: "Star",
  },
  {
    title: "Response Performance",
    value: departmentStats.avgResponseTime + "h avg",
    change: "-15% faster processing",
    changeType: "positive",
    iconBg: "bg-blue-100",
    icon: "Clock",
  },
  {
    title: "Resource Optimization",
    value: formatCurrency(departmentStats.totalValue),
    change: "25% cost efficiency gained",
    changeType: "positive",
    iconBg: "bg-amber-100",
    icon: "TrendingUp",
  },
];

// Add this route handler with the other route handlers
export const getDepartmentMetrics = (req: Request, res: Response) => {
  if (departmentStatCards.length <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Missing Department Stats" });
  }

  res.status(200).json({ success: true, data: departmentStatCards });
};

const departmentData = [
  {
    month: "Jan",
    housekeeping: 45,
    frontoffice: 28,
    fnb: 35,
    maintenance: 22,
    security: 15,
  },
  {
    month: "Feb",
    housekeeping: 52,
    frontoffice: 32,
    fnb: 41,
    maintenance: 28,
    security: 18,
  },
  {
    month: "Mar",
    housekeeping: 38,
    frontoffice: 25,
    fnb: 29,
    maintenance: 19,
    security: 12,
  },
  {
    month: "Apr",
    housekeeping: 61,
    frontoffice: 38,
    fnb: 47,
    maintenance: 31,
    security: 21,
  },
  {
    month: "May",
    housekeeping: 47,
    frontoffice: 29,
    fnb: 36,
    maintenance: 24,
    security: 16,
  },
  {
    month: "Jun",
    housekeeping: 55,
    frontoffice: 34,
    fnb: 42,
    maintenance: 28,
    security: 19,
  },
  {
    month: "Jul",
    housekeeping: 49,
    frontoffice: 31,
    fnb: 38,
    maintenance: 25,
    security: 17,
  },
  {
    month: "Aug",
    housekeeping: 53,
    frontoffice: 33,
    fnb: 40,
    maintenance: 27,
    security: 18,
  },
  {
    month: "Sep",
    housekeeping: 41,
    frontoffice: 26,
    fnb: 32,
    maintenance: 21,
    security: 14,
  },
  {
    month: "Oct",
    housekeeping: 58,
    frontoffice: 36,
    fnb: 44,
    maintenance: 29,
    security: 20,
  },
  {
    month: "Nov",
    housekeeping: 46,
    frontoffice: 28,
    fnb: 35,
    maintenance: 23,
    security: 16,
  },
  {
    month: "Dec",
    housekeeping: 51,
    frontoffice: 32,
    fnb: 39,
    maintenance: 26,
    security: 18,
  },
];

// Department performance data
const departmentPerformance = [
  {
    name: "Housekeeping",
    requests: 156,
    avgTime: "2.1h",
    approval: 94,
    color: "bg-blue-500",
  },
  {
    name: "Front Office",
    requests: 89,
    avgTime: "1.8h",
    approval: 97,
    color: "bg-green-500",
  },
  {
    name: "Food & Beverage",
    requests: 134,
    avgTime: "2.5h",
    approval: 91,
    color: "bg-orange-500",
  },
  {
    name: "Maintenance",
    requests: 78,
    avgTime: "3.2h",
    approval: 88,
    color: "bg-red-500",
  },
  {
    name: "Security",
    requests: 45,
    avgTime: "1.5h",
    approval: 98,
    color: "bg-purple-500",
  },
];

export const getDepartmentCharts = (req: Request, res: Response) => {
  if (departmentStatCards.length <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Missing Department Charts" });
  }

  res
    .status(200)
    .json({ success: true, data: [departmentData, departmentPerformance] });
};
