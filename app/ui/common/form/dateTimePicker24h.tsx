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

export function DateTimePicker24h({
  date,
  onDateChange,
  onTimeChange,
  placeholder,
}: {
  date?: Date;
  onDateChange: (selectedDate: Date | undefined) => void;
  onTimeChange: (type: 'hour' | 'minute', value: string) => void;
  placeholder: string;
}) {
  const { dayPickerLocale, dir } = useCalendarLocale();

  const humanDateTime = useHumanDateTime(date);

  const [isOpen, setIsOpen] = React.useState(false);

  const hours = Array.from({ length: 24 - 10 }, (_, i) => i + 10);
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
        <PopoverContent className="w-auto p-0">
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
            <div className="flex flex-col sm:flex-row sm:h-75 divide-y sm:divide-y-0 sm:divide-x">
              <ScrollArea className="w-64 sm:w-auto">
                <div className="flex sm:flex-col p-2">
                  {hours.reverse().map((hour) => (
                    <Button
                      key={hour}
                      size="icon"
                      variant={
                        date && date.getHours() === hour ? 'default' : 'ghost'
                      }
                      className="sm:w-full shrink-0 aspect-square"
                      onClick={() => onTimeChange('hour', hour.toString())}
                    >
                      {hour}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>
              <ScrollArea className="w-64 sm:w-auto">
                <div className="flex sm:flex-col p-2 justify-center">
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
                      onClick={() => onTimeChange('minute', minute.toString())}
                    >
                      {minute.toString().padStart(2, '0')}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
