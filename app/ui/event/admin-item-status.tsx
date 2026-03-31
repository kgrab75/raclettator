'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ShoppingBag, Users, PlusCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { formatQuantity, formatProgressRange } from '@/lib/utils/format';
import AdminContributionDialog from './admin-contribution-dialog';

export default function AdminItemStatus({
  items,
  participants,
  adminToken,
}: {
  items: any[];
  participants: any[];
  adminToken: string;
}) {
  const t = useTranslations('AdminEvent.Dashboard');
  const tp = useTranslations('PublicPage');
  
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Helper to find public token is difficult from here if not passed in event
  // Assume event.publicToken is passed via item.event or separate prop
  // Actually, in dashboard/page.tsx I passed event.publicToken.
  // Wait, I need the publicToken. I'll update the prop.

  if (items.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-xl">
        <p className="text-muted-foreground">{t('noParticipants')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const currentTotal = item.contributions.reduce(
          (acc: number, c: any) => acc + c.quantity,
          0
        );
        const isCompleted = currentTotal >= item.requiredQuantity;
        const progress = Math.min(100, (currentTotal / item.requiredQuantity) * 100);
        const progressLabel = formatProgressRange(currentTotal, item.requiredQuantity, item.category, tp);

        return (
          <div
            key={item.id}
            className={`flex flex-col gap-3 p-4 rounded-xl border transition-all ${
              isCompleted ? 'bg-green-500/5 border-green-500/20 shadow-sm' : 'bg-background hover:border-amber-500/30'
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isCompleted ? 'bg-green-500 text-white' : 'bg-amber-500/10 text-amber-600'}`}>
                  <ShoppingBag className="size-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-none mb-1">{item.name}</h3>
                  <p className="text-xs text-muted-foreground">{progressLabel}</p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className={`h-8 gap-1.5 font-bold ${isCompleted ? 'text-green-600 hover:text-green-700 hover:bg-green-500/10' : 'text-amber-600 hover:text-amber-700 hover:bg-amber-500/10'}`}
                onClick={() => {
                  setSelectedItem(item);
                  setIsDialogOpen(true);
                }}
              >
                <PlusCircle className="size-3.5" />
                {t('contribute')}
              </Button>
            </div>

            <div className={`h-1.5 w-full rounded-full overflow-hidden ${isCompleted ? 'bg-green-500/10' : 'bg-amber-500/10'}`}>
              <div
                className={`h-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-amber-500'}`}
                style={{ width: `${progress}%` }}
              />
            </div>

            {item.contributions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {item.contributions.map((c: any) => (
                  <Badge key={c.id} variant="secondary" className="text-[10px] py-0 h-5 px-1.5 font-medium bg-muted/30">
                    <span className="font-bold mr-1">{c.participant.name}</span>
                    {formatQuantity(c.quantity, item.category, tp)}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {selectedItem && (
        <AdminContributionDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          item={selectedItem}
          participants={participants}
          publicToken={selectedItem.eventPublicToken} // We'll map this in the dashboard
        />
      )}
    </div>
  );
}
