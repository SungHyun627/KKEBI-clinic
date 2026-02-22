import SessionHeader from '@/features/session/ui/SessionHeader';
import SessionInsightsPanel from '@/features/session/ui/SessionInsightsPanel';
import SessionAutoRecordPanel from '@/features/session/ui/SessionAutoRecordPanel';

interface SessionDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function SessionDetailPage({ params }: SessionDetailPageProps) {
  const { id } = await params;

  return (
    <section className="flex min-h-[calc(100dvh)] w-full flex-col gap-5 bg-white">
      <SessionHeader sessionId={id} />
      <div className="grid w-full flex-1 grid-cols-[1fr_1.5fr] gap-[34px]">
        <SessionInsightsPanel />
        <SessionAutoRecordPanel />
      </div>
    </section>
  );
}
