import { readdir } from 'node:fs/promises';
import path from 'node:path';

export async function getAvailableLocales(): Promise<string[]> {
  const messagesDir = path.join(process.cwd(), 'messages');
  const files = await readdir(messagesDir);

  return files
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.replace(/\.json$/, ''))
    .sort();
}