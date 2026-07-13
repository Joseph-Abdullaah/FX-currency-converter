import Image from "next/image"

import { cn } from "@/lib/utils"
import { flagSrc } from "@/lib/currency"

interface CurrencyFlagProps {
  /** Currency code; the flag is derived from its leading country code. */
  code: string
  /** Rendered pixel size (width and height). Match the Tailwind `size-*` class. */
  size?: number
  className?: string
}

/** Circular country flag for a currency code. */
export function CurrencyFlag({
  code,
  size = 24,
  className,
}: CurrencyFlagProps) {
  return (
    <Image
      src={flagSrc(code)}
      alt=""
      width={size}
      height={size}
      className={cn("shrink-0 rounded-full object-cover", className)}
    />
  )
}
