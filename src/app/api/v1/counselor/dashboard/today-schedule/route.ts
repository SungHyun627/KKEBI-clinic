import { proxyToBackend } from '@/shared/server/backend-proxy';

export const GET = async (request: Request) => {
  return proxyToBackend(request, {
    path: '/api/v1/counselor/dashboard/today-schedule',
    method: 'GET',
  });
};
