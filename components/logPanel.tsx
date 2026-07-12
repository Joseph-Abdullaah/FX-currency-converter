"use client"

import { ArrowRight, Trash2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import ExportLog from "@/components/exportLog"
import { useConversionLogStore } from "@/store/conversion-log-store"

const amountFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
})

/** Match the design's variable precision: fewer decimals for larger rates. */
function formatRate(rate: number) {
  const decimals = rate >= 100 ? 2 : rate >= 10 ? 3 : 4
  return rate.toFixed(decimals)
}

/** ISO timestamp -> "MAY 14 · 16:00". */
function formatTimestamp(iso: string) {
  const date = new Date(iso)
  const day = date
    .toLocaleDateString("en-US", { month: "short", day: "numeric" })
    .toUpperCase()
  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
  return `${day} · ${time}`
}

export default function LogPanel() {
  const logs = useConversionLogStore((state) => state.logs)
  const removeLog = useConversionLogStore((state) => state.removeLog)
  const clearLogs = useConversionLogStore((state) => state.clearLogs)

  return (
    <div className="rounded-2xl border border-border bg-card px-5 pb-5">
      <div className="flex items-center justify-between py-5">
        <p className="text-preset-3-medium text-foreground">LOG</p>
        <div className="flex items-center gap-3">
          <p className="hidden text-preset-5 text-foreground/70 sm:block">
            {logs.length} {logs.length === 1 ? "ENTRY" : "ENTRIES"}
          </p>
          <div className="flex items-center gap-2">
            <ExportLog logs={logs} />
            <Button
              type="button"
              variant="outline"
              onClick={clearLogs}
              disabled={logs.length === 0}
              className="h-auto gap-1.5 rounded-lg px-3 py-1.5 text-preset-5-medium text-foreground"
            >
              <Trash2 className="size-3.5" />
              CLEAR
            </Button>
          </div>
        </div>
      </div>

      {logs.length === 0 ? (
        <p className="pb-1 text-preset-4 text-muted-foreground">
          No conversions logged yet. Tap LOG CONVERSION to save one here.
        </p>
      ) : (
        <div className="flex flex-col">
          {logs.map((log, i) => {
            const rate = log.amount ? log.result / log.amount : 0

            return (
              <div
                key={log.id}
                className={cn(
                  "flex items-center justify-between gap-4 py-3.5",
                  i > 0 && "border-t border-border"
                )}
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="text-preset-5 text-foreground/70">
                    {formatTimestamp(log.createdAt)}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-preset-3 text-foreground">
                    <span>
                      {amountFormatter.format(log.amount)} {log.base}
                    </span>
                    <ArrowRight className="size-3.5 text-muted-foreground" />
                    <span className="text-primary">
                      {amountFormatter.format(log.result)} {log.symbol}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-4">
                  <p className="hidden text-preset-5 text-foreground/70 sm:block">
                    1 {log.base} = {formatRate(rate)} {log.symbol}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeLog(log.id)}
                    aria-label={`Delete ${log.base} to ${log.symbol} entry`}
                    className="cursor-pointer rounded-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
