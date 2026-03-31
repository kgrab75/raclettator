import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { getAvailableLocales } from '@/lib/i18n/get-available-locales';

const DEFAULT_LOCALE = 'fr';

function getBrowserLocale(
  acceptLanguage: string | null,
  availableLocales: string[],
) {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const browserLocales = acceptLanguage
    .split(',')
    .map((part) => part.split(';')[0]?.trim())
    .filter(Boolean);

  for (const browserLocale of browserLocales) {
    if (availableLocales.includes(browserLocale)) {
      return browserLocale;
    }

    const baseLocale = browserLocale.split('-')[0];
    const matchedLocale = availableLocales.find(
      (locale) => locale === baseLocale || locale.startsWith(`${baseLocale}-`),
    );

    if (matchedLocale) {
      return matchedLocale;
    }
  }

  return DEFAULT_LOCALE;
}

export default getRequestConfig(async () => {
  const store = await cookies();
  const requestHeaders = await headers();

  const availableLocales = await getAvailableLocales();

  const cookieLocale = store.get('locale')?.value;

  const locale =
    cookieLocale && availableLocales.includes(cookieLocale)
      ? cookieLocale
      : getBrowserLocale(
          requestHeaders.get('accept-language'),
          availableLocales,
        );

  const messages = (await import(`@/messages/${locale}.json`)).default;

  return {
    locale,
    messages,
  };
});
