"use client"

import { ChevronDown, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { ConversionLog } from "@/store/conversion-log-store"
import { exportLogsAsCsv, exportLogsAsJson } from "@/lib/export-log"

interface ExportLogProps {
  logs: ConversionLog[]
}

export default function ExportLog({ logs }: ExportLogProps) {
  const disabled = logs.length === 0

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className="h-auto gap-1.5 rounded-lg px-3 py-1.5 text-preset-5-medium text-foreground"
        >
          <Download className="size-3.5" />
          EXPORT
          <ChevronDown className="size-3.5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-auto min-w-44">
        <DropdownMenuItem
          className="text-preset-5-medium"
          onSelect={() => exportLogsAsCsv(logs)}
        >
          Export CSV
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-preset-5-medium"
          onSelect={() => exportLogsAsJson(logs)}
        >
          Export JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
