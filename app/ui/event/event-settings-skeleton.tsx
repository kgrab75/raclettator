import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function EventSettingsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* CARD 1: PARTAGE SKELETON */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-5 w-40" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-5 w-2/3" />
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 flex-1 rounded-md" />
            <Skeleton className="h-9 w-9 shrink-0 rounded-md" />
          </div>
          <Skeleton className="h-7 w-56 rounded-md" />
        </CardContent>
      </Card>

      {/* CARD 2: UPDATE SKELETON */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-5 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-5 w-3/4" />
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {/* Form field 1 */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-7 w-full" />
          </div>
          {/* Form field 2 */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-7 w-full" />
          </div>
          {/* Form field 3 */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-7 w-full" />
          </div>
          {/* Submit button */}
          <Skeleton className="h-7 w-32" />
        </CardContent>
      </Card>

      {/* CARD 3: DELETE SKELETON */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-32" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-full max-w-[300px]" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-44 rounded-md" />
        </CardContent>
      </Card>
    </div>
  );
}
