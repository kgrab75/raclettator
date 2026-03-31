import EventContributions from "@/app/ui/public/event-contributions";
import { 
  Empty, 
  EmptyContent, 
  EmptyDescription, 
  EmptyHeader, 
  EmptyTitle,
  EmptyMedia 
} from "@/components/ui/empty";
import { Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function DashboardClient({
  event,
}: {
  event: any;
}) {
  const t = useTranslations('AdminEvent.Dashboard');

  if (event.participants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Empty className="w-full max-w-md border-amber-500/10">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Users className="size-4 text-amber-600" />
            </EmptyMedia>
            <EmptyTitle className="text-xl font-extrabold text-amber-900 dark:text-amber-100">
              {t('noParticipantsTitle')}
            </EmptyTitle>
            <EmptyDescription className="text-sm font-medium">
              {t('noParticipants')}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild className="gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 font-extrabold shadow-lg shadow-orange-500/20">
              <Link href={`/admin/${event.adminToken}/participants`}>
                <Plus className="size-4" />
                {t('addParticipants')}
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <EventContributions 
      items={event.items} 
      participants={event.participants} 
      publicToken={event.publicToken}
    />
  );
}