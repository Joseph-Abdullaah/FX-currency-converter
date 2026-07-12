"use client"

import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import FavoriteButton from "@/components/favoriteButton"
import { Skeleton } from "@/components/ui/skeleton"
import { useHistoricalRates } from "@/hooks/use-historical-rates"
import { useFavoritesStore, type FavoritePair } from "@/store/favorites-store"

/** YYYY-MM-DD for `offset` days before today (0 = today). */
function isoDate(offsetDays: number) {
  const date = new Date()
  date.setDate(date.getDate() - offsetDays)
  return date.toISOString().slice(0, 10)
}

/** Match the design's variable precision: fewer decimals for larger rates. */
function formatRate(rate: number) {
  const decimals = rate >= 100 ? 2 : rate >= 10 ? 3 : 4
  return rate.toFixed(decimals)
}

function FavoriteRow({ pair }: { pair: FavoritePair }) {
  const { base, symbol } = pair

  // A one-week window yields the latest ECB rate plus the prior business day,
  // enough to derive both the current rate and the day-over-day change.
  const { data, isLoading } = useHistoricalRates({
    base,
    symbol,
    startDate: isoDate(7),
    endDate: isoDate(0),
  })

  let rate: number | undefined
  let changePct: number | undefined

  if (data?.rates) {
    const dates = Object.keys(data.rates).sort()
    const latest = dates.at(-1)
    const previous = dates.at(-2)

    if (latest) rate = data.rates[latest]?.[symbol]

    const latestRate = latest ? data.rates[latest]?.[symbol] : undefined
    const previousRate = previous ? data.rates[previous]?.[symbol] : undefined
    if (latestRate != null && previousRate != null && previousRate !== 0) {
      changePct = ((latestRate - previousRate) / previousRate) * 100
    }
  }

  const positive = (changePct ?? 0) >= 0

  return (
    <div className="flex items-center gap-5 rounded-[10px] border border-border bg-secondary px-4 py-3">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="text-preset-4 text-foreground">{base}</span>
        <ArrowRight className="size-3 shrink-0 text-foreground" />
        <span className="text-preset-4 text-foreground">{symbol}</span>
      </div>

      <div className="flex flex-col items-end gap-1.5 text-right">
        {isLoading && rate == null ? (
          <>
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-2.5 w-12" />
          </>
        ) : (
          <>
            <p className="text-preset-3 text-foreground">
              {rate != null ? formatRate(rate) : "—"}
            </p>
            <p
              className={cn(
                "text-preset-6",
                positive ? "text-green-500" : "text-destructive"
              )}
            >
              {changePct != null
                ? `${positive ? "▲" : "▼"} ${positive ? "+" : ""}${changePct.toFixed(2)}%`
                : "—"}
            </p>
          </>
        )}
      </div>

      <FavoriteButton base={base} symbol={symbol} iconOnly />
    </div>
  )
}

export default function FavoritesPanel() {
  const favorites = useFavoritesStore((state) => state.favorites)

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-preset-3-medium text-foreground">PINNED PAIRS</p>
        <p className="text-preset-5 text-foreground/70">
          {favorites.length} FAVORITES
        </p>
      </div>

      {favorites.length === 0 ? (
        <p className="text-preset-4 text-muted-foreground">
          No pinned pairs yet. Tap FAVORITE on a conversion to pin it here.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {favorites.map((pair) => (
            <FavoriteRow key={`${pair.base}-${pair.symbol}`} pair={pair} />
          ))}
        </div>
      )}
    </div>
  )
}
