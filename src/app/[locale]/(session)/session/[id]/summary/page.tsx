import { getTranslations } from 'next-intl/server';
import SessionSummaryContent from '@/features/summary/ui/SessionSummaryContent';

interface SessionSummaryPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function SessionSummaryPage({ params }: SessionSummaryPageProps) {
  const { locale, id } = await params;
  const tCommon = await getTranslations('common');

  return <SessionSummaryContent locale={locale} sessionId={id} backLabel={tCommon('back')} />;
}
