import { proxyToBackend } from '@/shared/server/backend-proxy';

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) => {
  const { sessionId } = await params;
  return proxyToBackend(request, {
    method: 'GET',
    path: `/api/v1/sessions/${encodeURIComponent(sessionId)}/reminders/history`,
  });
};
