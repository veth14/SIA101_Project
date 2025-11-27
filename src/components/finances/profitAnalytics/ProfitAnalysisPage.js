import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { getRevenueData, calculateChartMetrics } from '../dashboard/chartsLogic/revenueAnalyticsLogic';
import { ProfitAnalysisCharts } from './ProfitAnalysisCharts';
const ProfitAnalysisPage = () => {
    const activeTimeframe = 'monthly';
    // Get data from revenue analytics for calculations
    const revenueData = useMemo(() => getRevenueData(activeTimeframe), [activeTimeframe]);
    const metrics = useMemo(() => calculateChartMetrics(revenueData), [revenueData]);
    // Cost breakdown analysis
    const costAnalysis = [
        {
            category: 'Staff Costs',
            amount: Math.round(metrics.totalExpenses * 0.45),
            percentage: 45,
            trend: 'up',
            change: '+3.2%',
            color: '#EF4444',
            icon: '👥',
            description: 'Salaries, benefits, training',
            status: 'high'
        },
        {
            category: 'Utilities & Maintenance',
            amount: Math.round(metrics.totalExpenses * 0.25),
            percentage: 25,
            trend: 'down',
            change: '-1.8%',
            color: '#F59E0B',
            icon: '⚡',
            description: 'Electricity, water, repairs',
            status: 'medium'
        },
        {
            category: 'Food & Beverage Costs',
            amount: Math.round(metrics.totalExpenses * 0.20),
            percentage: 20,
            trend: 'up',
            change: '+2.1%',
            color: '#8B5CF6',
            icon: '🍽️',
            description: 'Ingredients, supplies, waste',
            status: 'medium'
        },
        {
            category: 'Marketing & Operations',
            amount: Math.round(metrics.totalExpenses * 0.10),
            percentage: 10,
            trend: 'down',
            change: '-0.5%',
            color: '#10B981',
            icon: '📢',
            description: 'Advertising, admin, insurance',
            status: 'low'
        }
    ];
    // Department profit analysis
    const departmentProfits = [
        {
            department: 'Rooms',
            revenue: Math.round(metrics.totalRevenue * 0.60),
            costs: Math.round(metrics.totalExpenses * 0.35),
            profit: Math.round(metrics.totalRevenue * 0.60) - Math.round(metrics.totalExpenses * 0.35),
            margin: 58.3,
            status: 'excellent'
        },
        {
            department: 'Food & Beverage',
            revenue: Math.round(metrics.totalRevenue * 0.25),
            costs: Math.round(metrics.totalExpenses * 0.30),
            profit: Math.round(metrics.totalRevenue * 0.25) - Math.round(metrics.totalExpenses * 0.30),
            margin: -20.0,
            status: 'poor'
        },
        {
            department: 'Events',
            revenue: Math.round(metrics.totalRevenue * 0.10),
            costs: Math.round(metrics.totalExpenses * 0.15),
            profit: Math.round(metrics.totalRevenue * 0.10) - Math.round(metrics.totalExpenses * 0.15),
            margin: -50.0,
            status: 'poor'
        },
        {
            department: 'Other Services',
            revenue: Math.round(metrics.totalRevenue * 0.05),
            costs: Math.round(metrics.totalExpenses * 0.20),
            profit: Math.round(metrics.totalRevenue * 0.05) - Math.round(metrics.totalExpenses * 0.20),
            margin: -300.0,
            status: 'critical'
        }
    ];
    return (_jsxs("div", { className: "min-h-screen bg-heritage-light", children: [_jsxs("div", { className: "fixed inset-0 pointer-events-none", children: [_jsx("div", { className: "absolute rounded-full top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 blur-3xl opacity-30" }), _jsx("div", { className: "absolute delay-1000 rounded-full opacity-25 top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 blur-3xl" }), _jsx("div", { className: "absolute rounded-full bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 blur-3xl delay-2000 opacity-20" })] }), _jsx("div", { className: "relative z-10 w-full px-4 py-6 lg:px-8", children: _jsx("div", { className: "max-w-6xl mx-auto", children: _jsx(ProfitAnalysisCharts, { costAnalysis: costAnalysis, departmentProfits: departmentProfits }) }) })] }));
};
export default ProfitAnalysisPage;
