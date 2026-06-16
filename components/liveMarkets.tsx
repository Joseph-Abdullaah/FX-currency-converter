import { InfiniteSlider } from "@/components/motion-primitives/infinite-slider"
import { ProgressiveBlur } from "@/components/motion-primitives/progressive-blur"
import LiveRates from "@/components/liveRates"
export interface LiveMarket {
  id: number
  pair: string
  rate: number
  change: number
}

export interface LiveMarketTickerProps {
  items: LiveMarket[]
}

export default function LiveMarkets({ items }: LiveMarketTickerProps) {
  return (
    <section className="w-full overflow-hidden bg-background">
      <div className="group relative m-auto">
        <div className="flex items-center">
          <p className="bg-[#CEF739] px-2 py-3 text-[10px] text-black md:px-4 md:py-3 md:text-xs">
            · LIVE MARKETS
          </p>
          <div className="relative w-[calc(100%-8.625rem)] **:fill-foreground">
            <InfiniteSlider speedOnHover={20} speed={50} gap={0}>
              {items.map((item) => (
                <LiveRates
                  key={item.id}
                  currencyPairs={item.pair}
                  exchangeRate={item.rate}
                  exchangeRateChange={item.change}
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
          </div>
        </div>
      </div>
    </section>
  )
}
