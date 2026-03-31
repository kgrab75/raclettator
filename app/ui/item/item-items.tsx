import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Item as UiItem,
  ItemActions,
  ItemContent,
  ItemFooter,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item';
import { deleteItem } from '@/lib/item/actions';
import { Item } from '@/lib/item/types';
import { Bot, Pencil, Trash2, User } from 'lucide-react';
import Form from 'next/form';
import { useTranslations } from 'next-intl';

export default function ItemItems({
  items,
  handleEdit,
  adminToken,
}: {
  items: Item[];
  handleEdit: (item: Item) => void;
  adminToken: string;
}) {
  const t = useTranslations('AdminItem');

  return (
    <ItemGroup className="gap-2">
      {items.map((item) => (
        <UiItem key={item.id} variant="outline">
          <ItemContent>
            <div className="flex items-center gap-3">
              <QuantityBadge item={item} />
              <ItemTitle>
                {item.systemKey ? t(`systemItems.${item.systemKey}`) : item.name}
              </ItemTitle>
            </div>
            <ItemFooter>
              <Badge
                variant={item.isSystem ? 'secondary' : 'outline'}
                className="gap-1.5 opacity-70 mt-1"
              >
                {item.isSystem ? (
                  <>
                    <Bot className="h-3.5 w-3.5" />
                    {t('isSystem')}
                  </>
                ) : (
                  <>
                    <User className="h-3.5 w-3.5" />
                    {t('isManual')}
                  </>
                )}
              </Badge>
            </ItemFooter>
          </ItemContent>
          <ItemActions>
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={() => handleEdit(item)}
              title={t('dialog.editing.title')}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Form
               action={deleteItem.bind(null, adminToken, item.id)}
            >
              <Button
                variant="outline"
                size="icon"
                title="Supprimer"
                type="submit"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Form>
          </ItemActions>
        </UiItem>
      ))}
    </ItemGroup>
  );
}

function QuantityBadge({ item }: { item: Item }) {
  const formattedQuantity = item.category === 'WEIGHT' && item.requiredQuantity >= 1000
    ? `${item.requiredQuantity / 1000} kg`
    : `${item.requiredQuantity} ${item.category === 'WEIGHT' ? 'g' : ''}`;

  return (
    <Badge variant="secondary" className="font-semibold shrink-0 w-[72px] justify-center text-center">
      {formattedQuantity}
    </Badge>
  );
}
