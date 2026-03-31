import '@/app/globals.css';
import LanguageSwitcher from '@/app/ui/common/language-switcher';
import AppSidebar from '@/app/ui/common/navigation/app-sidebar';
import { buildNavigationItems } from '@/app/ui/common/navigation/build-navigation';
import EventInfos from '@/app/ui/event/event-infos';
import EventInfosSkeleton from '@/app/ui/event/event-infos-skeleton';
import ThemeToggle from '@/components/theme-toggle';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Suspense } from 'react';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ adminToken: string }>;
}) {
  const t = await getTranslations('Navigation');
  const navItems = await buildNavigationItems();
  const brand = process.env.NEXT_PUBLIC_BRAND;

  const { adminToken } = await params;

  console.log(adminToken);

  return (
    <SidebarProvider>
      <AppSidebar footer={t('footer')} navItems={navItems} />

      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-10 items-center border-b bg-background/80 px-2 backdrop-blur">
          <div className="flex flex-1 items-center gap-2">
            <SidebarTrigger />
            <Link href="/" className="font-semibold tracking-tight md:hidden">
              {brand}
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </header>

        <Separator />

        <main className="mx-auto w-full max-w-6xl px-4 py-4">
          <div className="flex gap-2 flex-col">
            <Suspense fallback={<EventInfosSkeleton />}>
              <EventInfos adminToken={adminToken} />
            </Suspense>
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
