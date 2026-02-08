import './globals.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kkebi Clinic',
  description: 'Kkebi Clinic의 공식 웹사이트입니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-foreground antialiased">
        <div className="min-h-screen w-full">{children}</div>
      </body>
    </html>
  );
}
