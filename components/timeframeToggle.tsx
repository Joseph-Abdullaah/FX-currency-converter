"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useHistoryChartStore, type ChartRange } from "@/store/history-chart-store"

const timeframes: ChartRange[] = ["1D", "1W", "1M", "3M", "1Y", "5Y"]

export default function TimeframeToggle() {
  const range = useHistoryChartStore((state) => state.range)
  const setRange = useHistoryChartStore((state) => state.setRange)

  return (
    <ToggleGroup
      type="single"
      value={range}
      onValueChange={(value) => value && setRange(value as ChartRange)}
      spacing={0}
      className="h-auto flex min-w-71.5 self-start rounded-lg bg-card p-0.5"
    >
      {timeframes.map((timeframe) => (
        <ToggleGroupItem
          key={timeframe}
          value={timeframe}
          className="h-auto min-w-11.75 rounded-lg bg-transparent px-4 py-3 text-preset-5 text-muted-foreground hover:bg-transparent hover:text-foreground data-[state=on]:bg-muted data-[state=on]:text-foreground"
        >
          {timeframe}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
