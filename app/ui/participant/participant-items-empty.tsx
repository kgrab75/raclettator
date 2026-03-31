'use client';

import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  EmptyMedia,
} from '@/components/ui/empty';
import { Plus, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function ParticipantItemsEmpty({
  handleCreate,
}: {
  handleCreate: () => void;
}) {
  const t = useTranslations('AdminParticipant');

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <Empty className="w-full max-w-md border-amber-500/10">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Users className="size-4 text-amber-600" />
          </EmptyMedia>
          <EmptyTitle className="text-xl font-extrabold text-amber-900 dark:text-amber-100">
            {t('empty.title')}
          </EmptyTitle>
          <EmptyDescription className="text-sm font-medium">
            {t('empty.description')}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button 
            className="gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 font-extrabold shadow-lg shadow-orange-500/20" 
            onClick={handleCreate}
          >
            <Plus className="h-4 w-4" />
            {t('btnCreate')}
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
