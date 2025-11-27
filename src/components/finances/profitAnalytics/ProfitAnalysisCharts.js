import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ProfitTrendsChart from './ProfitTrendsChart';
import { DepartmentCards } from './DepartmentCards';
import { CostBreakdown } from './CostBreakdown';
export const ProfitAnalysisCharts = ({ costAnalysis, departmentProfits }) => {
    // No skeleton/loading simulation: render charts and sections immediately
    return (_jsxs("div", { className: "space-y-8", children: [_jsx("div", { className: "mb-2", children: _jsx(ProfitTrendsChart, {}) }), _jsxs("div", { className: "grid grid-cols-1 gap-8 lg:grid-cols-3", children: [_jsx(DepartmentCards, { departmentProfits: departmentProfits }), _jsx(CostBreakdown, { costAnalysis: costAnalysis })] })] }));
};
export default ProfitAnalysisCharts;
