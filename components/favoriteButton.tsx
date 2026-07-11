"use client"

import { Star } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useConverterStore } from "@/store/convert-store"
import { useFavoritesStore } from "@/store/favorites-store"

interface FavoriteButtonProps {
  /** Defaults to the active converter pair when omitted. */
  base?: string
  symbol?: string
  /** Compact 32px star-only button used inside the favorites panel rows. */
  iconOnly?: boolean
}

export default function FavoriteButton({
  base,
  symbol,
  iconOnly = false,
}: FavoriteButtonProps) {
  const storeBase = useConverterStore((state) => state.base)
  const storeSymbol = useConverterStore((state) => state.symbol)

  const pairBase = base ?? storeBase
  const pairSymbol = symbol ?? storeSymbol

  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)
  const favorited = useFavoritesStore((state) =>
    state.favorites.some(
      (fav) => fav.base === pairBase && fav.symbol === pairSymbol
    )
  )

  const label = `${favorited ? "Remove" : "Add"} ${pairBase}/${pairSymbol} ${
    favorited ? "from" : "to"
  } favorites`

  function handleToggle() {
    toggleFavorite({ base: pairBase, symbol: pairSymbol })
  }

  if (iconOnly) {
    return (
      <Button
        type="button"
        variant="secondary"
        size="icon"
        aria-label={label}
        aria-pressed={favorited}
        onClick={handleToggle}
        className={cn(
          "size-8 shrink-0 rounded-lg border border-border",
          favorited && "border-primary"
        )}
      >
        <Star
          className={cn("size-4", favorited && "fill-primary text-primary")}
        />
      </Button>
    )
  }

  return (
    <Button
      type="button"
      variant="secondary"
      aria-pressed={favorited}
      onClick={handleToggle}
      className={cn(
        "h-auto gap-2 rounded-lg border border-border px-3 py-2 text-preset-5-medium",
        // Active state: solid lime with dark text/star — identical in both
        // themes (primary/primary-foreground are theme-invariant). Hover stays
        // opaque so it never blends with the card behind it.
        favorited &&
          "border-primary bg-primary text-primary-foreground hover:bg-[color-mix(in_oklch,var(--primary),var(--primary-foreground)_12%)]"
      )}
    >
      <Star className={cn("size-4", favorited && "fill-current")} />
      {favorited ? "FAVORITED" : "FAVORITE"}
    </Button>
  )
}
