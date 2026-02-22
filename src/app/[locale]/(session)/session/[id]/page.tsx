import SessionHeader from '@/features/sessions/ui/SessionHeader';

interface SessionDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function SessionDetailPage({ params }: SessionDetailPageProps) {
  const { id } = await params;

  return (
    <section className="flex min-h-[calc(100dvh)] w-full flex-col gap-5 bg-white">
      <SessionHeader sessionId={id} />
      <div className="grid w-full flex-1 grid-cols-[1fr_1.5fr] gap-[20px]">
        <section className="min-h-full p-5"></section>
        <section className="min-h-full bg-neutral-99 p-5" />
      </div>
    </section>
  );
}
