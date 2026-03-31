'use client';

import { useFormatter } from 'next-intl';

export function useHumanDateTime(date?: Date) {
  const format = useFormatter();
  return date
    ? format.dateTime(date, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: 'numeric',
      })
    : '';
}
