import { useQuery } from "@tanstack/react-query"
import { getHistoricalRates } from "@/services/api"
import { queryKeys } from "@/lib/query-keys"
import type { GetHistoricalRatesParams } from "@/types/types"

export function useHistoricalRates(params: GetHistoricalRatesParams) {
  return useQuery({
    queryKey: queryKeys.historicalRates(
      params.startDate,
      params.endDate,
      params.base,
      params.symbol
    ),
    queryFn: () => getHistoricalRates(params),
    enabled: Boolean(
      params.base && params.symbol && params.startDate && params.endDate
    ),
  })
}
