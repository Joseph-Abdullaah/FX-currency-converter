import { useQuery } from "@tanstack/react-query"
import { convertCurrency } from "@/services/api"
import { queryKeys } from "@/lib/query-keys"
import type { ConvertCurrencyParams } from "@/types/types"

export function useConvertCurrency(params: ConvertCurrencyParams) {
  return useQuery({
    queryKey: queryKeys.convertCurrency(
      params.amount,
      params.base,
      params.symbol
    ),
    queryFn: () => convertCurrency(params),
    enabled: Boolean(params.base && params.symbol) && Number.isFinite(params.amount),
  })
}
