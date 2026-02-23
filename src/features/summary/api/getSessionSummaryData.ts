import type { SummaryPayload } from '@/features/summary/types/summary';

interface SessionSummaryResponse {
  success: boolean;
  data?: SummaryPayload;
  message?: string;
}

export const getSessionSummaryData = async (
  sessionId: string,
  locale: string,
): Promise<SessionSummaryResponse> => {
  try {
    const response = await fetch(
      `/api/v1/sessions/${encodeURIComponent(sessionId)}/summary?locale=${encodeURIComponent(locale)}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      },
    );

    const data = (await response.json().catch(() => null)) as SessionSummaryResponse | null;
    if (data && typeof data === 'object' && 'success' in data) {
      return data;
    }

    return {
      success: false,
      message: 'Failed to load session summary data.',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
    };
  }
};
