interface BookmarkResponse {
  success: boolean;
  data?: {
    transcriptId: string;
    bookmarked: boolean;
  };
  message?: string;
}

const call = async (
  sessionId: string,
  transcriptId: string,
  method: 'POST' | 'DELETE',
): Promise<BookmarkResponse> => {
  try {
    const response = await fetch(`/api/v1/sessions/${encodeURIComponent(sessionId)}/bookmarks`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcriptId }),
    });
    const data = (await response.json().catch(() => null)) as BookmarkResponse | null;
    if (data && typeof data === 'object' && 'success' in data) {
      return data;
    }
    return { success: false, message: 'Invalid response' };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
    };
  }
};

export const addTranscriptBookmark = (sessionId: string, transcriptId: string) =>
  call(sessionId, transcriptId, 'POST');

export const removeTranscriptBookmark = (sessionId: string, transcriptId: string) =>
  call(sessionId, transcriptId, 'DELETE');
