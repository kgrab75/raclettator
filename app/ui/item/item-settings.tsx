import ItemSettingsClient from '@/app/ui/item/item-settings-client';
import { fetchItemsByToken } from '@/lib/item/data';
import { use } from 'react';

export default function ItemSettings({
  adminToken,
}: {
  adminToken: string;
}) {
  const items = use(fetchItemsByToken(adminToken));

  return (
    <ItemSettingsClient
      adminToken={adminToken}
      items={items}
    />
  );
}
