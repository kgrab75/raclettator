'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, List, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export default function BottomNav({ adminToken }: { adminToken: string }) {
  const pathname = usePathname();
  const t = useTranslations('Navigation');

  const navItems = [
    {
      title: t('eventDashboard'),
      href: `/admin/${adminToken}/dashboard`,
      icon: LayoutDashboard,
    },
    {
      title: t('editParticipants'),
      href: `/admin/${adminToken}/participants`,
      icon: Users,
    },
    {
      title: t('editItems'),
      href: `/admin/${adminToken}/items`,
      icon: List,
    },
    {
      title: t('editEvent'),
      href: `/admin/${adminToken}/events`,
      icon: Calendar,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-lg border-t shadow-[0_-1px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-1px_10px_rgba(0,0,0,0.2)]" />
      <nav className="relative flex h-16 items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex flex-col items-center justify-center gap-1 min-w-[70px] relative transition-all duration-300",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "flex h-8 w-14 items-center justify-center rounded-2xl transition-all duration-300 ease-out",
                isActive ? "bg-primary/15 scale-105" : "group-hover:bg-muted group-active:scale-95"
              )}>
                <Icon className={cn(
                  "h-5 w-5 transition-transform duration-300",
                  isActive && "scale-110"
                )} />
              </div>
              <span className={cn(
                "text-[10px] font-semibold leading-none tracking-tight transition-all duration-300",
                isActive ? "opacity-100 translate-y-0" : "opacity-70 group-hover:opacity-100"
              )}>
                {item.title}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
