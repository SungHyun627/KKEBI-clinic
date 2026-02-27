'use client';

import { useTranslations } from 'next-intl';

export default function NewClientPage() {
  const tClients = useTranslations('clients');

  return <section className="flex w-full flex-col items-start gap-4"></section>;
}
