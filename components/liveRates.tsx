import { cn } from "@/lib/utils"

interface LiveRatesProps {
  base: string
  symbol: string
  /** Live rate for `base`/`symbol`; `undefined` while the request is pending. */
  rate?: number
  /** Day-over-day change in percent; `undefined` until a prior close is known. */
  changePct?: number
}

/** Match the design's variable precision: fewer decimals for larger rates. */
function formatRate(rate: number) {
  const decimals = rate >= 100 ? 2 : rate >= 10 ? 3 : 4
  return rate.toFixed(decimals)
}

export default function LiveRates({
  base,
  symbol,
  rate,
  changePct,
}: LiveRatesProps) {
  const positive = (changePct ?? 0) >= 0

  return (
    <div className="flex items-center gap-2.5 border-r border-border bg-card p-3 md:px-5 md:py-3">
      <p className="text-[10px] text-muted-foreground md:text-xs">
        {base}/{symbol}
      </p>
      <p className="text-[10px] text-foreground md:text-xs">
        {rate != null ? formatRate(rate) : "—"}
      </p>
      {changePct != null && (
        <p
          className={cn(
            "text-[10px] md:text-xs",
            positive ? "text-green-500" : "text-destructive"
          )}
        >
          {positive ? "▲" : "▼"} {positive ? "+" : ""}
          {changePct.toFixed(2)}%
        </p>
      )}
    </div>
  )
}
