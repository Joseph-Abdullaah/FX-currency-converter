export const queryKeys = {
  currencies: ["currencies"] as const,

  latestRates: (base: string, symbols?: string[]) =>
    ["latest-rates", base, symbols] as const,

  convertCurrency: (amount: number, base: string, symbol: string) =>
    ["convert-currency", amount, base, symbol] as const,

  historicalRates: (
    base: string,
    symbol: string,
    startDate: string,
    endDate: string
  ) => ["historical-rates", base, symbol, startDate, endDate] as const,
}
