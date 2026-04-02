'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, ShoppingBag, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import ContributionDialog from './contribution-dialog';

import { formatProgressRange, formatQuantity } from '@/lib/utils/format';

export default function ContributionCard({ item, participants, publicToken, selectedParticipantId }: {
  item: any,
  participants: any[],
  publicToken: string,
  selectedParticipantId?: string
}) {
  const t = useTranslations('PublicPage');
  const tItem = useTranslations('AdminItem');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const currentTotal = item.contributions.reduce((acc: number, c: any) => acc + c.quantity, 0);
  const isCompleted = currentTotal >= item.requiredQuantity;
  const progress = Math.min(100, (currentTotal / item.requiredQuantity) * 100);

  const isMyContribution = selectedParticipantId && item.contributions.some((c: any) => c.participantId === selectedParticipantId);

  const progressLabel = formatProgressRange(currentTotal, item.requiredQuantity, item.category, t);

  return (
    <Card className={`group relative overflow-hidden transition-all hover:shadow-lg backdrop-blur-sm flex flex-col h-full border-amber-500/10 bg-background/50 ${isCompleted ? 'ring-2 ring-green-500/50 border-green-500/20' : ''} ${isMyContribution ? 'ring-2 ring-amber-500 border-amber-500/50 shadow-amber-500/10 shadow-lg scale-[1.01] z-10' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-md transition-colors ${isCompleted ? 'bg-green-500 text-white' : 'bg-amber-500/10 text-amber-600 group-hover:bg-amber-500 group-hover:text-white'}`}>
              <ShoppingBag className="size-4" />
            </div>
            <CardTitle className="text-lg font-bold leading-tight line-clamp-1">{item.systemKey ? tItem(`systemItems.${item.systemKey}`) : item.name}</CardTitle>
          </div>
          <Badge variant="outline" className={`shrink-0 border-amber-500/20 ${isCompleted ? 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400 font-bold' : 'text-amber-700 dark:text-amber-400'}`}>
            {progressLabel}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {/* Custom Progress Bar to allow dynamic coloring */}
        <div className={`h-2 w-full rounded-full overflow-hidden ${isCompleted ? 'bg-green-500/20' : 'bg-amber-500/10'}`}>
          <div
            className={`h-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-amber-500'}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <Users className="size-3" />
            {t('bringers', { count: item.contributions.length })}
          </div>

          <div className="flex flex-wrap gap-2 min-h-6">
            {item.contributions.length > 0 ? (
              item.contributions.map((c: any) => (
                <Badge 
                  key={c.participant.name} 
                  variant={c.participantId === selectedParticipantId ? "default" : "secondary"} 
                  className={`${c.participantId === selectedParticipantId ? "bg-amber-500 text-white" : "bg-muted/50"} font-normal py-1`}
                >
                  <span className="font-semibold mr-1">{c.participant.name}</span> {formatQuantity(c.quantity, item.category, t)}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground italic">{t('empty')}</p>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="">
        <Button
          className={`w-full font-bold transition-all group/btn ${isCompleted ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-500/20' : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'}`}
          onClick={() => setIsDialogOpen(true)}
        >
          {isCompleted ? t('completed') : t('contributeBtn')}
          <ChevronRight className="ml-2 size-4 transition-transform group-hover/btn:translate-x-0.5" />
        </Button>
      </CardFooter>

      <ContributionDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        item={item}
        currentTotal={currentTotal}
        participants={participants}
        publicToken={publicToken}
        selectedParticipantId={selectedParticipantId}
      />
    </Card>
  );
}
