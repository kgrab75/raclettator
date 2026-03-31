'use client';

import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';
import { upsertPublicContribution } from '@/lib/contribution/actions';
import { toast } from 'sonner';
import { ROUNDING_RULES } from '@/lib/item/constants';
import { formatQuantity } from '@/lib/utils/format';

export default function ContributionDialog({ 
  isOpen, 
  onOpenChange, 
  item, 
  currentTotal,
  participants, 
  publicToken 
}: { 
  isOpen: boolean, 
  onOpenChange: (open: boolean) => void,
  item: any,
  currentTotal: number,
  participants: any[],
  publicToken: string
}) {
  const t = useTranslations('PublicPage');
  const [isPending, startTransition] = useTransition();
  const [participantId, setParticipantId] = useState<string>('');
  
  // Find existing contribution for this item if any
  const existingContribution = item.contributions.find((c: any) => c.participantId === participantId);
  const [quantity, setQuantity] = useState<string>('');

  const handleParticipantChange = (id: string) => {
    setParticipantId(id);
    const existing = item.contributions.find((c: any) => c.participantId === id);
    setQuantity(existing ? existing.quantity.toString() : '');
  };

  const stepValue = (ROUNDING_RULES as any)[item.systemKey] || (item.category === 'WEIGHT' ? 100 : 1);
  
  // Max logic: required - (total - mine)
  const myCurrentContrib = existingContribution?.quantity || 0;
  const othersTotal = currentTotal - myCurrentContrib;
  const maxAllowed = Math.max(0, item.requiredQuantity - othersTotal);
  const maxAllowedFormatted = formatQuantity(maxAllowed, item.category, t);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!participantId) return;

    startTransition(async () => {
      try {
        const qtyNum = parseFloat(quantity) || 0;
        const participant = participants.find(p => p.id === participantId);
        
        await upsertPublicContribution(publicToken, participantId, item.id, qtyNum);
        
        toast.success(t('dialog.success', { name: participant?.name }));
        onOpenChange(false);
      } catch (error: any) {
        toast.error(error.message || "Une erreur est survenue");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] border-amber-500/20 bg-background/95 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold">{t('dialog.title', { itemName: item.name })}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t('dialog.description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="participant" className="font-bold text-amber-600 dark:text-amber-500">
              {t('dialog.who')}
            </Label>
            <Select onValueChange={handleParticipantChange} value={participantId}>
              <SelectTrigger className="w-full h-12 border-amber-500/20 bg-background/50">
                <SelectValue placeholder={t('dialog.whoPlaceholder')} />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {participants.map((p) => (
                  <SelectItem key={p.id} value={p.id} className="cursor-pointer py-3 border-b last:border-0 border-border/50">
                    <span className="font-semibold">{p.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="quantity" className="font-bold text-orange-600 dark:text-orange-500">
                {t('dialog.howMuch')}
              </Label>
              {maxAllowed > 0 && participantId && (
                <button 
                  type="button" 
                  onClick={() => setQuantity(maxAllowed.toString())}
                  className="text-xs font-extrabold text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400 transition-colors underline underline-offset-2"
                >
                  {t('dialog.contributeAll')} ({maxAllowedFormatted})
                </button>
              )}
            </div>
            <div className="relative group">
              <Input
                id="quantity"
                type="number"
                step={stepValue}
                min="0"
                max={maxAllowed}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                disabled={!participantId}
                placeholder={participantId ? `Max: ${maxAllowedFormatted}` : t('dialog.whoPlaceholder')}
                className="h-12 pl-4 pr-12 text-lg font-bold border-amber-500/20 bg-background/50 focus-visible:ring-amber-500"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground/60">
                {item.category === 'WEIGHT' ? 'g' : 'pcs'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground italic px-1 pt-1 opacity-70">
              {t('dialog.cancelInfo')}
            </p>
          </div>

          <DialogFooter className="pt-4">
            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg transition-all"
              disabled={isPending || !participantId || !quantity}
            >
              {isPending ? "..." : t('dialog.submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
