import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { fetchEventByToken } from '@/lib/event/data';
import EventShareCta from '@/app/ui/event/event-share-cta';
import { CalendarDays, CheckCircle2, MapPin, ShoppingBag, Users } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function EventInfos({ adminToken }: { adminToken: string }) {
  const event = await fetchEventByToken(adminToken);
  const t = await getTranslations('NewEvent');
  const tc = await getTranslations('EventCard');

  // Calculate setup progress
  const hasParticipants = event._count.participants > 0;
  const hasItems = event._count.items > 0;
  const stepsCompleted = 1 + (hasParticipants ? 1 : 0) + (hasItems ? 1 : 0);
  const progressValue = (stepsCompleted / 3) * 100;

  // Calculate relative time accurately
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const eventDate = new Date(event.startsAt);
  eventDate.setHours(0, 0, 0, 0);
  const diffDays = Math.round((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  let statusBadge = null;
  let statusVariant: 'default' | 'secondary' | 'outline' = 'secondary';
  let badgeColor = '';

  if (diffDays < 0) {
    statusBadge = tc('past');
    statusVariant = 'outline';
  } else if (diffDays === 0) {
    statusBadge = tc('today');
    statusVariant = 'default';
    badgeColor = 'bg-orange-500 hover:bg-orange-600 border-none text-white';
  } else if (diffDays === 1) {
    statusBadge = tc('tomorrow');
    statusVariant = 'secondary';
    badgeColor = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
  } else {
    statusBadge = tc('inDays', { days: diffDays });
    statusVariant = 'outline';
  }

  const humanDate = t('form.startsAt.previewFromDate', {
    startsAtDate: event.startsAt,
    day: event.startsAt.getDate(),
  });

  return (
    <Card className="group pb-0 relative overflow-hidden transition-all hover:shadow-xl border-amber-500/20 bg-background/50 backdrop-blur-sm flex flex-col">
      {/* Decorative gradient background */}
      <div className="absolute -right-20 -top-20 z-0 size-40 rounded-full bg-amber-500/10 blur-3xl transition-all group-hover:bg-orange-500/20" />

      <CardHeader className="relative z-10 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <CardTitle className="text-xl font-bold leading-tight truncate mr-2">{event.title}</CardTitle>
              <Badge variant={statusVariant} className={`shrink-0 ${badgeColor}`}>
                {statusBadge}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center min-w-0">
                <CalendarDays className="mr-2 size-3.5 shrink-0 opacity-70 text-amber-500" />
                <span className="truncate">{humanDate}</span>
              </div>
              <div className="flex items-center min-w-0">
                <MapPin className="mr-2 size-3.5 shrink-0 opacity-70 text-amber-500" />
                <span className="truncate">{event.location}</span>
              </div>
              <div className="flex items-center min-w-0 font-medium text-foreground/80">
                <Users className="mr-2 size-3.5 shrink-0 text-amber-500" />
                <span className="truncate">{tc('participants', { count: event._count.participants })}</span>
              </div>
              <div className="flex items-center min-w-0 font-medium text-foreground/80">
                <ShoppingBag className="mr-2 size-3.5 shrink-0 text-orange-500" />
                <span className="truncate">{tc('items', { count: event._count.items })}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 pt-3 flex flex-col gap-3 border-t border-border/50 bg-muted/10 pb-4">

        {/* Progress Bar "Delight" */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
            <span>{tc('setupProgress')}</span>
            <span className="flex items-center gap-1">
              {progressValue === 100 && <CheckCircle2 className="size-3 text-emerald-500" />}
              {Math.round(progressValue)}%
            </span>
          </div>
          <Progress
            value={progressValue}
            className="h-1.5 bg-amber-500/10"
            indicatorClassName="bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-1000 ease-in-out"
          />

          {/* Next Step Guidance */}
          <p className="text-[11px] font-medium transition-colors">
            {progressValue < 100 ? (
              <>
                <span className="text-muted-foreground opacity-70">{tc('nextStepPrefix')} </span>
                <span className="text-amber-600 dark:text-amber-400">
                  {!hasParticipants ? tc('nextStepParticipants') : tc('nextStepItems')}
                </span>
              </>
            ) : (
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-3" />
                {tc('allReady')} — <EventShareCta
                  publicToken={event.publicToken}
                  eventTitle={event.title}
                  label={tc('nextStepShare')}
                  className="underline underline-offset-2 tracking-tight hover:text-emerald-500 transition-colors"
                />
              </span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
