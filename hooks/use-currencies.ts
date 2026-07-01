import { useQuery } from "@tanstack/react-query"
import { getCurrencies } from "@/services/api"
import { queryKeys } from "@/lib/query-keys"

export function useCurrencies() {
  return useQuery({
    queryKey: queryKeys.currencies,
    queryFn: getCurrencies,

    staleTime: Infinity,
    gcTime: Infinity,
  })
}
