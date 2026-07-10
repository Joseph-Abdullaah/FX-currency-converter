import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ConverterState {
  amount: number
  base: string
  symbol: string
}

interface ConverterActions {
  setAmount: (amount: number) => void
  setBase: (base: string) => void
  setSymbol: (symbol: string) => void

  swapCurrencies: () => void
}

export interface ConverterStore extends ConverterState, ConverterActions {}

const initialState: ConverterState = {
  amount: 1,
  base: "USD",
  symbol: "EUR",
}

export const useConverterStore = create<ConverterStore>()(
  persist(
    (set) => ({
      ...initialState,

      setAmount: (amount) => set({ amount }),

      setBase: (base) => set({ base }),

      setSymbol: (symbol) => set({ symbol }),

      swapCurrencies: () =>
        set((state) => ({
          base: state.symbol,
          symbol: state.base,
        })),
    }),
    {
      name: "converter-store",
    }
  )
)
