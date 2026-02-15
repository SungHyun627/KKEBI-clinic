import './globals.css';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

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
    <html lang={locale}>
      <body className="min-h-screen bg-white text-foreground antialiased">
        <NextIntlClientProvider messages={messages}>
          <div className="min-h-screen w-full">{children}</div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
