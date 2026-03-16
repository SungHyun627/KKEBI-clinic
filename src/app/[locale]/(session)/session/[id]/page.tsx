import SessionPageWidget from '@/widgets/session/ui/SessionPageWidget';

interface SessionDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function SessionDetailPage({ params }: SessionDetailPageProps) {
  const { id } = await params;

  return <SessionPageWidget sessionId={id} />;
}
