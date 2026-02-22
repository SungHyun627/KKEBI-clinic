import { redirect } from 'next/navigation';

interface SessionDetailPageProps {
  params: Promise<{ locale: string; clientId: string }>;
}

export default async function SessionDetailPage({ params }: SessionDetailPageProps) {
  const { locale, clientId } = await params;
  redirect(`/${locale}/session/${clientId}`);
}
