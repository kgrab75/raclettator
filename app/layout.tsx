import '@/app/globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { headers } from 'next/headers';
import { getLocale, getMessages } from 'next-intl/server';
import { Geist, Geist_Mono, Roboto } from 'next/font/google';

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-sans',
});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const brand = process.env.NEXT_PUBLIC_BRAND;

export const metadata: Metadata = {
  title: brand,
  description: 'Organise tes raclettes entre amis',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: brand,
  },
};

export const viewport: Viewport = {
  themeColor: '#facc15',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [locale, messages, headersList] = await Promise.all([
    getLocale(),
    getMessages(),
    headers(),
  ]);

  const nonce = headersList.get('x-nonce') ?? undefined;

  return (
    <html lang={locale} suppressHydrationWarning className={roboto.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background text-foreground antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          enableColorScheme
          disableTransitionOnChange
          nonce={nonce}
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
            <Toaster position="top-center" />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
