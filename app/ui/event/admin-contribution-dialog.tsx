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
import { Input } from '@/components/ui/input';
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
  const [quantity, setQuantity] = useState<string>('');

  const currentTotal = item.contributions.reduce((acc: number, c: any) => acc + c.quantity, 0);
  const remaining = Math.max(0, item.requiredQuantity - currentTotal);

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
        setQuantity('');
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
            <DialogTitle>{t('title')}</DialogTitle>
            <DialogDescription>
              {t('description')}
            </DialogDescription>
            <div className="mt-2 text-sm font-semibold text-amber-600 dark:text-amber-400">
              {item.name} — Besoin : {formatQuantity(item.requiredQuantity, item.category, tp)}
              <br />
              Reste : {formatQuantity(remaining, item.category, tp)}
            </div>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="participant">{t('selectParticipant')}</Label>
              <Select value={participantId} onValueChange={setParticipantId}>
                <SelectTrigger>
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
            
            <div className="grid gap-2">
              <Label htmlFor="quantity">{t('quantity')}</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="quantity"
                  type="number"
                  step="any"
                  placeholder={remaining.toString()}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="flex-1"
                />
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                  {item.category === 'WEIGHT' ? 'g' : 'unité(s)'}
                </span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isPending || !participantId}>
              {isPending ? 'Chargement...' : t('submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
