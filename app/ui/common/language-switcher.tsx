import { LanguageSwitcherClient } from '@/app/ui/common/language-switcher-client';
import { getAvailableLocales } from '@/lib/i18n/get-available-locales';

export default async function LanguageSwitcher() {
  const locales = await getAvailableLocales();

  return <LanguageSwitcherClient locales={locales} />;
}
