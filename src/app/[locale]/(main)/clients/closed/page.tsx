import { redirect } from 'next/navigation';

export default async function ClosedClientsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/clients/terminated`);
}
