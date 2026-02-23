import type { SessionPageResponse } from '../types/session-page';

export const getSessionPageData = async (
  sessionId: string,
  locale: string,
): Promise<SessionPageResponse> => {
  try {
    const response = await fetch(
      `/api/v1/sessions/${encodeURIComponent(sessionId)}?locale=${encodeURIComponent(locale)}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      },
    );

    const data = (await response.json().catch(() => null)) as SessionPageResponse | null;
    if (data && typeof data === 'object' && 'success' in data) {
      return data;
    }

    return {
      success: false,
      message: 'Failed to load session page data.',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
    };
  }
};
