import SessionSummaryContent from '@/features/summary/ui/SessionSummaryContent';

interface SessionSummaryPageWidgetProps {
  locale: string;
  sessionId: number;
  backLabel: string;
}

export default function SessionSummaryPageWidget({
  locale,
  sessionId,
  backLabel,
}: SessionSummaryPageWidgetProps) {
  return <SessionSummaryContent locale={locale} sessionId={sessionId} backLabel={backLabel} />;
}
