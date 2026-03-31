import { Suspense } from 'react';

import ParticipantSettings from '@/app/ui/participant/participant-settings';
import ParticipantSettingsSkeleton from '@/app/ui/participant/participant-settings-skeleton';

export default async function Page({
  params,
}: {
  params: Promise<{ adminToken: string }>;
}) {
  const { adminToken } = await params;

  return (
    <Suspense fallback={<ParticipantSettingsSkeleton />}>
      <ParticipantSettings adminToken={adminToken} />
    </Suspense>
  );
}
