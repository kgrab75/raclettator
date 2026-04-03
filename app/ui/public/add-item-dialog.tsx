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
  SelectGroup,
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QuantitySelector } from '@/components/ui/quantity-selector';
import { Label } from '@/components/ui/label';
import { useTranslations } from 'next-intl';
import { useState, useTransition, useEffect } from 'react';
import { addPublicItemWithContribution } from '@/lib/item/actions';
import { toast } from 'sonner';
import { ItemCategory } from '@/generated/prisma/enums';

export default function AddItemDialog({ 
  isOpen, 
  onOpenChange, 
  participants, 
  publicToken,
  selectedParticipantId
}: { 
  isOpen: boolean, 
  onOpenChange: (open: boolean) => void,
  participants: any[],
  publicToken: string,
  selectedParticipantId?: string
}) {
  const t = useTranslations('PublicPage');
  const tAdminItem = useTranslations('AdminItem');
  const [isPending, startTransition] = useTransition();
  
  const [participantId, setParticipantId] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<string>('UNIT');
  const [quantity, setQuantity] = useState<string>('1');

  // Sync state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setParticipantId(selectedParticipantId || '');
      setName('');
      setCategory('UNIT');
      setQuantity('1');
    }
  }, [isOpen, selectedParticipantId]);

  const stepValue = category === 'WEIGHT' ? 100 : 1;
  const unitLabel = category === 'WEIGHT' ? t('units.g') : 'pcs';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!participantId || !name || !quantity) return;

    startTransition(async () => {
      try {
        const qtyNum = parseFloat(quantity) || 0;
        if (qtyNum <= 0) {
          toast.error("La quantité doit être supérieure à 0.");
          return;
        }

        const participant = participants.find(p => p.id === participantId);
        
        await addPublicItemWithContribution(publicToken, participantId, name, category, qtyNum);
        
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
          <DialogTitle className="text-xl font-extrabold">{t('addItem.dialogTitle')}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t('addItem.dialogDescription')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="participant" className="font-bold text-amber-600 dark:text-amber-500">
              {t('dialog.who')}
            </Label>
            <Select onValueChange={setParticipantId} value={participantId}>
              <SelectTrigger className="w-full h-[56px] border-amber-500/20 bg-background/50 text-lg rounded-xl px-4">
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
            <Label htmlFor="name" className="font-bold text-amber-600 dark:text-amber-500">
              {t('addItem.nameLabel')}
            </Label>
            <Input
              id="name"
              placeholder={t('addItem.namePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-[56px] border-amber-500/20 bg-background/50 text-lg rounded-xl px-4"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="font-bold text-amber-600 dark:text-amber-500">
              {t('addItem.categoryLabel')}
            </Label>
            <Select onValueChange={setCategory} value={category}>
              <SelectTrigger className="w-full h-[56px] border-amber-500/20 bg-background/50 text-lg rounded-xl px-4">
                <SelectValue placeholder={t('addItem.categoryLabel')} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.values(ItemCategory).map((c) => (
                    <SelectItem key={c} value={c}>
                      {tAdminItem(`form.category.options.${c}`)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity" className="font-bold text-orange-600 dark:text-orange-500">
              {t('addItem.quantityLabel')}
            </Label>
            
            <QuantitySelector
              value={quantity}
              onChange={setQuantity}
              min={0}
              max={10000} // Large max since there's no pre-defined target
              step={stepValue}
              unit={unitLabel}
              disabled={!participantId}
              className="mt-2"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button 
              type="submit" 
              className="w-full h-[56px] text-xl font-black bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg transition-all rounded-xl"
              disabled={isPending || !participantId || !name || !quantity || parseFloat(quantity) <= 0}
            >
              {isPending ? "..." : t('addItem.submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
