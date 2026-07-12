import { cn } from "@/lib/utils"
import type { RatePoint } from "@/components/historyPanel"

interface ConversionStatsProps {
  series: RatePoint[]
}

/** Match the design's variable precision: fewer decimals for larger rates. */
function decimalsFor(rate: number) {
  return rate >= 100 ? 2 : rate >= 10 ? 3 : 4
}

interface Stat {
  label: string
  value: string
  tone: "default" | "positive" | "negative"
}

function buildStats(series: RatePoint[]): Stat[] {
  const open = series[0]?.rate
  const last = series[series.length - 1]?.rate

  if (open == null || last == null) {
    return [
      { label: "OPEN", value: "—", tone: "default" },
      { label: "LAST", value: "—", tone: "default" },
      { label: "CHANGE", value: "—", tone: "default" },
      { label: "% CHANGE", value: "—", tone: "default" },
    ]
  }

  const change = last - open
  const changePct = open !== 0 ? (change / open) * 100 : 0
  const positive = change >= 0
  const tone = positive ? "positive" : "negative"
  const decimals = decimalsFor(last)
  const sign = positive ? "+" : "-"

  return [
    { label: "OPEN", value: open.toFixed(decimals), tone: "default" },
    { label: "LAST", value: last.toFixed(decimals), tone: "default" },
    {
      label: "CHANGE",
      value: `${sign}${Math.abs(change).toFixed(decimals)}`,
      tone,
    },
    {
      label: "% CHANGE",
      value: `${positive ? "▲" : "▼"} ${sign}${Math.abs(changePct).toFixed(2)}%`,
      tone,
    },
  ]
}

export default function ConversionStats({ series }: ConversionStatsProps) {
  const stats = buildStats(series)

  return (
    <div className="flex flex-1 flex-wrap gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex min-w-35 flex-1 flex-col justify-center gap-4 rounded-2xl border border-border bg-card px-5 py-3 md:w-full md:max-w-35"
        >
          <p className="text-preset-4 text-foreground/70">{stat.label}</p>
          <p
            className={cn(
              "text-preset-2! text-foreground",
              stat.tone === "positive" && "text-green-500",
              stat.tone === "negative" && "text-destructive"
            )}
          >
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  )
}
