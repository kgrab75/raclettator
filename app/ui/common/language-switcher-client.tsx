'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { setLocaleAction } from '@/lib/i18n/actions';

type LanguageSwitcherClientProps = {
  locales: string[];
};

function formatLocaleLabel(currentLocale: string, locale: string): string {
  try {
    return (
      new Intl.DisplayNames([currentLocale], { type: 'language' }).of(locale) ??
      locale
    );
  } catch {
    return locale;
  }
}

export function LanguageSwitcherClient({
  locales,
}: LanguageSwitcherClientProps) {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleValueChange(nextLocale: string) {
    startTransition(async () => {
      await setLocaleAction(nextLocale);
      router.refresh();
    });
  }

  return (
    <Select
      value={locale}
      onValueChange={handleValueChange}
      disabled={isPending}
    >
      <SelectTrigger>
        <SelectValue placeholder="Language" />
      </SelectTrigger>

      <SelectContent>
        {locales.map((item) => (
          <SelectItem key={item} value={item}>
            {formatLocaleLabel(locale, item)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
