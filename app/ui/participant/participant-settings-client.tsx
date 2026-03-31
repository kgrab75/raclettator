'use client';

import ParticipantFormDialog from '@/app/ui/participant/participant-form-dialog';
import ParticipantItems from '@/app/ui/participant/participant-items';
import ParticipantItemsEmpty from '@/app/ui/participant/participant-items-empty';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Participant } from '@/lib/participant/types';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function ParticipantSettingsClient({
  adminToken,
  participants,
}: {
  adminToken: string;
  participants: Participant[];
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] =
    useState<Participant | null>(null);
  const t = useTranslations('AdminParticipant');

  function handleCreate() {
    setEditingParticipant(null);
    setDialogOpen(true);
  }

  function handleEdit(participant: Participant) {
    setEditingParticipant(participant);
    setDialogOpen(true);
  }

  return (
    <>

      {participants.length === 0 ? (
        <ParticipantItemsEmpty handleCreate={handleCreate} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{t('title')}</CardTitle>
            <CardDescription>{t('description')}</CardDescription>
            <CardAction>
              <Button className="gap-2" onClick={handleCreate}>
                <Plus className="h-4 w-4" />
                {t('btnCreate')}
              </Button>
            </CardAction>
          </CardHeader>

          <CardContent className="flex flex-col gap-2">
            <ParticipantItems
              participants={participants}
              handleEdit={handleEdit}
              adminToken={adminToken}
            ></ParticipantItems>
          </CardContent>
        </Card>
      )}

      <ParticipantFormDialog
        adminToken={adminToken}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        participant={editingParticipant}
      />
    </>
  );
}
