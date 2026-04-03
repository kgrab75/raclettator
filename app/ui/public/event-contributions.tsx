'use client';

import ContributionCard from './contribution-card';
import ContributionStats from './contribution-stats';
import WhoAreYouSelector from './who-are-you';
import MyContributions from './my-contributions';
import AddItemDialog from './add-item-dialog';
import { useRealtimeRefresh } from '@/hooks/use-realtime-refresh';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('PublicPage');
  
  const [selectedParticipantId, setSelectedParticipantId] = useState<string>('');
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`raclette_participant_${publicToken}`);
    if (saved) setSelectedParticipantId(saved);
  }, [publicToken]);

  // Save to localStorage on change
  const handleSelectParticipant = (id: string) => {
    const value = id === 'none' ? '' : id;
    setSelectedParticipantId(value);
    if (value) {
      localStorage.setItem(`raclette_participant_${publicToken}`, value);
    } else {
      localStorage.removeItem(`raclette_participant_${publicToken}`);
    }
  };

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
      <WhoAreYouSelector 
        participants={participants}
        selectedParticipantId={selectedParticipantId || 'none'}
        onSelect={handleSelectParticipant}
      />

      {selectedParticipantId && (
        <MyContributions 
          participantId={selectedParticipantId}
          items={items}
          participants={participants}
        />
      )}

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
            selectedParticipantId={selectedParticipantId}
          />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button 
          variant="outline" 
          className="border-dashed border-2 border-amber-500/30 text-amber-600 dark:text-amber-500 hover:bg-amber-500/10 hover:border-amber-500/50 bg-transparent h-14 rounded-xl px-6"
          onClick={() => setIsAddItemOpen(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          {t('addItem.btn')}
        </Button>
      </div>

      <AddItemDialog 
        isOpen={isAddItemOpen} 
        onOpenChange={setIsAddItemOpen}
        participants={participants}
        publicToken={publicToken}
        selectedParticipantId={selectedParticipantId}
      />
    </div>
  );
}
