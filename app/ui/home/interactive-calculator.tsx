'use client';

import { UtensilsCrossed } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function InteractiveCalculator() {
  const t = useTranslations('HomePage');
  const [guests, setGuests] = useState(6);

  const cheeseAmount = (guests * 0.2).toFixed(1);
  const potatoAmount = (guests * 0.35).toFixed(1);
  const meatAmount = (guests * 0.15).toFixed(1);

  return (
    <div className="relative mx-auto max-w-4xl rounded-3xl border border-white/10 bg-background/50 p-8 shadow-2xl ring-1 ring-inset ring-amber-500/20 backdrop-blur-xl sm:p-12 overflow-hidden">
      <div className="absolute -right-20 -top-20 -z-10 size-60 rounded-full bg-orange-500/20 blur-3xl" />
      
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-amber-500/10 p-3 text-amber-500 ring-1 ring-inset ring-amber-500/20">
          <UtensilsCrossed className="size-8" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground">
          {t('calculator.title')}
        </h2>
        <p className="mt-4 text-muted-foreground">
          {t('calculator.description')}
        </p>
      </div>

      <div className="mt-12 flex flex-col items-center space-y-8">
        <div className="w-full max-w-md space-y-4">
          <div className="flex justify-between text-lg font-medium">
            <span>{t('calculator.guests')}</span>
            <span className="text-2xl font-bold tracking-tighter text-amber-500">{guests}</span>
          </div>
          <input
            type="range"
            min="2"
            max="20"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            className="h-2 w-full appearance-none rounded-full bg-muted accent-amber-500 cursor-grab active:cursor-grabbing focus:outline-none"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{t('calculator.min')}</span>
            <span>{t('calculator.max')}</span>
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-3 sm:gap-6 sm:grid-cols-3 pt-6 sm:pt-8 border-t border-border/50">
          <IngredientCard emoji="🧀" value={cheeseAmount} unit={t('calculator.unit')} label={t('calculator.cheese')} />
          <IngredientCard emoji="🥔" value={potatoAmount} unit={t('calculator.unit')} label={t('calculator.potatoes')} />
          <IngredientCard emoji="🥩" value={meatAmount} unit={t('calculator.unit')} label={t('calculator.charcuterie')} />
        </div>
      </div>
    </div>
  );
}

function IngredientCard({ emoji, value, unit, label }: { emoji: string, value: string, unit: string, label: string }) {
  return (
    <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center rounded-2xl bg-background/50 p-4 sm:p-6 ring-1 ring-inset ring-border/50 transition-transform hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center gap-3 sm:gap-0 sm:flex-col text-left sm:text-center">
        <div className="text-3xl sm:mb-3 sm:text-5xl drop-shadow-sm">{emoji}</div>
        <span className="block sm:hidden text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      <div className="flex flex-col items-end sm:items-center mt-0 sm:mt-2">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl sm:text-4xl font-black tracking-tighter text-foreground">{value}</span>
          <span className="text-base sm:text-xl font-bold text-muted-foreground">{unit}</span>
        </div>
        <span className="hidden sm:block mt-2 text-sm font-medium text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}
