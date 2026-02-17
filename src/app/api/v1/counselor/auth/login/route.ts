import { proxyToBackend } from '@/shared/server/backend-proxy';

export async function POST(request: Request) {
  return proxyToBackend(request, { method: 'POST', path: '/api/v1/counselor/auth/login' });
}
