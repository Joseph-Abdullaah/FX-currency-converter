"use client"

import Image from "next/image"

import FavoriteButton from "@/components/favoriteButton"
import { useConverterStore } from "@/store/convert-store"
import { useCurrencies } from "@/hooks/use-currencies"
import { useLatestRates } from "@/hooks/use-latest-rates"

/**
 * Curated set of major currencies the input is compared against. Only the list
 * of codes is fixed — every rate, amount and name below comes from the API.
 * All are valid ECB/Frankfurter codes (e.g. the design's "BDT" is unsupported).
 */
const COMPARE_CODES = ["EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "CNY", "INR"]

/** ISO 4217 currency codes start with the ISO 3166 country code (GBP → gb). */
function countryOf(code: string) {
  return code.slice(0, 2).toLowerCase()
}

/** Match the design's variable precision: fewer decimals for larger rates. */
function formatRate(rate: number) {
  const decimals = rate >= 100 ? 2 : rate >= 10 ? 3 : 4
  return rate.toFixed(decimals)
}

const amountFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
})

const convertedFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export default function ComparePanel() {
  const amount = useConverterStore((state) => state.amount)
  const base = useConverterStore((state) => state.base)

  // Compare the base against every curated currency except the base itself.
  const symbols = COMPARE_CODES.filter((code) => code !== base)

  const { data: rateData, isError } = useLatestRates({ base, symbols })
  const { data: currencies } = useCurrencies()

  const nameByCode = new Map(
    (currencies ?? []).map((currency) => [currency.code, currency.name])
  )

  const rows = symbols.map((code) => {
    const rate = rateData?.rates?.[code]
    return {
      code,
      rate,
      converted: rate != null ? amount * rate : undefined,
      name: nameByCode.get(code) ?? code,
    }
  })

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-preset-3-medium text-foreground">
          MULTI-CURRENCY{" "}
          <span className="text-foreground/70">
            {amountFormatter.format(amount)} FROM {base}
          </span>
        </p>
        <p className="shrink-0 text-preset-5 text-foreground/70">
          {rows.length} PAIRS
        </p>
      </div>

      {isError ? (
        <p className="text-preset-4 text-muted-foreground">
          Couldn&apos;t load comparison rates. Please try again.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((row) => (
            <div
              key={row.code}
              className="flex items-center gap-4 rounded-[10px] border border-border bg-secondary px-4 py-3"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <Image
                  src={`/assets/images/flags/${countryOf(row.code)}.webp`}
                  alt=""
                  width={28}
                  height={28}
                  className="size-7 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="text-preset-3-bold text-foreground">
                    {row.code}
                  </p>
                  <p className="truncate text-preset-5 text-foreground/70">
                    {row.name}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-preset-2-bold text-foreground">
                  {row.converted != null
                    ? convertedFormatter.format(row.converted)
                    : "—"}
                </p>
                <p className="text-preset-5 text-foreground/70">
                  @ {row.rate != null ? formatRate(row.rate) : "—"}
                </p>
              </div>

              <FavoriteButton base={base} symbol={row.code} iconOnly />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
