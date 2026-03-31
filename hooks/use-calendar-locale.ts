'use client';

import { useMemo } from 'react';
import { useLocale } from 'next-intl';
import {
  getLocaleDirection,
  resolveDayPickerLocale,
} from '@/lib/i18n/day-picker';

export type UseCalendarLocaleResult = {
  locale: string;
  dayPickerLocale: ReturnType<typeof resolveDayPickerLocale>;
  dir: 'ltr' | 'rtl';
};

export function useCalendarLocale(): UseCalendarLocaleResult {
  const locale = useLocale();

  return useMemo(
    () => ({
      locale,
      dayPickerLocale: resolveDayPickerLocale(locale),
      dir: getLocaleDirection(locale),
    }),
    [locale],
  );
}
