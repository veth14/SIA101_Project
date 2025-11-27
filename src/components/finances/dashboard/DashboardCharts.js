import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import RevenueAnalytics from './RevenueAnalytics';
import ProfitAnalysis from './ProfitAnalysis';
import RecentTransactions from './RecentTransactions';
import RecentActivities from './RecentActivities';
const DashboardCharts = () => {
    return (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsx(RevenueAnalytics, {}), _jsx(ProfitAnalysis, {}), _jsx(RecentTransactions, {}), _jsx(RecentActivities, {})] }));
};
export default DashboardCharts;
