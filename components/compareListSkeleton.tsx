import { Skeleton } from "@/components/ui/skeleton"

interface CompareListSkeletonProps {
  /** Number of placeholder rows — match the real list to avoid layout shift. */
  rows?: number
}

/** Placeholder rows shown while multi-currency comparison rates load. */
export default function CompareListSkeleton({
  rows = 8,
}: CompareListSkeletonProps) {
  return (
    <div className="flex flex-col gap-3" aria-hidden>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 rounded-[10px] border border-border bg-secondary px-4 py-3"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Skeleton className="size-7 shrink-0 rounded-full" />
            <div className="flex min-w-0 flex-col gap-1.5">
              <Skeleton className="h-3.5 w-12" />
              <Skeleton className="h-2.5 w-24" />
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-2.5 w-12" />
          </div>

          <Skeleton className="size-8 shrink-0 rounded-lg" />
        </div>
      ))}
    </div>
  )
}
