import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface ConversionLog {
  id: string
  amount: number
  base: string
  symbol: string
  result: number
  createdAt: string
}

interface ConversionLogState {
  logs: ConversionLog[]
}

interface ConversionLogActions {
  addLog: (log: ConversionLog) => void
  removeLog: (id: string) => void
  clearLogs: () => void
}

type ConversionLogStore = ConversionLogState & ConversionLogActions

const initialState: ConversionLogState = {
  logs: [],
}

export const useConversionLogStore = create<ConversionLogStore>()(
  persist(
    (set) => ({
      ...initialState,

      addLog: (log) =>
        set((state) => ({
          logs: [log, ...state.logs], // newest first
        })),

      removeLog: (id) =>
        set((state) => ({
          logs: state.logs.filter((log) => log.id !== id),
        })),

      clearLogs: () =>
        set({
          logs: [],
        }),
    }),
    {
      name: "conversion-log-store",
    }
  )
);