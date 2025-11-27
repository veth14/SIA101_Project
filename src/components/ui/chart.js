"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";
const ChartContainer = React.forwardRef(({ id, className, children, config, ...props }, ref) => {
    const uniqueId = React.useId();
    const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;
    return (_jsxs("div", { "data-chart": chartId, ref: ref, className: cn("flex w-full h-full justify-center text-xs", className), ...props, children: [_jsx(ChartStyle, { id: chartId, config: config }), React.createElement(ResponsiveContainer, {
                width: "100%",
                height: "100%"
            }, children)] }));
});
ChartContainer.displayName = "Chart";
const ChartStyle = ({ id, config }) => {
    const colorConfig = Object.entries(config).filter(([_, itemConfig]) => itemConfig.color);
    if (!colorConfig.length) {
        return null;
    }
    return (_jsx("style", { dangerouslySetInnerHTML: {
            __html: `
[data-chart=${id}] {
${colorConfig
                .map(([key, itemConfig]) => {
                return itemConfig.color ? `  --color-${key}: ${itemConfig.color};` : null;
            })
                .filter(Boolean)
                .join("\n")}
}
`
        } }));
};
const ChartTooltip = Tooltip;
const ChartTooltipContent = React.forwardRef(({ active, payload, label, className }, ref) => {
    if (!active || !payload?.length) {
        return null;
    }
    return (_jsxs("div", { ref: ref, className: cn("grid min-w-[10rem] items-start gap-2 rounded-lg border bg-white/95 backdrop-blur-sm px-3 py-2 text-xs shadow-xl", className), children: [label && (_jsx("div", { className: "font-semibold text-gray-700 border-b border-gray-100 pb-1", children: label })), _jsx("div", { className: "grid gap-1.5", children: payload.map((item, index) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "h-2.5 w-2.5 rounded-[2px]", style: { backgroundColor: item.color } }), _jsxs("div", { className: "flex flex-1 justify-between leading-none", children: [_jsx("div", { className: "text-gray-600 capitalize", children: item.dataKey === 'consumption' ? 'Consumption' : item.name }), _jsxs("div", { className: "font-mono font-semibold text-gray-900", children: [item.value?.toLocaleString(), _jsx("span", { className: "text-gray-500 ml-1 font-normal", children: "units" })] })] })] }, index))) })] }));
});
ChartTooltipContent.displayName = "ChartTooltipContent";
export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartStyle, };
