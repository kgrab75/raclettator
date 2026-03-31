import ItemForm from '@/app/ui/item/item-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Item } from '@/lib/item/types';
import { useTranslations } from 'next-intl';
import { Dispatch, SetStateAction } from 'react';

export default function ItemFormDialog({
  open,
  onOpenChange,
  adminToken,
  item,
}: {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  adminToken: string;
  item: Item | null;
}) {
  const t = useTranslations('AdminItem');

  const mode = item ? 'editing' : 'create';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t(`dialog.${mode}.title`)}</DialogTitle>
          <DialogDescription>
            {t(`dialog.${mode}.description`)}
          </DialogDescription>
        </DialogHeader>

        <ItemForm
          adminToken={adminToken}
          item={item}
          setDialogOpen={onOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
}
