'use client';

import { useTranslations } from 'next-intl';

export default function ClosedClientsPage() {
  const tClients = useTranslations('clients');

  return (
    <section className="flex w-full flex-col items-start gap-4">
      <h1 className="body-20 font-semibold text-label-normal">{tClients('listClosedSessions')}</h1>
      <p className="body-14 text-label-alternative">
        {tClients('listClosedSessions')} 페이지는 다음 단계에서 구현됩니다.
      </p>
    </section>
  );
}
