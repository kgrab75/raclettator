'use client';

import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface QuantitySelectorProps {
  value: string | number;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  disabled?: boolean;
  className?: string;
}

export function QuantitySelector({
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  unit,
  disabled = false,
  className,
}: QuantitySelectorProps) {
  const [currentValue, setCurrentValue] = useState<number>(Number(value) || 0);

  // Sync internal state with external value prop
  useEffect(() => {
    const num = Number(value);
    if (!isNaN(num) && num !== currentValue) {
      setCurrentValue(num);
    }
  }, [value]);

  const handleDecrement = () => {
    if (disabled) return;
    const nextValue = Math.max(min, currentValue - step);
    setCurrentValue(nextValue);
    onChange(nextValue.toString());
  };

  const handleIncrement = () => {
    if (disabled) return;
    const nextValue = Math.min(max, currentValue + step);
    setCurrentValue(nextValue);
    onChange(nextValue.toString());
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-[56px] w-[56px] flex-none rounded-full border-amber-500/20 bg-background/50 text-amber-600 hover:bg-amber-500/10 hover:text-amber-700 disabled:opacity-30 transition-all shadow-sm active:scale-95"
        onClick={handleDecrement}
        disabled={disabled || currentValue <= min}
        aria-label="Diminuer"
      >
        <Minus className="h-6 w-6 stroke-[3px]" />
      </Button>

      <div className="flex-1 min-w-[110px] h-[56px] flex items-center justify-center bg-background/50 border border-amber-500/20 rounded-xl px-4 shadow-sm group">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-foreground tracking-tight tabular-nums leading-none">
            {currentValue}
          </span>
          {unit && (
            <span className="text-sm font-bold text-muted-foreground/70 uppercase ml-1.5 leading-none">
              {unit}
            </span>
          )}
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-[56px] w-[56px] flex-none rounded-full border-orange-500/20 bg-background/50 text-orange-600 hover:bg-orange-500/10 hover:text-orange-700 disabled:opacity-30 transition-all shadow-sm active:scale-95"
        onClick={handleIncrement}
        disabled={disabled || currentValue >= max}
        aria-label="Augmenter"
      >
        <Plus className="h-6 w-6 stroke-[3px]" />
      </Button>


    </div>
  );
}
