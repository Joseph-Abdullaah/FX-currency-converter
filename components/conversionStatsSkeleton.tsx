import { Skeleton } from "@/components/ui/skeleton"

/** Placeholder stat cards (open/last/change/%) shown while history loads. */
export default function ConversionStatsSkeleton() {
  return (
    <div className="flex flex-1 flex-wrap gap-4" aria-hidden>
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex min-w-35 flex-1 flex-col justify-center gap-4 rounded-2xl border border-border bg-card px-5 py-3 md:w-full md:max-w-35"
        >
          <Skeleton className="h-3.5 w-14" />
          <Skeleton className="h-5 w-16" />
        </div>
      ))}
    </div>
  )
}
