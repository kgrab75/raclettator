import { Suspense } from 'react';

import EventSettings from '@/app/ui/event/event-settings';
import EventSettingsSkeleton from '@/app/ui/event/event-settings-skeleton';

export default async function Page({
  params,
}: {
  params: Promise<{ adminToken: string }>;
}) {
  const { adminToken } = await params;

  return (
    <Suspense fallback={<EventSettingsSkeleton />}>
      <EventSettings adminToken={adminToken} />
    </Suspense>
  );
}
