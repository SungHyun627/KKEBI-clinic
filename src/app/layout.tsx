import './globals.css';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import ReactQueryProvider from '@/shared/lib/react-query-provider';

export const metadata: Metadata = {
  title: 'Kkebi Clinic',
  description: 'Kkebi Clinic의 공식 웹사이트입니다.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen bg-white text-foreground antialiased">
        <NextIntlClientProvider messages={messages}>
          <ReactQueryProvider>
            <div className="min-h-screen w-full">{children}</div>
          </ReactQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
