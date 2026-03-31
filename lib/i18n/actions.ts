'use server';

import { cookies } from 'next/headers';
import { getAvailableLocales } from '@/lib/i18n/get-available-locales';

const ONE_YEAR = 60 * 60 * 24 * 365;

export async function setLocaleAction(locale: string): Promise<void> {
  const availableLocales = await getAvailableLocales();

  if (!availableLocales.includes(locale)) {
    throw new Error(`Unsupported locale: ${locale}`);
  }

  const store = await cookies();

  store.set('locale', locale, {
    path: '/',
    maxAge: ONE_YEAR,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
}
