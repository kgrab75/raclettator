'use client';

import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, PartyPopper, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function ContributionStats({ items, participants }: { 
  items: any[], 
  participants: any[] 
}) {
  const t = useTranslations('PublicPage');

  // 1. Calculate item completion
  const totalItems = items.length;
  const completedItems = items.filter(item => {
    const current = item.contributions.reduce((acc: number, c: any) => acc + c.quantity, 0);
    return current >= item.requiredQuantity;
  }).length;
  
  const globalProgress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  const isFullyReady = completedItems === totalItems && totalItems > 0;

  // 2. Identify non-contributors
  const contributorIds = new Set<string>();
  items.forEach(item => {
    item.contributions.forEach((c: any) => contributorIds.add(c.participantId));
  });

  const missingParticipants = participants.filter(p => !contributorIds.has(p.id));
  
  // 3. Format the "waiting for" list
  const maxNamesToShow = 3;
  const displayedNames = missingParticipants.slice(0, maxNamesToShow).map(p => p.name);
  const othersCount = missingParticipants.length - maxNamesToShow;

  let waitingMessage = "";
  if (missingParticipants.length > 0) {
    const namesStr = displayedNames.join(', ');
    waitingMessage = t('stats.waitingFor', { 
      names: namesStr + (othersCount > 0 ? t('stats.others', { count: othersCount }) : "") 
    });
  }

  return (
    <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5 shadow-inner backdrop-blur-sm overflow-hidden mb-4">
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold flex items-center gap-2">
              {isFullyReady ? <PartyPopper className="text-green-500" /> : <GraduationCap className="text-amber-500" />}
              {t('stats.title')}
            </h2>
            <p className="text-sm font-bold text-muted-foreground">
              {t('stats.progress', { found: completedItems, total: totalItems })}
            </p>
          </div>

          <div className="w-full md:w-64 h-3 bg-amber-500/10 rounded-full overflow-hidden border border-amber-500/10">
            <div 
              className={`h-full transition-all duration-1000 ease-out ${isFullyReady ? 'bg-green-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`}
              style={{ width: `${globalProgress}%` }}
            />
          </div>
        </div>

        {missingParticipants.length > 0 ? (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-500/5 border border-orange-500/10 animate-in fade-in slide-in-from-top-1">
            <Users className="size-5 text-orange-500 mt-0.5" />
            <p className="text-sm font-semibold text-orange-800 dark:text-orange-300">
              {waitingMessage}
            </p>
          </div>
        ) : totalItems > 0 && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/10">
            <PartyPopper className="size-5 text-green-500" />
            <p className="text-sm font-bold text-green-700 dark:text-green-400">
              {t('stats.allReady')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
