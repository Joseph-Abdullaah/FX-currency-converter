"use client"

import { Button } from "@/components/ui/button"
import { useConverterStore } from "@/store/convert-store"

export default function SwapButton() {
  const swapCurrencies = useConverterStore((state) => state.swapCurrencies)

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon"
      aria-label="Swap currencies"
      onClick={swapCurrencies}
      className="size-12 shrink-0 rounded-lg border border-border"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 20 20"
        className="size-5"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M6 9 2 5l4-4M2 5h16m-4 6 4 4-4 4m4-4H2"
        />
      </svg>
    </Button>
  )
}
