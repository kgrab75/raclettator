import EventSettingsClient from '@/app/ui/event/event-settings-client';
import { fetchEventByToken } from '@/lib/event/data';
import { use } from 'react';

export default function EventSettings({
  adminToken,
}: {
  adminToken: string;
}) {
  const event = use(fetchEventByToken(adminToken));

  return (
    <EventSettingsClient
      adminToken={adminToken}
      publicToken={event.publicToken}
      event={event}
    />
  );
}
