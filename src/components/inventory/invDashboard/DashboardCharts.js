import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import useGetInvDashboard from '../../../api/getInvDashboard';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart";
const chartConfig = {
    consumption: {
        label: "Consumption",
        color: "#82A33D",
    },
};
export const DashboardCharts = () => {
    const [departmentData, setDepartmentData] = useState([]);
    const [chartData, setChartData] = useState([]);
    const { getInvDashboardChart, loadingForGetInvDashboardChart, } = useGetInvDashboard();
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
    return (_jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6", children: [_jsxs(Card, { className: "relative bg-white/90 backdrop-blur-xl shadow-2xl border-white/30 hover:shadow-3xl hover:-translate-y-2 transition-all duration-700 group overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-heritage-green/8 via-emerald-50/30 to-heritage-green/5 rounded-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700" }), _jsx("div", { className: "absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-heritage-green/15 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" }), _jsx("div", { className: "absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-100/20 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000" }), _jsx(CardHeader, { className: "relative pb-3", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-8 h-8 bg-gradient-to-br from-heritage-green to-emerald-600 rounded-lg flex items-center justify-center shadow-lg", children: _jsx("svg", { className: "w-4 h-4 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" }) }) }), _jsxs("div", { children: [_jsx(CardTitle, { className: "text-lg font-bold text-heritage-green drop-shadow-sm", children: "Inventory Consumption Trends" }), _jsx(CardDescription, { className: "text-xs text-gray-600 font-medium", children: "January - June 2024" })] })] }) }), _jsxs(CardContent, { className: "relative pt-0", children: [_jsx("div", { className: "h-48 sm:h-56", children: _jsx(ChartContainer, { config: chartConfig, children: React.createElement(LineChart, {
                                        data: chartData,
                                        margin: {
                                            left: 8,
                                            right: 8,
                                            top: 8,
                                            bottom: 8,
                                        },
                                    }, [
                                        React.createElement(CartesianGrid, { key: "grid", vertical: false }),
                                        React.createElement(XAxis, {
                                            key: "xaxis",
                                            dataKey: "month",
                                            tickLine: false,
                                            axisLine: false,
                                            tickMargin: 8,
                                            tick: { fontSize: 11, fill: '#6b7280' },
                                            tickFormatter: (value) => value.slice(0, 3)
                                        }),
                                        React.createElement("YAxis", {
                                            key: "yaxis",
                                            tickLine: false,
                                            axisLine: false,
                                            tick: { fontSize: 10, fill: '#6b7280' },
                                            tickFormatter: (value) => `${(value / 1000).toFixed(1)}k`
                                        }),
                                        React.createElement(ChartTooltip, {
                                            key: "tooltip",
                                            cursor: false,
                                            content: React.createElement(ChartTooltipContent, { hideLabel: true })
                                        }),
                                        React.createElement(Line, {
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
                                    ]) }) }), _jsx("div", { className: "flex items-center justify-center mt-2 pb-2", children: _jsxs("div", { className: "flex items-center gap-2 text-xs text-gray-600", children: [_jsx("div", { className: "w-3 h-0.5 bg-[#82A33D] rounded" }), _jsx("span", { children: "Monthly Consumption (Units)" })] }) })] }), _jsxs(CardFooter, { className: "relative flex-col items-start gap-1 text-sm pt-2", children: [_jsxs("div", { className: "flex gap-2 leading-none font-medium text-heritage-green text-xs", children: ["Trending up by 40% this period ", _jsx(TrendingUp, { className: "h-3 w-3" })] }), _jsx("div", { className: "text-xs text-gray-500 leading-none", children: "Peak consumption: 2.8k units in June \u2022 Average: 2.3k units/month" })] })] }), _jsxs(Card, { className: "relative bg-white/90 backdrop-blur-xl shadow-2xl border-white/30 hover:shadow-3xl hover:-translate-y-2 transition-all duration-700 group overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-blue-500/8 via-blue-50/30 to-heritage-green/5 rounded-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700" }), _jsx("div", { className: "absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-100/15 to-transparent rounded-full -translate-y-1/2 -translate-x-1/2 animate-pulse delay-500" }), _jsx("div", { className: "absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-heritage-green/10 to-transparent rounded-full translate-y-1/2 translate-x-1/2 animate-pulse delay-1500" }), _jsx(CardHeader, { className: "relative pb-3", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg", children: _jsx("svg", { className: "w-4 h-4 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }) }) }), _jsxs("div", { children: [_jsx(CardTitle, { className: "text-lg font-bold text-heritage-green drop-shadow-sm", children: "Department Usage Analysis" }), _jsx(CardDescription, { className: "text-xs text-gray-600 font-medium", children: "Inventory consumption by department" })] })] }) }), _jsxs(CardContent, { className: "relative pt-0", children: [_jsx("div", { className: "h-48 sm:h-56", children: _jsx("div", { className: "space-y-3 h-full flex flex-col justify-center", children: departmentData && departmentData.length > 0 && departmentData.map((dept, index) => {
                                        const maxUsage = Math.max(...departmentData.map((d) => d.usage));
                                        const percentage = (dept.usage / maxUsage) * 100;
                                        return (_jsxs("div", { className: "flex items-center space-x-3 group", children: [_jsx("div", { className: "w-20 text-xs font-semibold text-gray-700 text-right", children: dept.department }), _jsx("div", { className: "flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden shadow-inner", children: _jsx("div", { className: "bg-gradient-to-r from-[#82A33D] to-[#6d8a33] h-6 rounded-full flex items-center justify-end pr-3 transition-all duration-1500 ease-out shadow-lg group-hover:shadow-xl", style: {
                                                            width: `${percentage}%`,
                                                            transform: 'translateX(0)'
                                                        }, children: _jsx("span", { className: "text-white text-xs font-bold drop-shadow-sm", children: dept.usage }) }) }), _jsxs("div", { className: "w-10 text-xs text-gray-500 font-medium", children: [Math.round(percentage), "%"] })] }, index));
                                    }) }) }), _jsxs("div", { className: "mt-3 pt-3 border-t border-gray-100", children: [_jsxs("div", { className: "flex items-center justify-between text-xs text-gray-600 mb-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-2 bg-gradient-to-r from-[#82A33D] to-[#6d8a33] rounded" }), _jsx("span", { children: "Usage by Department" })] }), _jsx("span", { className: "font-medium", children: "Total: 1,200 units" })] }), _jsxs("div", { className: "text-xs text-gray-500 leading-relaxed", children: [_jsx("strong", { children: "Highest:" }), " Kitchen (400 units, 33%) \u2022 ", _jsx("strong", { children: "Lowest:" }), " Front Desk (100 units, 8%)"] })] })] })] })] }));
};
