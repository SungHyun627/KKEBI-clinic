import { proxyToBackend } from '@/shared/server/backend-proxy';

export const POST = async (
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) => {
  const { sessionId } = await params;
  return proxyToBackend(request, {
    method: 'POST',
    path: `/api/v1/sessions/${sessionId}/reminder`,
  });
};
