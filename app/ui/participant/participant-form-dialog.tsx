'use client';

import ParticipantForm from '@/app/ui/participant/participant-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Participant } from '@/lib/participant/types';
import { useTranslations } from 'next-intl';

export default function ParticipantFormDialog({
  adminToken,
  open,
  onOpenChange,
  participant,
}: {
  adminToken: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participant: Participant | null;
}) {
  const t = useTranslations('AdminParticipant.dialog');
  const isEditing = !!participant?.id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t('editing.title') : t('create.title')}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? t('editing.description') : t('create.description')}
          </DialogDescription>
        </DialogHeader>

        <ParticipantForm
          adminToken={adminToken}
          participant={participant}
          setDialogOpen={onOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
}
