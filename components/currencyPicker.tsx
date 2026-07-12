"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { CurrencyFlag } from "@/components/currencyFlag"
import type { Currency } from "@/types/types"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface PickerCurrency extends Currency {
  popular?: boolean
}

interface CurrencyPickerProps {
  value: string
  currencies: PickerCurrency[]
  onValueChange: (value: PickerCurrency | null) => void
  /** DOM id for the trigger, so keyboard shortcuts can target it. */
  triggerId?: string
}

function GroupHeading({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex w-full items-center justify-between text-preset-6 tracking-[0.0625rem] text-muted-foreground uppercase">
      <span>{label}</span>
      <span>{count}</span>
    </div>
  )
}

export function CurrencyPicker({
  value,
  currencies,
  onValueChange,
  triggerId,
}: CurrencyPickerProps) {
  const [open, setOpen] = React.useState(false)

  const selected = currencies.find((currency) => currency.code === value)
  const popular = currencies.filter((currency) => currency.popular)
  const others = currencies.filter((currency) => !currency.popular)

  function handleSelect(currency: PickerCurrency) {
    onValueChange(currency.code === value ? null : currency)
    setOpen(false)
  }

  function renderItem(currency: PickerCurrency) {
    return (
      <CommandItem
        key={currency.code}
        value={`${currency.code} ${currency.name}`}
        data-checked={currency.code === value}
        onSelect={() => handleSelect(currency)}
        className="gap-3 px-2 py-2"
      >
        <CurrencyFlag code={currency.code} className="size-6" />
        <span className="text-preset-3-bold text-foreground">
          {currency.code}
        </span>
        <span className="truncate text-preset-4 text-muted-foreground">
          {currency.name}
        </span>
      </CommandItem>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          id={triggerId}
          variant="secondary"
          role="combobox"
          aria-expanded={open}
          className="h-auto shrink-0 gap-2 rounded-lg border border-border p-2.5 text-preset-4"
        >
          {selected ? (
            <>
              <CurrencyFlag code={selected.code} className="size-6" />
              <span className="text-foreground">{selected.code}</span>
            </>
          ) : (
            <span className="text-muted-foreground">Select</span>
          )}
          <ChevronDown
            className={cn(
              "size-3 text-foreground transition-transform",
              open && "rotate-180"
            )}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-80 p-0">
        <Command>
          <CommandInput placeholder="Search currencies..." />
          <CommandList>
            <CommandEmpty>No currency found.</CommandEmpty>
            {popular.length > 0 && (
              <CommandGroup
                heading={
                  <GroupHeading label="Popular" count={popular.length} />
                }
              >
                {popular.map(renderItem)}
              </CommandGroup>
            )}
            {others.length > 0 && (
              <CommandGroup
                heading={
                  <GroupHeading
                    label="Other currencies"
                    count={others.length}
                  />
                }
              >
                {others.map(renderItem)}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
