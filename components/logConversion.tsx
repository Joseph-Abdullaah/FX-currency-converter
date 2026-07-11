"use client"

import { Button } from "@/components/ui/button"
import { useConverterStore } from "@/store/convert-store"
import { useConvertCurrency } from "@/hooks/use-convert-currency"
import { useConversionLogStore } from "@/store/conversion-log-store"

export default function LogConversion() {
  const amount = useConverterStore((state) => state.amount)
  const base = useConverterStore((state) => state.base)
  const symbol = useConverterStore((state) => state.symbol)
  const addLog = useConversionLogStore((state) => state.addLog)

  // Same query key as the converter, so this reuses the cached result.
  const { data } = useConvertCurrency({ amount, base, symbol })
  const result = base === symbol ? amount : data?.rates?.[symbol]

  const disabled = result == null || amount <= 0

  function handleLog() {
    if (result == null) return

    addLog({
      id: crypto.randomUUID(),
      amount,
      base,
      symbol,
      result,
      createdAt: new Date().toISOString(),
    })
  }

  return (
    <Button
      type="button"
      variant="outline"
      disabled={disabled}
      onClick={handleLog}
      className="h-auto gap-2 rounded-lg border-primary px-3 py-2 text-preset-5-medium text-foreground"
    >
      LOG CONVERSION
    </Button>
  )
}
