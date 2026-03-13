import { proxyToBackend } from '@/shared/server/backend-proxy';

export const GET = async (request: Request) => {
  return proxyToBackend(request, {
    method: 'GET',
    path: '/api/v1/notifications/unread',
  });
};
