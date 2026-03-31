import * as dayPickerLocales from 'react-day-picker/locale';
import { enUS } from 'react-day-picker/locale';
import type { Locale } from 'date-fns';

function toDayPickerLocaleKey(locale: string): string {
  const [language, region] = locale.split('-');

  if (!region) return language;
  return `${language}${region.toUpperCase()}`;
}

export function resolveDayPickerLocale(locale: string): Locale {
  const exactKey = toDayPickerLocaleKey(locale);
  const languageKey = locale.split('-')[0];

  const exactMatch =
    dayPickerLocales[exactKey as keyof typeof dayPickerLocales];
  if (exactMatch) return exactMatch as Locale;

  const languageMatch =
    dayPickerLocales[languageKey as keyof typeof dayPickerLocales];
  if (languageMatch) return languageMatch as Locale;

  return enUS;
}

export function getLocaleDirection(locale: string): 'ltr' | 'rtl' {
  const language = locale.split('-')[0];
  const rtlLanguages = new Set(['ar', 'fa', 'he', 'ur']);

  return rtlLanguages.has(language) ? 'rtl' : 'ltr';
}
