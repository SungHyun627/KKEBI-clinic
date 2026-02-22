import SessionHeader from '@/features/sessions/ui/SessionHeader';

interface SessionDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function SessionDetailPage({ params }: SessionDetailPageProps) {
  const { id } = await params;

  return (
    <section className="flex w-full flex-col gap-5 bg-white">
      <SessionHeader sessionId={id} />
    </section>
  );
}
