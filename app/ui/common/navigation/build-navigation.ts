import { NavItem as NavItem } from '@/app/ui/common/navigation/navigation-items';
import { getAdminEventTokens } from '@/lib/event/admin-events-cookie';
import prisma from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';

export async function buildNavigationItems(): Promise<NavItem[]> {
  const t = await getTranslations('Navigation');

  const mainNavigation: NavItem[] = [
    {
      title: t('home'),
      href: '/',
      iconName: 'home',
    },
    {
      title: t('createEvent'),
      href: '/admin/events/create',
      iconName: 'calendarPlus',
    },
  ];

  const tokens = await getAdminEventTokens();
  if (tokens.length === 0) return mainNavigation;

  const events = await prisma.event.findMany({
    where: { adminToken: { in: tokens } },
    select: { adminToken: true, title: true, location: true, startsAt: true },
  });

  const eventItemsGroup: NavItem[] = events.map((event) => ({
    title: event.title,
    iconName: 'utensils',
    items: [
      {
        title: t('eventDashboard'),
        href: `/admin/${event.adminToken}/dashboard`,
        iconName: 'layoutDashboard',
      },
      {
        title: t('editEvent'),
        href: `/admin/${event.adminToken}/events`,
        iconName: 'calendar',
      },
      {
        title: t('editParticipants'),
        href: `/admin/${event.adminToken}/participants`,
        iconName: 'users',
      },
      {
        title: t('editItems'),
        href: `/admin/${event.adminToken}/items`,
        iconName: 'list',
      },
    ],
  }));

  return [...mainNavigation, ...eventItemsGroup];
}
