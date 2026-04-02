'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatQuantity } from '@/lib/utils/format';
import { CheckCircle2, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface MyContributionsProps {
  participantId: string;
  items: any[];
  participants: any[];
}

export default function MyContributions({
  participantId,
  items,
  participants
}: MyContributionsProps) {
  const t = useTranslations('PublicPage');
  const tItem = useTranslations('AdminItem');
  const [isCollapsed, setIsCollapsed] = useState(true);

  const participant = participants.find(p => p.id === participantId);
  if (!participant) return null;

  // Filter items where this participant contributes
  const myItems = items.reduce((acc: any[], item) => {
    const myContribution = item.contributions.find((c: any) => c.participantId === participantId);
    if (myContribution && myContribution.quantity > 0) {
      acc.push({
        ...item,
        myQuantity: myContribution.quantity
      });
    }
    return acc;
  }, []);

  return (
    <Card className="gap-0 pt-0 mb-4 border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500 pb-0">
      <CardHeader
        className="py-4 px-6 flex flex-row items-center justify-between border-b border-amber-500/10 cursor-pointer hover:bg-amber-500/5 transition-colors group"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-amber-900 dark:text-amber-100">
          <CheckCircle2 className="size-5 text-amber-500" />
          {t('myContributions.title')}
          <span className="ml-2 text-xs font-medium text-amber-600/60 transition-transform group-hover:translate-x-0.5">
            ({myItems.length})
          </span>
        </CardTitle>
        <div className="flex items-center gap-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600/60 dark:text-amber-400/60 hidden sm:inline">
            {participant.name}
          </span>
          {isCollapsed ? (
            <ChevronDown className="size-5 text-amber-500 animate-bounce-subtle" />
          ) : (
            <ChevronUp className="size-5 text-amber-500" />
          )}
        </div>
      </CardHeader>

      {!isCollapsed && (
        <CardContent className="p-0 animate-in slide-in-from-top-2 duration-300">
          {myItems.length > 0 ? (
            <div className="divide-y divide-amber-500/10">
              {myItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 py-1.5 px-6 hover:bg-background/40 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                      <ShoppingBag className="size-3.5" />
                    </div>
                    <span className="text-sm font-bold text-foreground line-clamp-1">
                      {item.systemKey ? tItem(`systemItems.${item.systemKey}`) : item.name}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 whitespace-nowrap">
                      {formatQuantity(item.myQuantity, item.category, t)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 px-6 text-center space-y-3">
              <div className="p-4 rounded-full bg-amber-500/5 text-amber-300 dark:text-amber-700">
                <ShoppingBag className="size-10 stroke-[1.5px] opacity-30" />
              </div>
              <p className="text-sm font-semibold text-muted-foreground max-w-[200px] leading-snug">
                {t('myContributions.empty')}
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
