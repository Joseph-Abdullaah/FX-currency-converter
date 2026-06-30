import { fetcher } from "@/lib/fetcher"
import { endpoints } from "@/services/endpoints"
import type {
  Currency,
  CurrencyResponse,
  LatestRatesResponse,
  ConvertCurrencyParams,
  GetLatestRatesParams,
  GetHistoricalRatesParams,
  HistoricalRatesResponse,
} from "@/types/types"

export async function getCurrencies(): Promise<Currency[]> {
  const data = await fetcher<CurrencyResponse>(endpoints.currencies)

  return Object.entries(data).map(([code, name]) => ({
    code,
    name,
  }))
}

export async function convertCurrency({
  amount,
  base,
  symbol,
}: ConvertCurrencyParams) {
  const params = new URLSearchParams({
    amount: amount.toString(),
    base,
    symbols: symbol,
  })

  return fetcher<LatestRatesResponse>(`${endpoints.latest}?${params}`)
}

export async function getLatestRates({ base, symbol }: GetLatestRatesParams) {
  const params = new URLSearchParams({
    base,
  })

  if (symbol?.length) {
    params.set("symbol", symbol.join(","))
  }

  return fetcher<LatestRatesResponse>(`${endpoints.latest}?${params}`)
}

export async function getHistoricalRates({
  startDate,
  endDate,
  base,
  symbol,
}: GetHistoricalRatesParams) {
  const params = new URLSearchParams({
    base,
    symbols: symbol,
  })

  return fetcher<HistoricalRatesResponse>(`/${startDate}..${endDate}?${params}`)
}
