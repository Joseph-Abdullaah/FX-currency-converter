"use client"

import SendCard from "@/components/sendCard"
import SwapButton from "@/components/swapButton"
import ReceiveCard from "@/components/receiveCard"
import FavoriteButton from "@/components/favoriteButton"
import LogConversion from "@/components/logConversion"
import { useConverterStore } from "@/store/convert-store"
import { useConvertCurrency } from "@/hooks/use-convert-currency"

export default function ConverterWrapper() {
  const amount = useConverterStore((state) => state.amount)
  const base = useConverterStore((state) => state.base)
  const symbol = useConverterStore((state) => state.symbol)

  const { data, isLoading, isError } = useConvertCurrency({
    amount,
    base,
    symbol,
  })

  const converted =
    base === symbol ? amount : data?.rates?.[symbol]

  const rate =
    base === symbol
      ? 1
      : converted != null && amount > 0
        ? converted / amount
        : undefined

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-preset-2 text-foreground">CHECK THE RATE</h2>

      <div className="overflow-hidden rounded-[20px] bg-card ring-1 ring-border shadow-[0px_12px_40px_0px_rgba(0,0,0,0.4)]">
        <div className="flex flex-col items-stretch gap-6 p-5 md:flex-row md:items-center">
          <SendCard />
          <div className="flex justify-center">
            <SwapButton />
          </div>
          <ReceiveCard
            converted={converted}
            isLoading={isLoading}
            isError={isError}
          />
        </div>

        <div className="flex flex-col items-start gap-4 border-t border-dashed border-border px-5 pt-4 pb-4 md:flex-row md:items-center md:justify-between">
          <p className="text-preset-5 text-foreground">
            {rate != null
              ? `1 ${base} = ${rate.toFixed(4)} ${symbol}`
              : `1 ${base} = — ${symbol}`}
          </p>
          <div className="flex items-center gap-3">
            <FavoriteButton />
            <LogConversion />
          </div>
        </div>
      </div>
    </section>
  )
}
