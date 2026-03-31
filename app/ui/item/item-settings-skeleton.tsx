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
  ItemFooter,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';

export default function ItemSettingsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-5 w-full max-w-[150px]" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-5 w-full max-w-[200px]" />
        </CardDescription>
        <CardAction>
          <Skeleton className="h-7 w-32 rounded-md" />
        </CardAction>
      </CardHeader>

      <CardContent>
        <ItemGroup className="gap-2">
          {Array.from({ length: 9 }).map((_, index) => (
            <Item key={index} variant="outline">
              <ItemContent>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 shrink-0 w-[72px] rounded-full" />
                  <ItemTitle>
                    <Skeleton className="h-5 w-32 sm:w-48" />
                  </ItemTitle>
                </div>
                <ItemFooter>
                  <Skeleton className="h-5 w-32 rounded-full mt-1" />
                </ItemFooter>
              </ItemContent>
              <ItemActions>
                <Skeleton className="h-9 w-9 rounded-md border bg-transparent" />
                <Skeleton className="h-9 w-9 rounded-md border bg-transparent" />
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
