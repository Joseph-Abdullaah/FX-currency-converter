"use client"

import * as React from "react"

import ConversionStats from "@/components/conversionStats"
import ConversionStatsSkeleton from "@/components/conversionStatsSkeleton"
import TimeframeToggle from "@/components/timeframeToggle"
import RateChart from "@/components/rateChart"
import { useConverterStore } from "@/store/convert-store"
import {
  useHistoryChartStore,
  type ChartRange,
} from "@/store/history-chart-store"
import { useHistoricalRates } from "@/hooks/use-historical-rates"
import { isoDate } from "@/lib/date"

export interface RatePoint {
  date: string
  rate: number
}

/**
 * Calendar-day lookback per range (ECB publishes one rate per business day).
 * "1D" fetches a few days so we reliably capture the last two business days
 * across weekends/holidays; the series is then sliced to that latest move.
 */
const RANGE_DAYS: Record<ChartRange, number> = {
  "1D": 5,
  "1W": 7,
  "1M": 30,
  "3M": 90,
  "1Y": 365,
  "5Y": 365 * 5,
}

export default function HistoryPanel() {
  const base = useConverterStore((state) => state.base)
  const symbol = useConverterStore((state) => state.symbol)
  const range = useHistoryChartStore((state) => state.range)

  const endDate = isoDate(0)
  const startDate = isoDate(RANGE_DAYS[range])

  const { data, isLoading, isError } = useHistoricalRates({
    base,
    symbol,
    startDate,
    endDate,
  })

  const series = React.useMemo<RatePoint[]>(() => {
    if (!data?.rates) return []
    const points = Object.keys(data.rates)
      .sort()
      .map((date) => ({ date, rate: data.rates[date]?.[symbol] }))
      .filter((point): point is RatePoint => point.rate != null)

    // Daily ECB data can't show intraday movement, so "1D" is the latest
    // day-over-day move: the two most recent business-day closes.
    return range === "1D" ? points.slice(-2) : points
  }, [data, symbol, range])

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2.5 lg:flex-row lg:items-start lg:justify-between">
        {isLoading ? (
          <ConversionStatsSkeleton />
        ) : (
          <ConversionStats series={series} />
        )}
        <TimeframeToggle />
      </div>
      <RateChart
        base={base}
        symbol={symbol}
        range={range}
        series={series}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  )
}
