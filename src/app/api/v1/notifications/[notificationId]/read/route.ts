import { proxyToBackend } from '@/shared/server/backend-proxy';

export const PUT = async (
  request: Request,
  { params }: { params: Promise<{ notificationId: string }> },
) => {
  const { notificationId } = await params;
  return proxyToBackend(request, {
    method: 'PUT',
    path: `/api/v1/notifications/${encodeURIComponent(notificationId)}/read`,
  });
};
