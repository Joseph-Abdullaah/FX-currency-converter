import Image from "next/image"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"

interface CurrencyButtonProps {
  code?: string
  /** lowercase ISO country code matching public/assets/images/flags/<code>.webp */
  country?: string
}

export default function CurrencyButton({
  code = "USD",
  country = "us",
}: CurrencyButtonProps) {
  return (
    <Button
      type="button"
      variant="secondary"
      className="h-auto shrink-0 gap-2 rounded-lg border border-border p-2.5 text-preset-4"
    >
      <Image
        src={`/assets/images/flags/${country}.webp`}
        alt=""
        width={20}
        height={20}
        className="size-5 rounded-full object-cover"
      />
      <span className="text-foreground">{code}</span>
      <ChevronDown className="size-3 text-foreground" />
    </Button>
  )
}
