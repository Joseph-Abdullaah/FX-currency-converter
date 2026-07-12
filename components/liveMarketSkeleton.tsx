import { Skeleton } from "@/components/ui/skeleton"

/** Placeholder ticker cells shown while live-market rates load. */
export default function LiveMarketSkeleton() {
  return (
    <div className="flex" aria-hidden>
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-2.5 border-r border-border bg-card p-3 md:px-5 md:py-3"
        >
          <Skeleton className="h-2.5 w-10" />
          <Skeleton className="h-2.5 w-12" />
          <Skeleton className="h-2.5 w-10" />
        </div>
      ))}
    </div>
  )
}
