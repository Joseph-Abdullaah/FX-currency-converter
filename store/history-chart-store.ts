import { create } from "zustand"
import { persist } from "zustand/middleware"

export type ChartRange = "1D" | "1W" | "1M" | "3M" | "1Y" | "5Y"

interface HistoryChartState {
  range: ChartRange
}

interface HistoryChartActions {
  setRange: (range: ChartRange) => void
}

type HistoryChartStore = HistoryChartState & HistoryChartActions

const initialState: HistoryChartState = {
  range: "1M",
}

export const useHistoryChartStore = create<HistoryChartStore>()(
  persist(
    (set) => ({
      ...initialState,

      setRange: (range) => set({ range }),
    }),
    {
      name: "history-chart-store",
    }
  )
)