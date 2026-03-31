'use server';

import { cookies } from 'next/headers';

const COOKIE_NAME = 'adminEventTokens';
const ONE_YEAR = 60 * 60 * 24 * 365;
const MAX_TOKENS = 10;

function safeParseTokens(raw?: string): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is string => typeof x === 'string' && x.length > 0,
    );
  } catch {
    return [];
  }
}

export async function addAdminEventToken(adminToken: string) {
  const store = await cookies();
  const current = safeParseTokens(store.get(COOKIE_NAME)?.value);

  // dédoublonne + plus récent en premier
  const next = [adminToken, ...current.filter((t) => t !== adminToken)].slice(
    0,
    MAX_TOKENS,
  );

  store.set(COOKIE_NAME, JSON.stringify(next), {
    path: '/',
    maxAge: ONE_YEAR,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  });
}

export async function getAdminEventTokens(): Promise<string[]> {
  const store = await cookies();
  return safeParseTokens(store.get(COOKIE_NAME)?.value).slice(0, MAX_TOKENS);
}

export async function removeAdminEventToken(adminToken: string) {
  const store = await cookies();
  const current = safeParseTokens(store.get(COOKIE_NAME)?.value);
  const next = current.filter((t) => t !== adminToken);

  store.set(COOKIE_NAME, JSON.stringify(next), {
    path: '/',
    maxAge: ONE_YEAR,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  });
}
