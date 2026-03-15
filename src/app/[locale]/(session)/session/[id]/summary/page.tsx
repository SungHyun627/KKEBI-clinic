import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { SessionSummaryContent } from '@/features/summary';

interface SessionSummaryPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function SessionSummaryPage({ params }: SessionSummaryPageProps) {
  const { locale, id } = await params;
  const sessionId = Number(id);
  if (!Number.isFinite(sessionId)) {
    notFound();
  }
  const tCommon = await getTranslations('common');

  return (
    <SessionSummaryContent locale={locale} sessionId={sessionId} backLabel={tCommon('back')} />
  );
}
