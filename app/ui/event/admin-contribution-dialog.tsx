'use client';

import { useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { QuantitySelector } from '@/components/ui/quantity-selector';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { upsertPublicContribution } from '@/lib/contribution/actions';
import { formatQuantity } from '@/lib/utils/format';
import { ROUNDING_RULES } from '@/lib/item/constants';

export default function AdminContributionDialog({
  isOpen,
  onOpenChange,
  item,
  participants,
  publicToken,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  item: any;
  participants: any[];
  publicToken: string;
}) {
  const t = useTranslations('AdminEvent.Dashboard.dialog');
  const tp = useTranslations('PublicPage');
  const [isPending, startTransition] = useTransition();
  
  const [participantId, setParticipantId] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('0');

  const currentTotal = item.contributions.reduce((acc: number, c: any) => acc + c.quantity, 0);
  const remaining = Math.max(0, item.requiredQuantity - currentTotal);

  const stepValue = (ROUNDING_RULES as any)[item.systemKey] || (item.category === 'WEIGHT' ? 100 : 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!participantId) {
      toast.error(t('selectParticipant'));
      return;
    }

    startTransition(async () => {
      try {
        await upsertPublicContribution(
          publicToken,
          participantId,
          item.id,
          parseFloat(quantity) || 0
        );
        toast.success(t('success'));
        onOpenChange(false);
        setQuantity('0');
      } catch (error) {
        toast.error('Erreur lors de l\'enregistrement');
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{t('title')}</DialogTitle>
            <DialogDescription>
              {t('description')}
            </DialogDescription>
            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl text-sm shadow-sm transition-all">
              <span className="font-bold text-amber-700 dark:text-amber-400">{item.name}</span>
              <div className="flex justify-between mt-1 text-muted-foreground">
                <span>Besoin : {formatQuantity(item.requiredQuantity, item.category, tp)}</span>
                <span className="font-semibold text-foreground">Reste : {formatQuantity(remaining, item.category, tp)}</span>
              </div>
            </div>
          </DialogHeader>
          
          <div className="grid gap-6 py-6">
            <div className="grid gap-2">
              <Label htmlFor="participant" className="font-semibold">{t('selectParticipant')}</Label>
              <Select value={participantId} onValueChange={setParticipantId}>
                <SelectTrigger className="h-[56px] !h-[56px] rounded-xl border-amber-500/20 bg-background/50 text-lg px-4 flex-none">
                  <SelectValue placeholder={t('selectParticipant')} />
                </SelectTrigger>
                <SelectContent>
                  {participants.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-3">
              <Label htmlFor="quantity" className="font-semibold">{t('quantity')}</Label>
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                min={0}
                max={parseFloat(item.requiredQuantity)}
                step={stepValue}
                unit={item.category === 'WEIGHT' ? tp('units.g') : 'pcs'}
                disabled={!participantId}
              />
            </div>
          </div>

          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-[56px] rounded-xl flex-1">
              Annuler
            </Button>
            <Button type="submit" disabled={isPending || !participantId} className="h-[56px] rounded-xl px-8 font-bold flex-1">
              {isPending ? 'Chargement...' : t('submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
