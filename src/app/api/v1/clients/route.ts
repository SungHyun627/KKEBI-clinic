import { proxyToBackend } from '@/shared/server/backend-proxy';

export async function GET(request: Request) {
  return proxyToBackend(request, { method: 'GET', path: '/api/v1/clients' });
}

export async function POST(request: Request) {
  return proxyToBackend(request, { method: 'POST', path: '/api/v1/clients' });
}
