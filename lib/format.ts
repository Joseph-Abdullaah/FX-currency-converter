/** Match the design's variable precision: fewer decimals for larger rates. */
export function decimalsFor(rate: number) {
  return rate >= 100 ? 2 : rate >= 10 ? 3 : 4
}

/** Format an exchange rate with the design's variable precision. */
export function formatRate(rate: number) {
  return rate.toFixed(decimalsFor(rate))
}

/** Entered/echoed amounts: up to 2 decimals, no trailing zeros forced. */
export const amountFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
})

/** Converted money values: always exactly 2 decimals. */
export const moneyFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
