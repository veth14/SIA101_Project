import * as React from "react";
import { Tooltip } from "recharts";
export type ChartConfig = {
    [k in string]: {
        label?: string;
        color?: string;
    };
};
declare const ChartContainer: React.ForwardRefExoticComponent<Omit<React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement> & {
    config: ChartConfig;
    children: React.ReactNode;
}, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const ChartStyle: ({ id, config }: {
    id: string;
    config: ChartConfig;
}) => import("react/jsx-runtime").JSX.Element | null;
declare const ChartTooltip: typeof Tooltip;
declare const ChartTooltipContent: React.ForwardRefExoticComponent<Omit<any, "ref"> & React.RefAttributes<HTMLDivElement>>;
export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartStyle, };
