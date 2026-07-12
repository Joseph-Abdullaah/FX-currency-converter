/** ISO 4217 currency codes start with the ISO 3166 country code (USD → us). */
export function countryOf(code: string) {
  return code.slice(0, 2).toLowerCase()
}

/** Path to a currency's flag asset, keyed by lowercase ISO country code. */
export function flagSrc(code: string) {
  return `/assets/images/flags/${countryOf(code)}.webp`
}
