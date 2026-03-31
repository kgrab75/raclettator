import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';

export default function ParticipantSettingsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-5 w-full" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-12 w-full" />
        </CardDescription>
        <CardAction>
          <Skeleton className="h-7 w-37 rounded-md" />
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Item key={index} variant="outline">
            <ItemContent>
              <ItemTitle>
                <Skeleton className="h-4 w-20" />
              </ItemTitle>
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-5 w-14 rounded-full" />

                <Skeleton className="h-5 w-9 rounded-full" />
                <Skeleton className="h-5 w-9 rounded-full" />
                <Skeleton className="h-5 w-9 rounded-full" />
              </div>
            </ItemContent>
            <ItemActions>
              <Skeleton className="h-7 w-7 border" />
              <Skeleton className="h-7 w-7 border" />
            </ItemActions>
          </Item>
        ))}
      </CardContent>
    </Card>
  );
}
