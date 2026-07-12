"use client"

import Logo from "@/components/logo"
import ThemeToggle from "@/components/themeToggle"
import { Skeleton } from "@/components/ui/skeleton"
import { useCurrencies } from "@/hooks/use-currencies"

export interface HeaderProps {
  dataProvider: string
  dataType: string
}

export default function Header({ dataProvider, dataType }: HeaderProps) {
  const { data: currencies, isLoading } = useCurrencies()
  const currencyCount = currencies?.length

  return (
    <header className="mx-auto flex w-full max-w-360 items-center justify-between p-4 md:px-6 md:py-5">
      <Logo />
      <div className="flex items-center gap-4">
        <div className="flex gap-2 text-[10px] text-muted-foreground md:text-base">
          <div className="flex items-center gap-1">
            {isLoading ? (
              <Skeleton className="h-2.5 w-5" />
            ) : (
              (currencyCount ?? "—")
            )}
            CURRENCIES
          </div>
          ·<p>{dataProvider}</p>·<p>{dataType}</p>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}
