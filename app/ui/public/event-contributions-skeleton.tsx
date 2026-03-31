import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function EventContributionsSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Skeleton */}
      <Card className="border-amber-500/10 bg-muted/5 shadow-inner">
        <CardContent className="space-y-4 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="w-full md:w-64 h-3 rounded-full" />
          </div>
          <Skeleton className="h-[72px] w-full rounded-lg" />
        </CardContent>
      </Card>

      {/* Grid Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-amber-500/5 bg-background/50 h-[260px] flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-xl" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <Skeleton className="h-2 w-full rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Skeleton className="h-10 w-full rounded-md" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
