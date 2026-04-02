'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { UserCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface WhoAreYouSelectorProps {
  participants: any[];
  selectedParticipantId: string;
  onSelect: (id: string) => void;
}

export default function WhoAreYouSelector({
  participants,
  selectedParticipantId,
  onSelect
}: WhoAreYouSelectorProps) {
  const t = useTranslations('PublicPage');

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-muted/30 border border-border/50 p-5 rounded-2xl mb-4 backdrop-blur-sm shadow-inner">
      <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-500 font-extrabold shrink-0">
        <UserCircle className="size-6" />
        <span className="text-base tracking-tight">{t('whoAreYou')}</span>
      </div>

      <Select onValueChange={onSelect} value={selectedParticipantId}>
        <SelectTrigger className="w-full sm:w-[320px] h-12 border-amber-500/10 bg-background/80 text-base font-medium rounded-xl px-5 focus:ring-amber-500/20 hover:border-amber-500/30 transition-all">
          <SelectValue placeholder={t('whoAreYouPlaceholder')} />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-amber-500/20">
          <SelectItem value="none" className="italic text-muted-foreground py-3">
            {t('whoAreYouPlaceholder')}
          </SelectItem>
          {participants.sort((a, b) => a.name.localeCompare(b.name)).map((p) => (
            <SelectItem key={p.id} value={p.id} className="cursor-pointer font-semibold py-3 border-b border-muted/30 last:border-0">
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
