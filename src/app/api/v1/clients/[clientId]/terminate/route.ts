import { proxyToBackend } from '@/shared/server/backend-proxy';
import type { ClientClosePayload } from '@/features/clients';

const TERMINATION_REASON_LABEL: Record<ClientClosePayload['reason'], string> = {
  'session-complete': '회기 종료',
  dropout: '내담자 중도 탈락',
  other: '기타',
};

export async function POST(request: Request, context: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await context.params;
  const payload = (await request.json().catch(() => null)) as ClientClosePayload | null;
  const mappedReason = payload?.reason ? TERMINATION_REASON_LABEL[payload.reason] : null;
  const terminationReason = payload?.detail?.trim()
    ? mappedReason
      ? `${mappedReason}: ${payload.detail.trim()}`
      : payload.detail.trim()
    : (mappedReason ?? undefined);

  const proxiedRequest = new Request(request.url, {
    method: 'PATCH',
    headers: request.headers,
    body: JSON.stringify({ terminationReason }),
  });

  return proxyToBackend(proxiedRequest, {
    method: 'PATCH',
    path: `/api/v1/clients/${clientId}/terminate`,
  });
}
