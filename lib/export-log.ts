import type { ConversionLog } from "@/store/conversion-log-store"

/** Triggers a client-side file download via a Blob URL — no server involved. */
function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

/** Escapes a value for safe inclusion in a CSV cell. */
function toCsvCell(value: string | number): string {
  const text = String(value)
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

const CSV_HEADERS = [
  "Date",
  "Amount",
  "Base Currency",
  "Target Currency",
  "Result",
] as const

/** Downloads the log as `conversion-log.csv` with the required columns. */
export function exportLogsAsCsv(logs: ConversionLog[]) {
  const rows = logs.map((log) =>
    [log.createdAt, log.amount, log.base, log.symbol, log.result]
      .map(toCsvCell)
      .join(",")
  )
  const csv = [CSV_HEADERS.join(","), ...rows].join("\n")
  downloadFile("conversion-log.csv", csv, "text/csv;charset=utf-8")
}

/** Downloads the complete log as `conversion-log.json`. */
export function exportLogsAsJson(logs: ConversionLog[]) {
  const json = JSON.stringify(logs, null, 2)
  downloadFile("conversion-log.json", json, "application/json")
}
