import { Suspense } from 'react';

import ItemSettings from '@/app/ui/item/item-settings';
import ItemSettingsSkeleton from '@/app/ui/item/item-settings-skeleton';

export default async function Page({
  params,
}: {
  params: Promise<{ adminToken: string }>;
}) {
  const { adminToken } = await params;

  return (
    <Suspense fallback={<ItemSettingsSkeleton />}>
      <ItemSettings adminToken={adminToken} />
    </Suspense>
  );
}
