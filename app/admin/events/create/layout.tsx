import '@/app/globals.css';
import LanguageSwitcher from '@/app/ui/common/language-switcher';
import AppSidebar from '@/app/ui/common/navigation/app-sidebar';
import { buildNavigationItems } from '@/app/ui/common/navigation/build-navigation';
import ThemeToggle from '@/components/theme-toggle';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations('Navigation');
  const navItems = await buildNavigationItems();
  const brand = process.env.NEXT_PUBLIC_BRAND;

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
            {children}
          </div>          
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
