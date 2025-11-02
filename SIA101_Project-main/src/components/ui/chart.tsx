"use client"

import * as React from "react"
import { ResponsiveContainer, Tooltip } from "recharts"

import { cn } from "@/lib/utils"

export type ChartConfig = {
  [k in string]: {
    label?: string
    color?: string
  }
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ReactNode
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <div
      data-chart={chartId}
      ref={ref}
      className={cn(
        "flex w-full h-full justify-center text-xs",
        className
      )}
      {...props}
    >
      <ChartStyle id={chartId} config={config} />
      {React.createElement(ResponsiveContainer as any, {
        width: "100%",
        height: "100%"
      }, children)}
    </div>
  )
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, itemConfig]) => itemConfig.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
[data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    return itemConfig.color ? `  --color-${key}: ${itemConfig.color};` : null
  })
  .filter(Boolean)
  .join("\n")}
}
`
      }}
    />
  )
}

const ChartTooltip = Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  any
>(({ active, payload, label, className }, ref) => {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div
      ref={ref}
      className={cn(
        "grid min-w-[10rem] items-start gap-2 rounded-lg border bg-white/95 backdrop-blur-sm px-3 py-2 text-xs shadow-xl",
        className
      )}
    >
      {label && (
        <div className="font-semibold text-gray-700 border-b border-gray-100 pb-1">
          {label}
        </div>
      )}
      <div className="grid gap-1.5">
        {payload.map((item: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="h-2.5 w-2.5 rounded-[2px]"
              style={{ backgroundColor: item.color }}
            />
            <div className="flex flex-1 justify-between leading-none">
              <div className="text-gray-600 capitalize">
                {item.dataKey === 'consumption' ? 'Consumption' : item.name}
              </div>
              <div className="font-mono font-semibold text-gray-900">
                {item.value?.toLocaleString()} 
                <span className="text-gray-500 ml-1 font-normal">units</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})
ChartTooltipContent.displayName = "ChartTooltipContent"

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartStyle,
}
