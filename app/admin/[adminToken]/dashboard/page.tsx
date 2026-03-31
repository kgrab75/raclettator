import Dashboard from '@/app/ui/dashboard/dashboard';
import DashboardSkeleton from '@/app/ui/dashboard/dashboard-skeleton';
import { Suspense } from 'react';

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ adminToken: string }>;
}) {
  const { adminToken } = await params;

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Dashboard adminToken={adminToken} />
    </Suspense>
  );
}
