"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import RateChartSkeleton from "@/components/rateChartSkeleton"
import type { RatePoint } from "@/components/historyPanel"
import type { ChartRange } from "@/store/history-chart-store"
import { formatRate } from "@/lib/format"

interface RateChartProps {
  base: string
  symbol: string
  range: ChartRange
  series: RatePoint[]
  isLoading: boolean
  isError: boolean
}

/** Longer ranges label by month/year; shorter ones by month/day. */
function makeDateFormatter(range: ChartRange) {
  const longRange = range === "1Y" || range === "5Y"
  const options: Intl.DateTimeFormatOptions = longRange
    ? { month: "short", year: "2-digit" }
    : { month: "short", day: "2-digit" }

  return (iso: string) => {
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return iso
    return date.toLocaleDateString("en-US", options)
  }
}

export default function RateChart({
  base,
  symbol,
  range,
  series,
  isLoading,
  isError,
}: RateChartProps) {
  const pair = `${base}/${symbol}`
  const formatDate = makeDateFormatter(range)

  // Rate under the cursor (or keyboard focus), used to draw the horizontal
  // crosshair. Cleared when the pointer leaves so the guideline disappears.
  const [activeRate, setActiveRate] = React.useState<number | null>(null)

  const chartConfig = {
    rate: { label: pair, color: "var(--primary)" },
  } satisfies ChartConfig

  const latest = series.at(-1)
  const latestLabel = latest
    ? new Date(latest.date)
        .toLocaleDateString("en-US", { month: "short", day: "2-digit" })
        .toUpperCase()
    : null

  // Dynamic Y range padded around the observed min/max.
  const values = series.map((point) => point.rate)
  const min = values.length ? Math.min(...values) : 0
  const max = values.length ? Math.max(...values) : 1
  const spread = max - min
  const pad =
    spread > 0 ? spread * 0.15 : Math.max(Math.abs(max) * 0.02, 0.0001)
  const domainMin = min - pad
  const domainMax = max + pad
  const yTicks = [domainMin, (domainMin + domainMax) / 2, domainMax]

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-preset-3-medium text-foreground">{pair}</p>
        {latest && (
          <p className="text-preset-5 text-foreground/70">
            {formatRate(latest.rate)} · {latestLabel}
          </p>
        )}
      </div>

      {series.length < 2 ? (
        isLoading ? (
          <RateChartSkeleton />
        ) : (
          <div className="flex h-68 items-center justify-center text-preset-4 text-muted-foreground">
            {isError
              ? "Couldn't load rates."
              : "Not enough rate data for this range."}
          </div>
        )
      ) : (
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-68 w-full"
        >
          <AreaChart
            accessibilityLayer
            data={series}
            margin={{ left: 4, right: 8, top: 8, bottom: 4 }}
            onMouseMove={(state) => {
              const index = state?.isTooltipActive
                ? state.activeIndex
                : undefined
              const point =
                typeof index === "number" ? series[index] : undefined
              setActiveRate(point ? point.rate : null)
            }}
            onMouseLeave={() => setActiveRate(null)}
          >
            <defs>
              <linearGradient id="fillRate" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-rate)"
                  stopOpacity={0.5}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-rate)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <YAxis
              dataKey="rate"
              orientation="left"
              domain={[domainMin, domainMax]}
              ticks={yTicks}
              tickLine={false}
              axisLine={false}
              width={52}
              tickFormatter={formatRate}
              tick={{ fontSize: 10 }}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              interval="preserveStartEnd"
              tickFormatter={formatDate}
              tick={{ fontSize: 10 }}
            />
            <ChartTooltip
              cursor={{ strokeDasharray: "4 4" }}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => formatDate(String(value))}
                  formatter={(value) => (
                    <span className="font-mono font-medium text-foreground tabular-nums">
                      {formatRate(Number(value))} {symbol}
                    </span>
                  )}
                />
              }
            />
            <Area
              dataKey="rate"
              type="monotone"
              stroke="var(--color-rate)"
              strokeWidth={2}
              fill="url(#fillRate)"
              dot={false}
            />
            {activeRate != null && (
              <ReferenceLine
                y={activeRate}
                stroke="var(--border)"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
            )}
          </AreaChart>
        </ChartContainer>
      )}
    </div>
  )
}
