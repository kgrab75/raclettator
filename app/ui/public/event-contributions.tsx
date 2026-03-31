'use client';

import ContributionCard from './contribution-card';
import ContributionStats from './contribution-stats';
import { useRealtimeRefresh } from '@/hooks/use-realtime-refresh';

interface EventContributionsProps {
  items: any[];
  participants: any[];
  publicToken: string;
  className?: string;
}

export default function EventContributions({
  items,
  participants,
  publicToken,
  className = '',
}: EventContributionsProps) {
  useRealtimeRefresh(publicToken);
  
  const sortedItems = [...items].sort((a, b) => {
    const currentA = a.contributions?.reduce((acc: number, c: any) => acc + c.quantity, 0) || 0;
    const currentB = b.contributions?.reduce((acc: number, c: any) => acc + c.quantity, 0) || 0;
    const isCompA = currentA >= a.requiredQuantity;
    const isCompB = currentB >= b.requiredQuantity;
    if (isCompA === isCompB) return 0;
    return isCompA ? 1 : -1;
  });

  return (
    <div className={className}>
      <ContributionStats 
        items={items} 
        participants={participants} 
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {sortedItems.map((item) => (
          <ContributionCard 
            key={item.id} 
            item={item} 
            participants={participants} 
            publicToken={publicToken}
          />
        ))}
      </div>
    </div>
  );
}
