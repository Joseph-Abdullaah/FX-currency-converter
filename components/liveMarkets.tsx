"use client"

import { InfiniteSlider } from "@/components/motion-primitives/infinite-slider"
import { ProgressiveBlur } from "@/components/motion-primitives/progressive-blur"
import LiveRates from "@/components/liveRates"
import { useLatestRates } from "@/hooks/use-latest-rates"
import { useHistoricalRates } from "@/hooks/use-historical-rates"

/** Every ticker pair is quoted against USD. */
const TICKER_BASE = "USD"

/** YYYY-MM-DD for `offset` days before today (0 = today). */
function isoDate(offsetDays: number) {
  const date = new Date()
  date.setDate(date.getDate() - offsetDays)
  return date.toISOString().slice(0, 10)
}

export default function LiveMarkets() {
  // Current rate for every symbol against USD, in one polled request — this
  // both drives the pair list and provides the live rate shown in the ticker.
  const { data: latest } = useLatestRates({ base: TICKER_BASE })

  // One all-symbols historical window supplies each pair's prior close, so the
  // day-over-day change is derived without an extra request per pair.
  const { data: history } = useHistoricalRates({
    base: TICKER_BASE,
    startDate: isoDate(9),
    endDate: isoDate(0),
  })

  // Prior close = the most recent published day strictly before the latest one.
  const previousRates =
    latest?.date && history?.rates
      ? history.rates[
          Object.keys(history.rates)
            .sort()
            .reverse()
            .find((date) => date < latest.date) ?? ""
        ]
      : undefined

  const items = latest?.rates
    ? Object.entries(latest.rates).map(([symbol, rate]) => {
        const previous = previousRates?.[symbol]
        const changePct =
          previous != null && previous !== 0
            ? ((rate - previous) / previous) * 100
            : undefined
        return { symbol, rate, changePct }
      })
    : []

  return (
    <section className="w-full overflow-hidden bg-background">
      <div className="group relative m-auto">
        <div className="flex items-center">
          <p className="bg-primary px-2 py-3 text-[10px] text-primary-foreground md:px-4 md:py-3 md:text-xs">
            · LIVE MARKETS
          </p>
          <div className="relative w-[calc(100%-8.625rem)] **:fill-foreground">
            {items.length > 0 ? (
              <>
                <InfiniteSlider speedOnHover={20} speed={50} gap={0}>
                  {items.map((item) => (
                    <LiveRates
                      key={item.symbol}
                      base={TICKER_BASE}
                      symbol={item.symbol}
                      rate={item.rate}
                      changePct={item.changePct}
                    />
                  ))}
                </InfiniteSlider>

                <div
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-20 bg-linear-to-r from-background"
                />
                <div
                  aria-hidden
                  className="absolute inset-y-0 right-0 w-20 bg-linear-to-l from-background"
                />
                <ProgressiveBlur
                  className="pointer-events-none absolute top-0 left-0 h-full w-5"
                  direction="left"
                  blurIntensity={0.25}
                />
                <ProgressiveBlur
                  className="pointer-events-none absolute top-0 right-0 h-full w-5"
                  direction="right"
                  blurIntensity={0.25}
                />
              </>
            ) : (
              <p className="px-3 py-3 text-[10px] text-muted-foreground md:px-5 md:text-xs">
                Loading live markets…
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
