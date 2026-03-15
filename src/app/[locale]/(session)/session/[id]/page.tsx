import SessionPageContent from '@/features/session/ui/page/SessionPageContent';

interface SessionDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function SessionDetailPage({ params }: SessionDetailPageProps) {
  const { id } = await params;

  return <SessionPageContent sessionId={id} />;
}
