import { Skeleton } from "@/components/ui/skeleton"

/** Full-area placeholder shown while the rate-history chart loads. */
export default function RateChartSkeleton() {
  return <Skeleton className="h-68 w-full rounded-xl" aria-hidden />
}
