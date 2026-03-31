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
import { Plus, Users, Package } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function ItemItemsEmpty({
  adminToken,
  handleCreate,
}: {
  adminToken: string;
  handleCreate: () => void;
}) {
  const t = useTranslations('AdminItem');

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <Empty className="w-full max-w-md border-amber-500/10 text-balance">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Package className="size-4 text-amber-600" />
          </EmptyMedia>
          <EmptyTitle className="text-xl font-extrabold text-amber-900 dark:text-amber-100">
            {t('empty.title')}
          </EmptyTitle>
          <EmptyDescription className="text-sm font-medium">
            {t('empty.description')}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="gap-4">
          <Button asChild className="gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 font-extrabold shadow-lg shadow-orange-500/20">
            <Link href={`/admin/${adminToken}/participants`}>
              <Users className="h-4 w-4" />
              {t('empty.btnParticipants')}
            </Link>
          </Button>

          <Button variant="link" onClick={handleCreate} className="text-muted-foreground text-xs h-auto py-0 font-semibold hover:text-amber-600 transition-colors">
            <Plus className="size-3 mr-1" />
            {t('empty.btnAddManual')}
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
