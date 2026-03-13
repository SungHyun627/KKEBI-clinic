import { proxyToBackend } from '@/shared/server/backend-proxy';

export const PATCH = async (
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) => {
  const { sessionId } = await params;
  return proxyToBackend(request, {
    method: 'PATCH',
    path: `/api/v1/sessions/${sessionId}/schedule`,
  });
};
