'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useCalendarLocale } from '@/hooks/use-calendar-locale';
import { useHumanDateTime } from '@/hooks/use-human-date-time';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { useLocale } from 'next-intl';

export function DateTimePicker({
  date,
  onDateChange,
  onTimeChange,
  placeholder,
}: {
  date?: Date;
  onDateChange: (selectedDate: Date | undefined) => void;
  onTimeChange: (
    type: 'hour' | 'minute' | 'ampm',
    value: string,
    uses12hClock: boolean,
  ) => void;
  placeholder: string;
}) {
  const { dayPickerLocale, dir } = useCalendarLocale();

  const humanDateTime = useHumanDateTime(date);

  const [isOpen, setIsOpen] = React.useState(false);

  const uses12hClock =
    new Intl.DateTimeFormat(useLocale(), {
      hour: 'numeric',
    }).resolvedOptions().hour12 === true;

  const hours = uses12hClock
    ? Array.from({ length: 12 }, (_, i) => i + 1)
    : Array.from({ length: 24 - 10 }, (_, i) => i + 10);

  const minutes = Array.from({ length: 4 }, (_, i) => i * 15);

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-between text-left font-normal border-input text-sm md:text-xs py-0.5 cursor-pointer',
              !date && 'text-muted-foreground',
            )}
          >
            {date ? (
              humanDateTime
            ) : (
              <span className="placeholder:text-muted-foreground">
                {placeholder}
              </span>
            )}
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" side="top">
          <div className="sm:flex">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onDateChange}
              locale={dayPickerLocale}
              dir={dir}
              disabled={{ before: new Date() }}
              className="mx-auto"
            />
            <div className="flex flex-col sm:flex-row sm:h-60 divide-y sm:divide-y-0 sm:divide-x">
              <ScrollArea className="w-64 sm:w-auto">
                <div className="flex sm:flex-col">
                  {hours.reverse().map((hour) => (
                    <Button
                      key={hour}
                      size="icon"
                      variant={
                        date && date.getHours() % 12 === hour % 12
                          ? 'default'
                          : 'ghost'
                      }
                      className="sm:w-full shrink-0 aspect-square"
                      onClick={() =>
                        onTimeChange('hour', hour.toString(), uses12hClock)
                      }
                    >
                      {hour}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>
              <ScrollArea className="w-64 sm:w-auto">
                <div className="flex sm:flex-col justify-center">
                  {minutes.map((minute) => (
                    <Button
                      key={minute}
                      size="icon"
                      variant={
                        date && date.getMinutes() === minute
                          ? 'default'
                          : 'ghost'
                      }
                      className="sm:w-full shrink-0 aspect-square"
                      onClick={() =>
                        onTimeChange('minute', minute.toString(), uses12hClock)
                      }
                    >
                      {minute.toString().padStart(2, '0')}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>
              {uses12hClock && (
                <ScrollArea className="">
                  <div className="flex sm:flex-col p-2 justify-center">
                    {['AM', 'PM'].map((ampm) => (
                      <Button
                        key={ampm}
                        size="icon"
                        variant={
                          date &&
                          ((ampm === 'AM' && date.getHours() < 12) ||
                            (ampm === 'PM' && date.getHours() >= 12))
                            ? 'default'
                            : 'ghost'
                        }
                        className="sm:w-full shrink-0 aspect-square"
                        onClick={() => onTimeChange('ampm', ampm, uses12hClock)}
                      >
                        {ampm}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
