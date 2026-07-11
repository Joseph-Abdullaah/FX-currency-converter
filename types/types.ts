export type CurrencyResponse = Record<string, string>

// Model used throughout the app
export interface Currency {
  code: string
  name: string
}


export interface LatestRatesResponse {
  amount: number
  base: string
  date: string
  rates: Record<string, number>
}

export interface HistoricalRatesResponse {
  amount: number
  base: string
  startDate: string
  endDate: string
  rates: Record<string, Record<string, number>>
}

export interface ConvertCurrencyParams {
  amount: number;
  base: string;
  symbol: string;
}

export interface GetLatestRatesParams {
  base: string,
  symbols?: string[]
}

export interface GetHistoricalRatesParams {
  startDate: string,
  endDate: string,
  base: string,
  /** Omit to fetch every symbol quoted against `base` in one request. */
  symbol?: string
}