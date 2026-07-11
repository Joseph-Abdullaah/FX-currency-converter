import { useQuery } from "@tanstack/react-query"
import { getHistoricalRates } from "@/services/api"
import { queryKeys } from "@/lib/query-keys"
import type { GetHistoricalRatesParams } from "@/types/types"

export function useHistoricalRates(params: GetHistoricalRatesParams) {
  return useQuery({
    queryKey: queryKeys.historicalRates(
      params.base,
      params.symbol,
      params.startDate,
      params.endDate
    ),
    queryFn: () => getHistoricalRates(params),
    // `symbol` is optional — omitting it fetches every symbol against `base`.
    enabled: Boolean(params.base && params.startDate && params.endDate),
  })
}
