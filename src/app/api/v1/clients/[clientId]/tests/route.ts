import { proxyToBackend } from '@/shared/server/backend-proxy';

export async function POST(request: Request, context: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await context.params;
  return proxyToBackend(request, { method: 'POST', path: `/api/v1/clients/${clientId}/tests` });
}
