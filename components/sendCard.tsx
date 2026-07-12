"use client"

import * as React from "react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import CurrencySelect from "@/components/currencySelect"
import { useConverterStore } from "@/store/convert-store"

const formatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
})

export default function SendCard() {
  const amount = useConverterStore((state) => state.amount)
  const base = useConverterStore((state) => state.base)
  const setAmount = useConverterStore((state) => state.setAmount)
  const setBase = useConverterStore((state) => state.setBase)

  const [draft, setDraft] = React.useState("")
  const [focused, setFocused] = React.useState(false)

  // While editing, show the user's raw keystrokes; otherwise mirror the store
  // (formatted), so external changes like hydration or swap flow straight in.
  const value = focused ? draft : formatter.format(amount)

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    // Accept digits and a single decimal point only — drop anything else
    // (letters, symbols, extra dots) so the field is numbers-only.
    const cleaned = event.target.value
      .replace(/[^\d.]/g, "")
      .replace(/(\..*)\./g, "$1")
    setDraft(cleaned)

    if (cleaned === "") {
      setAmount(0)
    } else {
      const parsed = Number(cleaned)
      if (Number.isFinite(parsed)) setAmount(parsed)
    }
  }

  return (
    <div className="flex flex-1 flex-col justify-end gap-5 rounded-2xl border border-border bg-secondary p-5">
      <Label
        htmlFor="send-amount"
        className="text-preset-4 text-muted-foreground"
      >
        SEND
      </Label>
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-col items-start">
          <Input
            id="send-amount"
            inputMode="decimal"
            value={value}
            onChange={handleChange}
            onFocus={() => {
              setDraft(amount ? String(amount) : "")
              setFocused(true)
            }}
            onBlur={() => setFocused(false)}
            placeholder="0"
            className="h-auto w-full border-0 bg-transparent p-0 text-preset-1 text-[2.5rem]! text-foreground shadow-none focus-visible:ring-0 dark:bg-transparent"
          />
          <div className="h-px w-29.5 bg-border" />
        </div>
        <CurrencySelect
          value={base}
          onValueChange={setBase}
          triggerId="send-currency-trigger"
        />
      </div>
    </div>
  )
}
