import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DashboardBackground } from "./DashboardBackground";
import { DashboardStats } from "./DashboardStats";
import { DashboardCharts } from "./DashboardCharts";
import { DashboardActivity } from "./DashboardActivity";
const InventoryDashboardPage = () => {
    return (_jsxs("div", { className: "min-h-screen bg-[#F9F6EE]", children: [_jsx(DashboardBackground, {}), _jsxs("div", { className: "relative z-10 px-2 sm:px-4 lg:px-6 py-4 space-y-6 w-full", children: [_jsx(DashboardStats, {}), _jsx(DashboardCharts, {}), _jsx(DashboardActivity, {})] })] }));
};
export default InventoryDashboardPage;
