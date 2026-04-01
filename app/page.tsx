import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  Flame,
  PartyPopper,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Suspense } from 'react';

import InteractiveCalculator from '@/app/ui/home/interactive-calculator';
import { getAdminEventTokens } from '@/lib/event/admin-events-cookie';

import LanguageSwitcher from '@/app/ui/common/language-switcher';
import EventInfos from '@/app/ui/event/event-infos';
import EventInfosSkeleton from '@/app/ui/event/event-infos-skeleton';
import ThemeToggle from '@/components/theme-toggle';

export default async function HomePage() {
  const t = await getTranslations('HomePage');
  const tokens = await getAdminEventTokens();
  const brand = process.env.NEXT_PUBLIC_BRAND as string;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <header className="absolute top-0 right-0 w-full p-4 flex justify-end gap-2 z-50">
        <LanguageSwitcher />
        <ThemeToggle />
      </header>

      {/* GLOBAL BACKDROP GLOW */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-full -translate-x-1/2 rounded-full bg-amber-500/20 blur-[120px] dark:bg-amber-500/10" />

      {/* 1. IMMERSIVE HERO */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-16 pb-16 text-center md:pt-32 md:pb-32">
        <Badge text={t('hero.badge')} />
        <h1 className="mt-8 max-w-4xl text-5xl font-extrabold tracking-tighter sm:text-7xl">
          {t('hero.titlePart1')} <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 bg-clip-text text-transparent">
            {t('hero.titlePart2')}
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          {t('hero.description', { brand })}
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="group h-14 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 text-lg text-white shadow-[0_0_40px_-10px_rgba(245,158,11,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_60px_-15px_rgba(245,158,11,0.7)]"
          >
            <Link href="/admin/events/create">
              <Flame className="mr-2 size-5 transition-transform group-hover:scale-125" />
              {t('hero.cta')}
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground sm:ml-4">
            {t('hero.disclaimer')}
          </p>
        </div>

        {/* RECENT EVENTS SECTION */}
        {tokens.length > 0 && (
          <div className="mx-auto mt-16 max-w-3xl w-full text-left">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground text-center">
              {t('hero.myEvents')}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {tokens.map((token) => (
                <Link key={token} href={`/admin/${token}/items`} className="block transition-transform hover:-translate-y-1">
                  <Suspense fallback={<EventInfosSkeleton />}>
                    <EventInfos adminToken={token} />
                  </Suspense>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 2. THE CHAT BUBBLES ZONE */}
      <section className="container mx-auto px-4 py-16 md:py-32">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left: Chaos */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="flex flex-col gap-2 sm:gap-4">
              <ChatBubble
                sender={t('chaos.senders.hugo')}
                message={t('chaos.bubbles.hugo1')}
                time={t('chaos.times.t1')}
              />
              <ChatBubble
                sender={t('chaos.senders.you')}
                message={t('chaos.bubbles.you1')}
                time={t('chaos.times.t2')}
                isMe
              />
              <ChatBubble
                sender={t('chaos.senders.sarah')}
                message={t('chaos.bubbles.sarah1')}
                time={t('chaos.times.t3')}
              />
              <ChatBubble
                sender={t('chaos.senders.hugo')}
                message={t('chaos.bubbles.hugo2')}
                time={t('chaos.times.t4')}
              />
              <ChatBubble
                sender={t('chaos.senders.you')}
                message={t('chaos.bubbles.you2')}
                time={t('chaos.times.t5')}
                isMe
              />
              <ChatBubble
                sender={t('chaos.senders.sarah')}
                message={t('chaos.bubbles.sarah2')}
                time={t('chaos.times.t6')}
              />
            </div>
          </div>

          {/* Right: The elegant solution */}
          <div className="flex flex-col space-y-8">
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl border-l-4 border-amber-500 pl-6">
              {t('chaos.title')}
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground pl-6">
              <p>
                {t('chaos.description')}
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 size-5 shrink-0 text-amber-500" />
                  <span><strong>{t('chaos.points.calc')}</strong> {t('chaos.points.calcDesc')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 size-5 shrink-0 text-amber-500" />
                  <span><strong>{t('chaos.points.list')}</strong> {t('chaos.points.listDesc')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 size-5 shrink-0 text-amber-500" />
                  <span><strong>{t('chaos.points.prefs')}</strong> {t('chaos.points.prefsDesc')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE CALCULATOR */}
      <InteractiveCalculator />

      {/* 4. BOTTOM CTA */}
      <section className="border-t border-border/50 bg-muted/20 py-16 px-4 text-center md:py-32">
        <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
          {t('footer.title')}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          {t('footer.description')}
        </p>
        <div className="mt-10">
          <Button
            asChild
            size="lg"
            className="h-16 rounded-full bg-foreground px-10 text-lg hover:bg-foreground/90 dark:bg-foreground dark:text-background dark:hover:bg-foreground/90 transition-transform hover:-translate-y-1"
          >
            <Link href="/admin/events/create">
              <PartyPopper className="mr-3 size-6" />
              {t('footer.cta')}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

// Subcomponents
function Badge({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-600 dark:text-amber-400">
      <Flame className="mr-2 size-4 text-amber-500" />
      {text}
    </div>
  );
}

function ChatBubble({ sender, message, time, isMe = false }: { sender: string, message: string, time: string, isMe?: boolean }) {
  return (
    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[80%] ${isMe ? 'ml-auto' : 'mr-auto'}`}>
      <span className="mb-0.5 sm:mb-1 text-[10px] sm:text-xs text-muted-foreground px-2">{sender}</span>
      <div
        className={`rounded-2xl px-3 py-2 sm:px-4 sm:py-3 text-sm shadow-sm ${isMe
            ? 'rounded-tr-none bg-amber-500 text-white dark:bg-amber-600'
            : 'rounded-tl-none bg-muted/80 backdrop-blur-sm dark:bg-muted/50 border border-border/50'
          }`}
      >
        {message}
      </div>
      <span className="mt-0.5 sm:mt-1 text-[9px] sm:text-[10px] text-muted-foreground px-2 opacity-60">{time}</span>
    </div>
  );
}