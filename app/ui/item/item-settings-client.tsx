'use client';


import ItemFormDialog from '@/app/ui/item/item-form-dialog';
import ItemItems from '@/app/ui/item/item-items';
import ItemItemsEmpty from '@/app/ui/item/item-items-empty';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Item } from '@/lib/item/types';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function ItemSettingsClient({
  adminToken,
  items,
}: {
  adminToken: string;
  items: Item[];
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const t = useTranslations('AdminItem');

  function handleCreate() {
    setEditingItem(null);
    setDialogOpen(true);
  }

  function handleEdit(item: Item) {
    setEditingItem(item);
    setDialogOpen(true);
  }

  return (
    <>
      {items.length === 0 ? (
        <ItemItemsEmpty adminToken={adminToken} handleCreate={handleCreate} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{t('title')}</CardTitle>
            <CardDescription>{t('description')}</CardDescription>
            <CardAction>
              <Button className="gap-2" onClick={handleCreate}>
                <Plus className="h-4 w-4" />
                {t('btnCreate')}
              </Button>
            </CardAction>
          </CardHeader>

          <CardContent className="flex flex-col gap-2">
            <ItemItems
              items={items}
              handleEdit={handleEdit}
              adminToken={adminToken}
            />
          </CardContent>
        </Card >
      )
      }

      <ItemFormDialog
        adminToken={adminToken}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={editingItem}
      />
    </>
  );
}
