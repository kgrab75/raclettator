import LanguageSwitcher from '@/app/ui/common/language-switcher';
import EventContributions from '@/app/ui/public/event-contributions';
import EventContributionsSkeleton from '@/app/ui/public/event-contributions-skeleton';
import ThemeToggle from '@/components/theme-toggle';
import { fetchEventByPublicToken } from '@/lib/event/data';
import { fetchPublicItems } from '@/lib/item/data';
import { fetchPublicParticipants } from '@/lib/participant/data';
import { CalendarDays, MapPin } from 'lucide-react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

async function getFormattedDate(date: Date) {
  const tStartsAt = await getTranslations('NewEvent.form.startsAt');
    
  const d = new Date(date);
  return tStartsAt('previewFromDate', { 
      day: d.getDate(), 
      startsAtDate: d 
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ publicToken: string }>;
}): Promise<Metadata> {
  const { publicToken } = await params;
  const t = await getTranslations('OG');
  const brand = (process.env.NEXT_PUBLIC_BRAND || 'Raclettator');
  
  try {
    const event = await fetchEventByPublicToken(publicToken);
    const description = t('description', { date: await getFormattedDate(event.startsAt), location: event.location, brand });
    
    return {
      title: `${brand} | ${event.title}`,
      description,
      metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
      openGraph: {
        title: event.title,
        description,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: event.title,
        description,
      },
    };
  } catch {
    return {
      title: brand,
    };
  }
}

async function PublicEventContributionsSection({ publicToken }: { publicToken: string }) {
  const [items, participants] = await Promise.all([
    fetchPublicItems(publicToken),
    fetchPublicParticipants(publicToken),
  ]);

  return (
    <EventContributions 
      items={items} 
      participants={participants} 
      publicToken={publicToken}
    />
  );
}

export default async function PublicPage({
  params,
}: {
  params: Promise<{ publicToken: string }>;
}) {
  const { publicToken } = await params;
  
  let event;
  try {
    event = await fetchEventByPublicToken(publicToken);
  } catch (error) {
    notFound();
  }

  const t = await getTranslations('PublicPage');

  return (
    <div className="relative min-h-screen bg-background">
      {/* Background Decor */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[120px]" />
      
      <header className="absolute top-0 right-0 w-full p-4 flex justify-end gap-2 z-50">
        <LanguageSwitcher />
        <ThemeToggle />
      </header>

      <main className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
        {/* Event Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            {event.title}
          </h1>
          <div className="flex flex-wrap justify-center gap-4 text-muted-foreground font-medium">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="size-5 text-amber-500" />
              <span>{await getFormattedDate(event.startsAt)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="size-5 text-orange-500" />
              <span>{event.location}</span>
            </div>
          </div>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground/80 pt-4">
            {t('intro')}
          </p>
        </div>

        <Suspense fallback={<EventContributionsSkeleton />}>
          <PublicEventContributionsSection publicToken={publicToken} />
        </Suspense>
      </main>
    </div>
  );
}
