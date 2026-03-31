import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function EventInfosSkeleton() {
  return (
    <Card className="group relative overflow-hidden transition-all border-amber-500/10 bg-background/30 backdrop-blur-sm h-full flex flex-col">
      <CardHeader className="relative z-10 pb-4 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 w-full">
            <CardTitle className="text-xl font-bold leading-tight">
              <Skeleton className="h-6 w-48" />
            </CardTitle>
            
            <div className="space-y-2 pt-2">
              <div className="flex items-center">
                <Skeleton className="mr-2 size-4 shrink-0 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-center">
                <Skeleton className="mr-2 size-4 shrink-0 rounded-full" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          </div>
          
          <Skeleton className="h-6 w-20 rounded-full shrink-0" />
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10 pt-4 flex items-center justify-between border-t border-border/50 bg-muted/5 pb-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-20" />
        </div>
        
        <Skeleton className="h-8 w-8 rounded-full" />
      </CardContent>
    </Card>
  );
}
