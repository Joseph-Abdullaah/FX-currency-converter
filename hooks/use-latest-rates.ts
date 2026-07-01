import { useQuery } from "@tanstack/react-query"
import { getLatestRates } from "@/services/api"
import { queryKeys } from "@/lib/query-keys"
import type { GetLatestRatesParams } from "@/types/types"

export function useLatestRates(params: GetLatestRatesParams) {
  return useQuery({
    queryKey: queryKeys.latestRates(params.base, params.symbols),
    queryFn: () => getLatestRates(params),
    enabled: Boolean(params.base),
    refetchInterval: 60 * 1000, // Refetch every 60 seconds
  })
}
