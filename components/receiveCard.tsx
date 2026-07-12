"use client"

import CurrencySelect from "@/components/currencySelect"
import { useConverterStore } from "@/store/convert-store"

const formatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

interface ReceiveCardProps {
  converted?: number
  isLoading?: boolean
  isError?: boolean
}

export default function ReceiveCard({
  converted,
  isLoading,
  isError,
}: ReceiveCardProps) {
  const symbol = useConverterStore((state) => state.symbol)
  const setSymbol = useConverterStore((state) => state.setSymbol)

  const display =
    converted != null
      ? formatter.format(converted)
      : isLoading
        ? "…"
        : isError
          ? "—"
          : "0.00"

  return (
    <div className="flex flex-1 flex-col justify-end gap-5 rounded-2xl border border-border bg-secondary p-5">
      <span className="text-preset-4 text-muted-foreground">RECEIVE</span>
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-col items-start">
          <p className="truncate text-preset-1 text-primary">{display}</p>
          <div className="h-px w-29.5 bg-border" />
        </div>
        <CurrencySelect
          value={symbol}
          onValueChange={setSymbol}
          triggerId="receive-currency-trigger"
        />
      </div>
    </div>
  )
}
