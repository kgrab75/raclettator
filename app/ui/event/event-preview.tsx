'use client';
import { EventProp } from '@/app/ui/event/main-section';
import { Badge } from '@/components/ui/badge';

export type EventPreviewProps = {
  event: EventProp;
  children?: React.ReactNode;
};

export default function EventPreview({ event, children }: EventPreviewProps) {
  return (
    <div className="w-full rounded-2xl border bg-background p-2 shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-xl border bg-muted/40 px-4 py-3">
          <span className="text-md font-medium">
            {event.title} {event.location}
          </span>
          <Badge variant="outline">{event.humanizedStartsAt}</Badge>
        </div>

        <div className="space-y-3 rounded-xl border p-4">
          <p className="text-sm font-medium">En un coup d&apos;œil</p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">Participants</p>
              <p className="mt-1 text-2xl font-semibold">8</p>
            </div>

            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">Liste prête</p>
              <p className="mt-1 text-2xl font-semibold">Oui</p>
            </div>
          </div>
        </div>

        {children && <div>{children}</div>}
      </div>
    </div>
  );
}
