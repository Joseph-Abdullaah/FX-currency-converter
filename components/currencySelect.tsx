"use client"

import * as React from "react"

import { CurrencyPicker } from "@/components/currencyPicker"
import { useCurrencies } from "@/hooks/use-currencies"

/** Codes surfaced under the "Popular" group in the picker. */
const POPULAR_CODES = new Set(["USD", "EUR", "GBP"])

interface CurrencySelectProps {
  value: string
  onValueChange: (code: string) => void
  /** DOM id for the trigger, so keyboard shortcuts can target it. */
  triggerId?: string
}

export default function CurrencySelect({
  value,
  onValueChange,
  triggerId,
}: CurrencySelectProps) {
  const { data } = useCurrencies()

  const currencies = React.useMemo(() => {
    const list = (data ?? []).map((currency) => ({
      ...currency,
      popular: POPULAR_CODES.has(currency.code),
    }))

    // Ensure the current selection always renders (code + flag) even before
    // the currencies list has loaded from the API.
    if (value && !list.some((currency) => currency.code === value)) {
      list.unshift({ code: value, name: value, popular: false })
    }

    return list
  }, [data, value])

  return (
    <CurrencyPicker
      value={value}
      currencies={currencies}
      onValueChange={(currency) => currency && onValueChange(currency.code)}
      triggerId={triggerId}
    />
  )
}
