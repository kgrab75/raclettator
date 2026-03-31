
import DashboardClient from '@/app/ui/dashboard/dashboard-client';
import { fetchEventByToken } from '@/lib/event/data';
import { use } from 'react';

export default function Dashboard({
  adminToken,
}: {
  adminToken: string;
}) {
  const event = use(fetchEventByToken(adminToken));

  return (
    <DashboardClient
      event={event}
    />
  );
}
