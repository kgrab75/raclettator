import ParticipantSettingsClient from '@/app/ui/participant/participant-settings-client';
import { fetchParticipantsByToken } from '@/lib/participant/data';
import { use } from 'react';

export default function ParticipantSettings({
  adminToken,
}: {
  adminToken: string;
}) {
  const participants = use(fetchParticipantsByToken(adminToken));

  return (
    <ParticipantSettingsClient
      adminToken={adminToken}
      participants={participants}
    />
  );
}
